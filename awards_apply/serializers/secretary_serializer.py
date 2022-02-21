from awards_apply.models import Secretary
from rest_framework import serializers, validators


class SecretarySerializer(serializers.ModelSerializer):
    secretaries = serializers.JSONField(label="秘书信息列表", initial=list)
    group_id = serializers.IntegerField(
        validators=[validators.UniqueValidator(Secretary.objects.all(), message="组已创建")]
    )

    class Meta:
        model = Secretary
        fields = "__all__"
