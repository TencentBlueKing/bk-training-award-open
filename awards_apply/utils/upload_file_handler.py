import hashlib
from functools import partial
from pathlib import Path

from config.default import MEDIA_URL
from django.core.files.storage import default_storage


def upload_file_handler(file):
    """处理上传上来的文件

    :param file: file对象
    :return: 文件路径, 名称, 大小等信息
    """
    if not file:
        return None
    file_md5 = file_md5_calculate(file)
    suffix = Path(file.name).suffix
    if default_storage.exists(path := MEDIA_URL + file_md5 + suffix):
        return {"path": path, "name": file.name, "size": file.size}
    else:
        path = default_storage.save(MEDIA_URL + file_md5 + suffix, file)
        return {"path": path, "name": file.name, "size": file.size}


def file_md5_calculate(data, block_size=65536):
    """文件MD5值计算"""
    md5 = hashlib.md5()
    for item in iter(partial(data.read, block_size), b""):
        md5.update(item)
    file_md5 = md5.hexdigest()
    return file_md5
