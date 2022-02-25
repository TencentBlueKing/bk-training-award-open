from awards_apply.models import Images
from awards_apply.utils.const import (object_not_exist_error, param_error,
                                      success_code)
from django.conf import settings
from django.core.files.storage import default_storage
from django.http import FileResponse, JsonResponse
from django.views.decorators.http import require_GET, require_POST


@require_POST
def upload(request):
    """上传文件"""
    file = request.FILES.get("upload_file", None)
    if not file:
        return JsonResponse(param_error("file"))
    file_info = Images.objects.create(image=file)
    file_info = file_info.image
    print(settings.MEDIA_URL)
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
