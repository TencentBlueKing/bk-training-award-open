(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[1],{196:function(e,t,a){"use strict";a.r(t);var n=a(323);var i=a(218);for(var r in i)if(r!=="default")(function(e){a.d(t,e,function(){return i[e]})})(r);var l=a(7);var u=Object(l["a"])(i["default"],n["a"],n["b"],false,null,"2284fc49",null);t["default"]=u.exports},218:function(e,t,a){"use strict";a.r(t);var n=a(219);var i=a.n(n);for(var r in n)if(r!=="default")(function(e){a.d(t,e,function(){return n[e]})})(r);t["default"]=i.a},219:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:true});t.default=void 0;var n=a(8);var i=a(22);var r={name:"select-search",props:{value:{type:[Array,String,Number],default:function e(){return[]}},data:{type:Array,default:function e(){return[]}},multiple:{type:Boolean,default:function e(){return true}},type:{type:String,default:function e(){return"user"}},idKey:{type:String,default:function e(){return"id"}},displayKey:{type:String,default:function e(){return"id"}},filterFn:{type:Function,default:function e(){return true}},clearable:{type:Boolean,default:function e(){return false}}},data:function e(t){return{config:{user:{func:t.handleGetUserManageListUsers,idKey:t.idKey||"id",displayKey:"display_name_for_display"},group:{func:t.handleGetDepartment,idKey:t.idKey||"id",displayKey:"full_name"},sys_group:{func:t.handleGetSysGroup,idKey:t.idKey||"id",displayKey:"full_name"},"bk-group":{func:t.handleGetBkGroup,idKey:t.idKey||"id",displayKey:"full_name"},self:{func:this.handleSetMySelfData,idKey:t.idKey||"id",displayKey:t.displayKey}},groupUsers:[],loading:false}},computed:{list:function e(t){var a,n,i;var r=t["config"];var l=t["type"];var e=(a=(n=t.groupUsers)===null||n===void 0?void 0:(i=n.filter)===null||i===void 0?void 0:i.call(n,function(e){return e[r[l]["displayKey"]]}).filter(t.filterFn))!==null&&a!==void 0?a:[];if(l==="group"){return t.$bus.groupList}if(e&&!t.value&&!t.multiple){var u,s;console.log((u=e[0])===null||u===void 0?void 0:u[r[l]["idKey"]]);t.handleChange(((s=e[0])===null||s===void 0?void 0:s[r[l]["idKey"]])||"")}return e}},created:function e(){this.handleInit()},methods:{handleInit:function e(){var t,a;var n=this.type;(t=this.config[n])===null||t===void 0?void 0:(a=t["func"])===null||a===void 0?void 0:a.call(t)},handleChange:function e(t){if(this.type==="group"){this.$bus.curGlobalGroupId=t}this.$emit("change",t);this.$emit("update:value",t)},handleGetBkGroup:function e(){var t=this;this.loading=true;var a=this.$http.cache.get(n.BK_GROUP_KEYNAME);if(a){this.groupUsers=a;this.loading=false;return}return this.$store.dispatch("bkInfo",{fromCache:true}).then(function(e){t.groupUsers=e["departments"];t.$http.cache.set(n.BK_GROUP_KEYNAME,e["departments"])}).finally(function(e){t.loading=false})},handleGetDepartment:function e(){this.groupUsers=this.$bus.groupList},handleGetUserManageListUsers:function e(){var t=this;this.loading=true;var a=this.$bus.curGlobalGroupId;var r=this.$http.cache.get(n.GROUP_USERS_KEYNAME+a);if(r){this.groupUsers=r;this.loading=false;return}return(0,i.getGroupUser)({groupId:this.$bus.curGlobalGroupId}).then(function(e){if(!e.data){t.messageWarn("出错啦");t.loading=false;return}t.groupUsers=e.data.map(function(e){e["display_name_for_display"]="".concat(e["username"],"(").concat(e["display_name"],")");return e});t.$http.cache.set(n.GROUP_USERS_KEYNAME+a,e.data)}).finally(function(e){t.loading=false})},handleSetMySelfData:function e(){this.groupUsers=this.data},handleGetSysGroup:function e(){var t=this;this.loading=true;var a=this.$http.cache.get(n.SYS_KEYNAME);if(a){this.groupUsers=a;this.loading=false;return}return(0,i.getGroupAll)().then(function(e){console.log(e);t.groupUsers=e.data;t.$http.cache.set(n.SYS_KEYNAME,e.data)}).finally(function(e){t.loading=false})}}};t.default=r},323:function(e,t,a){"use strict";var n=function(){var e=this;var t=e.$createElement;var a=e._self._c||t;return a("bk-select",{attrs:{placeholder:e.$attrs["placeholder"],"ext-cls":e.$attrs["ext-cls"],readonly:e.$attrs["readonly"],disabled:e.$attrs["disabled"],list:e.list,"id-key":e.config[e.type]["idKey"],"display-key":e.config[e.type]["displayKey"],loading:e.loading,clearable:e.clearable,searchable:true,"enable-virtual-scroll":true,multiple:e.multiple,"display-tag":true,value:e.value,"z-index":9999999999,"is-tag-width-limit":false,behavior:e.$attrs["behavior"]},on:{change:function(t){e.handleChange(t)}}})};var i=[];a.d(t,"a",function(){return n});a.d(t,"b",function(){return i})}}]);