(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[39],{289:function(a,t,n){"use strict";n.r(t);var e=n(290);var r=n.n(e);for(var i in e)if(i!=="default")(function(a){n.d(t,a,function(){return e[a]})})(i);t["default"]=r.a},290:function(a,t,n){"use strict";var e=n(1);Object.defineProperty(t,"__esModule",{value:true});t.default=void 0;var r=e(n(3));var i=n(8);var o=n(208);var d=n(291);var l=n(14);var u=n(209);var p={name:"pending-approval",mixins:[d.applyTableMixins],data:function a(){return{pendingApprovalRemoteData:[],APPLY_STATE:Object.freeze(i.APPLY_STATE)}},computed:{pendingApprovalData:function a(t){return t.pendingApprovalRemoteData.map(function(a){var t,n;var e=(t=a["award_info"])!==null&&t!==void 0?t:{};var r=e["award_reviewers"].map(function(a,t){return{title:"审批流程",icon:t+1,description:a.join(",")}});return{approval_id:a["id"],record_id:a["id"],approval_state:a["approval_state"],application_reason:a["application_reason"],application_time:(0,l.formatDate)(a["application_time"]),award_id:a["award_id"],award_name:(n=a["award_info"])===null||n===void 0?void 0:n["award_name"],award_department_id:["award_department_id"],award_department_fullname:e["award_department_fullname"],award_reviewers:e["award_reviewers"],award_reviewers_steps:r,award_consultant:e["award_consultant"],award_description:e["award_description"],award_consultant_displayname:e["award_consultant_displayname"],award_consultant_displayname_for_display:e["award_consultant_displayname_for_display"],award_demand:e["award_demand"],start_time:(0,l.formatDate)(e["start_time"]),end_time:(0,l.formatDate)(e["end_time"])}})}},created:function a(){this.handleInit()},methods:{handleInit:function a(){Promise.all([this.handleGetPendingApproval()])},handleGetPendingApproval:function a(){var t=this;var n=arguments.length>0&&arguments[0]!==undefined?arguments[0]:this.pagination.current;var e=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.pagination.limit;var r={page:n,size:e,group_id:this.$bus.curGlobalGroupId,apply_status:i.MYAPPLY_DRAFT};if(this.loading)return;this.loading=true;return(0,o.getRecord)(r).then(function(a){var n=a.data;t.pagination["count"]=n.count;t.pendingApprovalRemoteData=n.data}).finally(function(a){t.loading=false})},handleToRefundApplication:function a(t){var n=this;return(0,u.deleteRecord)(t).then(function(a){n.messageWarn("撤回成功");n.handleInit()})},handleToEditDraft:function a(t){var n;if(!t["award_id"]){return}this.$router.push({name:i.DETAIL_ROUTE_PATH,query:(n={},(0,r.default)(n,i.DETAIL_TYPE_KEYNAME,i.DETAIL_EDIT),(0,r.default)(n,"award_id",t["award_id"]),(0,r.default)(n,"record_id",t["record_id"]),n)})},handleToGetDetail:function a(t){var n;this.$router.push({name:i.DETAIL_ROUTE_PATH,query:(n={},(0,r.default)(n,i.DETAIL_TYPE_KEYNAME,i.DETAIL_APPLY_DETAIL),(0,r.default)(n,"award_id",t["award_id"]),(0,r.default)(n,"record_id",t["record_id"]),n)})}}};t.default=p},363:function(a,t,n){"use strict";n.r(t);var e=n(405);var r=n(289);for(var i in r)if(i!=="default")(function(a){n.d(t,a,function(){return r[a]})})(i);var o=n(18);var d=Object(o["a"])(r["default"],e["a"],e["b"],false,null,null,null);t["default"]=d.exports},405:function(a,t,n){"use strict";var e=function(){var a=this;var t=a.$createElement;var n=a._self._c||t;return n("self-table",{attrs:{data:a.pendingApprovalData,loading:a.loading,pagination:a.pagination},on:{"update:pagination":function(t){a.pagination=t},"page-change":function(t){a.handleInit()}}},[n("bk-table-column",{attrs:{type:"index",label:"序号",width:"60"}}),a._v(" "),n("bk-table-column",{attrs:{label:"奖项名称",prop:"award_name"}}),a._v(" "),n("bk-table-column",{attrs:{label:"申请开始时间",prop:"start_time"}}),a._v(" "),n("bk-table-column",{attrs:{label:"申请截止时间",prop:"end_time"}}),a._v(" "),n("bk-table-column",{attrs:{label:"申请理由"},scopedSlots:a._u([{key:"default",fn:function(t){return[n("span",{directives:[{name:"bk-tooltips",rawName:"v-bk-tooltips.light",value:t.row["application_reason"],expression:"application.row['application_reason']",modifiers:{light:true}}]},[a._v(" "+a._s(t.row["application_reason"]))])]}}])}),a._v(" "),n("bk-table-column",{attrs:{label:"操作",width:250},scopedSlots:a._u([{key:"default",fn:function(t){return[n("bk-button",{staticClass:"mr10",attrs:{theme:"primary",text:true},on:{click:function(n){a.handleToGetDetail(t.row)}}},[a._v("\n                详情\n            ")]),a._v(" "),n("bk-button",{directives:[{name:"show",rawName:"v-show",value:t.row["approval_state"]===a.APPLY_STATE["draft"],expression:"application.row['approval_state'] === APPLY_STATE['draft']"}],staticClass:"ml10 mr10",attrs:{theme:"warning",text:true},on:{click:function(n){a.handleToEditDraft(t.row)}}},[a._v("\n                编辑草稿\n            ")])]}}])})],1)};var r=[];n.d(t,"a",function(){return e});n.d(t,"b",function(){return r})}}]);