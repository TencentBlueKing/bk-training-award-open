from awards_apply.utils.const import param_error, success_code
from awards_apply.utils.upload_file_handler import upload_file_handler
from bkstorages.backends.bkrepo import BKRepoStorage
from django.http import JsonResponse
from django.views.decorators.http import require_POST

default_storage = BKRepoStorage()


@require_POST
def upload(request):
    """上传文件"""
    file = request.FILES.get("upload_file")
    if not file:
        return JsonResponse(param_error("upload_file"))
    file_info = upload_file_handler(file)
    return JsonResponse(success_code(file_info))
