import{j as e,b as Y,d as F,a as v,B as b,f as g,G as w,g as j,F as J,h as K,M as X,W as Z,X as Q,Q as ee,Y as ne,i as _,r as S,n as re,o as se,C as ae,p as te,q as D,D as f,s as L,R as M,t as q,u as H,v as E,w as k,x as le,y as oe,z as ie,E as $,H as ce,J as pe,L as de,K as xe,N as T}from"./index-BWEcqMhN.js";import{A as N,a as ue,b as he,d as me,h as O,e as B,f as je,g as ye}from"./AppForm-BsNa3M_s.js";import{P as fe,S as ge,H as ve,C as be,I as _e}from"./SafetyCheckTwoTone-7KSkY5rD.js";const P=({onSubmit:s,title:o,children:i,back:n=!1,onBack:c=()=>{},skip:r=!1,onSkip:l=()=>{},next:a=!1,finish:p=!1})=>e.jsx("form",{onSubmit:Y.eventPreventDefault(({target:m})=>{let u=new FormData(m);s(u)}),style:{display:"contents"},children:e.jsxs(F,{direction:"column",spacing:2,justifyContent:"start",alignItems:"stretch",sx:{width:"100%",minHeight:"100%"},children:[e.jsx(De,{title:o,children:i}),e.jsx("div",{style:{flexGrow:1}}),e.jsx(we,{back:n,onBack:c,skip:r,onSkip:l,next:a,finish:p})]})}),we=({back:s=!1,onBack:o=()=>{},skip:i=!1,onSkip:n=()=>{},next:c=!1,finish:r=!1})=>{const{t:l}=v();return e.jsxs(F,{direction:"row",spacing:2,children:[s&&e.jsx(b,{type:"button",variant:"outlined",color:"error",onClick:o,sx:{px:3},children:l("back")}),i&&e.jsx(b,{type:"button",variant:"contained",color:"primary",onClick:n,sx:{px:3},children:l("skip")}),e.jsx("div",{style:{flexGrow:1}}),c&&e.jsx(b,{type:"submit",variant:"outlined",color:"primary",sx:{px:3},children:l("next")}),r&&e.jsx(b,{type:"submit",variant:"contained",color:"primary",sx:{px:3},children:l("finish")})]})},De=({title:s,children:o})=>e.jsxs(e.Fragment,{children:[e.jsx(g,{variant:"h4",color:"text.primary",children:s}),e.jsx("div",{style:{width:"100%"},children:e.jsx(w,{container:!0,spacing:2,justifyContent:"start",alignItems:"stretch",children:o})})]}),Se=({activeStep:s,nextStep:o,prevStep:i,data:n,pushData:c,createLead:r})=>{const{t:l}=v();return e.jsxs(P,{onSubmit:a=>{let p=c(j.formDataToObj(a));r({name:p.name,phone:p.phone}),o()},title:l("main_person_data"),next:!0,children:[e.jsx(N,{name:"name",label:l("fullname"),placeholder:l("fullname_hint"),startIcon:e.jsx(J,{}),required:!0,initValue:n==null?void 0:n.name}),e.jsx(ue,{name:"phone",label:l("phone_number"),placeholder:l("phone_number_hint"),startIcon:e.jsx(K,{}),required:!0,initValue:n==null?void 0:n.phone})]})},Ae=({activeStep:s,nextStep:o,prevStep:i,data:n,pushData:c})=>{const{t:r}=v();return e.jsxs(P,{onSubmit:l=>{c(j.formDataToObj(l)),o()},back:!0,onBack:()=>{i()},next:!0,children:[e.jsx(g,{variant:"h4",gutterBottom:!0,children:r("main_person_data")}),e.jsx(he,{name:"email",label:r("email"),placeholder:r("email_hint"),startIcon:e.jsx(X,{}),required:!1,initValue:n==null?void 0:n.email}),e.jsx(me,{name:"Type",label:r("Type"),required:!0,startIcon:e.jsx(Z,{}),options:[{value:"Owner",label:r("Owner")},{value:"Tenant",label:r("Tenant")}],initValue:n==null?void 0:n.gender}),e.jsx(O,{name:"Builing price",label:r("Builing price"),placeholder:r("Builing price"),startIcon:e.jsx(Q,{}),required:!0,initValue:n==null?void 0:n.phone}),e.jsx(O,{name:"Content price",label:r("Content price"),placeholder:r("Content price"),startIcon:e.jsx(ee,{}),required:!0,initValue:n==null?void 0:n.phone}),e.jsx(N,{name:"Address",label:r("Address"),placeholder:r("Address"),startIcon:e.jsx(ne,{}),required:!0,initValue:n==null?void 0:n.name})]})},Ce=({activeStep:s,nextStep:o,prevStep:i,data:n,pushData:c,deps:r})=>{const{t:l,forLocale:a}=v();_(null),console.log(r);const p=S.useCallback(u=>r==null?void 0:r.plans_data.find(d=>d.id===u),[r]),m=S.useCallback(u=>{var d;return p(u)?j.sortArr((d=p(u))==null?void 0:d.plans_data_values,!1,h=>parseInt(h==null?void 0:h.order_by)):[]},[p]);return S.useCallback(u=>j.toArray(m(u),(d,h)=>({value:h.id,label:h==null?void 0:h[a({ar:"name_alt"},"name")]})),[a,m]),e.jsx(P,{onSubmit:u=>{c(j.formDataToObj(u)),o()},title:l("Car Data"),back:!0,onBack:()=>{i()},next:!0,children:j.toArray(m("homeBenefits"),(u,d)=>e.jsx(w,{item:!0,xs:6,md:4,children:e.jsx(re,{children:e.jsx(se,{control:e.jsx(ae,{name:"homeBenefits[]",value:d.id,...d.always_checked===1?{checked:!0}:{},sx:{"& .MuiSvgIcon-root":{fontSize:28}}}),label:d==null?void 0:d[a({ar:"name_alt"},"name")]})})},`cl-${d.id}`))})},Ie=({item:s,onChoosePolicy:o})=>{const{t:i,forLocale:n}=v();return e.jsx(w,{item:!0,xs:12,lg:6,sx:{height:"auto"},children:e.jsx(te,{sx:{height:"100%",boxShadow:3},children:e.jsxs(F,{direction:"column",sx:{height:"100%"},children:[e.jsxs(D,{sx:{borderColor:"primary.main",fontWeight:"bold"},children:[e.jsx(g,{variant:"h4",color:"primary",name:"plan",children:s==null?void 0:s[n({ar:"plan_name_alt"},"plan_name")]}),e.jsx(g,{variant:"h5",sx:{mt:2,fontWeight:"bold"},color:"secondary.main",name:"plan",children:e.jsx(z,{price:s==null?void 0:s.total,currency:i("egp_year")})})]}),e.jsx(f,{}),e.jsx(D,{sx:{borderColor:"primary.main",fontWeight:"bold",py:0},children:e.jsx(L,{sx:{width:"100%",padding:0},children:j.toArray(s==null?void 0:s.persons,(c,r)=>e.jsxs(M.Fragment,{children:[e.jsxs(q,{alignItems:"flex-start",dense:!0,children:[e.jsx(H,{children:e.jsx(fe,{color:"secondary"})}),e.jsx(E,{primary:r==null?void 0:r.name,secondary:e.jsx(z,{price:r==null?void 0:r.amount,currency:i("egp_year")}),secondaryTypographyProps:{color:"secondary.main"}})]}),e.jsx(f,{variant:"inset",component:"li"})]},`persons-${c}`))})}),e.jsx(f,{}),e.jsxs(D,{sx:{borderColor:"primary.main",fontWeight:"bold",py:0},children:[e.jsx(g,{variant:"body1",color:"primaryT50.main",sx:{py:1},children:i("annual_limit")}),e.jsx(L,{sx:{width:"100%",padding:0},children:j.toArray(s==null?void 0:s.healthLimit,(c,r)=>e.jsxs(M.Fragment,{children:[e.jsxs(q,{alignItems:"flex-start",dense:!0,children:[e.jsx(H,{sx:{mt:0},children:e.jsx(ge,{color:"secondary"})}),e.jsx(E,{primary:r==null?void 0:r[n({ar:"name_alt"},"name")]})]}),e.jsx(f,{variant:"inset",component:"li"})]},`limit-${c}`))})]}),e.jsx(f,{}),e.jsx(D,{sx:{borderColor:"primary.main",fontWeight:"bold",py:0},children:e.jsxs(L,{sx:{width:"100%",padding:0},children:[e.jsx(g,{variant:"body1",color:"primaryT50.main",sx:{py:1},children:i("health_benefits")}),j.toArray(s==null?void 0:s.healthBenefits,(c,r)=>e.jsxs(M.Fragment,{children:[e.jsxs(q,{alignItems:"flex-start",dense:!0,children:[e.jsx(H,{children:e.jsx(ve,{color:"secondary"})}),e.jsx(E,{primary:r==null?void 0:r[n({ar:"name_alt"},"name")],secondary:r==null?void 0:r[n({ar:"desc_alt"},"desc")],secondaryTypographyProps:{color:"dark600.main"}})]}),e.jsx(f,{variant:"inset",component:"li"})]},`benefits-${c}`))]})}),e.jsx("div",{style:{flexGrow:1}}),e.jsx(f,{}),e.jsx(D,{children:e.jsxs(F,{direction:"row",spacing:2,children:[e.jsx("div",{style:{flexGrow:1}}),e.jsx(b,{type:"submit",variant:"outlined",color:"primary",sx:{px:3},onClick:()=>o(s),children:i("choose_policy")})]})})]})})})},z=({price:s,currency:o})=>e.jsxs(e.Fragment,{children:[s," ",e.jsx("span",{style:{fontSize:"0.7em"},children:o})]}),ke=({activeStep:s,nextStep:o,prevStep:i,data:n,pushData:c,deps:r,healthReq:l,healthQQ:a})=>{var h,A,C,I,U;const{t:p}=v(),m=_(null),u=_(!1);S.useEffect(()=>{var x=new FormData;if(x.set("user_name",n.name),x.set("phone",n.phone),x.append("name[]",n.name),x.append("age[]",k.parseDate(n.birthdate,"dmy").age),n.person_name)for(let t in n.person_name)x.append("name[]",n.person_name[t]),x.append("age[]",k.parseDate(n.person_birthdate[t],"dmy").age);x.set("healthLimit",n.healthLimit);for(let t in n.healthBenefits)x.append("healthBenefits[]",n.healthBenefits[t]);a.call({bodyData:x,onSuccess:({message:t,data:y})=>{m.value=y==null?void 0:y.UID}})},[]);function d(x){var W,G;var t=new FormData;if(t.set("UID",m.value),t.set("organization_id",x.org_id),t.set("plan_id",x.plan_id),t.set("data_type",x.data_type),t.append("name[]",n.name),t.append("age[]",k.parseDate(n.birthdate,"dmy").age),t.append("gender[]",n.gender),t.append("relation[]","self"),t.append("price[]",(W=x.persons)==null?void 0:W[0].amount),n.person_name)for(var y in n.person_name)y=parseInt(y),t.append("name[]",n.person_name[y]),t.append("age[]",k.parseDate(n.person_birthdate[y],"dmy").age),t.append("gender[]",n.person_gender[y]),t.append("relation[]",n.person_relation[y]),t.append("price[]",(G=x.persons)==null?void 0:G[y+1].amount);l.call({bodyData:t,onSuccess:({message:V,data:R})=>{u.value=!0},onError:({message:V,data:R})=>{console.log(V,R)}})}return e.jsxs(P,{onSubmit:x=>{},title:p("list_of_health"),back:!0,onBack:()=>{i()},children:[((A=(h=a==null?void 0:a.value)==null?void 0:h.prices)==null?void 0:A.length)>0&&j.toArray(j.sortArr((C=a==null?void 0:a.value)==null?void 0:C.prices,!0,x=>{var t;return(t=x==null?void 0:x.healthBenefits)==null?void 0:t.length}),(x,t)=>e.jsx(Ie,{item:t,onChoosePolicy:d},`giodfupjsk-${x}`)),((U=(I=a.value)==null?void 0:I.prices)==null?void 0:U.length)===0&&e.jsx(w,{item:!0,xs:12,children:e.jsx(g,{variant:"h5",color:"text.primary",textAlign:"center",sx:{width:"100%",py:10},children:p("empty_health_results")})}),e.jsx(le,{open:l.waiting||a.waiting,children:e.jsx(oe,{color:"inherit"})}),e.jsx(Te,{open:u.value,icon:e.jsx(be,{}),content:p("health_request_success"),actions:[Be({onClick:()=>window.location.href="../",text:p("back"),flex:12})]})]})},Te=({open:s,onClose:o,maxWidth:i="xs",icon:n=e.jsx(_e,{}),iconColor:c="secondary",content:r,actions:l=[]})=>e.jsxs(ie,{open:s,onClose:o,fullWidth:!0,maxWidth:i,PaperProps:{sx:{overflow:"visible",overflowY:"visible"}},children:[e.jsx($,{sx:{textAlign:"center",mt:-10},children:e.jsx($,{sx:{bgcolor:"white.main",borderRadius:"100%",width:125,height:125,overflow:"hidden",mx:"auto"},children:S.cloneElement(n,{className:"animate-pulsate-fwd",sx:{width:"100%",height:"100%"},color:c})})}),e.jsx(ce,{children:r,sx:{textAlign:"center"}}),e.jsx(pe,{children:e.jsx(w,{container:!0,spacing:1,children:j.toArray(l,(a,{linkTo:p,onClick:m,close:u,variant:d,color:h,startIcon:A,text:C,flex:I})=>(u&&(p=null,m=o),e.jsx(w,{item:!0,xs:I,children:e.jsx(b,{...p?{component:de,to:p}:{onClick:m},variant:d,color:h,startIcon:A,children:C,fullWidth:!0,sx:{px:.5}})},`dal-${a}`)))})})]}),Be=({linkTo:s,onClick:o,close:i=!1,variant:n="outlined",color:c="secondary",startIcon:r,text:l,flex:a=6})=>({linkTo:s,onClick:o,close:i,variant:n,color:c,startIcon:r,text:l,flex:a});function Me(){const{t:s}=v(),o=B(T,"client/home/dependants",{autoCall:!0}),i=B(T,"client/health/quick-quotation2"),n=B(T,"client/health/request"),c=B(T,"client/health/lead"),r=_(!1),l={leadCreated:r.value,createLead:({name:d,phone:h})=>{r.value===!1&&(c.call({bodyData:{user_name:d,phone:h}}),r.value=!0)}},a=_(0),p={activeStep:a.value,nextStep:()=>a.value=a.value+1,prevStep:()=>a.value=a.value-1},m=_({}),u={data:m.value,pushData:d=>{const h={...m.value,...d};return m.value=h,h},setData:d=>m.value=d};return e.jsx(je,{title:s("Home Insurance"),icon:e.jsx(xe,{}),children:e.jsx(ye,{active:a.value,contents:[e.jsx(Se,{...p,...u,...l},"1"),e.jsx(Ae,{...p,...u},"2"),e.jsx(Ce,{...p,...u,deps:o.value},"3"),e.jsx(ke,{...p,...u,deps:o.value,healthReq:n,healthQQ:i},"4")]})})}export{Me as default};