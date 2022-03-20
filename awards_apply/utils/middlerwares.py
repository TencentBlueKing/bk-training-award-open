import traceback

from awards_apply.utils.const import false_code, not_catch_error, param_error
from awards_apply.utils.exception import NotUserException
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin


class AppExceptionMiddleware(MiddlewareMixin):
    """
    错误捕获中间件
    """

    def process_exception(self, request, exception):
        self.exception = exception
        self.request = request
        traceback.print_exc()
        if isinstance(exception, KeyError):
            response = JsonResponse(param_error(exception))
            return response
        elif isinstance(exception, NotUserException):
            response = JsonResponse(false_code("用户不存在"))
            return response
        response = JsonResponse(not_catch_error())
        response.status_code = 500

        return response
