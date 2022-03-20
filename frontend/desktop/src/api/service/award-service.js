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
 * */
export function getAwards ({ page, size }) {
    return http.get('awards/', {
        params: {
            page,
            size
        }
    })
}
/***
 * 获取可申请奖项
 * @param { number } page
 * @param { number } size
 * */
export function getAvailableAwards (page, size) {
    return http.get('get_available_awards/', {
        params: {
            page,
            size
        }
    })
}
/**
 * 获取申请过的奖项
 * @param { number } page
 * @param { number } size
 * */
export function getAppliedAwards (page, size) {
    return http.get('get_applyed_awards/', {
        params: { page, size }
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
    return http.put('record/', {
        id: applyId
    })
}
/**
 * 删除奖项
 * @param { number } awardId
 * */
export function deleteAward ({ awardId }) {
    return http.delete('awards/', {
        data: {
            award_id: awardId
        }
    })
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
    end_time
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
        end_time
    })
}

export function getAwardById (id) {
    return http.get(`/awards/${id}/`)
}
