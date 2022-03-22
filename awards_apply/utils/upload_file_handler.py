
from bkstorages.backends.bkrepo import BKRepoStorage
from django.conf import settings

default_storage = BKRepoStorage()


def upload_file_handler(file):
    """处理上传上来的文件

    :param file: file对象
    :return: 文件路径, 名称, 大小等信息
    """
    if not file:
        return None
    path = settings.MEDIA_URL + file.name
    path = default_storage.save(path, file)
    url = default_storage.url(path)
    return {"path": url, "name": file.name, "size": file.size}
