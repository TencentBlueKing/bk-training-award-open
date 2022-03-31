from awards_apply.models import User
from awards_apply.utils.exception import NotUserException
from blueking.component.shortcuts import get_client_by_request


def get_user_info(request):
    """ESB接口调用-获取用户信息

    :param api:
    :return: 用户数据
    """
    client = get_client_by_request(request)
    query_params = {"id": request.user.username}
    data = client.usermanage.retrieve_user(query_params)
    if data['result'] is False:
        raise NotUserException("用户不存在")
    return data


def copy_user_from_bk(request, username: str):
    """
    ESB接口调用-获取用户信息并复制到项目数据库中
    """
    client = get_client_by_request(request)
    query_params = {"id": username}
    api_res = client.usermanage.retrieve_user(query_params)
    if api_res['result'] is False:
        raise NotUserException("用户不存在")
    user_info = api_res["data"]
    user = User.objects.create(
        id=user_info["id"],
        username=user_info["username"],
        display_name=user_info["display_name"],
        phone=user_info["telephone"],
        email=user_info["email"]
    )
    return user
