(function(e){function t(t){for(var n,o,l=t[0],i=t[1],c=t[2],d=0,f=[];d<l.length;d++)o=l[d],Object.prototype.hasOwnProperty.call(a,o)&&a[o]&&f.push(a[o][0]),a[o]=0;for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n]);u&&u(t);while(f.length)f.shift()();return s.push.apply(s,c||[]),r()}function r(){for(var e,t=0;t<s.length;t++){for(var r=s[t],n=!0,l=1;l<r.length;l++){var i=r[l];0!==a[i]&&(n=!1)}n&&(s.splice(t--,1),e=o(o.s=r[0]))}return e}var n={},a={app:0},s=[];function o(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=e,o.c=n,o.d=function(e,t,r){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)o.d(r,n,function(t){return e[t]}.bind(null,n));return r},o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/";var l=window["webpackJsonp"]=window["webpackJsonp"]||[],i=l.push.bind(l);l.push=t,l=l.slice();for(var c=0;c<l.length;c++)t(l[c]);var u=i;s.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("56d7")},"039a":function(e,t,r){"use strict";r("7174")},"0ea0":function(e,t,r){},"56d7":function(e,t,r){"use strict";r.r(t);r("e260"),r("e6cf"),r("cca6"),r("a79d");var n=r("2b0e"),a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-app",[r("v-main",[r("router-view")],1)],1)},s=[],o={name:"App"},l=o,i=r("2877"),c=r("6544"),u=r.n(c),d=r("7496"),f=r("f6c4"),v=Object(i["a"])(l,a,s,!1,null,null,null),p=v.exports;u()(v,{VApp:d["a"],VMain:f["a"]});var m=r("9483");Object(m["a"])("".concat("/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(e){console.error("Error during service worker registration:",e)}});var h=r("8c4f"),g=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-container",[r("h1",{staticClass:"text-center"},[e._v("Willkommen bei Coming Home Safe")]),r("br"),e.firstTime?r("v-container",[r("Register")],1):r("v-container",[r("Login")],1)],1)},b=[],w=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-container",[r("h2",{staticClass:"text-center"},[e._v("Login")]),r("p",{on:{click:e.changePage}},[e._v(" get Back to "),r("span",{staticClass:"text-decoration-underline pointer",on:{click:e.changePage}},[e._v("Register")])])])},x=[],P={name:"Login",data:function(){return{}},methods:{changePage:function(){try{localStorage.removeItem("firstTime"),localStorage.setItem("firstTime",!0),location.reload()}catch(e){console.log(e)}}}},y=P,k=(r("039a"),r("a523")),j=Object(i["a"])(y,w,x,!1,null,null,null),O=j.exports;u()(j,{VContainer:k["a"]});var S=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-container",[r("h2",{staticClass:"text-center"},[e._v("Register")]),r("br"),r("v-container",{staticClass:"grey lighten-2 rounded-lg"},[r("v-form",{ref:"form_Register",attrs:{"lazy-validation":""},model:{value:e.valid,callback:function(t){e.valid=t},expression:"valid"}},[r("v-container",{staticClass:"d-flex flex-wrap justify-center"},[r("v-col",[r("v-row",{staticClass:"justify-center"},[r("v-col",{attrs:{md:"4"}},[r("v-text-field",{attrs:{type:"text",label:"Vorname",rules:e.rules.required,clearable:"",required:""},model:{value:e.Vorname,callback:function(t){e.Vorname=t},expression:"Vorname"}})],1),r("v-col",{attrs:{md:"4"}},[r("v-text-field",{attrs:{label:"Nachname",rules:e.rules.required,required:"",clearable:""},model:{value:e.Nachname,callback:function(t){e.Nachname=t},expression:"Nachname"}})],1)],1),r("v-row",{staticClass:"justify-center"},[r("v-col",{attrs:{md:"8"}},[r("v-text-field",{attrs:{label:"E-Mail",type:"mail",rules:e.rules.EmailRules,required:"",clearable:""},model:{value:e.Email,callback:function(t){e.Email=t},expression:"Email"}})],1)],1),r("v-row",{staticClass:"justify-center"},[r("v-col",{attrs:{md:"4"}},[r("v-text-field",{attrs:{"append-icon":e.showPasswordInput?"mdi-eye":"mdi-eye-off",rules:e.rules.required,type:e.showPasswordInput?"text":"password",label:"Passwort",required:"",clearable:""},on:{"click:append":function(t){e.showPasswordInput=!e.showPasswordInput}},model:{value:e.Passwort1,callback:function(t){e.Passwort1=t},expression:"Passwort1"}})],1),r("v-col",{attrs:{md:"4"}},[r("v-text-field",{attrs:{"append-icon":e.showPasswordInput?"mdi-eye":"mdi-eye-off",rules:e.rules.required,type:e.showPasswordInput?"text":"password",label:"Passwort",required:"",clearable:""},on:{"click:append":function(t){e.showPasswordInput=!e.showPasswordInput}},model:{value:e.Passwort2,callback:function(t){e.Passwort2=t},expression:"Passwort2"}})],1)],1),r("v-row",{staticClass:"justify-center"},[r("v-col",{attrs:{md:"3"}},[r("v-text-field",{attrs:{label:"Straße + Hausnr",rules:e.rules.required,required:"",clearable:""},model:{value:e.Strasse,callback:function(t){e.Strasse=t},expression:"Strasse"}})],1),r("v-col",{attrs:{md:"2"}},[r("v-text-field",{attrs:{label:"PLZ",rules:e.rules.PlzRules,required:"",clearable:""},model:{value:e.Plz,callback:function(t){e.Plz=t},expression:"Plz"}})],1),r("v-col",{attrs:{md:"3"}},[r("v-text-field",{attrs:{label:"Ort",rules:e.rules.required,required:"",clearable:""},model:{value:e.Ort,callback:function(t){e.Ort=t},expression:"Ort"}})],1)],1),r("v-row",{staticClass:"justify-center"},[r("v-col",{attrs:{cols:"8"}},[r("v-textarea",{attrs:{solo:"",name:"interessen",label:"Geben Sie persönliche Interessen oder Hobbys an","background-color":"grey lighten-2"},model:{value:e.interessen,callback:function(t){e.interessen=t},expression:"interessen"}})],1)],1),r("v-row",{staticClass:"justify-center"},[r("v-col",{attrs:{cols:"8"}},[r("v-checkbox",{attrs:{label:"Akzeptieren Sie unsere Datenschutzbestimmungen",rules:e.validateCheckbox},model:{value:e.datenschutz,callback:function(t){e.datenschutz=t},expression:"datenschutz"}})],1)],1),r("v-row",{staticClass:"justify-center"},[r("v-col",{attrs:{cols:"8"}},[r("p",[e._v(" Sind Sie schon Registriert? "),r("span",{staticClass:"text-decoration-underline pointer",on:{click:e.changePage}},[e._v("Login")])])])],1),r("v-row",{staticClass:"justify-center",staticStyle:{"margin-top":"2rem"}},[r("v-btn",{staticClass:"light-blue accent-3",on:{click:e.register}},[e._v(" Register ")])],1)],1)],1)],1)],1)],1)},_=[],C=r("1da1"),q=r("ade3"),R=(r("96cf"),r("ac1f"),r("00b4"),r("bc3a")),V=r.n(R),I={name:"Register",data:function(){var e;return{serverAdress:"",Vorname:"",Nachname:"",Email:"",Passwort1:"",Passwort2:"",Strasse:"",Plz:"",Ort:"",interessen:"",datenschutz:[],valid:!0,showPasswordInput:!1,showAuthenticator:!1,showAuthError:!1,showEmailInUse:!1,rules:(e={required:[function(e){return!!e||"Required."}]},Object(q["a"])(e,"required",[function(e){return(e||"").length>0||"This field is required"}]),Object(q["a"])(e,"EmailRules",[function(e){return!!e||"Required."},function(e){var t=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return t.test(e)||"Invalid e-mail."}]),Object(q["a"])(e,"PlzRules",[function(e){return!!e||"Required."},function(e){var t=/^\d{4,5}$/;return t.test(e)}]),e)}},methods:{register:function(){var e=this;return Object(C["a"])(regeneratorRuntime.mark((function t(){var r,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!e.$refs.form_Register.validate()){t.next=8;break}if(e.Passwort1!=e.Passwort2){t.next=8;break}return r={vorname:e.Vorname,nachname:e.Nachname,email:e.Email,passwort:e.Passwort1,addresse:{Strasse:e.Strasse,PLZ:e.Plz,Ort:e.Ort},interessen:e.interessen},t.next=5,V.a.post("".concat(e.serverAdress,"/register"),r);case 5:n=t.sent,console.log(n),e.clearFelder();case 8:case"end":return t.stop()}}),t)})))()},clearFelder:function(){this.Vorname=null,this.Nachname=null,this.Email=null,this.Passwort1=null,this.Passwort2=null,this.Strasse=null,this.PLZ=null,this.Ort=null,this.interessen=null},changePage:function(){try{localStorage.removeItem("firstTime"),localStorage.setItem("firstTime",!1),location.reload()}catch(e){console.log("set"),localStorage.setItem("firstTime",!1),location.reload()}}},computed:{validateCheckbox:function(){return[this.datenschutz.length>0||"Required"]}}},z=I,E=(r("f30e"),r("8336")),T=r("ac7c"),A=r("62ad"),N=r("4bd4"),L=r("0fd9"),$=r("8654"),F=r("a844"),M=Object(i["a"])(z,S,_,!1,null,null,null),Z=M.exports;u()(M,{VBtn:E["a"],VCheckbox:T["a"],VCol:A["a"],VContainer:k["a"],VForm:N["a"],VRow:L["a"],VTextField:$["a"],VTextarea:F["a"]});var B={name:"Login_Register",data:function(){return{firstTime:!0}},components:{Login:O,Register:Z},created:function(){var e=localStorage.getItem("firstTime");null!=e?this.firstTime="false"!=e:console.log("Null")},computed:{checkStatus:function(){}}},H=B,J=Object(i["a"])(H,g,b,!1,null,null,null),D=J.exports;u()(J,{VContainer:k["a"]}),n["a"].use(h["a"]);var G=[{path:"/",name:"Login_Register",component:D}],U=new h["a"]({routes:G}),W=U,K=r("2f62");n["a"].use(K["a"]);var Q=new K["a"].Store({state:{},mutations:{},actions:{},modules:{}}),X=r("f309");n["a"].use(X["a"]);var Y=new X["a"]({});n["a"].config.productionTip=!1,new n["a"]({router:W,store:Q,vuetify:Y,render:function(e){return e(p)}}).$mount("#app")},7174:function(e,t,r){},f30e:function(e,t,r){"use strict";r("0ea0")}});
//# sourceMappingURL=app.8385006b.js.map