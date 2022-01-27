from rest_framework.pagination import PageNumberPagination


class PagePagination(PageNumberPagination):
    page_size = 10
    max_page_size = 60
    page_size_query_param = 'size'
