from awards_apply.utils.const import (object_not_exist_error, param_error,
                                      success_code)
from awards_apply.utils.upload_file_handler import upload_file_handler
from bkstorages.backends.bkrepo import BKRepoStorage
from django.conf import settings
from django.http import FileResponse, JsonResponse
from django.views.decorators.http import require_GET, require_POST

default_storage = BKRepoStorage()


@require_POST
def upload(request):
    """上传文件"""
    file = request.FILES.get("upload_file")
    if not file:
        return JsonResponse(param_error("file"))
    file_info = upload_file_handler(file)
    return JsonResponse(success_code({
        "path": settings.MEDIA_URL + file_info.name,
        "name": file.name,
        "size": file_info.size,
        'root': settings.MEDIA_URL
    }))


@require_GET
def download(request, filename):
    """下载文件"""
    try:
        file = default_storage.open(settings.MEDIA_URL + filename)
    except FileNotFoundError:
        return JsonResponse(object_not_exist_error("file"))
    else:
        return FileResponse(file, as_attachment=True, filename=filename)
