from awards_apply.models import Secretary
from rest_framework import serializers


class SecretarySerializer(serializers.ModelSerializer):
    secretaries = serializers.JSONField(label="秘书信息列表", initial=list)

    class Meta:
        model = Secretary
        fields = "__all__"
