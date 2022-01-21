from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)
    return Response(
        {
            "code": "40005",
            "result": False,
            "message": response.data,
            "data": None,
        }
    )
