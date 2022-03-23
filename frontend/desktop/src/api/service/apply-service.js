/**
 * @file service apply
 * @author couriourc
 */
import http from '@/api'

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

/**
 * @param { number } page 页码
 * @param { number } size 每页大小
 * @param group_id
 * @param approval_status
 * */
export function getAwardApproval ({ page, size, group_id, approval_status }) {
    return http.get('/approval/', {
        params: {
            page,
            size,
            group_id,
            approval_status
        }
    })
}

/**
 * @param { number } page 页码
 * @param { number } size 每页大小
 * @param group_id
 * @param apply_status
 * */
export function getRecord ({ page, size, group_id, apply_status }) {
    return http.get('record/', {
        params: {
            page,
            size,
            group_id,
            apply_status
        }
    })
}

/**
 * @param applicationId
 * */
export function getApplicationById (applicationId) {
    return http.get(`/application/${applicationId}/`)
}

/**
 * @param id
 * */
export function getAwardApplication (id) {
    return http.get(`/award_application/${id}/`)
}
