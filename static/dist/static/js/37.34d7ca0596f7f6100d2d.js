(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[37],{268:function(a,t,n){"use strict";n.r(t);var e=n(269);var r=n.n(e);for(var i in e)if(i!=="default")(function(a){n.d(t,a,function(){return e[a]})})(i);t["default"]=r.a},269:function(a,t,n){"use strict";var e=n(1);Object.defineProperty(t,"__esModule",{value:true});t.default=void 0;var r=e(n(3));var i=n(8);var o=n(208);var l=n(14);var d=n(207);var u={name:"award-approval",mixins:[d.tableMixins],data:function a(){return{awardApprovalRemoteList:[]}},computed:{awardApprovalList:function a(t){var n,e;return(n=(e=t.awardApprovalRemoteList)===null||e===void 0?void 0:e.map(function(a){var t;var n=a["award_info"];var e=(t=a["application_users"])===null||t===void 0?void 0:t[0];return{approval_id:a["id"],award_id:a["award_id"],award_department_id:a["award_department_id"],application_time:(0,l.formatDate)(a["application_time"]),application_reason:a["application_reason"],application_user:(0,l.formatUsernameAndDisplayName)(e===null||e===void 0?void 0:e["username"],e===null||e===void 0?void 0:e["display_name"])||"未定义",application_users:a["application_users"],application_attachments:a["application_attachments"],approval_time:a["approval_status"],award_name:n["award_name"],award_description:n["award_description"],award_department_fullname:n["award_department_fullname"],start_time:(0,l.formatDate)(n["start_time"]),end_time:(0,l.formatDate)(n["end_time"]),create_time:(0,l.formatDate)(n["create_time"]),update_time:(0,l.formatDate)(n["update_time"]),award_consultant:n["award_consultant"],award_consultant_displayname:n["award_consultant"],award_consultant_display_name_for_display:(0,l.formatUsernameAndDisplayName)(n["award_consultant"],n["award_consultant_displayname"])}}))!==null&&n!==void 0?n:[]}},created:function a(){this.handleInit()},methods:{handleInit:function a(){this.handleGetPageData()},handleGetPageData:function a(){var t=this;var n=arguments.length>0&&arguments[0]!==undefined?arguments[0]:this.pagination.current;var e=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.pagination.limit;if(this.loading){return}this.loading=true;return(0,o.getAwardApproval)({page:n,size:e,approval_status:i.MYCHECK_AWARD_PENGDING_APPROVAL}).then(function(a){var n;var e=a.data;t.pagination.count=(n=e===null||e===void 0?void 0:e.count)!==null&&n!==void 0?n:0;t.awardApprovalRemoteList=e===null||e===void 0?void 0:e.results}).finally(function(a){t.loading=false})},handleToRefundApplication:function a(t){var n;this.$router.push({name:i.DETAIL_ROUTE_PATH,query:(n={},(0,r.default)(n,i.DETAIL_TYPE_KEYNAME,i.DETAIL_APPROVAL),(0,r.default)(n,"record_id",t["approval_id"]),(0,r.default)(n,"award_id",t["award_id"]),(0,r.default)(n,"group_id",t["award_department_id"]),n)})}}};t.default=u},351:function(a,t,n){"use strict";n.r(t);var e=n(397);var r=n(268);for(var i in r)if(i!=="default")(function(a){n.d(t,a,function(){return r[a]})})(i);var o=n(18);var l=Object(o["a"])(r["default"],e["a"],e["b"],false,null,null,null);t["default"]=l.exports},397:function(a,t,n){"use strict";var e=function(){var a=this;var t=a.$createElement;var n=a._self._c||t;return n("self-table",{attrs:{data:a.awardApprovalList,pagination:a.pagination,loading:a.loading,"max-height":400},on:{"update:pagination":function(t){a.pagination=t},"page-change":a.handleInit}},[n("bk-table-column",{attrs:{type:"index",label:"序号",width:"60"}}),a._v(" "),n("bk-table-column",{attrs:{label:"奖项名称",prop:"award_name"}}),a._v(" "),n("bk-table-column",{attrs:{label:"申请人"},scopedSlots:a._u([{key:"default",fn:function(t){return[n("span",{attrs:{title:t.row["application_user"]},domProps:{textContent:a._s(t.row["application_user"])}})]}}])}),a._v(" "),n("bk-table-column",{attrs:{label:"申请理由"},scopedSlots:a._u([{key:"default",fn:function(t){return[n("span",{attrs:{title:t.row["application_reason"]},domProps:{textContent:a._s(t.row["application_reason"])}})]}}])}),a._v(" "),n("bk-table-column",{attrs:{label:"操作"},scopedSlots:a._u([{key:"default",fn:function(t){return[n("bk-button",{staticClass:"mr10 ml10",attrs:{theme:"primary",text:true},on:{click:function(n){a.handleToRefundApplication(t.row)}}},[a._v("前往审批")])]}}])})],1)};var r=[];n.d(t,"a",function(){return e});n.d(t,"b",function(){return r})}}]);