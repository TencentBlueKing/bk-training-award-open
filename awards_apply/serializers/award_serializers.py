from django.utils import timezone
from rest_framework import serializers

from awards_apply.models import Awards, AwardApplicationRecord

# 时间格式
TIME_FORMAT = '%Y-%m-%d %H:%M:%S'
# 奖项申请的状态
RecordStatus = {'wait': 0, 'pass': 1, 'not_pass': 2, 'draft': 3}


class AwardsSerializers(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    award_name = serializers.CharField()
    award_level = serializers.CharField()
    award_description = serializers.CharField()
    award_department_fullname = serializers.CharField()
    award_reviewers = serializers.ListField()
    award_consultant = serializers.CharField()
    award_image = serializers.CharField(required=False, read_only=True)
    start_time = serializers.DateTimeField(format=TIME_FORMAT)
    end_time = serializers.DateTimeField(format=TIME_FORMAT)
    approval_state = serializers.IntegerField(default=0, required=False)

    def create(self, validated_data):  # 调用Serializer必须重写create方法
        res = Awards.objects.create(**validated_data)
        return res


class AwardsRecordSerializers(serializers.Serializer):
    id = serializers.IntegerField(default=None, required=False)
    award_id = serializers.IntegerField()
    application_reason = serializers.CharField(required=False)
    application_users = serializers.DictField()
    application_attachments = serializers.ListField(required=False)
    approval_state = serializers.IntegerField(default=0, required=False)
    application_time = serializers.DateTimeField(format=TIME_FORMAT, required=False)
    award_name = serializers.SerializerMethodField()

    def create(self, validated_data):  # 调用Serializer必须重写create方法
        if self.initial_data["is_draft"]:
            validated_data["approval_state"] = RecordStatus["draft"]
        # 对奖项表进行update_or_create，提供id则更新，否则创建
        record, result = AwardApplicationRecord.objects.update_or_create(
            id=validated_data["id"],
            defaults={
                "award_id": validated_data["award_id"],
                "application_reason": validated_data.get("application_reason", ""),
                "application_users": validated_data["application_users"],
                "application_attachments": validated_data.get("application_attachments", []),
                "approval_state": validated_data["approval_state"],
                "application_time": timezone.now()
            })
        return record

    def get_award_name(self, row):
        res = Awards.objects.get(id=row.award_id)
        return res.award_name
