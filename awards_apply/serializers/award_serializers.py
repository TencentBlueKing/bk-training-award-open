from awards_apply.models import AwardApplicationRecord, Awards
from django.utils import timezone
from rest_framework import serializers

# 时间格式
TIME_FORMAT = '%Y-%m-%d %H:%M:%S'
# 奖项申请的状态
RecordStatus = {'wait': 0, 'pass': 1, 'not_pass': 2, 'draft': 3}


class AwardsSerializers(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    award_name = serializers.CharField()
    award_description = serializers.CharField()
    award_department_fullname = serializers.CharField()
    award_department_id = serializers.IntegerField()
    award_reviewers = serializers.ListField()
    award_consultant = serializers.CharField()
    award_consultant_displayname = serializers.CharField()
    award_demand = serializers.CharField()
    start_time = serializers.DateTimeField(format=TIME_FORMAT)
    end_time = serializers.DateTimeField(format=TIME_FORMAT)
    approval_state = serializers.IntegerField(default=0, required=False)

    def create(self, validated_data):  # 调用Serializer必须重写create方法
        validated_data["award_reviewers"] = list(filter(None, validated_data["award_reviewers"]))
        res = Awards.objects.create(**validated_data)
        return res


class AwardsRecordSerializers(serializers.Serializer):
    id = serializers.IntegerField(default=None, required=False)
    award_id = serializers.IntegerField()
    award_department_id = serializers.IntegerField()
    application_reason = serializers.CharField(required=False)
    application_users = serializers.JSONField(required=False)
    application_attachments = serializers.ListField(required=False)
    approval_turn = serializers.IntegerField(read_only=True)
    approval_text = serializers.CharField(required=False)
    approval_state = serializers.IntegerField(default=0, required=False)
    application_time = serializers.DateTimeField(format=TIME_FORMAT, required=False)
    award_info = serializers.SerializerMethodField()

    def create(self, validated_data):  # 调用Serializer必须重写create方法
        if self.initial_data["is_draft"]:
            validated_data["approval_state"] = RecordStatus["draft"]
        else:
            validated_data["approval_state"] = RecordStatus["wait"]
        approval_users = Awards.objects.filter(pk=validated_data["award_id"]).values_list("award_reviewers")
        # 对奖项表进行update_or_create，提供id则更新，否则创建
        record, result = AwardApplicationRecord.objects.update_or_create(
            id=validated_data["id"],
            defaults={
                "award_id": validated_data["award_id"],
                "award_department_id": validated_data["award_department_id"],
                "application_reason": validated_data.get("application_reason", ""),
                "application_users": validated_data["application_users"],
                "application_attachments": validated_data.get("application_attachments", []),
                "approval_state": validated_data["approval_state"],
                "application_time": timezone.now(),
                "approval_users": approval_users[0][0]
            })
        return record

    def get_award_info(self, row):
        res = Awards.objects.filter(id=row.award_id).values().first()
        return res if res else None
