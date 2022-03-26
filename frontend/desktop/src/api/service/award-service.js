/**
 * @file service award
 * @author couriourc
 */
import http from '@/api'

/**
 * 新增奖项
 * @param { award_name, award_level, award_description, award_consultant, award_image, award_department_fullname, award_reviewers, start_time, end_time } fields
 * */
export function postAwards (fields) {
    return http.post('awards/', fields)
}

/**
 * 获取奖项
 * @param { number } page
 * @param { number } size
 * @param group_id
 * @param award_status
 * */
export function getAwards ({
    page,
    size,
    group_id,
    award_status
}) {
    return http.get('awards/', {
        params: {
            page,
            size,
            group_id,
            award_status
        }
    })
}
/***
 * 获取可申请奖项
 * @param { number } page
 * @param { number } size
 * @param award_status
 * @param group_id
 * */
export function getAvailableAwards ({ page, size, award_status, group_id }) {
    return http.get('get_available_awards/', {
        params: {
            page,
            size,
            award_status: award_status,
            group_id: group_id
        }
    })
}
/**
 * 奖项申请的统一入口
 * @param { boolean } isDraft
 * @param { id,award_id,application_reason,application_users,application_attachments } applyForm
 *
 * */
export function postRecord (isDraft, applyForm) {
    return http.post('record/', {
        is_draft: isDraft,
        ...applyForm
    })
}
/**
 * 撤销申请
 * @param { number } applyId
 *
 * */
export function deleteRecord (applyId) {
    console.log(applyId)
    return http.delete('record/', {
        data: {
            id: applyId
    
        } })
}
/**
 * 编辑奖项
 * @param {string} awardId
 * @param { string } award_name
 * @param { string } award_level
 * @param { string } award_description
 * @param { string } award_consultant
 * @param { string } award_image
 * @param { string } award_department_fullname
 * @param { string } award_reviewers
 * @param { string } start_time
 * @param { string } end_time
 * @param award_department_id
 * @param award_consultant_displayname
 * @param award_demand
 * */
export function putAward (awardId, {
    award_name,
    award_level,
    award_description,
    award_consultant,
    award_image,
    award_department_fullname,
    award_reviewers,
    start_time,
    end_time,
    award_department_id,
    award_consultant_displayname,
    award_demand
}) {
    return http.put('awards/', {
        award_id: awardId,
        award_name,
        award_level,
        award_description,
        award_consultant,
        award_image,
        award_department_fullname,
        award_reviewers,
        start_time,
        end_time,
        award_department_id,
        award_consultant_displayname,
        award_demand
    })
}

/**
 * 撤销申请
 * @param id
 * */
export function getAwardById (id) {
    return http.get(`/awards/${id}/`)
}

/**
 * 结束奖项
 * @param awardId 需要结束的奖项id
 * @return {any}
 * */
export function postFinishAward ({ awardId }) {
    return http.post(`/finish_award/${awardId}/`)
}

/**
 * 结束奖项
 * @param id
 * */
export function getAwardApplication (id) {
    return http.get(`/award_application/${id}/`)
}
