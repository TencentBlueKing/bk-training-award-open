(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[25],{211:function(a,t,e){"use strict";var r=e(1);Object.defineProperty(t,"__esModule",{value:true});t.deleteAward=_;t.deleteRecord=f;t.getAppliedAwards=c;t.getAvailableAwards=s;t.getAwardById=m;t.getAwards=u;t.postAwards=l;t.postRecord=p;t.putAward=w;var n=r(e(3));var i=r(e(4));function d(a,t){var e=Object.keys(a);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(a);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(a,t).enumerable})),e.push.apply(e,r)}return e}function o(a){for(var t=1;t<arguments.length;t++){var e=null!=arguments[t]?arguments[t]:{};t%2?d(Object(e),!0).forEach(function(t){(0,n.default)(a,t,e[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(e)):d(Object(e)).forEach(function(t){Object.defineProperty(a,t,Object.getOwnPropertyDescriptor(e,t))})}return a}function l(a){return i.default.post("awards/",a)}function u(a){var t=a.page,e=a.size;return i.default.get("awards/",{params:{page:t,size:e}})}function s(a,t){return i.default.get("get_available_awards/",{params:{page:a,size:t}})}function c(a,t){return i.default.get("get_applyed_awards/",{params:{page:a,size:t}})}function p(a,t){return i.default.post("record/",o({is_draft:a},t))}function f(a){console.log(a);return i.default.put("record/",{id:a})}function _(a){var t=a.awardId;return i.default.delete("awards/",{data:{award_id:t}})}function w(a,t){var e=t.award_name,r=t.award_level,n=t.award_description,d=t.award_consultant,o=t.award_image,l=t.award_department_fullname,u=t.award_reviewers,s=t.start_time,c=t.end_time;return i.default.put("awards/",{award_id:a,award_name:e,award_level:r,award_description:n,award_consultant:d,award_image:o,award_department_fullname:l,award_reviewers:u,start_time:s,end_time:c})}function m(a){return i.default.get("/awards/".concat(a,"/"))}},275:function(a,t,e){"use strict";e.r(t);var r=e(276);var n=e.n(r);for(var i in r)if(i!=="default")(function(a){e.d(t,a,function(){return r[a]})})(i);t["default"]=n.a},276:function(a,t,e){"use strict";var r=e(1);Object.defineProperty(t,"__esModule",{value:true});t.default=void 0;var n=e(8);var i=e(211);var d=r(e(0));var o={name:"applicable-award",data:function a(){return{applicationableAwardRemoteList:[],loading:false,pagination:{current:1,count:0,limit:10}}},computed:{applicationableAwardList:function a(t){var e;return(e=t.applicationableAwardRemoteList)===null||e===void 0?void 0:e.map(function(a){return{id:a["id"],award_name:a["award_name"],award_description:a["award_description"],award_department_fullname:a["award_department_fullname"],award_department_id:a["award_department_id"],award_reviewers:a["award_reviewers"],award_consultant:a["award_consultant"],award_consultant_displayname:a["award_consultant_displayname"],award_demand:a["award_demand"],start_time:a["start_time"],end_time:(0,d.default)(a["end_time"]).format("YYYY-MM-DD hh:mm"),approval_state:a["approval_state"]}})}},created:function a(){this.handleInit()},methods:{toApply:function a(t){this.$router.push({name:n.DETAIL_ROUTE_PATH,query:{type:"apply",award_id:t["id"]}})},handleInit:function a(){this.handleGetPageData(this.pagination)},handleGetPageData:function a(t){var e=this;var r=t.current,n=t.limit;if(this.loading){return}this.loading=true;return(0,i.getAwards)({page:r,size:n}).then(function(a){var t=a.data;console.log(t);e.pagination.count=t===null||t===void 0?void 0:t.count;e.applicationableAwardRemoteList=t===null||t===void 0?void 0:t.data}).finally(function(a){e.loading=false})}}};t.default=o},342:function(a,t,e){"use strict";e.r(t);var r=e(384);var n=e(275);for(var i in n)if(i!=="default")(function(a){e.d(t,a,function(){return n[a]})})(i);var d=e(7);var o=Object(d["a"])(n["default"],r["a"],r["b"],false,null,null,null);t["default"]=o.exports},384:function(a,t,e){"use strict";var r=function(){var a=this;var t=a.$createElement;var e=a._self._c||t;return e("self-table",{attrs:{data:a.applicationableAwardList,pagination:a.pagination,loading:a.loading,height:300},on:{"update:pagination":function(t){a.pagination=t},"page-change":a.handleGetPageData}},[e("bk-table-column",{attrs:{label:"序列",width:"60",type:"index"}}),a._v(" "),e("bk-table-column",{attrs:{label:"奖项名称",prop:"award_name"}}),a._v(" "),e("bk-table-column",{attrs:{label:"所属小组"},scopedSlots:a._u([{key:"default",fn:function(t){return[e("bk-tag",{attrs:{theme:"success",title:t["row"]["award_department_fullname"]}},[a._v("\n                "+a._s(t.row["award_department_fullname"])+"\n            ")])]}}])}),a._v(" "),e("bk-table-column",{attrs:{label:"截止申请时间",width:200},scopedSlots:a._u([{key:"default",fn:function(t){return[e("span",{attrs:{title:t["row"]["end_time"]}},[a._v("\n                "+a._s(t["row"]["end_time"])+"\n            ")])]}}])}),a._v(" "),e("bk-table-column",{attrs:{label:"操作"},scopedSlots:a._u([{key:"default",fn:function(t){return[e("bk-button",{attrs:{text:true},on:{click:function(e){a.toApply(t.row)}}},[a._v("\n                立即申请\n            ")])]}}])})],1)};var n=[];e.d(t,"a",function(){return r});e.d(t,"b",function(){return n})}}]);