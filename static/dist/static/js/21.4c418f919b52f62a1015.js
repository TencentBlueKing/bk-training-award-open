(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[21],{223:function(e,t,a){"use strict";var n=a(1);Object.defineProperty(t,"__esModule",{value:true});t.getGroupManage=r;t.getMessage=s;var i=n(a(3));function r(){return i.default.get("/group_manage/")}function s(e){var t=e.page,a=e.size;return i.default.get("/message/",{params:{page:t,size:a}})}},271:function(e,t,a){"use strict";a.r(t);var n=a(272);var i=a.n(n);for(var r in n)if(r!=="default")(function(e){a.d(t,e,function(){return n[e]})})(r);t["default"]=i.a},272:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:true});t.default=void 0;var n=a(223);var i={name:"message-list",components:{MessageCard:function e(){return a.e(26).then(a.bind(null,368))}},data:function e(){return{messageRemoteData:[],loading:false,pagination:{current:1,count:0,limit:10}}},computed:{messageData:function e(t){return t.messageRemoteData}},created:function e(){this.handleInit()},methods:{handleInit:function e(){this.handleGetPageData()},handleGetPageData:function e(){var t=this;var a=arguments.length>0&&arguments[0]!==undefined?arguments[0]:this.pagination.current;var i=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.pagination.limit;if(this.loading){return}this.loading=true;return(0,n.getMessage)({page:a,size:i}).then(function(e){console.log(e)}).finally(function(e){t.loading=false})}}};t.default=i},273:function(e,t,a){},342:function(e,t,a){"use strict";a.r(t);var n=a(387);var i=a(271);for(var r in i)if(r!=="default")(function(e){a.d(t,e,function(){return i[e]})})(r);var s=a(343);var u=a(7);var o=Object(u["a"])(i["default"],n["a"],n["b"],false,null,"81aff700",null);t["default"]=o.exports},343:function(e,t,a){"use strict";var n=a(273);var i=a.n(n);var r=i.a},387:function(e,t,a){"use strict";var n=function(){var e=this;var t=e.$createElement;var a=e._self._c||t;return a("div",{staticClass:"message-table"},[a("div",{directives:[{name:"show",rawName:"v-show",value:e.messageData.length,expression:"messageData.length"},{name:"bkloading",rawName:"v-bkloading",value:{isLoading:e.loading,title:"请稍等,正在为您安放数据"},expression:"{ isLoading: loading ,title: '请稍等,正在为您安放数据' }"}],staticClass:"message-content"},e._l(e.messageData,function(e){return a("message-card",{key:e["id"],attrs:{message:e}})}),1),e._v(" "),a("empty",{directives:[{name:"show",rawName:"v-show",value:!e.messageData.length,expression:"!messageData.length"}]}),e._v(" "),a("bk-pagination",{attrs:{small:"",current:e.pagination.current,count:e.pagination.count,limit:e.pagination.limit},on:{"update:current":function(t){e.$set(e.pagination,"current",t)},"update:count":function(t){e.$set(e.pagination,"count",t)},"update:limit":function(t){e.$set(e.pagination,"limit",t)}}})],1)};var i=[];a.d(t,"a",function(){return n});a.d(t,"b",function(){return i})}}]);