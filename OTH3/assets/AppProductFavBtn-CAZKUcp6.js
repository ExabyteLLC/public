import{j as a,B as C,e as k,a7 as _,ae as d,aw as f,aF as I,t as g,aG as R,T as w,aH as A,aI as b,aJ as B,a8 as M,aK as p,aL as y}from"./index-D539SZr7.js";const T=({baseIcon:s,children:o})=>a.jsxs(C,{sx:{display:"contents",position:"relative",width:"min-content",height:"min-content"},children:[s,o]}),F=({icon:s,h:o,v:n})=>a.jsx(C,{sx:{display:"flex",position:"absolute",top:"auto",left:"auto",width:"min-content",height:"min-content",transform:`translateX(${o&&o!==0?o/10:0}rem) translateY(${n&&n!==0?n/10:0}rem)`},children:s}),G=({sx:s,productId:o,product:n,full:c=!0,size:e="medium",mobile:x=!1,fullWidth:l=!1,remover:j=!1})=>{var v;const{t:m}=k(),{getCartItem:i,manageApi:r}=_(),t=r(o,n),S=(!(n!=null&&n.stock)||(n==null?void 0:n.stock)==="0")&&((v=n==null?void 0:n.per_order)==null?void 0:v.toString())==="1",u=i(o);if(j)return a.jsx(d,{loading:!!t.waiting,onClick:()=>{t.delCartItem()},color:"error",size:e,sx:{px:1,py:1},children:a.jsx(T,{baseIcon:a.jsx(f,{color:t.waiting?"transparent":"secondary"}),children:a.jsx(F,{icon:a.jsx(I,{color:t.waiting?"transparent":"error300",fontSize:"small"}),h:4,v:4})})});if(u){const h=[a.jsx(g,{variant:"outlined",onClick:()=>{t.subCartItem()},size:e,disabled:!!t.waiting,children:a.jsx(R,{color:"warning400",fontSize:"small"})},"csub"),a.jsx(g,{disableFocusRipple:!0,disableRipple:!0,size:e,sx:{py:0},disabled:!!t.waiting,children:a.jsx(w,{className:"enFonts",variant:"subtitle1",children:u.qty})},"cnum"),a.jsx(g,{variant:"outlined",onClick:()=>{t.addCartItem()},size:e,disabled:!!t.waiting,children:a.jsx(A,{color:"success",fontSize:"small"})},"cadd")];return c?a.jsxs(b,{variant:"outlined",size:e,fullWidth:l,sx:s,children:[a.jsx(g,{color:"secondary",variant:"contained",disableFocusRipple:!0,disableRipple:!0,disableElevation:!0,size:e,disabled:!!t.waiting,children:a.jsx(f,{fontSize:"small"})}),h]}):a.jsx(b,{variant:"outlined",size:e,fullWidth:l,sx:s,children:h})}else return a.jsx(d,{loading:!!t.waiting,loadingPosition:"start",onClick:()=>{t.addCartItem()},variant:"contained",startIcon:a.jsx(B,{fontSize:e}),size:e,fullWidth:l,disableElevation:!0,sx:{px:x?.5:1.5,...s??{}},children:a.jsx(w,{variant:x?"caption":"button",noWrap:!0,children:m(S?"reserve_in_cart":"add_to_cart")})})},L=({productId:s,product:o,full:n=!1,size:c="medium",fullWidth:e=!1,remover:x=!1})=>{const{t:l}=k(),{getFavItem:j,manageApi:m}=M(),i=m(s,o),r=j(s);return x?a.jsx(d,{loading:i.waiting,onClick:()=>{i.delFavItem()},color:"error",size:c,sx:{px:1,py:1},children:a.jsx(T,{baseIcon:a.jsx(p,{color:i.waiting?"transparent":"secondary"}),children:a.jsx(F,{icon:a.jsx(I,{color:i.waiting?"transparent":"error300",fontSize:"small"}),h:4,v:4})})}):n?a.jsx(d,{loading:i.waiting,loadingPosition:"start",onClick:()=>{i.toggleFavItem()},variant:"text",color:r?"dark300":"dark",startIcon:r?a.jsx(p,{color:"secondary"}):a.jsx(y,{}),size:c,fullWidth:e,children:l(r?"remove_from_favorites":"add_to_favorites")}):a.jsx(d,{loading:i.waiting,onClick:()=>{i.toggleFavItem()},color:r?"secondary":"darkT50",size:c,sx:{px:1,py:1},children:r?a.jsx(p,{}):a.jsx(y,{})})};export{G as A,L as a};