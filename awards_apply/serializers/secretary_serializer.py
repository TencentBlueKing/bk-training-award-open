from awards_apply.models import Secretary
from awards_apply.utils.json_schema_validator import JsonSchemaValidator
from rest_framework import serializers, validators


class SecretarySerializer(serializers.ModelSerializer):
    secretaries_rule = {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "username": {"type": "string"},
                "display_name": {"type": "string"},
            },
            "required": ["username", "display_name"],
        },
    }
    secretaries = serializers.JSONField(
        label="秘书信息列表",
        initial=list,
        validators=[
            JsonSchemaValidator(secretaries_rule, message="secretaries数据格式错误"),
        ],
    )
    group_id = serializers.IntegerField(
        validators=[validators.UniqueValidator(Secretary.objects.all(), message="组已创建")]
    )

    class Meta:
        model = Secretary
        fields = "__all__"
