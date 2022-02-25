import jsonschema
from rest_framework import serializers


class JsonSchemaValidator():
    """JsonField校验器

        :rule: jsonschema规则
    """

    def __init__(self, rule, message="数据格式错误"):
        self.rule = rule
        self.message = message

    def __call__(self, value):
        try:
            jsonschema.validate(value, self.rule)
        except jsonschema.ValidationError:
            raise serializers.ValidationError(self.message)
