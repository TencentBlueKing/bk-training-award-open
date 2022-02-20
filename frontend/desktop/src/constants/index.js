/* 常量表 */

/**
 * 奖项申请状态
 * */
const NOT_APPLY = 0
const APPLYED = 1
export const APPROVAL_STATE = {
    [NOT_APPLY]: NOT_APPLY,
    [APPLYED]: APPLYED
}
export const AWARD_APPROVAL_STATE_MAP = {
    [NOT_APPLY]: '未申请',
    [APPLYED]: '申请中'
}
export const AWARD_APPROVAL_STATE_EN_MAP = {
    [NOT_APPLY]: 'not_apply',
    [APPLYED]: 'applyied'
}
/**
 * 组类型
 * */
const COMPANY = 0
const GROUP = 1
export const AWARD_LEVEL_MAP = {
    [COMPANY]: '公司',
    [GROUP]: '小组'
}
/***
 * 组人员缓存键值
 * */

export const GROUP_USERS_KEYNAME = 'groupUser'
export const GROUP_KEYNAME = 'group'
