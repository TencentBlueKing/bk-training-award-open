# Generated by Django 2.2.6 on 2022-03-18 13:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('awards_apply', '0006_group_groupapply_groupuser_notification_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='group_name',
            field=models.CharField(max_length=128, verbose_name='组名字'),
        ),
    ]