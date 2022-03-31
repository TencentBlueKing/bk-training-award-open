from awards_apply.models import (ApprovalRecord, ApprovalState,
                                 AwardApplicationRecord, Awards)
from django.forms import model_to_dict
from django.utils import timezone
from rest_framework import serializers


class ApplicationSerializer(serializers.Serializer):
    id = serializers.IntegerField(write_only=True, label="id")
    action = serializers.IntegerField(write_only=True, label="操作")
    approval_text = serializers.CharField(write_only=True)
    obj = serializers.SerializerMethodField()

    def get_obj(self, obj):
        if (
            len(obj.approval_users) > obj.approval_turn
            and self.context["username"] in obj.approval_users[obj.approval_turn]
        ):
            award_info = Awards.objects.filter(pk=obj.award_id).values().first()
            if award_info["end_time"] > timezone.now():
                return None
            obj = model_to_dict(obj)
            obj.update({"award_info": award_info if award_info else None})
            return obj

    def update(self, instance, validated_data, username):
        action_dict = {"pass": 1, "not_pass": 0}  # 通过/不通过操作码
        # 创建审批记录
        ApprovalRecord.objects.create(**{
            "application_id": instance.id,
            "department_id": instance.award_department_id,
            "approval_user": username,
            "approval_action": validated_data["action"],
            "approval_turn": instance.approval_turn
        })
        if validated_data["action"] == action_dict["pass"]:
            instance.approval_turn += 1  # 进入下一轮审批
            # 防止调接口刷轮次导致前端展示进度条不正常
            if instance.approval_turn > len(instance.approval_users):
                instance.approval_turn = len(instance.approval_users)
                instance.save()
                return instance
            # 如果是最后一轮审批, 置审批状态为通过, 填入审批评语, 通过时间
            if len(instance.approval_users) == instance.approval_turn:
                instance.approval_state = ApprovalState.review_passed.value[0]
                instance.approval_time = timezone.now()
                instance.approval_text += validated_data.get("approval_text")
            else:
                instance.approval_text += validated_data.get("approval_text") + "||"
            instance.save()
            return instance
        else:  # 不通过, 置轮次为0, 状态置为草稿, 写入审批时间,要求审批评语
            instance.approval_turn = 0
            instance.approval_state = ApprovalState.review_not_passed.value[0]
            instance.approval_time = timezone.now()
            instance.approval_text = validated_data["approval_text"]
            instance.save()
            return instance


class ApprovalRecordSerializer(serializers.ModelSerializer):
    application_info = serializers.SerializerMethodField()

    class Meta:
        model = ApprovalRecord
        fields = '__all__'

    def get_application_info(self, obj):
        application_info = AwardApplicationRecord.objects.filter(pk=obj.application_id).first()
        if application_info:
            award_info = Awards.objects.filter(pk=application_info.award_id).first()
            application_info = model_to_dict(application_info)
            application_info.update({"award_info": model_to_dict(award_info) if award_info else None})
        return application_info
