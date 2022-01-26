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
    re_path(r'media/(?P<path>.*)$', serve, {'document_root': MEDIA_ROOT}),
    url(r"get_awards_list/", views.AwardView.as_view()),
    url(r"make_an_application/$", views.make_an_application),
    url(r"^withdraw_an_application/$", views.withdraw_an_application),
    url(r"^create_award/$", views.create_award),
    url(r"^get_available_awards/", views.AvailableAwardsView.as_view()),
]
