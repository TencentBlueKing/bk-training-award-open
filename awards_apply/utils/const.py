def success_code(data, message="操作成功"):
    """成功返回信息模板

    :param data: 要返回的数据
    :param message: 提示信息
    """
    return {
        "code": 0,
        "result": True,
        "message": message,
        "data": data,
    }


def object_not_exist_error(object):
    """目标不存在返回模板

    :param object:没找到的目标信息, 例如:user not exist
    """
    return {
        "code": 40004,
        "message": f"{object} 不存在",
        "result": False,
        "data": None,
    }


def param_error(error=None):
    """参数缺失返回信息模板

    :param error: 参数名
    """
    return {
        "code": 40001,
        "result": False,
        "message": f"缺少参数 {error} ",
        "data": None,
    }


def not_catch_error():
    """未捕获的异常"""
    return {
        "result": False,
        "code": 50000,
        "message": "系统异常,请联系管理员处理",
        "data": None,
    }


def permission_denied():
    """权限校验失败返回信息"""
    return {
        "code": 30000,
        "result": False,
        "message": "您没有权限访问此页面",
        "data": None,
    }


def serializer_errors(errors):
    """反序列化参数错误返回信息模板

    :param errors: 错误信息
    """
    return {
        "code": 40001,
        "result": False,
        "message": "参数校验失败",
        "data": errors,
    }


def false_code(message):
    """自定义失败返回信息"""
    return {
        "code": 1,
        "result": False,
        "message": message,
        "data": None,
    }


def page_num_exception():
    """页面超出范围异常"""
    return {
        "code": 1,
        "result": False,
        "message": "页码超出范围",
        "data": None,
    }


def value_exception():
    """数据为空或参数异常"""
    return {
        "code": 1,
        "result": True,
        "message": "数据为空或参数异常",
        "data": [],
    }


def value_type_exception():
    """参数异常"""
    return {
        "code": 1,
        "result": False,
        "message": "未传参数",
        "data": None,
    }
