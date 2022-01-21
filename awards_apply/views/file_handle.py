from awards_apply.utils.const import (object_not_exist_error, param_error,
                                      success_code)
from awards_apply.utils.upload_file_handler import upload_file_handler
from config.default import MEDIA_URL
from django.core.files.storage import default_storage
from django.http import FileResponse, JsonResponse


def upload(request):
    """上传文件"""
    file = request.FILES.get("upload_file", None)
    if not file:
        return JsonResponse(param_error("file"))
    file_info = upload_file_handler(file)
    return JsonResponse(success_code(file_info))


def download(request, filename):
    """下载文件"""
    try:
        file = default_storage.open(MEDIA_URL + filename)
    except FileNotFoundError:
        return JsonResponse(object_not_exist_error("file"))
    else:
        return FileResponse(file, as_attachment=True, filename=filename)
