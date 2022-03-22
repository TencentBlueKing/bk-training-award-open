import http from '@/api'

/**
 * 获取小组审批信息
 * */

export function getMessage ({ page, size }) {
    return http.get('/message/', {
        params: {
            page, size
        }
    })
}
export function putMessage ({ msg_id }) {
    return http.put('/message/', {
        msg_id
    })
}
