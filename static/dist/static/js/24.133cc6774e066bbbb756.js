(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[24],{275:function(t,e,n){"use strict";n.r(e);var r=n(276);var a=n.n(r);for(var i in r)if(i!=="default")(function(t){n.d(e,t,function(){return r[t]})})(i);e["default"]=a.a},276:function(t,e,n){"use strict";var r=n(1);Object.defineProperty(e,"__esModule",{value:true});e.default=void 0;var a=r(n(5));var i=n(16);function o(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}function l(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?o(Object(n),!0).forEach(function(e){(0,a.default)(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}var c={name:"apply-form",components:{SelectSearch:function t(){return n.e(0).then(n.bind(null,214))},Uploader:function t(){return n.e(2).then(n.bind(null,283))}},data:function t(){return{applyForm:{application_reason:"",application_users:{},application_attachments:[]}}},computed:{groupUsers:function t(e){var n;return(n=e.$http.cache.get(i.GROUP_USERS_KEYNAME))!==null&&n!==void 0?n:[]},applicationUsers:{get:function t(e){var n,r;return(n=(r=Object.keys(e.applyForm.application_users||{}))===null||r===void 0?void 0:r.map(function(t){return~~t}))!==null&&n!==void 0?n:[]},set:function t(e){this.applyForm.application_users=this.groupUsers.filter(function(t){return e.includes(t.id)}).reduce(function(t,e){return l(l({},t),{},(0,a.default)({},e.id,e["display_name"]))},{})}}},created:function t(){this.handleInit()},methods:{handleInit:function t(){this.handleSetDefaultInfo()},handleSetDefaultInfo:function t(){console.log(this.$route.params);if(this.$route.params){this.applyForm=this.$route.params}},checkEmptyForm:function t(e){var n,r,a;var i="";console.log(Object.keys(e["application_users"]));if(!((n=Object.keys(e["application_users"]))!==null&&n!==void 0&&n.length))i="请选择申请人";if(!((r=e["application_reason"])!==null&&r!==void 0&&r.length))i="请输入申请理由";if(!((a=e["application_attachments"])!==null&&a!==void 0&&a.length))i="请传入申请材料";if(i){this.messageWarn(i);return}return true},handleCancel:function t(){this.$emit("cancel")},handleSave:function t(e){if(this.checkEmptyForm(e)){this.$emit("save",e)}},handleConfirm:function t(e){if(this.checkEmptyForm(e)){e["application_attachments"]=e["application_attachments"].map(function(t){return{url:t.path}});this.$emit("confirm",e)}},getFields:function t(){var e=this.applyForm;if(this.checkEmptyForm(e)){return JSON.parse(JSON.stringify(e))}return null},handleOnlyGroup:function t(e){var n=e["departments"].map(function(t){return t["full_name"]});var r=this.$route.params["award_department_fullname"];return n.includes(r)}}};e.default=c},277:function(t,e,n){},316:function(t,e,n){"use strict";n.r(e);var r=n(343);var a=n(275);for(var i in a)if(i!=="default")(function(t){n.d(e,t,function(){return a[t]})})(i);var o=n(317);var l=n(3);var c=Object(l["a"])(a["default"],r["a"],r["b"],false,null,"1aa7e2f2",null);e["default"]=c.exports},317:function(t,e,n){"use strict";var r=n(277);var a=n.n(r);var i=a.a},343:function(t,e,n){"use strict";var r=function(){var t=this;var e=t.$createElement;var n=t._self._c||e;return n("div",{staticClass:"apply-form-container"},[n("bk-divider",{attrs:{align:"center"}},[t._v("申请奖项")]),t._v(" "),n("bk-form",{attrs:{"label-width":140}},[n("bk-form-item",{attrs:{label:"申请人"}},[n("select-search",{attrs:{value:t.applicationUsers,placeholder:"请选择申请人","ext-cls":"w-90","id-key":"id",type:"user",multiple:true,"filter-fn":t.handleOnlyGroup},on:{"update:value":function(e){t.applicationUsers=e}}})],1),t._v(" "),n("bk-form-item",{attrs:{label:"申请理由"}},[n("bk-input",{attrs:{placeholder:"请输入申请理由","ext-cls":"w-90"},model:{value:t.applyForm["application_reason"],callback:function(e){t.$set(t.applyForm,"application_reason",e)},expression:"applyForm['application_reason']"}})],1),t._v(" "),n("bk-form-item",{attrs:{label:"申请材料"}},[n("Uploader",{attrs:{"ext-cls":"w-90",limit:3},model:{value:t.applyForm["application_attachments"],callback:function(e){t.$set(t.applyForm,"application_attachments",e)},expression:"applyForm['application_attachments']"}})],1)],1)],1)};var a=[];n.d(e,"a",function(){return r});n.d(e,"b",function(){return a})}}]);