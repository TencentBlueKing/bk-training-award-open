(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[19],{212:function(a,t,e){"use strict";var r=e(1);Object.defineProperty(t,"__esModule",{value:true});t.deleteAward=p;t.deleteRecord=m;t.getAppliedAwards=u;t.getAvailableAwards=c;t.getAwardById=f;t.getAwards=s;t.postAwards=o;t.postRecord=w;t.putAward=_;var d=r(e(4));var n=r(e(3));function i(a,t){var e=Object.keys(a);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(a);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(a,t).enumerable})),e.push.apply(e,r)}return e}function l(a){for(var t=1;t<arguments.length;t++){var e=null!=arguments[t]?arguments[t]:{};t%2?i(Object(e),!0).forEach(function(t){(0,d.default)(a,t,e[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(e)):i(Object(e)).forEach(function(t){Object.defineProperty(a,t,Object.getOwnPropertyDescriptor(e,t))})}return a}function o(a){return n.default.post("awards/",a)}function s(a){var t=a.page,e=a.size;return n.default.get("awards/",{params:{page:t,size:e}})}function c(a){var t=a.page,e=a.size,r=a.award_status,d=a.group_id;return n.default.get("get_available_awards/",{params:{page:t,size:e,award_status:r,group_id:d}})}function u(a,t){return n.default.get("get_applyed_awards/",{params:{page:a,size:t}})}function w(a,t){return n.default.post("record/",l({is_draft:a},t))}function m(a){console.log(a);return n.default.delete("record/",{data:{id:a}})}function p(a){var t=a.awardId;return n.default.delete("awards/",{data:{award_id:t}})}function _(a,t){var e=t.award_name,r=t.award_level,d=t.award_description,i=t.award_consultant,l=t.award_image,o=t.award_department_fullname,s=t.award_reviewers,c=t.start_time,u=t.end_time;return n.default.put("awards/",{award_id:a,award_name:e,award_level:r,award_description:d,award_consultant:i,award_image:l,award_department_fullname:o,award_reviewers:s,start_time:c,end_time:u})}function f(a){return n.default.get("/awards/".concat(a,"/"))}},310:function(a,t,e){"use strict";e.r(t);var r=e(311);var d=e.n(r);for(var n in r)if(n!=="default")(function(a){e.d(t,a,function(){return r[a]})})(n);t["default"]=d.a},311:function(a,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:true});t.default=void 0;var r=e(212);var d=e(155);var n={name:"detail-info",components:{},data:function a(){return{awardForm:{id:"",award_name:"",award_description:"",award_department_id:"",award_department_fullname:"",award_reviewers:"",award_consultant:"",award_consultant_displayname:"",award_demand:"",start_time:"",end_time:"",approval_state:""}}},created:function a(){this.handleInit()},methods:{handleInit:function a(){var t=this.$route.query["award_id"];this.handleGetAwardDetailById(t)},handleGetAwardDetailById:function a(t){var e=this;if(t){return(0,r.getAwardById)(t).then(function(a){var t=a.data;try{t["time_range"]="".concat((0,d.formatDate)(t["start_time"]),"~").concat((0,d.formatDate)(t["end_time"]));t["award_consultant_displayname"]="".concat(t["award_consultant"],"（").concat(t["award_consultant_displayname"],"）")}catch(a){console.error(a)}e.awardForm=t})}}}};t.default=n},312:function(a,t,e){},364:function(a,t,e){"use strict";e.r(t);var r=e(405);var d=e(310);for(var n in d)if(n!=="default")(function(a){e.d(t,a,function(){return d[a]})})(n);var i=e(365);var l=e(7);var o=Object(l["a"])(d["default"],r["a"],r["b"],false,null,"5b179971",null);t["default"]=o.exports},365:function(a,t,e){"use strict";var r=e(312);var d=e.n(r);var n=d.a},405:function(a,t,e){"use strict";var r=function(){var a=this;var t=a.$createElement;var e=a._self._c||t;return e("div",{staticClass:"detail-form-container"},[e("bk-divider",{attrs:{align:"center"}},[a._v("基本信息")]),a._v(" "),e("bk-form",{attrs:{"label-width":140,"form-type":"horizontal","ext-cls":"detail-form"}},[e("bk-form-item",{attrs:{label:"奖项名"}},[e("bk-input",{staticStyle:{width:"auto"},attrs:{disabled:true,placeholder:"奖项名","ext-cls":"detail-input",title:a.awardForm["award_name"]},model:{value:a.awardForm["award_name"],callback:function(t){a.$set(a.awardForm,"award_name",t)},expression:"awardForm['award_name']"}})],1),a._v(" "),e("bk-form-item",{attrs:{label:"所属组织"}},[e("bk-input",{staticStyle:{width:"auto"},attrs:{disabled:true,placeholder:"所属组织","ext-cls":"detail-input",title:a.awardForm["award_department_fullname"]},model:{value:a.awardForm["award_department_fullname"],callback:function(t){a.$set(a.awardForm,"award_department_fullname",t)},expression:"awardForm['award_department_fullname']"}})],1),a._v(" "),e("bk-form-item",{attrs:{label:"接口人"}},[e("bk-input",{staticStyle:{width:"auto"},attrs:{"ext-cls":"detail-input",placeholder:"接口人",disabled:true,title:a.awardForm["award_consultant_displayname"]},model:{value:a.awardForm["award_consultant_displayname"],callback:function(t){a.$set(a.awardForm,"award_consultant_displayname",t)},expression:"awardForm['award_consultant_displayname']"}})],1),a._v(" "),e("bk-form-item",{attrs:{label:"开放申请时间段","label-width":140}},[e("bk-input",{staticStyle:{width:"calc(2*118px + 8px)"},attrs:{disabled:true,placeholder:"开放申请时间段","ext-cls":"detail-input",title:a.awardForm["time_range"]},model:{value:a.awardForm["time_range"],callback:function(t){a.$set(a.awardForm,"time_range",t)},expression:"awardForm['time_range']"}})],1),a._v(" "),e("bk-form-item",{attrs:{label:"奖项描述"}},[e("bk-input",{staticStyle:{width:"calc(2*118px + 8px)"},attrs:{type:"textarea",rows:3,disabled:true,placeholder:"奖项要求","ext-cls":"detail-input",title:a.awardForm["award_demand"]},model:{value:a.awardForm["award_demand"],callback:function(t){a.$set(a.awardForm,"award_demand",t)},expression:"awardForm['award_demand']"}})],1),a._v(" "),e("bk-form-item",{attrs:{label:"奖项要求"}},[e("bk-input",{staticStyle:{width:"calc(2*118px + 8px)"},attrs:{type:"textarea",rows:3,disabled:true,placeholder:"奖项描述","ext-cls":"detail-input",title:a.awardForm["award_description"]},model:{value:a.awardForm["award_description"],callback:function(t){a.$set(a.awardForm,"award_description",t)},expression:"awardForm['award_description']"}})],1)],1)],1)};var d=[];e.d(t,"a",function(){return r});e.d(t,"b",function(){return d})}}]);