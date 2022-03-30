/* 常量表 */

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

/***
 * 组人员缓存键值
 * */

export const GROUP_USERS_KEYNAME = 'user'
export const SYS_KEYNAME = 'sys'
export const GROUP_KEYNAME = 'group'
export const BK_GROUP_KEYNAME = 'bk-group'

/**
 * 路由常量表，如果需要携带参数，只需要在 router 创建的时候去拼接一下就能使用对应的动态路由
 * */
export const HOME_ROUTE_PATH = 'home'
export const CANAWARDS_ROUTE_PATH = 'canawards'
export const MYAPPLY_ROUTE_PATH = 'myapply'
// S 申请路由中的状态量
// 对应到我的申请页面的关键词
/**
 * 这样做的好处是不至于传参很混乱
 * */
export const MYAPPLY_ROUTER_KEYNAME = 'myapply_type'
export const MYAPPLY_DRAFT = 1
export const MYAPPLY_PENDING_APPLY = 2
export const MYAPPLY_ENDED_APPROVAL = 3
/**
 * 这是抽离出来 tak-key 的命名常量,然后这样可以让 组件不是依赖于名字,
 * 而是专心做自己的事情,只要复合规范就行,因此也强烈建议在使用本项目中 tabs 的组件的时候,
 * 采用不断把在 tab-key 抽离的方式,
 * */
export const MYAPPLY_ING_APPLY_TAB_KEYNAME = 'myapply-ing-apply'
export const MYAPPLY_ING_APPROVAL_TAB_KEYNAME = 'myapply-ing-approval'
export const MYAPPLY_ENDED_APPROVAL_TAB_KEYNAME = 'myapply-ended-approval'
export const MYAPPLY_DRAFT_TAB_KEYNAME = 'myapply-draft'

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
// S 奖项表单的 类型
export const AWARD_TYPE_ROUTE_KEY = 'award-form-type'
export const AWARD_TYPE_CREATE = 'create'
export const AWARD_TYPE_EDIT = 'edit'
export const AWARD_TYPE_DETAIL = 'detail'
// E 奖项表单的 类型

export const MYCHECK_ROUTE_PATH = 'mycheck'
// S 审批路由中的一些状态
export const MYCHECK_ROUTE_KEYNAME = 'mycheck-type'
export const MYCHECK_AWARD_PENGDING_APPROVAL = 0
export const MYCHECK_AWARD_ENDED_APPROVAL = 1

// E 审批路由中的一些类型
// S
export const GROUP_PENDING_APPROVAL = 0
export const GROUP_ENDED_APPROVAL = 1
// E
export const DETAIL_ROUTE_PATH = 'detail'
// S 详情路由中的类型
export const DETAIL_TYPE_KEYNAME = 'detail_type'
export const DETAIL_APPLY = 'apply'
export const DETAIL_EDIT = 'edit'
export const DETAIL_APPROVAL = 'approval'
export const DETAIL_APPLY_DETAIL = 'apply_detail'
export const DETAIL_DRAFT_DETAIL = 'draft_detail'
export const DETAIL_APPROVAL_RESULT_DETAIL = 'approval_result'
// E 详情路由中的类型
export const BAD_404_ROUTE_PATH = '404'
export const INVITE_ROUTE_PATH = 'invite'
export const AWARD_APPLICATION_DETAILS_ROUTE_PATH = 'award_application_detail'
// S 奖项详情路由中的一些类型管理

// 事件集
export const APP_AUTH_NEWER = 'auth-newer'
export const APP_GROUP_DIALOG = 'auth-newer_dialog'
