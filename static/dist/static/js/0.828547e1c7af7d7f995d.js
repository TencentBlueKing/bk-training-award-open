(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[0],{195:function(e,t,a){"use strict";a.r(t);var r=a(222);var n=a(212);for(var i in n)if(i!=="default")(function(e){a.d(t,e,function(){return n[e]})})(i);var u=a(7);var l=Object(u["a"])(n["default"],r["a"],r["b"],false,null,"a1fc6d56",null);t["default"]=l.exports},212:function(e,t,a){"use strict";a.r(t);var r=a(213);var n=a.n(r);for(var i in r)if(i!=="default")(function(e){a.d(t,e,function(){return r[e]})})(i);t["default"]=n.a},213:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:true});t.default=void 0;var r=a(218);var n=a(8);var i=a(22);var u={name:"select-search",props:{value:{type:[Array,String,Number],default:function e(){return[]}},data:{type:Array,default:function e(){return[]}},multiple:{type:Boolean,default:function e(){return true}},type:{type:String,default:function e(){return"user"}},idKey:{type:String,default:function e(){return"id"}},displayKey:{type:String,default:function e(){return"id"}},filterFn:{type:Function,default:function e(){return true}},clearable:{type:Boolean,default:function e(){return true}}},data:function e(t){return{config:{user:{func:t.handleGetUserManageListUsers,idKey:t.idKey||"id",displayKey:"display_name_for_display"},group:{func:t.handleGetDepartment,idKey:t.idKey||"id",displayKey:"full_name"},"bk-group":{func:t.handleGetBkGroup,idKey:t.idKey||"id",displayKey:"full_name"},secretary:{func:t.handleGetSecretaryDepartment,idKey:t.idKey||"id",displayKey:"full_name"},self:{func:this.handleSetMySelfData,idKey:t.idKey||"id",displayKey:t.displayKey}},groupUsers:[],loading:false}},computed:{list:function e(t){var a,r,n;var i=t["config"];var u=t["type"];var e=(a=(r=t.groupUsers)===null||r===void 0?void 0:(n=r.filter)===null||n===void 0?void 0:n.call(r,function(e){return e[i[u]["displayKey"]]}).filter(t.filterFn))!==null&&a!==void 0?a:[];if(u==="group"){return t.$bus.groupList}if(e&&!t.value&&!t.multiple){var l,s;console.log((l=e[0])===null||l===void 0?void 0:l[i[u]["idKey"]]);t.handleChange(((s=e[0])===null||s===void 0?void 0:s[i[u]["idKey"]])||"")}return e}},created:function e(){this.handleInit()},methods:{handleInit:function e(){var t,a;var r=this.type;(t=this.config[r])===null||t===void 0?void 0:(a=t["func"])===null||a===void 0?void 0:a.call(t)},handleChange:function e(t){if(this.type==="group"){this.$bus.curGlobalGroupId=t}this.$emit("change",t);this.$emit("update:value",t)},handleGetBkGroup:function e(){var t=this;this.loading=true;var a=this.$http.cache.get(n.BK_GROUP_KEYNAME);if(a){this.groupUsers=a;this.loading=false;return}return this.$store.dispatch("bkInfo",{fromCache:true}).then(function(e){t.groupUsers=e["departments"];t.$http.cache.set(n.BK_GROUP_KEYNAME,e["departments"])}).finally(function(e){t.loading=false})},handleGetDepartment:function e(){this.groupUsers=this.$bus.groupList},handleGetUserManageListUsers:function e(){var t=this;this.loading=true;var a=this.$bus.curGlobalGroupId;var r=this.$http.cache.get(n.GROUP_USERS_KEYNAME+a);if(r){this.groupUsers=r;this.loading=false;return}console.log("asd",this.$bus.curGlobalGroupId);return(0,i.getGroupUser)({groupId:this.$bus.curGlobalGroupId}).then(function(e){if(!e.data){t.messageWarn("出错啦");t.loading=false;return}t.groupUsers=e.data.map(function(e){e["display_name_for_display"]="".concat(e["username"],"(").concat(e["display_name"],")");return e});t.$http.cache.set(n.GROUP_USERS_KEYNAME+a,e.data)}).finally(function(e){t.loading=false})},handleGetSecretaryDepartment:function e(){var t=this;return(0,r.getSecretaryDepartment)().then(function(e){if(!e.data){t.messageWarn("出错啦");t.loading=false}t.groupUsers=e.data;t.$http.cache.set(n.GROUP_SECRETARY_KEYNAME,e.data)})},handleSetMySelfData:function e(){this.groupUsers=this.data}}};t.default=u},218:function(e,t,a){"use strict";var r=a(1);Object.defineProperty(t,"__esModule",{value:true});t.getListDepartments=i;t.getListUsers=u;t.getSecretaryDepartment=l;var n=r(a(4));function i(e){var t=e.page,a=e.page_size,r=e.fuzzy_lookups;return n.default.get("/usermanage/list_departments/",{params:{page:t,page_size:a,fuzzy_lookups:r}})}function u(e){var t=e.page,a=e.page_size,r=e.fuzzy_lookups;return n.default.get("/usermanage/list_users/",{params:{page:t,page_size:a,fuzzy_lookups:r}})}function l(){return n.default.get("/secretary_department/")}},222:function(e,t,a){"use strict";var r=function(){var e=this;var t=e.$createElement;var a=e._self._c||t;return a("bk-select",{attrs:{placeholder:e.$attrs["placeholder"],"ext-cls":e.$attrs["ext-cls"],readonly:e.$attrs["readonly"],disabled:e.$attrs["disabled"],list:e.list,"id-key":e.config[e.type]["idKey"],"display-key":e.config[e.type]["displayKey"],loading:e.loading,clearable:e.clearable,searchable:true,"enable-virtual-scroll":true,multiple:e.multiple,"display-tag":true,value:e.value,"z-index":9999999999,"is-tag-width-limit":false,behavior:e.$attrs["behavior"]},on:{change:function(t){e.handleChange(t)}}})};var n=[];a.d(t,"a",function(){return r});a.d(t,"b",function(){return n})}}]);