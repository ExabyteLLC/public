import{j as e,b as Z,d as P,a as I,B as f,f as b,G as _,g as y,F as N,h as Q,i as S,M as ee,k as Y,I as J,l as ne,D as w,r as C,m as re,C as ae,n as A,o as H,R as L,p as M,q as E,s as U,t as k,u as te,v as se,w as le,x as R,y as ie,z as oe,L as ce,E as pe,H as T}from"./index-DJt-4Ygg.js";import{A as K,a as de,b as xe,c as X,d as B,C as ue,I as he,e as F,f as me,g as je}from"./AppForm-B3YYDrTq.js";import{P as ye,S as ve,H as ge}from"./SafetyCheckTwoTone-CSCSjDB0.js";const q=({onSubmit:t,title:i,children:s,back:n=!1,onBack:c=()=>{},skip:r=!1,onSkip:a=()=>{},next:l=!1,finish:d=!1})=>e.jsx("form",{onSubmit:Z.eventPreventDefault(({target:x})=>{let u=new FormData(x);t(u)}),style:{display:"contents"},children:e.jsxs(P,{direction:"column",spacing:2,justifyContent:"start",alignItems:"stretch",sx:{width:"100%",minHeight:"100%"},children:[e.jsx(be,{title:i,children:s}),e.jsx("div",{style:{flexGrow:1}}),e.jsx(fe,{back:n,onBack:c,skip:r,onSkip:a,next:l,finish:d})]})}),fe=({back:t=!1,onBack:i=()=>{},skip:s=!1,onSkip:n=()=>{},next:c=!1,finish:r=!1})=>{const{t:a}=I();return e.jsxs(P,{direction:"row",spacing:2,children:[t&&e.jsx(f,{type:"button",variant:"outlined",color:"error",onClick:i,sx:{px:3},children:a("back")}),s&&e.jsx(f,{type:"button",variant:"contained",color:"primary",onClick:n,sx:{px:3},children:a("skip")}),e.jsx("div",{style:{flexGrow:1}}),c&&e.jsx(f,{type:"submit",variant:"outlined",color:"primary",sx:{px:3},children:a("next")}),r&&e.jsx(f,{type:"submit",variant:"contained",color:"primary",sx:{px:3},children:a("finish")})]})},be=({title:t,children:i})=>e.jsxs(e.Fragment,{children:[e.jsx(b,{variant:"h4",color:"text.primary",children:t}),e.jsx("div",{style:{width:"100%"},children:e.jsx(_,{container:!0,spacing:2,justifyContent:"start",alignItems:"stretch",children:i})})]}),_e=({activeStep:t,nextStep:i,prevStep:s,data:n,pushData:c,createLead:r})=>{const{t:a}=I();return e.jsxs(q,{onSubmit:l=>{let d=c(y.formDataToObj(l));r({name:d.name,phone:d.phone}),i()},title:a("main_person_data"),next:!0,children:[e.jsx(K,{name:"name",label:a("fullname"),placeholder:a("fullname_hint"),startIcon:e.jsx(N,{}),required:!0,initValue:n==null?void 0:n.name}),e.jsx(de,{name:"phone",label:a("phone_number"),placeholder:a("phone_number_hint"),startIcon:e.jsx(Q,{}),required:!0,initValue:n==null?void 0:n.phone})]})},we=({activeStep:t,nextStep:i,prevStep:s,data:n,pushData:c})=>{const{t:r}=I(),a=S(0);return e.jsxs(q,{onSubmit:l=>{c(y.formDataToObj(l)),i()},back:!0,onBack:()=>{s()},next:!0,children:[e.jsx(b,{variant:"h4",gutterBottom:!0,children:r("main_person_data")}),e.jsx(xe,{name:"email",label:r("email"),placeholder:r("email_hint"),startIcon:e.jsx(ee,{}),required:!1,initValue:n==null?void 0:n.email}),e.jsx(X,{style:{padding:"10px"},name:"birthdate",label:r("birthdate"),startIcon:e.jsx(Y,{}),required:!0,initValue:n==null?void 0:n.birthdate}),e.jsx(B,{name:"gender",label:r("gender"),required:!0,startIcon:e.jsx(J,{}),options:[{value:"male",label:r("male")},{value:"female",label:r("female")}],initValue:n==null?void 0:n.gender}),e.jsx("hr",{}),e.jsx(_,{item:!0,xs:12,children:a.value>0&&e.jsxs(e.Fragment,{children:[e.jsx(b,{variant:"h4",gutterBottom:!0,children:r("include_person")}),e.jsx(f,{type:"button",variant:"outlined",color:"primary",sx:{px:3,mx:2},onClick:()=>{a.value=a.value+1},children:r("add")}),e.jsx(f,{type:"button",variant:"outlined",color:"error",sx:{px:3,mx:2},onClick:()=>{a.value>0&&(a.value=a.value-1)},children:r("remove")})]})}),a.value===0&&e.jsx(_,{item:!0,xs:12,children:e.jsxs(b,{variant:"body1",color:"text.primary",textAlign:"center",sx:{width:"100%",py:5},children:[r("add_other_people_desc"),e.jsx("br",{})," ",e.jsx("br",{}),e.jsx(f,{type:"button",variant:"outlined",color:"primary",sx:{px:3},onClick:()=>{a.value=a.value+1},children:r("add")})]})}),a.value>0&&y.generateArray(a.value,l=>e.jsx(Ie,{index:l,data:n},`hp-${l}`))]})},Ie=({data:t,index:i})=>{const{t:s}=I();return e.jsxs(_,{item:!0,xs:12,children:[e.jsxs(_,{container:!0,children:[e.jsx(K,{name:"person_name[]",label:s("name"),placeholder:s("name_hint"),startIcon:e.jsx(N,{}),required:!0,cols:{xs:12,sm:6,md:3}}),e.jsx(B,{name:"person_relation[]",label:s("relation"),required:!0,startIcon:e.jsx(ne,{}),options:[{value:"spouse",label:s("spouse")},{value:"child",label:s("children")}],cols:{xs:12,sm:6,md:3}}),e.jsx(X,{style:{padding:"10px"},name:"person_birthdate[]",label:s("birthdate"),startIcon:e.jsx(Y,{}),required:!0,cols:{xs:12,sm:6,md:3}}),e.jsx(B,{name:"person_gender[]",label:s("gender"),required:!0,startIcon:e.jsx(J,{}),options:[{value:"male",label:s("male")},{value:"female",label:s("female")}],cols:{xs:12,sm:6,md:3}})]}),e.jsx(w,{})]})},De=({activeStep:t,nextStep:i,prevStep:s,data:n,pushData:c,deps:r})=>{var j,D;const{t:a,forLocale:l}=I(),d=S(null),x=C.useCallback(()=>r==null?void 0:r.plans_data.find(h=>h.id==="healthLimit"),[r]),u=C.useCallback(()=>{var h;return x()?y.sortArr((h=x())==null?void 0:h.plans_data_values,!1,m=>parseInt(m==null?void 0:m.order_by)):[]},[x]),v=C.useCallback(()=>y.toArray(u(),(h,m)=>({value:m.id,label:m==null?void 0:m[l({ar:"name_alt"},"name")]})),[l,u]);return e.jsx(q,{onSubmit:h=>{c(y.formDataToObj(h)),i()},title:a("annual_limit"),back:!0,onBack:()=>{s()},next:!0,children:e.jsx(B,{name:(j=x())==null?void 0:j.id,label:a("annual_limit"),required:!0,startIcon:e.jsx(re,{}),initValue:n==null?void 0:n[(D=x())==null?void 0:D.id],options:v(),onChange:h=>{d.value=h}})})},Se=({item:t,onChoosePolicy:i})=>{const{t:s,forLocale:n}=I();return e.jsx(_,{item:!0,xs:12,lg:6,sx:{height:"auto"},children:e.jsx(ae,{sx:{height:"100%",boxShadow:3},children:e.jsxs(P,{direction:"column",sx:{height:"100%"},children:[e.jsxs(A,{sx:{borderColor:"primary.main",fontWeight:"bold"},children:[e.jsx(b,{variant:"h4",color:"primary",name:"plan",children:t==null?void 0:t[n({ar:"plan_name_alt"},"plan_name")]}),e.jsx(b,{variant:"h5",sx:{mt:2,fontWeight:"bold"},color:"secondary.main",name:"plan",children:e.jsx(z,{price:t==null?void 0:t.total,currency:s("egp_year")})})]}),e.jsx(w,{}),e.jsx(A,{sx:{borderColor:"primary.main",fontWeight:"bold",py:0},children:e.jsx(H,{sx:{width:"100%",padding:0},children:y.toArray(t==null?void 0:t.persons,(c,r)=>e.jsxs(L.Fragment,{children:[e.jsxs(M,{alignItems:"flex-start",dense:!0,children:[e.jsx(E,{children:e.jsx(ye,{color:"secondary"})}),e.jsx(U,{primary:r==null?void 0:r.name,secondary:e.jsx(z,{price:r==null?void 0:r.amount,currency:s("egp_year")}),secondaryTypographyProps:{color:"secondary.main"}})]}),e.jsx(w,{variant:"inset",component:"li"})]},`persons-${c}`))})}),e.jsx(w,{}),e.jsxs(A,{sx:{borderColor:"primary.main",fontWeight:"bold",py:0},children:[e.jsx(b,{variant:"body1",color:"primaryT50.main",sx:{py:1},children:s("annual_limit")}),e.jsx(H,{sx:{width:"100%",padding:0},children:y.toArray(t==null?void 0:t.healthLimit,(c,r)=>e.jsxs(L.Fragment,{children:[e.jsxs(M,{alignItems:"flex-start",dense:!0,children:[e.jsx(E,{sx:{mt:0},children:e.jsx(ve,{color:"secondary"})}),e.jsx(U,{primary:r==null?void 0:r[n({ar:"name_alt"},"name")]})]}),e.jsx(w,{variant:"inset",component:"li"})]},`limit-${c}`))})]}),e.jsx(w,{}),e.jsx(A,{sx:{borderColor:"primary.main",fontWeight:"bold",py:0},children:e.jsxs(H,{sx:{width:"100%",padding:0},children:[e.jsx(b,{variant:"body1",color:"primaryT50.main",sx:{py:1},children:s("health_benefits")}),y.toArray(t==null?void 0:t.healthBenefits,(c,r)=>e.jsxs(L.Fragment,{children:[e.jsxs(M,{alignItems:"flex-start",dense:!0,children:[e.jsx(E,{children:e.jsx(ge,{color:"secondary"})}),e.jsx(U,{primary:r==null?void 0:r[n({ar:"name_alt"},"name")],secondary:r==null?void 0:r[n({ar:"desc_alt"},"desc")],secondaryTypographyProps:{color:"dark600.main"}})]}),e.jsx(w,{variant:"inset",component:"li"})]},`benefits-${c}`))]})}),e.jsx("div",{style:{flexGrow:1}}),e.jsx(w,{}),e.jsx(A,{children:e.jsxs(P,{direction:"row",spacing:2,children:[e.jsx("div",{style:{flexGrow:1}}),e.jsx(f,{type:"submit",variant:"outlined",color:"primary",sx:{px:3},onClick:()=>i(t),children:s("choose_policy")})]})})]})})})},z=({price:t,currency:i})=>e.jsxs(e.Fragment,{children:[t," ",e.jsx("span",{style:{fontSize:"0.7em"},children:i})]}),Ae=({activeStep:t,nextStep:i,prevStep:s,data:n,pushData:c,deps:r,healthReq:a,healthQQ:l})=>{var j,D,h,m,W;const{t:d}=I(),x=S(null),u=S(!1);C.useEffect(()=>{var p=new FormData;if(p.set("user_name",n.name),p.set("phone",n.phone),p.append("name[]",n.name),p.append("age[]",k.parseDate(n.birthdate,"dmy").age),n.person_name)for(let o in n.person_name)p.append("name[]",n.person_name[o]),p.append("age[]",k.parseDate(n.person_birthdate[o],"dmy").age);p.set("healthLimit",n.healthLimit),p.append("healthBenefits[]",17),l.call({bodyData:p,onSuccess:({message:o,data:g})=>{x.value=g==null?void 0:g.UID}})},[]);function v(p){var G,V;var o=new FormData;if(o.set("UID",x.value),o.set("organization_id",p.org_id),o.set("plan_id",p.plan_id),o.set("data_type",p.data_type),o.append("name[]",n.name),o.append("age[]",k.parseDate(n.birthdate,"dmy").age),o.append("gender[]",n.gender),o.append("relation[]","self"),o.append("price[]",(G=p.persons)==null?void 0:G[0].amount),n.person_name)for(var g in n.person_name)g=parseInt(g),o.append("name[]",n.person_name[g]),o.append("age[]",k.parseDate(n.person_birthdate[g],"dmy").age),o.append("gender[]",n.person_gender[g]),o.append("relation[]",n.person_relation[g]),o.append("price[]",(V=p.persons)==null?void 0:V[g+1].amount);a.call({bodyData:o,onSuccess:({message:$,data:O})=>{u.value=!0},onError:({message:$,data:O})=>{console.log($,O)}})}return e.jsxs(q,{onSubmit:p=>{},title:d("list_of_health"),back:!0,onBack:()=>{s()},children:[((D=(j=l==null?void 0:l.value)==null?void 0:j.prices)==null?void 0:D.length)>0&&y.toArray(y.sortArr((h=l==null?void 0:l.value)==null?void 0:h.prices,!0,p=>{var o;return(o=p==null?void 0:p.healthBenefits)==null?void 0:o.length}),(p,o)=>e.jsx(Se,{item:o,onChoosePolicy:v},`giodfupjsk-${p}`)),((W=(m=l.value)==null?void 0:m.prices)==null?void 0:W.length)===0&&e.jsx(_,{item:!0,xs:12,children:e.jsx(b,{variant:"h5",color:"text.primary",textAlign:"center",sx:{width:"100%",py:10},children:d("empty_results")})}),e.jsx(te,{open:a.waiting||l.waiting,children:e.jsx(se,{color:"inherit"})}),e.jsx(Ce,{open:u.value,icon:e.jsx(ue,{}),content:d("request_success"),actions:[ke({linkTo:"/",text:d("back"),flex:12})]})]})},Ce=({open:t,onClose:i,maxWidth:s="xs",icon:n=e.jsx(he,{}),iconColor:c="secondary",content:r,actions:a=[]})=>e.jsxs(le,{open:t,onClose:i,fullWidth:!0,maxWidth:s,PaperProps:{sx:{overflow:"visible",overflowY:"visible"}},children:[e.jsx(R,{sx:{textAlign:"center",mt:-10},children:e.jsx(R,{sx:{bgcolor:"white.main",borderRadius:"100%",width:125,height:125,overflow:"hidden",mx:"auto"},children:C.cloneElement(n,{className:"animate-pulsate-fwd",sx:{width:"100%",height:"100%"},color:c})})}),e.jsx(ie,{children:r,sx:{textAlign:"center"}}),e.jsx(oe,{children:e.jsx(_,{container:!0,spacing:1,children:y.toArray(a,(l,{linkTo:d,onClick:x,close:u,variant:v,color:j,startIcon:D,text:h,flex:m})=>(u&&(d=null,x=i),e.jsx(_,{item:!0,xs:m,children:e.jsx(f,{...d?{component:ce,to:d}:{onClick:x},variant:v,color:j,startIcon:D,children:h,fullWidth:!0,sx:{px:.5}})},`dal-${l}`)))})})]}),ke=({linkTo:t,onClick:i,close:s=!1,variant:n="outlined",color:c="secondary",startIcon:r,text:a,flex:l=6})=>({linkTo:t,onClick:i,close:s,variant:n,color:c,startIcon:r,text:a,flex:l}),Be=()=>{const{t}=I(),i=F(T,"client/health/dependants",!0),s=F(T,"client/health/quick-quotation2"),n=F(T,"client/health/request"),c=F(T,"client/health/lead"),r=S(!1),a={leadCreated:r.value,createLead:({name:v,phone:j})=>{r.value===!1&&(c.call({bodyData:{user_name:v,phone:j}}),r.value=!0)}},l=S(0),d={activeStep:l.value,nextStep:()=>l.value=l.value+1,prevStep:()=>l.value=l.value-1},x=S({}),u={data:x.value,pushData:v=>{const j={...x.value,...v};return x.value=j,j},setData:v=>x.value=v};return e.jsx(me,{title:t("health"),icon:e.jsx(pe,{}),children:e.jsx(je,{active:l.value,contents:[e.jsx(_e,{...d,...u,...a},"1"),e.jsx(we,{...d,...u},"2"),e.jsx(De,{...d,...u,deps:i.value},"3"),e.jsx(Ae,{...d,...u,deps:i.value,healthReq:n,healthQQ:s},"4")]})})};export{Be as default};