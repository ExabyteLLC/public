import{e as c,a as d,j as e,S as h,b as i,D as u,T as x,A as p,u as v,c as A,d as S,C as y}from"./index-D539SZr7.js";import{M as j,a as m,b}from"./MyTabSlider-BVVyDGdP.js";import{A as T}from"./AppProductCardGrid-Bu43PI5n.js";import"./MyGrid-CwyVAJVv.js";import"./AppProductFavBtn-CAZKUcp6.js";import"./AppPriceText-DS8uu40R.js";const _=({categories:r})=>{const{t:a,forLocale:s}=c(),{forDevice:l}=d();if(r)if((r==null?void 0:r.length)>0){var t=r.filter(n=>!(n!=null&&n.parent_id));return e.jsxs(i,{direction:"column",spacing:2,width:"100%",children:[e.jsx(u,{textAlign:"left",children:e.jsx(x,{variant:"h6",children:a("categories")})}),e.jsx(j,{data:t,scrollButtons:l(!1,null,"auto"),linkTo:(n,o)=>`/products/p/1/c/${o.id}`,sx:()=>({borderColor:"light.main",bgcolor:"light.main"}),label:n=>m({text:n==null?void 0:n[s({ar:"name_alt"},"name")]}),icon:n=>b({src:p.getMedia(n==null?void 0:n.thumbnail),alt:n==null?void 0:n[s({ar:"name_alt"},"name")],width:"100%",height:99,objectFit:"contain"}),width:100})]})}else return null;else return e.jsx(h,{variant:"rounded",height:125})},w=({brands:r})=>{const{t:a,forLocale:s}=c(),{forDevice:l}=d();return r?(r==null?void 0:r.length)>0?e.jsxs(i,{direction:"column",spacing:2,width:"100%",children:[e.jsx(u,{textAlign:"left",children:e.jsx(x,{variant:"h6",children:a("brands")})}),e.jsx(j,{data:r,scrollButtons:l(!1,null,"auto"),linkTo:(t,n)=>`/products/p/1/b/${n.id}`,sx:()=>({borderColor:"light.main",bgcolor:"light.main"}),label:t=>m({text:t==null?void 0:t[s({ar:"name_alt"},"name")]}),icon:t=>b({src:p.getMedia(t==null?void 0:t.thumbnail),alt:t==null?void 0:t[s({ar:"name_alt"},"name")],width:"100%",height:40,objectFit:"contain"}),width:100})]}):null:e.jsx(h,{variant:"rounded",height:65})},D=({title:r,products:a})=>a?(a==null?void 0:a.length)>0?e.jsxs(i,{direction:"column",spacing:2,width:"100%",children:[e.jsx(u,{textAlign:"left",children:e.jsx(x,{variant:"h6",children:r})}),e.jsx(T,{products:a})]}):null:e.jsx(h,{variant:"rounded",height:400}),P=()=>{var o,g,f;const{t:r}=c(),{forDevice:a,forSize:s}=d(),l=s(2,3,4,5,6)*4,t=v(),n=A(p,"public/ecommerce/products/get",!0,!0,{namespace:"home_trending_products",bodyData:{thresh:l}});return e.jsx(S,{children:e.jsx(y,{maxWidth:"desktop",sx:{my:a(2,null,4)},children:e.jsxs(i,{spacing:a(2,null,4),children:[e.jsx(_,{categories:(o=t.data)==null?void 0:o.categories}),e.jsx(w,{brands:(g=t.data)==null?void 0:g.brands}),e.jsx(D,{title:r("trending_products"),products:(f=n.value)==null?void 0:f.products})]})})})};export{P as default};