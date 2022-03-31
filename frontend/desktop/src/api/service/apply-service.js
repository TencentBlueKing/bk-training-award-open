/**
 * @file service apply
 * @author couriourc
 */
import http from '@/api'
// S 奖项审批
/**
 * @description 更据状态查询审批
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
 * @description 发起审批
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
// E 奖项审批

// S 查询奖项申请记录
/**
 * @description 更据状态查询申请记录
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
 * @description 根据申请id 查询申请信息
 * @param applicationId
 * */
export function getApplicationById (applicationId) {
    return http.get(`/application/${applicationId}/`)
}

/**
 * @description 获取奖项申请信息
 * @param id
 * */
export function getAwardApplication ({ id: awardId }) {
    return http.get(`/award_application/${awardId}/`)
}
