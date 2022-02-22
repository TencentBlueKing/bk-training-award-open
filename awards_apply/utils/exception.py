# 用户信息不存在异常
class NotUserException(Exception):
    def __init__(self, message):
        self.message = message
