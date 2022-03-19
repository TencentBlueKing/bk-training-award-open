# Generated by Django 2.2.6 on 2022-03-19 12:58

from django.db import migrations, models
import django_mysql.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('admin_username', models.CharField(max_length=50, verbose_name='管理员')),
            ],
        ),
        migrations.CreateModel(
            name='AwardApplicationRecord',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('award_id', models.IntegerField(verbose_name='奖项id')),
                ('application_time', models.DateTimeField(verbose_name='申请时间')),
                ('application_reason', models.TextField(verbose_name='申请理由')),
                ('application_users', django_mysql.models.JSONField(default=list, verbose_name='申请人username列表')),
                ('application_attachments', django_mysql.models.JSONField(default=list, verbose_name='申请附件地址列表')),
                ('approval_state', models.IntegerField(choices=[(0, '待评审'), (1, '评审通过'), (2, '评审不通过'), (3, '草稿')], default=3, verbose_name='评审状态')),
                ('approval_users', django_mysql.models.JSONField(default=dict, null=True, verbose_name='评审人map')),
                ('approval_turn', models.IntegerField(default=0, verbose_name='评审轮次')),
                ('approval_time', models.DateTimeField(null=True, verbose_name='评审时间')),
                ('approval_text', models.TextField(default='', verbose_name='评审评语')),
            ],
        ),
        migrations.CreateModel(
            name='Awards',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('award_name', models.CharField(max_length=128, verbose_name='奖项名称')),
                ('award_level', models.CharField(max_length=128, verbose_name='奖项级别')),
                ('award_description', models.CharField(max_length=512, verbose_name='奖项描述')),
                ('award_department_fullname', models.CharField(max_length=50, verbose_name='奖项所属部门full_name')),
                ('award_reviewers', django_mysql.models.JSONField(default=list, verbose_name='奖项评委')),
                ('award_consultant', models.CharField(max_length=128, verbose_name='奖项顾问')),
                ('award_image', models.CharField(max_length=1000, verbose_name='图片地址')),
                ('create_time', models.DateTimeField(auto_now_add=True, verbose_name='创建时间')),
                ('update_time', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
                ('start_time', models.DateTimeField(verbose_name='开始申请时间')),
                ('end_time', models.DateTimeField(verbose_name='截止申请时间')),
                ('approval_state', models.IntegerField(choices=[(0, '未开始'), (1, '已开始'), (2, '已结束')], default=3, verbose_name='评审状态')),
            ],
        ),
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_time', models.DateTimeField(auto_now_add=True, verbose_name='创建时间')),
                ('update_time', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
                ('full_name', models.CharField(max_length=128, unique=True, verbose_name='组名字')),
                ('secretary', models.CharField(max_length=128, verbose_name='组秘书账号')),
                ('secretary_display_name', models.CharField(max_length=128, verbose_name='组秘书姓名')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='GroupApply',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_time', models.DateTimeField(auto_now_add=True, verbose_name='创建时间')),
                ('update_time', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
                ('group_id', models.IntegerField(verbose_name='组id')),
                ('group_name', models.CharField(max_length=128, unique=True, verbose_name='组名字')),
                ('username', models.CharField(max_length=128, verbose_name='组成员账号')),
                ('display_name', models.CharField(max_length=128, verbose_name='组成员姓名')),
                ('status', models.IntegerField(choices=[(0, '待审核'), (1, '已通过'), (2, '未通过')], default=0, verbose_name='申请状态')),
                ('approver', models.CharField(blank=True, max_length=128, null=True, verbose_name='审批人账号')),
                ('approver_display_name', models.CharField(blank=True, max_length=128, null=True, verbose_name='审批人姓名')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='GroupUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=128, verbose_name='组成员账号')),
                ('display_name', models.CharField(max_length=128, verbose_name='组成员姓名')),
                ('group_id', models.IntegerField(verbose_name='组id')),
            ],
        ),
        migrations.CreateModel(
            name='Images',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, null=True, upload_to='images')),
                ('create_time', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['-create_time'],
            },
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_time', models.DateTimeField(auto_now_add=True, verbose_name='创建时间')),
                ('update_time', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
                ('group_id', models.IntegerField(verbose_name='组id')),
                ('group_name', models.CharField(max_length=128, verbose_name='组名字')),
                ('action_type', models.IntegerField(choices=[(0, 'group_user'), (1, 'award')], verbose_name='消息类型')),
                ('action_target', models.CharField(max_length=128, verbose_name='通知对象账号')),
                ('action_username', models.CharField(max_length=128, verbose_name='该操作处理人账号')),
                ('action_display_name', models.CharField(max_length=128, verbose_name='该操作处理人姓名')),
                ('message', models.CharField(max_length=128, verbose_name='消息主体')),
                ('is_read', models.BooleanField(default=False, verbose_name='是否已读')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Secretary',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('group_id', models.IntegerField(unique=True, verbose_name='组id')),
                ('secretaries', django_mysql.models.JSONField(default=list, verbose_name='组内秘书')),
                ('group_full_name', models.CharField(max_length=50, verbose_name='组full_name')),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_time', models.DateTimeField(auto_now_add=True, verbose_name='创建时间')),
                ('update_time', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
                ('username', models.CharField(max_length=128, unique=True, verbose_name='用户账号')),
                ('display_name', models.CharField(blank=True, max_length=128, null=True, verbose_name='用户姓名')),
                ('phone', models.CharField(blank=True, max_length=30, null=True, verbose_name='电话号码')),
                ('email', models.EmailField(blank=True, max_length=254, null=True, verbose_name='邮箱')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
