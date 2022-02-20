import http from '@/api'

/**
 * 获取蓝鲸平台下所有组织
 * @param { number } page
 * @param { number } page_size
 * @param { string? } fuzzy_lookups 模糊查找内容列表,
 * */
export function getListDepartments ({ page, page_size, fuzzy_lookups }) {
    return http.get('/usermanage/list_departments/', {
        params: {
            page,
            page_size,
            fuzzy_lookups
        }
    })
}

/**
 * 获取蓝鲸平台下所有组织
 * @param { number } page
 * @param { number } page_size
 * @param { string? } fuzzy_lookups 模糊查找内容列表,
 * */
export function getListUsers ({ page, page_size, fuzzy_lookups }) {
    return http.get('/usermanage/list_users/', {
        params: {
            page,
            page_size,
            fuzzy_lookups
        }
    })
}
