(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[6],{208:function(t,e,r){"use strict";r.r(e);var a=r(378);var n=r(258);for(var i in n)if(i!=="default")(function(t){r.d(e,t,function(){return n[t]})})(i);var o=r(334);var s=r(7);var l=Object(s["a"])(n["default"],a["a"],a["b"],false,null,"097403b2",null);e["default"]=l.exports},211:function(t,e,r){"use strict";var a=r(1);Object.defineProperty(e,"__esModule",{value:true});e.deleteAward=v;e.deleteRecord=f;e.getAppliedAwards=p;e.getAvailableAwards=u;e.getAwards=c;e.postAwards=l;e.postRecord=d;e.putAward=m;var n=a(r(3));var i=a(r(4));function o(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),r.push.apply(r,a)}return r}function s(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?o(Object(r),!0).forEach(function(e){(0,n.default)(t,e,r[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))})}return t}function l(t){return i.default.post("awards/",t)}function c(t){var e=t.page,r=t.size;return i.default.get("awards/",{params:{page:e,size:r}})}function u(t,e){return i.default.get("get_available_awards/",{params:{page:t,size:e}})}function p(t,e){return i.default.get("get_applyed_awards/",{params:{page:t,size:e}})}function d(t,e){return i.default.post("record/",s({is_draft:t},e))}function f(t){console.log(t);return i.default.put("record/",{id:t})}function v(t){var e=t.awardId;return i.default.delete("awards/",{data:{award_id:e}})}function m(t,e){var r=e.award_name,a=e.award_level,n=e.award_description,o=e.award_consultant,s=e.award_image,l=e.award_department_fullname,c=e.award_reviewers,u=e.start_time,p=e.end_time;return i.default.put("awards/",{award_id:t,award_name:r,award_level:a,award_description:n,award_consultant:o,award_image:s,award_department_fullname:l,award_reviewers:c,start_time:u,end_time:p})}},258:function(t,e,r){"use strict";r.r(e);var a=r(259);var n=r.n(a);for(var i in a)if(i!=="default")(function(t){r.d(e,t,function(){return a[t]})})(i);e["default"]=n.a},259:function(t,e,r){"use strict";var a=r(1);Object.defineProperty(e,"__esModule",{value:true});e.default=void 0;var n=a(r(3));var i=r(211);function o(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),r.push.apply(r,a)}return r}function s(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?o(Object(r),!0).forEach(function(e){(0,n.default)(t,e,r[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))})}return t}var l={name:"detail",components:{ApprovalList:function t(){return r.e(35).then(r.bind(null,359))},Detail:function t(){return r.e(15).then(r.bind(null,360))},ApplyForm:function t(){return r.e(20).then(r.bind(null,362))}},props:{type:{type:String,default:function t(){return null}}},data:function t(){return{formType:"detail",isShow:false,applyForm:{},panelCutOut:false,approvalTabItems:[{"tab-name":"审批列表","tab-key":"approval-list"}]}},computed:{isShowApplyForm:function t(){return["apply","edit"].includes(this.formType)},defaultInfo:function t(){return{award_apply_record_id:this.applyForm.award_apply_record_id,award_id:this.applyForm.id}}},created:function t(){this.applyForm=this.$route.params;this.formType=this.$route.query["type"]},methods:{handleToSaveApplyForm:function t(e){var r=this;this.handleToDealWidthApply(true,e).then(function(t){r.messageSuccess("保存草稿成功")})},handleToSendApplyForm:function t(e){var r=this;this.handleToDealWidthApply(false,e).then(function(t){r.messageSuccess("申请成功");return r.$router.back()})},handleToDealWidthApply:function t(e,r){var a=this.defaultInfo;var n=r.getFields();if(!n){return}return(0,i.postRecord)(e,s(s({},n),a))},trigglePanel:function t(){this.panelCutOut=!this.panelCutOut}}};e.default=l},260:function(t,e,r){},334:function(t,e,r){"use strict";var a=r(260);var n=r.n(a);var i=n.a},378:function(t,e,r){"use strict";var a=function(){var t=this;var e=t.$createElement;var r=t._self._c||e;return r("div",{staticClass:"detail-container"},[r("top-back"),t._v(" "),t.formType==="approval"?r("div",{class:["approval-list"]},[r("div",{directives:[{name:"waves",rawName:"v-waves"}],staticClass:"tip-button",on:{click:t.trigglePanel}},[t._v("\n            "+t._s(t.panelCutOut?"展开":"收起")+"\n        ")]),t._v(" "),r("div",{class:["approval-content",{not_active:t.panelCutOut}]},[r("tabs",{staticStyle:{height:"100%"},attrs:{"tab-items":t.approvalTabItems}},[[r("approval-list",{tag:"component"})]],2)],1)]):t._e(),t._v(" "),r("div",{staticClass:"form-panel"},[r("Detail",{staticClass:"detail",attrs:{"award-form":t.applyForm}}),t._v(" "),t.isShowApplyForm?r("ApplyForm",{ref:"applyForm",staticClass:"form",attrs:{id:t.applyForm["id"]}}):t._e()],1),t._v(" "),r("div",{staticClass:"tc w100  mt15"},[r("div",{staticClass:"button-item"},[r("bk-button",{staticClass:"mr10",attrs:{theme:"success","ext-cls":"button-item"},on:{click:function(e){t.handleToSendApplyForm(t.$refs["applyForm"])}}},[r("bk-icon",{attrs:{type:"check-circle"}}),t._v(" "),r("span",[t._v("发起申请")])],1),t._v(" "),r("bk-button",{staticClass:"mr10",attrs:{theme:"primary","ext-cls":"button-item"},on:{click:function(e){t.handleToSaveApplyForm(t.$refs["applyForm"])}}},[r("bk-icon",{attrs:{type:"save"}}),t._v(" "),r("span",[t._v("保存草稿")])],1),t._v(" "),r("bk-button",{staticClass:"mr10",attrs:{theme:"warning","ext-cls":"button-item"},on:{click:function(e){t.$router.back()}}},[r("bk-icon",{attrs:{type:"minus-circle"}}),t._v(" "),r("span",[t._v("取消")])],1)],1)])],1)};var n=[];r.d(e,"a",function(){return a});r.d(e,"b",function(){return n})}}]);