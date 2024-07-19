(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[59],{915:function(e,r,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/cadastro/formCadastro",function(){return s(2360)}])},8501:function(e,r,s){"use strict";s.d(r,{I:function(){return o}});var n=s(5893),t=s(7294),a=s(456);let o=t.forwardRef((e,r)=>{let{className:s,type:t,...o}=e;return(0,n.jsx)("input",{type:t,className:(0,a.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Roxo focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",s),ref:r,...o})});o.displayName="Input"},428:function(e,r,s){"use strict";s.d(r,{_:function(){return c}});var n=s(5893),t=s(7294),a=s(9102),o=s(5139),l=s(456);let i=(0,o.j)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),c=t.forwardRef((e,r)=>{let{className:s,...t}=e;return(0,n.jsx)(a.f,{ref:r,className:(0,l.cn)(i(),s),...t})});c.displayName=a.f.displayName},2360:function(e,r,s){"use strict";s.r(r),s.d(r,{default:function(){return S}});var n=s(5893),t=s(6312),a=s(7536),o=s(1604),l=s(2417),i=s(7294),c=s(8426),d=s(456),m=s(428);let f=a.RV,u=i.createContext({}),x=e=>{let{...r}=e;return(0,n.jsx)(u.Provider,{value:{name:r.name},children:(0,n.jsx)(a.Qr,{...r})})},h=()=>{let e=i.useContext(u),r=i.useContext(j),{getFieldState:s,formState:n}=(0,a.Gc)(),t=s(e.name,n);if(!e)throw Error("useFormField should be used within <FormField>");let{id:o}=r;return{id:o,name:e.name,formItemId:"".concat(o,"-form-item"),formDescriptionId:"".concat(o,"-form-item-description"),formMessageId:"".concat(o,"-form-item-message"),...t}},j=i.createContext({}),p=i.forwardRef((e,r)=>{let{className:s,...t}=e,a=i.useId();return(0,n.jsx)(j.Provider,{value:{id:a},children:(0,n.jsx)("div",{ref:r,className:(0,d.cn)("space-y-2",s),...t})})});p.displayName="FormItem";let N=i.forwardRef((e,r)=>{let{className:s,...t}=e,{error:a,formItemId:o}=h();return(0,n.jsx)(m._,{ref:r,className:(0,d.cn)(a&&"text-destructive",s),htmlFor:o,...t})});N.displayName="FormLabel";let v=i.forwardRef((e,r)=>{let{...s}=e,{error:t,formItemId:a,formDescriptionId:o,formMessageId:l}=h();return(0,n.jsx)(c.g7,{ref:r,id:a,"aria-describedby":t?"".concat(o," ").concat(l):"".concat(o),"aria-invalid":!!t,...s})});v.displayName="FormControl",i.forwardRef((e,r)=>{let{className:s,...t}=e,{formDescriptionId:a}=h();return(0,n.jsx)("p",{ref:r,id:a,className:(0,d.cn)("text-sm text-muted-foreground",s),...t})}).displayName="FormDescription";let b=i.forwardRef((e,r)=>{let{className:s,children:t,...a}=e,{error:o,formMessageId:l}=h(),i=o?String(null==o?void 0:o.message):t;return i?(0,n.jsx)("p",{ref:r,id:l,className:(0,d.cn)("text-sm font-medium text-destructive",s),...a,children:i}):null});b.displayName="FormMessage";var g=s(8501),w=s(1664),y=s.n(w);let I=o.z.object({firstname:o.z.string().min(2),lastname:o.z.string().min(2),email:o.z.string().email(),nick:o.z.string().min(2),senha:o.z.string().min(6,{message:"A senha deve ter pelo menos 6 caracteres."}),confirmsenha:o.z.string()}).refine(e=>e.senha===e.confirmsenha,{message:"As senhas n\xe3o coincidem!"});function S(){let e=(0,a.cI)({resolver:(0,t.F)(I),defaultValues:{firstname:"",lastname:"",email:"",nick:"",senha:"",confirmsenha:""}});return(0,n.jsx)(f,{...e,children:(0,n.jsxs)("form",{onSubmit:e.handleSubmit(e=>{console.log(e)}),className:"space-y-3",children:[(0,n.jsxs)("div",{className:"flex gap-4",children:[(0,n.jsx)(x,{control:e.control,name:"firstname",render:e=>{let{field:r}=e;return(0,n.jsxs)(p,{className:"flex-1",children:[(0,n.jsx)(N,{children:"Seu Nome"}),(0,n.jsx)(v,{children:(0,n.jsx)(g.I,{placeholder:"Seu Primeiro Nome",...r})})]})}}),(0,n.jsx)(x,{control:e.control,name:"lastname",render:e=>{let{field:r}=e;return(0,n.jsxs)(p,{className:"flex-1",children:[(0,n.jsx)(N,{children:"Seu Sobrenome"}),(0,n.jsx)(v,{children:(0,n.jsx)(g.I,{placeholder:"Seu Sobrenome",...r})})]})}})]}),(0,n.jsxs)("div",{className:"flex space-x-4",children:[(0,n.jsx)(x,{control:e.control,name:"email",render:e=>{let{field:r}=e;return(0,n.jsxs)(p,{className:"flex-1",children:[(0,n.jsx)(N,{children:"Seu Email"}),(0,n.jsx)(v,{children:(0,n.jsx)(g.I,{type:"email",placeholder:"Informe um Email",...r})})]})}}),(0,n.jsx)(x,{control:e.control,name:"nick",render:e=>{let{field:r}=e;return(0,n.jsxs)(p,{className:"flex-1",children:[(0,n.jsx)(N,{children:"Nick"}),(0,n.jsx)(v,{children:(0,n.jsx)(g.I,{placeholder:"Informe o seu Nick",...r})})]})}})]}),(0,n.jsx)(x,{control:e.control,name:"senha",render:e=>{let{field:r}=e;return(0,n.jsxs)(p,{children:[(0,n.jsx)(N,{children:"Sua Senha"}),(0,n.jsx)(v,{children:(0,n.jsx)(g.I,{type:"password",placeholder:"Informe uma Senha",...r})}),(0,n.jsx)(b,{className:"text-red-500"})]})}}),(0,n.jsx)(x,{control:e.control,name:"confirmsenha",render:e=>{let{field:r}=e;return(0,n.jsxs)(p,{children:[(0,n.jsx)(N,{children:"Confirmar Senha"}),(0,n.jsx)(v,{children:(0,n.jsx)(g.I,{type:"password",placeholder:"Confirme a sua Senha",...r})}),(0,n.jsx)(b,{className:"text-red-500"})]})}}),(0,n.jsxs)("div",{className:"flex flex-col w-full justify-center",children:[(0,n.jsxs)("p",{className:"mb-5 text-center text-sm text-zinc-300",children:["Ao clicar em",(0,n.jsx)("span",{className:"font-medium",children:" Concluir Cadastro"}),", voc\xea concorda com nossos",(0,n.jsx)(y(),{href:"/termos-de-servico",children:(0,n.jsx)("span",{className:"font-medium transition-colors text-white hover:text-Roxo",children:" Termos de Servi\xe7o"})})," e",(0,n.jsx)(y(),{href:"/politica-de-privacidade",children:(0,n.jsx)("span",{className:"font-medium transition-colors text-white hover:text-Roxo",children:" Pol\xedtica de Privacidade"})}),"."]}),(0,n.jsx)(l.z,{className:"bg-Roxo transition-colors text-white hover:bg-RoxoClaro",children:"Concluir Cadastro"})]})]})})}}},function(e){e.O(0,[763,888,774,179],function(){return e(e.s=915)}),_N_E=e.O()}]);