(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[16],{255:function(t,a,e){"use strict";e.r(a);var n=e(256);var r=e.n(n);for(var l in n)if(l!=="default")(function(t){e.d(a,t,function(){return n[t]})})(l);a["default"]=r.a},256:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:true});a.default=void 0;var n=e(257);var r={name:"notification-form",components:{Editor:function t(){return Promise.all([e.e(1),e.e(3)]).then(e.bind(null,282))}},props:{selectData:{type:Array,default:[]}},data:function t(){return{theadList:[{label:"奖项名称",prop:"awardName"},{label:"评审周期",prop:"bonus"},{label:"导向",prop:"committer"},{label:"接口人",prop:"interface"}],formData:{name:"",content:"",emailText:""}}},computed:{externalData:function t(){var a=this.selectData;var e=this.theadList;return(0,n.getRawTable)(e,a)}},beforeMount:function t(){this.formData.emailText=this.externalData;console.log("externalData",this.externalData)}};a.default=r},257:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:true});a.getRawTable=n;function n(){var t=arguments.length>0&&arguments[0]!==undefined?arguments[0]:[];var a=arguments.length>1&&arguments[1]!==undefined?arguments[1]:[];var e=arguments.length>2&&arguments[2]!==undefined?arguments[2]:"label";var n=arguments.length>3&&arguments[3]!==undefined?arguments[3]:"prop";console.log(a);var r=t.map(function(t){return"<th>"+t[e]+"</th>"}).join("");var l=function a(e){return t.map(function(t){console.log(e,t);return"<td>".concat(e[t[n]],"</td>")}).join("")};var o=a.map(function(t){return"<tr>".concat(l(t),"</tr>")}).join("");return'<table border="0" '+'width="100%" '+'cellpadding="0" '+'cellspacing="0" '+" >"+"<thead>"+"<tr>"+r+"</tr>"+"</thead>"+"<tbody>"+(o||"<tr>"+"<td></td>".repeat(t.length)+"</tr>")+"</tbody>"+"</table>"}},258:function(t,a,e){},307:function(t,a,e){"use strict";e.r(a);var n=e(339);var r=e(255);for(var l in r)if(l!=="default")(function(t){e.d(a,t,function(){return r[t]})})(l);var o=e(308);var i=e(3);var s=Object(i["a"])(r["default"],n["a"],n["b"],false,null,null,null);a["default"]=s.exports},308:function(t,a,e){"use strict";var n=e(258);var r=e.n(n);var l=r.a},339:function(t,a,e){"use strict";var n=function(){var t=this;var a=t.$createElement;var e=t._self._c||a;return e("div",{staticClass:"batch-send-email-container"},[e("bk-container",{attrs:{col:12,"ext-cls":"form-container",gutter:4}},[e("bk-row",[e("bk-col",{attrs:{span:2}},[e("label",{staticClass:"input-label"},[t._v("日期")])]),t._v(" "),e("bk-col",{attrs:{span:10}},[e("bk-date-picker",{staticStyle:{width:"100%"},attrs:{placeholder:"选择日期时间",type:"datetime"},model:{value:t.initDateTime,callback:function(a){t.initDateTime=a},expression:"initDateTime"}})],1)],1),t._v(" "),e("bk-row",[e("bk-col",{attrs:{span:2}},[e("label",{staticClass:"input-label"},[t._v("知会人")])]),t._v(" "),e("bk-col",{attrs:{span:10}},[e("bk-tag-input",{attrs:{list:t.remainData,placeholder:"请选择知会人",trigger:"focus","allow-next-focus":false,"has-delete-icon":true,"save-key":"$index","search-key":"awardName","display-key":"awardName"},model:{value:t.tags,callback:function(a){t.tags=a},expression:"tags"}})],1)],1),t._v(" "),e("bk-row",[e("bk-col",{attrs:{span:2}},[e("label",{staticClass:"input-label"},[t._v("邮件主题")])]),t._v(" "),e("bk-col",{attrs:{span:10}},[e("bk-input",{attrs:{placeholder:"请输入邮件主题"},model:{value:t.formData.name,callback:function(a){t.$set(t.formData,"name",a)},expression:"formData.name"}})],1)],1),t._v(" "),e("bk-row",[e("bk-col",{attrs:{span:2}},[e("label",{staticClass:"input-label"},[t._v("协同编辑人")])]),t._v(" "),e("bk-col",{attrs:{span:10}},[e("bk-tag-input",{attrs:{list:t.remainData,placeholder:"请选择协同编辑人",trigger:"focus","allow-next-focus":false,"has-delete-icon":true,"save-key":"$index","search-key":"awardName","display-key":"awardName"},model:{value:t.tags,callback:function(a){t.tags=a},expression:"tags"}})],1)],1),t._v(" "),e("bk-row",[e("bk-col",{attrs:{span:3}},[e("label",{staticClass:"input-label em"},[t._v("邮件正文")])])],1),t._v(" "),e("bk-row",[e("bk-col",{attrs:{span:12}},[e("Editor",{attrs:{content:t.formData.emailText}})],1)],1)],1)],1)};var r=[];e.d(a,"a",function(){return n});e.d(a,"b",function(){return r})}}]);