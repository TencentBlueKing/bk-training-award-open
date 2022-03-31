(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[42],{302:function(a,t,n){"use strict";n.r(t);var e=n(303);var r=n.n(e);for(var i in e)if(i!=="default")(function(a){n.d(t,a,function(){return e[a]})})(i);t["default"]=r.a},303:function(a,t,n){"use strict";var e=n(1);Object.defineProperty(t,"__esModule",{value:true});t.default=void 0;var r=e(n(3));var i=n(208);var l=n(207);var o=n(8);var d=n(14);var p={name:"award-ended-approval",mixins:[l.tableMixins],data:function a(){return{endedApprovalRemoteData:[]}},computed:{endedApprovalData:function a(t){var n;var e=t.endedApprovalRemoteData;var r=(n=e===null||e===void 0?void 0:e.map(function(a){var t,n;var e=a["application_info"];var r=(t=e===null||e===void 0?void 0:e["award_info"])!==null&&t!==void 0?t:{};var i=(n=e===null||e===void 0?void 0:e["application_users"])!==null&&n!==void 0?n:[];var l=i[0];return{approval_id:a["id"],application_id:a["application_id"],award_id:e["award_id"],award_department_id:a["award_department_id"],application_time:(0,d.formatDate)(e["application_time"]),application_reason:e["application_reason"]||"未填写申请理由",application_user:(0,d.formatUsernameAndDisplayName)(l===null||l===void 0?void 0:l["username"],l===null||l===void 0?void 0:l["display_name"]),application_users:i["application_users"],application_attachments:a["application_attachments"],approval_state:a["approval_state"],approval_turn:a["approval_turn"]+1,approval_time:a["approval_status"],approval_text:a["approval_text"],award_name:r["award_name"],award_description:r["award_description"],award_department_fullname:r["award_department_fullname"],start_time:(0,d.formatDate)(r["start_time"]),end_time:(0,d.formatDate)(r["end_time"]),create_time:(0,d.formatDate)(r["create_time"]),update_time:(0,d.formatDate)(r["update_time"]),award_consultant:r["award_consultant"],award_consultant_displayname:r["award_consultant"],award_consultant_display_name_for_display:(0,d.formatUsernameAndDisplayName)(r["award_consultant"],r["award_consultant"])}}))!==null&&n!==void 0?n:[];return r}},created:function a(){this.handleInit()},methods:{handleInit:function a(){Promise.all([this.handleGetEndedAwardApproval()]);(0,d.setTitle)("奖项审批结果")},handleGetEndedAwardApproval:function a(){var t=this;var n=arguments.length>0&&arguments[0]!==undefined?arguments[0]:this.pagination.current;var e=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.pagination.limit;if(this.loading)return;this.loading=true;var r={page:n,size:e,group_id:this.$bus.curGlobalGroupId,approval_status:o.MYCHECK_AWARD_ENDED_APPROVAL};return(0,i.getAwardApproval)(r).then(function(a){var n=a.data;t.pagination.count=n===null||n===void 0?void 0:n.count;t.endedApprovalRemoteData=n===null||n===void 0?void 0:n.results}).finally(function(a){t.loading=false})},handleGetDetail:function a(t){var n;this.$router.push({name:o.DETAIL_ROUTE_PATH,query:(n={},(0,r.default)(n,o.DETAIL_TYPE_KEYNAME,o.DETAIL_APPROVAL_RESULT_DETAIL),(0,r.default)(n,"record_id",t["approval_id"]),(0,r.default)(n,"award_id",t["award_id"]),n)})}}};t.default=p},368:function(a,t,n){"use strict";n.r(t);var e=n(409);var r=n(302);for(var i in r)if(i!=="default")(function(a){n.d(t,a,function(){return r[a]})})(i);var l=n(18);var o=Object(l["a"])(r["default"],e["a"],e["b"],false,null,null,null);t["default"]=o.exports},409:function(a,t,n){"use strict";var e=function(){var a=this;var t=a.$createElement;var n=a._self._c||t;return n("self-table",{attrs:{data:a.endedApprovalData,loading:a.loading,pagination:a.pagination},on:{"update:pagination":function(t){a.pagination=t},"page-change":function(t){a.handleInit()}}},[n("bk-table-column",{attrs:{type:"index",label:"序号",width:"60"}}),a._v(" "),n("bk-table-column",{attrs:{label:"奖项名称",prop:"award_name"},scopedSlots:a._u([{key:"default",fn:function(t){return[n("span",{attrs:{title:t.row["award_name"]}},[a._v("\n                "+a._s(t.row["award_name"])+"\n            ")])]}}])}),a._v(" "),n("bk-table-column",{attrs:{label:"申请人",prop:"application_user"}}),a._v(" "),n("bk-table-column",{attrs:{label:"申请开始时间",prop:"application_time"}}),a._v(" "),n("bk-table-column",{attrs:{label:"申请截止时间",prop:"end_time"}}),a._v(" "),n("bk-table-column",{attrs:{label:"申请理由",prop:"application_reason"},scopedSlots:a._u([{key:"default",fn:function(t){return[n("span",{attrs:{title:t.row["application_reason"]}},[a._v("\n                "+a._s(t.row["application_reason"])+"\n            ")])]}}])}),a._v(" "),n("bk-table-column",{attrs:{label:"审批轮次"},scopedSlots:a._u([{key:"default",fn:function(t){return[n("span",{attrs:{title:t.row["approval_turn"]}},[a._v("\n                第 "+a._s(t.row["approval_turn"])+" 轮\n            ")])]}}])}),a._v(" "),n("bk-table-column",{attrs:{label:"奖项顾问",prop:"award_consultant_display_name_for_display"}}),a._v(" "),n("bk-table-column",{attrs:{label:"操作"},scopedSlots:a._u([{key:"default",fn:function(t){return[n("bk-button",{attrs:{text:true},on:{click:function(n){a.handleGetDetail(t.row)}}},[a._v("查看详情")])]}}])})],1)};var r=[];n.d(t,"a",function(){return e});n.d(t,"b",function(){return r})}}]);