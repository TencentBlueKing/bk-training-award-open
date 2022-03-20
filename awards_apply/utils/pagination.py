import math

from rest_framework.pagination import PageNumberPagination


class PagePagination(PageNumberPagination):
    page_size = 10
    max_page_size = 60
    page_size_query_param = 'size'

    def get_paginated_response(self, data):
        return ({
            'count': self.page.paginator.count,
            'data': data,
            'sum_pages': math.ceil(self.page.paginator.count / self.page_size)  # 总页数
        })


class CommonPaginaation(PageNumberPagination):
    page_size = 10
    page_query_param = 'page'
    page_size_query_param = 'size'
