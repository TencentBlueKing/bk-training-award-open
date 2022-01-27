from awards_apply import views
from django.conf.urls import url

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
        r"^secretary/(?P<group_id>\d+)/$",
        views.SecretaryViewSet.as_view({"put": "update"}),
    ),
    url(r"^upload/$", views.upload),
    url(r"^media/(?P<filename>.*)/$", views.download),
    path("", views.home),
    url(r"^awards/", views.AwardView.as_view()),
    url(r"^record/$", views.RecordView.as_view()),
    url(r"^get_available_awards/", views.AvailableAwardsView.as_view()),
    url(r"^get_applyed_awards/", views.ApplyedRecordView.as_view()),
]
