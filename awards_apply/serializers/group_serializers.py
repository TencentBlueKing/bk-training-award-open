from awards_apply.models import Group
from rest_framework import serializers


class GroupSerializers(serializers.Serializer):
    full_name = serializers.CharField(max_length=128)
    secretary = serializers.CharField(max_length=128)
    secretary_display_name = serializers.CharField(max_length=128)

    def create(self, validated_data):  # 调用Serializer必须重写create方法
        res = Group.objects.create(**validated_data)
        return res
