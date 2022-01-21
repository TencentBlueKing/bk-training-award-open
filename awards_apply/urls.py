from django.urls import path, re_path
from django.views.static import serve
from . import views
from config.dev import MEDIA_ROOT

urlpatterns = (
    re_path(r'media/(?P<path>.*)$',serve,{'document_root':MEDIA_ROOT}),
    path("", views.home),
    path("get_awards_list/", views.get_awards_list),
    path("deal_with_an_apply/", views.deal_with_an_apply),
    path("create_award/", views.create_award),
    path("upload_img/<int:award_id>/", views.upload_img),
)