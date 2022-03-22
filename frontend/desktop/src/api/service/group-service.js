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

/**
 * API-获取用户是否为秘书, 是否为管理员
 * */
export function getUsermanageRetrieveUser (config = {}) {
    return http.get('/usermanage/retrieve_user/', {}, config)
}

export function getGroup (config = {}) {
    return http.get('/group/', {}, config)
}

/**
 * 更新组织的映射关系
 * @param { string } group_name 组名
 * */
export function postGroup ({ group_name }) {
    return http.post('/group/', {
        group_name
    })
}

/**
 * @param group_id 小组 id
 * */

export function postGroupUser ({ group_id }) {
    return http.post('/group_user/', {
        group_id
    })
}

export function getGroupUser ({ groupId }) {
    console.log(groupId)
    return http.get('/group_user/', {
        params: {
            group_id: groupId
        }
    })
}

/**
 * @param username
 * @param group_id
 * */
export function deleteGroupManage ({ username, group_id }) {
    return http.delete('/group_manage/', {
        group_id,
        username
    })
}

/**
 * @param apply_id
 * @param is_allow
 * */
export function postGroupManage ({
    apply_ids,
    is_allow
}) {
    return http.post('/group_manage/', {
        apply_ids,
        is_allow
    })
}

/**
 * @param username
 * @param group_id
 * */
export function putGroupManage ({ username, group_id }) {
    return http.delete('/group_manage/', {
        data: {
            group_id,
            new_secretary: username
        }
    })
}

// 退出小组
export function deleteGroupUser ({ group_id }) {
    return http.delete('/group_user/', {
        data: {
            group_id
        }
    })
}

/**
 * @param { number } page 页码
 * @param { number } size 每页大小
 * @param group_id
 * @param approval_status
 * */
export function getGroupApproval ({ page, size, group_id, approval_status }) {
    return http.get('/approval/', {
        params: {
            page,
            size,
            group_id,
            approval_status
        }
    })
}

export function getGroupManage ({ group_id, status }) {
    return http.get('/group_manage/', {
        params: {
            group_id,
            status
        }
    })
}

export function getGroupAll () {
    return http.get('/group_all/', {}, { fromCache: true })
}
