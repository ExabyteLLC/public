import{az as r,o as m,aA as e,j as i,B as d,S as g}from"./index-D539SZr7.js";const u={start:"flex-start",end:"flex-end",center:"center",around:"space-around",between:"flex-between",evenly:"space-evenly"},b={start:"flex-start",end:"flex-end",center:"center",stretch:"stretch",around:"space-around",between:"flex-between",evenly:"space-evenly"},f={start:"flex-start",end:"flex-end",center:"center",stretch:"stretch",baseline:"baseline",around:"space-around",between:"flex-between",evenly:"space-evenly"},x={start:"flex-start",end:"flex-end",center:"center",stretch:"stretch",baseline:"baseline"},h={row:"row",column:"column",rowReverse:"row-reverse",columnReverse:"column-reverse"},w={wrap:"wrap",nowrap:"nowrap"},s=(n,t=null,l=null)=>r.obj(n)?m.forEach(["xs","sm","md","lg","xl","mobile","tablet","laptop","desktop"],{},(j,o,c)=>{r.null(n[o])||(c[o]=r.func(l)?l(n[o]):n[o])}):r.null(n)?t:n,a=n=>n.hidden===!0?null:i.jsx(d,{className:`my-Item ${n.className??""}`,sx:{...n.flex===!0?{display:"inline-flex",flexDirection:n.flow??h.col,flexWrap:n.wrap??w.wrap,justifyContent:n.main??u.start,alignContent:n.cross??b.start,justifyItems:n.mainItem??f.start,alignItems:n.crossItem??x.start}:{display:"inline-block"},gap:s(n.spacing),...n.sx,width:s(n.width),height:s(n.height),flexGrow:s(n.grow,0),flexShrink:s(n.shrink,0),flexBasis:s(n.basis,"auto")},children:n.loading===!0?i.jsx(g,{variant:"rectangular"}):n.children});a.propTypes={sx:e.object,className:e.string,flow:e.string,wrap:e.string,main:e.string,cross:e.string,mainItem:e.string,crossItem:e.string,flex:e.bool,spacing:e.oneOfType([e.number,e.object]),grow:e.oneOfType([e.number,e.object]),shrink:e.oneOfType([e.number,e.object]),basis:e.oneOfType([e.number,e.object]),width:e.oneOfType([e.number,e.string,e.object]),height:e.oneOfType([e.number,e.string,e.object]),loading:e.bool,hidden:e.bool};const y=n=>i.jsx(a,{className:"my-Grid",width:"100%",spacing:n.spacing,main:n.main,cross:n.cross,mainItem:n.mainItem,crossItem:n.crossItem,sx:{...n.sx,display:"grid",gridTemplateColumns:s(n.cols,0,t=>r.num(t)?`repeat(${t}, minmax(0, 1fr))`:"auto"),gridAutoRows:s(n.rowHeight,"minmax(0, 1fr)")},children:n.children,loading:n.loading,hidden:n.hidden}),p=n=>i.jsx(a,{className:"my-GridItem",children:n.children,width:"100%",height:"100%",sx:{...n.sx,gridColumn:s(n.rows,null,t=>r.num(t)?`span ${t}`:"auto"),gridRow:s(n.spacing,null,t=>r.num(t)?`span ${t}`:"auto")},loading:n.loading,hidden:n.hidden});y.propTypes={sx:e.object,cols:e.oneOfType([e.number,e.object]),rowHeight:e.oneOfType([e.number,e.string,e.object]),main:e.string,cross:e.string,mainItem:e.string,crossItem:e.string,spacing:e.oneOfType([e.number,e.object])};p.propTypes={sx:e.object,rows:e.oneOfType([e.number,e.object]),cols:e.oneOfType([e.number,e.object])};export{y as M,p as a};