(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[26],{314:function(e,a,t){"use strict";t.r(a);var s=t(315);var n=t.n(s);for(var r in s)if(r!=="default")(function(e){t.d(a,e,function(){return s[e]})})(r);a["default"]=n.a},315:function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:true});a.default=void 0;var s={name:"message-card",props:{message:{type:Object,default:function e(){return{create_time:"",group_name:"小组名",action_user:"",action_display_name:"",message:""}}}},data:function e(){return{randomColor:[["#0E7AE2","#FFFFFF"],["#A46244","#FFFFFF"],["#4A4B9D","#FFFFFF"],["#274A78","#FFFFFF"]]}},created:function e(){},methods:{handleClickTopButton:function e(){this.$emit("tool-click")}}};a.default=s},316:function(e,a,t){},375:function(e,a,t){"use strict";t.r(a);var s=t(419);var n=t(314);for(var r in n)if(r!=="default")(function(e){t.d(a,e,function(){return n[e]})})(r);var i=t(376);var o=t(18);var c=Object(o["a"])(n["default"],s["a"],s["b"],false,null,"04d3456a",null);a["default"]=c.exports},376:function(e,a,t){"use strict";var s=t(316);var n=t.n(s);var r=n.a},419:function(e,a,t){"use strict";var s=function(){var e=this;var a=e.$createElement;var t=e._self._c||a;return t("div",{staticClass:"message-card"},[t("div",{staticClass:"message-content"},[t("div",{staticClass:"message-identical"},[t("bk-badge",{attrs:{dot:true,visible:!e.message["is_read"],theme:"danger"}},[t("span",{staticClass:"pl10 pr10",staticStyle:{"background-color":"#0E7AE2",color:"white"}},[e._v("\n                    "+e._s(e.message["group_name"])+"\n                ")])]),e._v(" "),t("bk-link",{directives:[{name:"bk-copy",rawName:"v-bk-copy",value:e.message["action_display_name_for_display"],expression:"message['action_display_name_for_display']"}],attrs:{theme:"primary"}},[e._v(" "+e._s(e.message["action_display_name_for_display"]))])],1),e._v(" "),t("div",{directives:[{name:"bk-overflow-tips",rawName:"v-bk-overflow-tips"}],staticClass:"message-panel"},[e._v("\n            "+e._s(e.message["message"])+"\n        ")])]),e._v(" "),t("div",{staticClass:"mt20 message-header"},[t("bk-link",{directives:[{name:"show",rawName:"v-show",value:!e.message["is_read"],expression:"!message['is_read']"}],attrs:{theme:"danger",underline:true},on:{click:function(a){e.handleClickTopButton(a)}}},[e._v("\n            标记已读\n        ")])],1)])};var n=[];t.d(a,"a",function(){return s});t.d(a,"b",function(){return n})}}]);