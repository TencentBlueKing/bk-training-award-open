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
    [APPLYED]: '开放申请中',
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
export const APPLY_STATE = {
    'review_pending': REVIEW_PENDING,
    'review_passed': REVIEW_PASSED,
    'review_not_passed': REVIEW_NOT_PASSED,
    'draft': DRAFT
}
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

export const GROUP_USERS_KEYNAME = 'user'
export const SYS_KEYNAME = 'sys'
export const GROUP_KEYNAME = 'group'
export const BK_GROUP_KEYNAME = 'bk-group'
export const GROUP_SECRETARY_KEYNAME = 'secretary'

/**
 * 权限控制表
 * */
/**
 * 身份常量表
 * */
export const IDENT_ADMIN = 'is_admin'
export const IDENT_SECRETARY = 'is_secretary'
export const IDENT_COMMON = 'common'
/**
 * 路由常量表，如果需要携带参数，只需要在 router 创建的时候去拼接一下就能使用对应的动态路由
 * */
export const HOME_ROUTE_PATH = 'home'
export const CANAWARDS_ROUTE_PATH = 'canawards'
export const MYAPPLY_ROUTE_PATH = 'myapply'
// S 申请路由中的状态量
export const PENDING_APPROVAL = 1
export const ING_APPROVAL = 2
export const ENDED_APPROVAL = 3
// E 申请路由中的状态量

export const GROUP_MANAGER_ROUTE_PATH = 'group-manager'
export const AWARD_MANAGER_ROUTE_PATH = 'award-manager'
// S 奖项路由中的状态量
export const PENDING_START = 1
export const ING_AWARD = 2
export const ING_REVIEW = 3
export const ENDED_REVIEW = 4
// E 奖项路由中的状态量

export const AWARD_FORM_ROUTE_PATH = 'award-form'
export const MYCHECK_ROUTE_PATH = 'mycheck'
// S
export const GROUP_PENDING_APPROVAL = 1
export const GROUP_ENDED_APPROVAL = 2
// E
export const DETAIL_ROUTE_PATH = 'detail'
export const BAD_404_ROUTE_PATH = '404'
export const LOGIN_SUCCESS_ROUTE_PATH = '/account/login_success'
export const INVITE_ROUTE_PATH = 'invite'

export const POWER_CONTROLLER = {
    [HOME_ROUTE_PATH]: {
        [IDENT_ADMIN]: {},
        [IDENT_SECRETARY]: {},
        [IDENT_COMMON]: {}
    },
    [CANAWARDS_ROUTE_PATH]: {
        [IDENT_ADMIN]: {},
        [IDENT_SECRETARY]: {},
        [IDENT_COMMON]: {}
    },
    [MYAPPLY_ROUTE_PATH]: {
        [IDENT_ADMIN]: {},
        [IDENT_SECRETARY]: {},
        [IDENT_COMMON]: {}
    },
    [GROUP_MANAGER_ROUTE_PATH]: {
        [IDENT_ADMIN]: {
            // 是否能创建新的组
            'add-new-group': true,
            // 是否能编辑组
            'table-controller': true
        },
        [IDENT_SECRETARY]: {},
        [IDENT_COMMON]: {}
    },
    [AWARD_MANAGER_ROUTE_PATH]: {
        [IDENT_ADMIN]: {},
        [IDENT_SECRETARY]: {},
        [IDENT_COMMON]: {}
    },
    [MYCHECK_ROUTE_PATH]: {
        [IDENT_ADMIN]: {},
        [IDENT_SECRETARY]: {},
        [IDENT_COMMON]: {}
    },
    [DETAIL_ROUTE_PATH]: {
        [IDENT_ADMIN]: {},
        [IDENT_SECRETARY]: {},
        [IDENT_COMMON]: {}
    },
    [AWARD_FORM_ROUTE_PATH]: {
        [IDENT_ADMIN]: {},
        [IDENT_SECRETARY]: {},
        [IDENT_COMMON]: {}
    },
    [BAD_404_ROUTE_PATH]: {
        [IDENT_ADMIN]: {},
        [IDENT_SECRETARY]: {},
        [IDENT_COMMON]: {}
    },
    [LOGIN_SUCCESS_ROUTE_PATH]: {
        [IDENT_ADMIN]: {},
        [IDENT_SECRETARY]: {},
        [IDENT_COMMON]: {}
    },
    [INVITE_ROUTE_PATH]: {
        [IDENT_ADMIN]: {},
        [IDENT_SECRETARY]: {},
        [IDENT_COMMON]: {}
    }
}
export const ROUTE_TABLE = {
    HOME_ROUTE_PATH,
    CANAWARDS_ROUTE_PATH,
    MYAPPLY_ROUTE_PATH,
    GROUP_MANAGER_ROUTE_PATH,
    AWARD_MANAGER_ROUTE_PATH,
    AWARD_FORM_ROUTE_PATH,
    MYCHECK_ROUTE_PATH,
    DETAIL_ROUTE_PATH,
    BAD_404_ROUTE_PATH,
    LOGIN_SUCCESS_ROUTE_PATH
}

// 事件集
export const APP_AUTH_NEWER = 'auth-newer'
export const APP_GROUP_DIALOG = 'auth-newer_dialog'
