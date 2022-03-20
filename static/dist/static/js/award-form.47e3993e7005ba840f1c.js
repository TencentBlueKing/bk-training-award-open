(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[2],{205:function(e,t,r){"use strict";r.r(t);var a=r(375);var n=r(249);for(var i in n)if(i!=="default")(function(e){r.d(t,e,function(){return n[e]})})(i);var s=r(331);var o=r(7);var u=Object(o["a"])(n["default"],a["a"],a["b"],false,null,"52d4e45c",null);t["default"]=u.exports},211:function(e,t,r){"use strict";var a=r(1);Object.defineProperty(t,"__esModule",{value:true});t.deleteAward=p;t.deleteRecord=f;t.getAppliedAwards=d;t.getAvailableAwards=l;t.getAwards=c;t.postAwards=u;t.postRecord=m;t.putAward=w;var n=a(r(3));var i=a(r(4));function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,a)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach(function(t){(0,n.default)(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function u(e){return i.default.post("awards/",e)}function c(e){var t=e.page,r=e.size;return i.default.get("awards/",{params:{page:t,size:r}})}function l(e,t){return i.default.get("get_available_awards/",{params:{page:e,size:t}})}function d(e,t){return i.default.get("get_applyed_awards/",{params:{page:e,size:t}})}function m(e,t){return i.default.post("record/",o({is_draft:e},t))}function f(e){console.log(e);return i.default.put("record/",{id:e})}function p(e){var t=e.awardId;return i.default.delete("awards/",{data:{award_id:t}})}function w(e,t){var r=t.award_name,a=t.award_level,n=t.award_description,s=t.award_consultant,o=t.award_image,u=t.award_department_fullname,c=t.award_reviewers,l=t.start_time,d=t.end_time;return i.default.put("awards/",{award_id:e,award_name:r,award_level:a,award_description:n,award_consultant:s,award_image:o,award_department_fullname:u,award_reviewers:c,start_time:l,end_time:d})}},249:function(e,t,r){"use strict";r.r(t);var a=r(250);var n=r.n(a);for(var i in a)if(i!=="default")(function(e){r.d(t,e,function(){return a[e]})})(i);t["default"]=n.a},250:function(e,t,r){"use strict";var a=r(1);Object.defineProperty(t,"__esModule",{value:true});t.default=void 0;var n=a(r(3));var i=a(r(9));var s=a(r(10));var o=r(155);var u=r(8);var c=r(211);function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,a)}return r}function d(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach(function(t){(0,n.default)(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}var m=0;var f={name:"new-award-form",components:{SelectSearch:function e(){return r.e(0).then(r.bind(null,195))}},data:function e(){var t=this;var r=function e(t){return{required:true,message:t,trigger:"blur"}};return{awardForm:{award_name:"",award_consultant:"",award_demand:"",start_time:null,end_time:null,award_description:"",award_level:"",award_department_fullname:"",award_department_id:"",award_attach_image:[],award_image:"",reviewers:[{uuid:m++,value:[]}]},rules:Object.freeze({award_name:[r("请输入奖项名称")],award_consultant:[r("请选择接口人")],start_time:[r("请输入开始时间")],end_time:[r("请输入截止时间")],award_description:[r("请输入奖项描述信息")],award_level:[r("请选择奖项等级信息")],award_image:[r("请传入图片")]}),awardLevels:u.AWARD_LEVEL_MAP,submitLoading:false,config:{edit:{title:"编辑奖项","title-clz":"edit","button-title":"提交修改","button-theme":"warning","confirm-func":this.handleConfirmModifyAward,"cancel-func":function e(){t.$router.replace({name:"award-manager"})}},create:{title:"新增奖项","title-clz":"new","button-title":"确认新增","button-theme":"success","confirm-func":this.handleConfirmAddNewAward,"cancel-func":function e(){t.$router.back()}}}}},computed:{formType:function e(t){return t.$route.query["type"]},groupInfo:{get:function e(t){return t.awardForm.award_department_fullname},set:function e(t){var r=this.awardForm;r.award_department_fullname=t}},awardFormStartEndTime:{get:function e(t){return[t.awardForm.start_time,t.awardForm.end_time]},set:function e(t){this.awardForm.start_time=t[0];this.awardForm.end_time=t[1]}}},created:function e(){m=0;this.$once("hook:beforeDestroy",function(){m=null});this.handleInit()},methods:{handleInit:function e(){},validator:function e(){var t=this;return new Promise(function(e){var r=t.awardForm;var a=true;t.$refs["award-form"].validate().then(function(n){if(!(r["reviewers"]&&r["reviewers"][0].value.length)){t.messageWarn("至少有一级评审人");a=false}return e(a)}).catch(function(t){a=false;return e(a)})})},getFields:function e(){var t=this;return(0,s.default)(i.default.mark(function e(){var r,a;return i.default.wrap(function e(n){while(1){switch(n.prev=n.next){case 0:n.next=2;return t.validator();case 2:r=n.sent;if(!r){n.next=8;break}a=t.awardForm;a.start_time=(0,o.formatDate)(a.start_time).format("YYYY-MM-DD hh:mm");a.end_time=(0,o.formatDate)(a.end_time).format("YYYY-MM-DD hh:mm");return n.abrupt("return",a);case 8:return n.abrupt("return",null);case 9:case"end":return n.stop()}}},e)}))()},addReviewer:function e(t,r){t.push({uuid:m++,value:[]});if(r.scrollHeight>r.clientHeight){setTimeout(function(){r.scrollTop=r.scrollHeight})}},removeReviewer:function e(t,r){var a=t.findIndex(function(e){return e.uuid===r});t.splice(a,1)},handleConfirmAddNewAward:function e(){var t=this;return(0,s.default)(i.default.mark(function e(){var r;return i.default.wrap(function e(a){while(1){switch(a.prev=a.next){case 0:a.next=2;return t.getFields();case 2:r=a.sent;if(r){a.next=5;break}return a.abrupt("return",null);case 5:if(!t.submitLoading){a.next=7;break}return a.abrupt("return",null);case 7:t.submitLoading=true;return a.abrupt("return",(0,c.postAwards)(r).then(function(e){t.messageSuccess("创建成功")}).catch(function(e){t.messageWarn("创建失败")}).finally(function(e){t.submitLoading=false}));case 9:case"end":return a.stop()}}},e)}))()},handleConfirmModifyAward:function e(){var t=this;return(0,s.default)(i.default.mark(function e(){var r;return i.default.wrap(function e(a){while(1){switch(a.prev=a.next){case 0:a.next=2;return t.getFields();case 2:r=a.sent;if(r){a.next=5;break}return a.abrupt("return",null);case 5:if(!t.submitLoading){a.next=7;break}return a.abrupt("return",null);case 7:t.submitLoading=true;return a.abrupt("return",(0,c.putAward)(t.$route.params["id"],r).then(function(e){t.messageSuccess("修改成功")}).catch(function(e){t.messageWarn("修改失败")}).finally(function(e){t.submitLoading=false}));case 9:case"end":return a.stop()}}},e)}))()},toModify:function e(){return this.$router.push({name:"award-form",query:{type:"edit"},params:d({},this.$route.params)})}}};t.default=f},251:function(e,t,r){},331:function(e,t,r){"use strict";var a=r(251);var n=r.n(a);var i=n.a},375:function(e,t,r){"use strict";var a=function(){var e=this;var t=e.$createElement;var r=e._self._c||t;return r("div",{staticClass:"new-award-form-container"},[r("top-back"),e._v(" "),r("div",{staticClass:"controller-panel mt20 mb15"},[r("select-search",{staticStyle:{width:"calc(2*118px + 1*8px)","font-size":"15px"},attrs:{behavior:"simplicity","id-key":"group_id",type:"group",multiple:false,placeholder:"请选择需要查看的小组",clearable:false,value:e.$bus.curGlobalGroupId},on:{"update:value":function(t){e.$set(e.$bus,"curGlobalGroupId",t)},change:function(t){e.handleInit(t)}}})],1),e._v(" "),e.$bus.isCurGroupAdmin?r("div",{staticClass:"form-container"},[r("bk-form",{ref:"award-form",attrs:{"form-type":"vertical"}},[r("bk-container",{attrs:{col:12}},[r("bk-row",{staticClass:"mt15 mb15"},[r("bk-col",{attrs:{span:6}},[r("bk-form-item",{attrs:{label:"奖项名称",required:""}},[r("bk-input",{attrs:{placeholder:"请输入奖项名称"},model:{value:e.awardForm["award_name"],callback:function(t){e.$set(e.awardForm,"award_name",t)},expression:"awardForm['award_name']"}})],1)],1),e._v(" "),r("bk-col",{attrs:{span:6}},[r("bk-form-item",{attrs:{label:"奖项申请顾问",required:""}},[r("select-search",{attrs:{multiple:false,"id-key":"username",placeholder:"请选择申请顾问",value:e.awardForm["award_consultant"]},on:{"update:value":function(t){e.$set(e.awardForm,"award_consultant",t)}}})],1)],1)],1),e._v(" "),r("bk-row",{staticClass:"mt15 mb15"},[r("bk-col",{attrs:{span:6}},[r("bk-form-item",{attrs:{label:"申请要求",required:""}},[r("bk-input",{attrs:{placeholder:"请输入255个字符以内",type:"textarea",rows:3,maxlength:255},model:{value:e.awardForm["award_demand"],callback:function(t){e.$set(e.awardForm,"award_demand",t)},expression:"awardForm['award_demand']"}})],1)],1),e._v(" "),r("bk-col",{attrs:{span:6}},[r("bk-form-item",{attrs:{label:"奖项描述",required:""}},[r("bk-input",{attrs:{placeholder:"请输入255个字符以内",type:"textarea",rows:3,maxlength:255}})],1)],1)],1),e._v(" "),r("bk-row",{staticClass:"mt15 mb15"},[r("bk-col",{attrs:{span:6}},[r("bk-form-item",{attrs:{label:"开放申请时间",required:""}},[r("bk-date-picker",{staticStyle:{width:"100%"},attrs:{placeholder:"选择日期时间范围",type:"datetimerange",format:"yyyy-MM-DD hh:mm"},model:{value:e.awardFormStartEndTime,callback:function(t){e.awardFormStartEndTime=t},expression:"awardFormStartEndTime"}})],1)],1)],1),e._v(" "),r("bk-row",{staticClass:"mt15 mb15"},[r("bk-col",{attrs:{span:12}},[r("p",{staticClass:"review-divider mt15 mb15"},[r("bk-icon",{directives:[{name:"bk-tooltips",rawName:"v-bk-tooltips.bottom-end",value:"同一级中任何有一人通过就表明该级审批通过",expression:"'同一级中任何有一人通过就表明该级审批通过'",modifiers:{"bottom-end":true}}],staticClass:"tips",attrs:{type:"info"}}),e._v(" "),r("span",{staticClass:"title"},[e._v(" 审批步骤: 1.xxx 2.xxx")])],1),e._v(" "),r("bk-form-item",[r("div",{ref:"review-container",staticClass:"review-container"},e._l(e.awardForm["reviewers"],function(t,a){return r("div",{key:t.uuid,staticClass:"reviewer-list mt10"},[r("span",{staticClass:"mr10 required"},[e._v("第 "+e._s(a+1)+" 批：")]),e._v(" "),r("select-search",{staticStyle:{width:"80%"},attrs:{value:t.value,placeholder:"请选择评审人",disabled:e.config[e.formType]["disabled"],"id-key":"username"},on:{"update:value":function(r){e.$set(t,"value",r)}}}),e._v(" "),r("div",{staticClass:"ml15"},[r("bk-button",{directives:[{name:"show",rawName:"v-show",value:e.awardForm["reviewers"].length>1,expression:"awardForm['reviewers'].length > 1"}],attrs:{theme:"danger",title:"移除同级评审人",icon:"minus-circle-shape"},on:{click:function(r){e.removeReviewer(e.awardForm["reviewers"],t.uuid)}}}),e._v(" "),r("bk-button",{directives:[{name:"show",rawName:"v-show",value:a===e.awardForm["reviewers"].length-1,expression:"index === awardForm['reviewers'].length - 1"}],attrs:{theme:"primary",title:"添加同级评审人",icon:"plus-circle-shape"},on:{click:function(t){e.addReviewer(e.awardForm["reviewers"],e.$refs["review-container"])}}})],1)],1)}),0)])],1)],1)],1),e._v(" "),r("div",{staticClass:"footer center-content mt20"},[r("bk-button",{staticClass:"mr10 ml10",attrs:{theme:"danger"},on:{click:e.config[e.formType]["cancel-func"]}},[e._v("\n                    取消\n                ")]),e._v(" "),r("bk-button",{staticClass:"mr10 ml10",attrs:{theme:e.config[e.formType]["button-theme"]},on:{click:function(t){e.config[e.formType]["confirm-func"]()}}},[e._v("确认新增\n                ")])],1)],1)],1):r("empty",[r("div",{attrs:{slot:"description"},slot:"description"},[r("p",{staticClass:"mb20"},[e._v("不好意思，您不是该组管理员~")]),e._v("\n            请联系本组（"+e._s(e.$bus.curGlobalSelectedGroup["full_name"])+"）管理员: "),r("span",{staticStyle:{color:"#cc1111"}},[e._v(" "+e._s(e.$bus.curGlobalSelectedGroup["secretary"])+" ")])])])],1)};var n=[];r.d(t,"a",function(){return a});r.d(t,"b",function(){return n})}}]);