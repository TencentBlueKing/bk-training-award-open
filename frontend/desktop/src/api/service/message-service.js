import http from '@/api'

/**
 * 获取小组审批信息
 * */
export function getGroupManage () {
    return http.get('/group_manage/')
}

export function getMessage ({ page, size }) {
    return http.get('/message/', {
        params: {
            page, size
        }
    })
}
