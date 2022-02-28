from awards_apply.models import ApprovalState, Awards
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
            obj = model_to_dict(obj)
            obj.update({"award_info": award_info if award_info else None})
            return obj

    def update(self, instance, validated_data):
        action_dict = {"pass": 1, "not_pass": 0}  # 通过/不通过操作码
        if validated_data["action"] == action_dict["pass"]:
            instance.approval_turn += 1  # 进入下一轮审批
            # 如果是最后一轮审批, 置审批状态为通过, 填入审批评语, 通过时间
            if len(instance.approval_users) == instance.approval_turn:
                instance.approval_state = ApprovalState.review_passed.value[0]
                instance.approval_time = timezone.now()
                instance.approval_text += validated_data.get("approval_text")
            instance.save()
            return instance
        else:  # 不通过, 置轮次为0, 状态置为草稿, 写入审批时间,要求审批评语
            instance.approval_turn = 0
            instance.approval_state = ApprovalState.review_not_passed.value[0]
            instance.approval_time = timezone.now()
            instance.approval_text = validated_data["approval_text"]
            instance.save()
            return instance
