/* 常量表 */

/**
 * 奖项申请状态
 * */
export const NOT_APPLY = 0
export const APPLYED = 1
export const ENDED = 2
export const APPROVAL_STATE = {
    [NOT_APPLY]: NOT_APPLY,
    [APPLYED]: APPLYED
}
export const AWARD_APPROVAL_STATE_MAP = {
    [NOT_APPLY]: '未开始',
    [APPLYED]: '申请中',
    [ENDED]: '已结束'
}
export const AWARD_APPROVAL_STATE_EN_MAP = {
    [NOT_APPLY]: 'not_apply',
    [APPLYED]: 'applyied',
    [ENDED]: 'ended'
}

/***
 * 申请表状态
 *
 * */
export const REVIEW_PENDING = 0

export const REVIEW_PASSED = 1

export const REVIEW_NOT_PASSED = 2

export const DRAFT = 3

export const APPLY_APPROVAL_STATE_MAP = {
    [REVIEW_PENDING]: '待评审',
    [REVIEW_PASSED]: '评审通过',
    [REVIEW_NOT_PASSED]: '评审不通过',
    [DRAFT]: '草稿'
}
export const APPLY_APPROVAL_STATE_EN_MAP = {
    [REVIEW_PENDING]: 'review_pending',
    [REVIEW_PASSED]: 'review_passed',
    [REVIEW_NOT_PASSED]: 'review_not_passed',
    [DRAFT]: 'draft'
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
export const AWARD_LEVEL_EN_MAP = {
    [COMPANY]: 'company',
    [GROUP]: 'group'
}
/***
 * 组人员缓存键值
 * */

export const GROUP_USERS_KEYNAME = 'groupUser'
export const GROUP_KEYNAME = 'group'

/**
 * 权限控制表
 * */

export const POWER_CONTROLLER = {
    'award-manager': {
        'is_admin': {},
        'is_secretary': {},
        'common': {}
    },
    'group-manager': {
        'is_admin': {
            'add-new-group': true,
            'table-controller': true
        },
        'is_secretary': {
            'add-new-group': false,
            'table-controller': false
        },
        'common': {
            'add-new-group': false,
            'table-controller': false
        }
    }
}
