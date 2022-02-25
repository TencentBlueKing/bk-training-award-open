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
