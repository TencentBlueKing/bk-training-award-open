from awards_apply.utils.const import not_catch_error, param_error
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin


class AppExceptionMiddleware(MiddlewareMixin):
    """
    错误捕获中间件
    """

    def process_exception(self, request, exception):
        self.exception = exception
        self.request = request
        if isinstance(exception, KeyError):
            response = JsonResponse(param_error(exception))
            return response
        response = JsonResponse(not_catch_error())
        response.status_code = 500

        return response
