from awards_apply.models import Admin, Secretary
from blueking.component.shortcuts import get_client_by_request
from rest_framework.response import Response
from rest_framework.views import APIView


class UserView(APIView):
    def get(self, request, api):
        """ESB接口调用-用户管理

        :param api: 要调用的api
        :return:
        """
        client = get_client_by_request(request)
        # 默认id参数使用username,这样获取用户信息就不用传参了
        query_params = {"id": request.user.username, **request.query_params}
        # 为当前用户数据中添加is_admin, is_secretary字段, 用于前端页面展示判断
        if api == "retrieve_user" and not request.query_params:
            data = getattr(client.usermanage, api)(query_params)
            is_admin = Admin.objects.filter(admin_username=request.user.username).exists()
            is_secretary = Secretary.objects.filter(secretaries__contains=request.user.username).exists()
            data["data"].update({"is_admin": is_admin, "is_secretary": is_secretary})
            return Response(data)
        # 获得CompomentApi并调用
        data = getattr(client.usermanage, api)(query_params)
        return Response(data)
