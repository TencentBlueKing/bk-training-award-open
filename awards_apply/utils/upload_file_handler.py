import hashlib
from functools import partial
from pathlib import Path

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
    file_md5 = file_md5_calculate(file)
    suffix = Path(file.name).suffix
    path = settings.MEDIA_URL + file_md5 + suffix
    path = default_storage.save(path, file)
    return {"path": path, "name": file.name, "size": file.size}


def file_md5_calculate(data, block_size=65536):
    """文件MD5值计算"""
    md5 = hashlib.md5()
    for item in iter(partial(data.read, block_size), b""):
        md5.update(item)
    file_md5 = md5.hexdigest()
    return file_md5
