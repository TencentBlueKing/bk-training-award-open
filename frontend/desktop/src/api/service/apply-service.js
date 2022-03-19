/**
 * @file service apply
 * @author couriourc
 */
import http from '@/api'

export function getApproval ({ page, size }) {
    return http.get('/approval/', {
        params: {
            page,
            size
        }
    })
}

/**
 * @param { number } page 页码
 * @param { number } size 每页大小
 * */
export function getRecord (page, size) {
    return http.get('record/', {
        params: {
            page,
            size
        }
    })
}

/**
 * @param { number } id 申请id
 * @param {string} action 通过为1,打回为0
 * @param {string} approval_text 审批信息
 * */

export function postApproval ({ id, action, approval_text }) {
    return http.post('/approval/', {
        id,
        action,
        approval_text
    })
}
