from django.utils import timezone
from rest_framework import serializers

from awards_apply.models import Awards, AwardApplicationRecord


class AwardsSerializers(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    award_name = serializers.CharField()
    award_level = serializers.CharField()
    award_description = serializers.CharField()
    award_department_fullname = serializers.CharField()
    award_reviewers = serializers.ListField()
    award_consultant = serializers.CharField()
    award_image = serializers.ImageField(required=False, read_only=True)
    start_time = serializers.DateField()
    end_time = serializers.DateField()
    approval_state = serializers.IntegerField(default=0, required=False)

    def create(self, validated_data):  # 调用Serializer必须重写create方法
        res = Awards.objects.create(**validated_data)
        return res


class AwardsRecordSerializers(serializers.Serializer):
    id = serializers.IntegerField(default=None, required=False)
    award_id = serializers.IntegerField()
    application_reason = serializers.CharField()
    application_users = serializers.ListField()
    application_attachments = serializers.ListField()
    approval_state = serializers.IntegerField(default=0, required=False)

    def create(self, validated_data):  # 调用Serializer必须重写create方法
        if self.initial_data["is_draft"]:
            validated_data["approval_state"] = 3
        # 对奖项表进行update_or_create，提供id则更新，否则创建
        record, result = AwardApplicationRecord.objects.update_or_create(
            id=validated_data["id"],
            defaults={
                "award_id": validated_data["award_id"],
                "application_reason": validated_data["application_reason"],
                "application_users": validated_data["application_users"],
                "application_attachments": validated_data["application_attachments"],
                "approval_state": validated_data["approval_state"],
                "application_time": timezone.now()
            })
        return record
