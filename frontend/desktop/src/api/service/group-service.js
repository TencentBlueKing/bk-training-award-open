/**
 * @file service group
 * @author couriourc
 */
import http from '@/api'

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

/**
 * @param group_id 小组 id
 * */
export function getGroupUser ({ groupId }) {
    console.log(groupId)
    return http.get('/group_user/', {
        params: {
            group_id: groupId
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
 * @param username
 * @param group_id
 * */
export function deleteGroupManage ({ username, group_id }) {
    return http.delete('/group_manage/', {
        params: {
            group_id,
            username

        }
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
    return http.put('/group_manage/', {
        group_id,
        new_secretary: username
    })
}

/**
 * @param username
 * @param group_id
 * */
export function getGroupManage ({ group_id, status }) {
    return http.get('/group_manage/', {
        params: {
            group_id,
            status
        }
    })
}

/**
 * 获取所有的小组
 * */
export function getGroupAll () {
    return http.get('/group_all/', {}, { canNewer: true, fromCache: true })
}
