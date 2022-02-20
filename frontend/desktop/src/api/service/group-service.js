/**
 * @file service group
 * @author couriourc
 */
import http from '@/api'

/**
 * 创建组织的映射关系
 * @param { number } page
 * @param { number } size
 * */
export function getSecretary (page, size) {
    return http.get('/secretary/', {
        page,
        size
    })
}

/**
 * 创建组织的映射关系
 * @param { group_id,secretaries ,group_full_name } groupForm
 * */
export function postSecretary ({ group_id, secretaries, group_full_name }) {
    return http.post('/secretary/', { group_id, secretaries, group_full_name })
}

/**
 * 更新组织的映射关系
 * @param { number } id 更新对应的 id
 * @param { number } group_id 组的 id
 * @param { array<username> } secretaries 秘书表
 * @param { string } group_full_name 组名（我也不知道有啥用，但是要传）
 * */
export function putSecretary (id, { group_id, secretaries, group_full_name }) {
    return http.put(`/secretary/${id}/`, { group_id, secretaries, group_full_name })
}
