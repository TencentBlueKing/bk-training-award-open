(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[15],{203:function(t,a,e){"use strict";e.r(a);var n=e(329);var r=e(234);for(var o in r)if(o!=="default")(function(t){e.d(a,t,function(){return r[t]})})(o);var i=e(295);var l=e(3);var s=Object(l["a"])(r["default"],n["a"],n["b"],false,null,"3268ebf4",null);a["default"]=s.exports},232:function(t,a,e){"use strict";var n=e(1);Object.defineProperty(a,"__esModule",{value:true});a.getApproval=o;a.getRecord=i;a.postApproval=l;var r=n(e(6));function o(t,a){return r.default.get("/approval/",{params:{page:t,size:a}})}function i(t,a){return r.default.get("record/",{params:{page:t,size:a}})}function l(t){var a=t.id,e=t.action,n=t.approval_text;return r.default.post("/approval/",{id:a,action:e,approval_text:n})}},234:function(t,a,e){"use strict";e.r(a);var n=e(235);var r=e.n(n);for(var o in n)if(o!=="default")(function(t){e.d(a,t,function(){return n[t]})})(o);a["default"]=r.a},235:function(t,a,e){"use strict";var n=e(1);Object.defineProperty(a,"__esModule",{value:true});a.default=void 0;var r=n(e(23));var o=n(e(24));var i=n(e(5));var l=e(232);var s=e(16);var p=n(e(0));function c(t,a){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);a&&(n=n.filter(function(a){return Object.getOwnPropertyDescriptor(t,a).enumerable})),e.push.apply(e,n)}return e}function u(t){for(var a=1;a<arguments.length;a++){var e=null!=arguments[a]?arguments[a]:{};a%2?c(Object(e),!0).forEach(function(a){(0,i.default)(t,a,e[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):c(Object(e)).forEach(function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(e,a))})}return t}var v={data:function t(){return{remoteData:[],pagination:{current:1,count:0,limit:10,award_name:[],department_name:[]},config:{award_approval_state_controller:{pass:s.REVIEW_PASSED,no_pass:s.REVIEW_NOT_PASSED,review_pending:s.REVIEW_PENDING},button_controller_action:{pass:s.REVIEW_PASSED,no_pass:s.REVIEW_NOT_PASSED,review_pending:s.REVIEW_PENDING}},approvalForm:{tips:"",editing:false,id:null,action:null,approval_text:""},isPreviewAttachFiles:false,tmpAttachFiles:[]}},computed:{tableData:function t(a){var e,n;return(e=(n=a.remoteData)===null||n===void 0?void 0:n.map(function(t){var a;return u(u(u({},t["award_info"]),t),{},{application_time:(0,p.default)(t["application_time"]).format("YYYY-MM-DD hh:mm:ss"),application_users_list:Object.values((a=t["application_users"])!==null&&a!==void 0?a:{}),approval_state_cn:s.APPLY_APPROVAL_STATE_MAP[t["approval_state"]],approval_state_en:s.APPLY_APPROVAL_STATE_EN_MAP[t["approval_state"]]})}))!==null&&e!==void 0?e:[]}},created:function t(){this.handleInit()},methods:{handleInit:function t(){this.handleGetPageData()},handleChangePage:function t(a){this.pagination.current=a;this.handleGetPageData()},handleChangeLimit:function t(a){this.pagination.current=1;this.pagination.limit=a;this.handleGetPageData()},handleGetPageData:function t(){var a=this;var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:this.pagination.current;var n=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.pagination.limit;return(0,l.getApproval)(e,n).then(function(t){a.remoteData=t.data["results"];a.pagination=t.data["count"]})},toCheck:function t(a,e,n){console.log(a);this.approvalForm.id=a["id"];this.approvalForm.editing=true;this.approvalForm.action=e;this.approvalForm.tips=n;this.approvalForm.approval_text=""},handleConfirmToSubmitDelApproval:function t(a){var e=this;return(0,o.default)(r.default.mark(function t(){return r.default.wrap(function t(n){while(1){switch(n.prev=n.next){case 0:return n.abrupt("return",new Promise(function(t){(0,l.postApproval)(a).then(function(t){e.messageSuccess("审批成功");e.handleGetPageData();e.approvalForm.editing=false})}));case 1:case"end":return n.stop()}}},t)}))()},toAttachFilePreview:function t(a){this.isPreviewAttachFiles=true;this.tmpAttachFiles=a}}};a.default=v},236:function(t,a,e){},295:function(t,a,e){"use strict";var n=e(236);var r=e.n(n);var o=r.a},329:function(t,a,e){"use strict";var n=function(){var t=this;var a=t.$createElement;var e=t._self._c||a;return e("div",{staticClass:"mycheck-container"},[e("div",[e("bk-table",{staticClass:"mt10",attrs:{pagination:t.pagination,data:t.tableData},on:{"page-change":function(a){t.handleChangePage(a)},"page-limit-change":function(a){t.handleChangeLimit(a)}}},[e("bk-table-column",{attrs:{label:"序号",type:"index",width:"60",fixed:"left"}}),t._v(" "),e("bk-table-column",{attrs:{label:"奖项名称"},scopedSlots:t._u([{key:"default",fn:function(a){return[e("span",[t._v(t._s(a.row["award_name"]))])]}}])}),t._v(" "),e("bk-table-column",{attrs:{label:"申请人"},scopedSlots:t._u([{key:"default",fn:function(a){return t._l(a.row["application_users"]||[],function(a,n){return e("span",{key:a},[t._v("\n                        "+t._s(n)+"("+t._s(a)+")\n                    ")])})}}])}),t._v(" "),e("bk-table-column",{attrs:{label:"申请时间",prop:"application_time"}}),t._v(" "),e("bk-table-column",{attrs:{label:"申请理由",prop:"application_reason"}}),t._v(" "),e("bk-table-column",{attrs:{label:"当前审批轮次"},scopedSlots:t._u([{key:"default",fn:function(a){return[t._v("\n                    第 "+t._s(a.row["approval_turn"]+1)+" 轮\n                ")]}}])}),t._v(" "),e("bk-table-column",{attrs:{label:"申请附件"},scopedSlots:t._u([{key:"default",fn:function(a){return[e("bk-button",{attrs:{text:true},on:{click:function(e){t.toAttachFilePreview(a.row["application_attachments"])}}},[t._v("\n                        查看附件\n                    ")])]}}])}),t._v(" "),e("bk-table-column",{attrs:{label:"评审状态",align:"center","header-align":"center"},scopedSlots:t._u([{key:"default",fn:function(a){return[e("span",{class:["status",a.row.approval_state_en]},[t._v("\n                        "+t._s(a.row.approval_state_cn)+"\n                    ")])]}}])}),t._v(" "),e("bk-table-column",{attrs:{label:"操作",width:"150",fixed:"right"},scopedSlots:t._u([{key:"default",fn:function(a){return[e("bk-button",{directives:[{name:"show",rawName:"v-show",value:a.row["approval_state"]===t.config["award_approval_state_controller"]["review_pending"],expression:"props.row['approval_state'] === config['award_approval_state_controller']['review_pending']"}],class:["mr10",a.row["approval_state_en"]],attrs:{theme:"primary",text:true},on:{click:function(e){t.toCheck(a.row,t.config["button_controller_action"]["pass"],"通过"+a.row["application_users_list"][0]+a.row["application_users_list"].length+"人的申请")}}},[t._v("\n                        通过\n                    ")]),t._v(" "),e("bk-button",{directives:[{name:"show",rawName:"v-show",value:a.row["approval_state"]===t.config["award_approval_state_controller"]["review_pending"],expression:"props.row['approval_state'] === config['award_approval_state_controller']['review_pending']"}],class:["mr10",a.row["approval_state_en"]],attrs:{theme:"primary",text:true},on:{click:function(e){t.toCheck(a.row,t.config["button_controller_action"]["no_pass"],"退回"+a.row["application_users_list"][0]+a.row["application_users_list"].length+"人的申请")}}},[t._v("\n                        打回\n                    ")]),t._v(" "),e("span",{directives:[{name:"show",rawName:"v-show",value:a.row["approval_state"]!==t.config["award_approval_state_controller"]["review_pending"],expression:"props.row['approval_state'] !== config['award_approval_state_controller']['review_pending']"}],staticClass:"text-gray",staticStyle:{cursor:"pointer"}},[t._v("\n                        --\n                    ")])]}}])})],1)],1),t._v(" "),e("bk-dialog",{attrs:{"header-position":"left","confirm-fn":function(){return t.handleConfirmToSubmitDelApproval(t.approvalForm)}},model:{value:t.approvalForm.editing,callback:function(a){t.$set(t.approvalForm,"editing",a)},expression:"approvalForm.editing"}},[e("template",{slot:"header"},[e("span",{staticClass:"em f16"},[t._v("\n                "+t._s(t.approvalForm.tips)+"\n            ")])]),t._v(" "),e("bk-input",{staticClass:"mb15",attrs:{placeholder:"请输入评语",type:"textarea",rows:5},model:{value:t.approvalForm.approval_text,callback:function(a){t.$set(t.approvalForm,"approval_text",a)},expression:"approvalForm.approval_text"}})],2),t._v(" "),e("bk-dialog",{model:{value:t.isPreviewAttachFiles,callback:function(a){t.isPreviewAttachFiles=a},expression:"isPreviewAttachFiles"}},[e("ul",{staticClass:"file-list"},t._l(t.tmpAttachFiles,function(a,n){return e("li",{key:a.url,staticClass:"mt5 file-item"},[e("bk-link",{attrs:{href:a.path,theme:"primary"}},[t._v("\n                    "+t._s(n+1)+" "+t._s(a.name)+"\n                ")])],1)}),0)])],1)};var r=[];e.d(a,"a",function(){return n});e.d(a,"b",function(){return r})}}]);