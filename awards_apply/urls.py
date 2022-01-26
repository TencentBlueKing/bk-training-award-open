from django.urls import path, re_path
from django.views.static import serve
from . import views
from config.dev import MEDIA_ROOT


urlpatterns = (
    re_path(r'media/(?P<path>.*)$', serve, {'document_root': MEDIA_ROOT}),
    path("", views.home),
    path("get_awards_list/", views.AwardView.as_view()),
    path("make_an_application/", views.make_an_application),
    path("withdraw_an_application/", views.withdraw_an_application),
    path("create_award/", views.create_award),
    path("upload_img/<int:award_id>/", views.upload_img),
    path("get_available_awards/", views.AvailableAwardsView.as_view()),
)
