from awards_apply import views
from django.conf.urls import url
from django.urls import path

urlpatterns = [
    url(
        r"^usermanage/(?P<api>retrieve_user|"
        r"retrieve_department|"
        r"list_users|"
        r"list_profile_departments|"
        r"list_department_profiles|"
        r"list_departments)/$",
        views.UserView.as_view(),
    ),
    url(
        r"^secretary/$",
        views.SecretaryViewSet.as_view({"get": "list", "post": "create"}),
    ),
    url(
        r"^secretary/(?P<id>\d+)/$",
        views.SecretaryViewSet.as_view({"put": "update"}),
    ),
    url(r"^upload/$", views.upload),
    url(r"^$", views.home),
    url(r"^awards/(?P<id>\d+)/$", views.get_award_by_id),
    url(r"^award_application/(?P<id>\d+)/$", views.award_application),
    url(r"^application/(?P<id>\d+)/$", views.get_application_by_id),
    url(r"^awards/", views.AwardView.as_view()),
    url(r"^award_result/(?P<id>\d+)/$", views.award_result),
    url(r"^get_available_awards/", views.available_awards),
    url(r"^finish_award/(?P<id>\d+)/$", views.finish_award),
    url(r"^record/$", views.RecordView.as_view()),
    url(r"^get_applyed_awards/", views.ApplyedRecordView.as_view()),
    url(r"^approval/$", views.ApprovalView.as_view()),
    url(r"^secretary_department/$", views.secretary.secretary_department),
    path("group/", views.GroupView.as_view()),
    path("userinfo/", views.UserInfoView.as_view()),
    path("group_user/", views.GroupUserView.as_view()),
    path("message/", views.MessageView.as_view()),
    path("group_manage/", views.GroupManageView.as_view()),
    path("group_all/", views.GroupAllView.as_view()),
    path("group_invitation/", views.GroupInvite.as_view())
]
