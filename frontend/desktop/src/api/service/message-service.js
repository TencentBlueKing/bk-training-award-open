import http from '@/api'

/**
 * @description 获取消息
 * @param msg_id
 * */

export function getMessage ({ page, size }) {
    return http.get('/message/', {
        params: {
            page, size
        }
    })
}

/**
 * @description 将消息设置为已读
 * @param msg_id
 * */
export function putMessage ({ msg_id }) {
    return http.put('/message/', {
        msg_id
    })
}
