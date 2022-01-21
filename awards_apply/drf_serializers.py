from rest_framework import serializers


class AwardsSerializers(serializers.Serializer):
    id = serializers.IntegerField()
    award_name = serializers.CharField()
    award_level = serializers.CharField()
    award_description = serializers.CharField()
    award_department_fullname = serializers.CharField()
    award_reviewers = serializers.ListField()
    award_consultant = serializers.CharField()
    award_image = serializers.ImageField()
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    approval_state = serializers.IntegerField()
