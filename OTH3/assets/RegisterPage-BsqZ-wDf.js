import{H as m,e as x,a as P,G as T,a6 as I,a7 as L,a8 as w,r as A,j as e,d as C,C as D,k as M,b as j,M as W,a9 as _,L as R,aa as k,T as p,af as B,B as $,ab as c,ac as u,ag as q,ad as F,ah as E,Y as g,o as S,ai as H,ae as U,a3 as G,t as N,O,a2 as V}from"./index-D539SZr7.js";const Q=()=>{const{nav:s}=m(),{t}=x(),{device:a,forDevice:i}=P(),o=T(),r=a==="mobile",{isClient:l,registerCall:n,registerWaiting:h}=I(),{cart:f}=L(),{fav:v}=w();return A.useLayoutEffect(()=>{l&&o(`/${s||""}`,{replace:!0})},[l,o,s]),e.jsx(C,{main:!1,header:t("register"),children:e.jsx(D,{fixed:!r,maxWidth:r?"desktop":"tablet",sx:{my:i(2,null,4)},children:e.jsxs("form",{onSubmit:M.eventPreventDefault((J,b)=>{let d=new FormData(b);n(d.get("name"),d.get("telephone"),d.get("city_id"),d.get("address"),f,v)}),children:[e.jsx(Y,{mobile:r,loading:h}),e.jsx(z,{mobile:r,loading:h})]})})})},y=({loading:s})=>{var r;const{t,forLocale:a}=x(),{nav:i}=m(),o=B();return e.jsxs(e.Fragment,{children:[e.jsxs($,{sx:{width:"100%",textAlign:"start"},children:[e.jsx(p,{variant:"h5",children:t("welcome_greeting"),sx:{fontWeight:"bold"}}),e.jsx(p,{variant:"h6",children:t("register_desc"),sx:{color:"primary300.main"}})]}),e.jsx(c,{label:t("name"),fullWidth:!0,InputProps:{startAdornment:e.jsx(u,{position:"start",children:e.jsx(q,{})}),sx:{py:1}},name:"name",type:"text",required:!0,inputProps:{minLength:2}}),e.jsx(c,{label:t("mobile_number"),fullWidth:!0,InputProps:{startAdornment:e.jsx(u,{position:"start",children:e.jsx(F,{})}),sx:{py:1}},name:"telephone",type:"tel",required:!0,inputProps:{minLength:11,maxLength:11}}),e.jsx(c,{label:t("city"),fullWidth:!0,InputProps:{startAdornment:e.jsx(u,{position:"start",children:e.jsx(E,{})}),sx:{py:1}},select:!0,defaultValue:"",name:"city_id",required:!0,children:[e.jsx(g,{value:"",children:e.jsx("em",{children:`- ${t("city")} -`})},"rcs--1"),...S.toArray((r=o.data)==null?void 0:r.cities,(l,n)=>e.jsx(g,{value:n==null?void 0:n.id,children:n==null?void 0:n[a({ar:"name_native"},"name")]},`rcs-${l}`))],inputProps:{sx:{py:.8}}}),e.jsx(c,{label:t("address"),fullWidth:!0,InputProps:{startAdornment:e.jsx(u,{position:"start",children:e.jsx(H,{})}),sx:{py:1}},name:"address",type:"text",required:!0,inputProps:{minLength:2}}),e.jsx(U,{loading:s,loadingPosition:"start",startIcon:e.jsx(G,{}),variant:"contained",type:"submit",children:t("register"),fullWidth:!0}),e.jsx(N,{component:O,to:`/login${i?`/${i}`:""}`,replace:!0,variant:"outlined",color:"secondary",startIcon:e.jsx(V,{}),children:t("login_title")})]})},Y=({mobile:s,loading:t})=>{const{t:a}=x();return s?e.jsxs(j,{spacing:3,alignItems:"center",children:[e.jsx(W,{src:_,alt:a("welcome_greeting"),width:100,height:100,style:{borderRadius:4}}),e.jsx(y,{loading:t})]}):null},z=({mobile:s,loading:t})=>{const{t:a}=x();return s?null:e.jsx(R,{variant:"outlined",children:e.jsx(k,{children:e.jsxs(j,{spacing:3,alignItems:"center",children:[e.jsx(p,{variant:"h3",children:a("register")}),e.jsx(y,{loading:t})]})})})};export{Q as default};