(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[788],{6730:function(e,r,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/cadastro",function(){return s(8700)}])},1064:function(e,r,s){"use strict";s.d(r,{Ol:function(){return i},SZ:function(){return c},Zb:function(){return l},aY:function(){return d},ll:function(){return o}});var t=s(5893),n=s(7294),a=s(456);let l=n.forwardRef((e,r)=>{let{className:s,...n}=e;return(0,t.jsx)("div",{ref:r,className:(0,a.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",s),...n})});l.displayName="Card";let i=n.forwardRef((e,r)=>{let{className:s,...n}=e;return(0,t.jsx)("div",{ref:r,className:(0,a.cn)("flex flex-col space-y-1.5 p-6",s),...n})});i.displayName="CardHeader";let o=n.forwardRef((e,r)=>{let{className:s,...n}=e;return(0,t.jsx)("h3",{ref:r,className:(0,a.cn)("text-2xl font-semibold leading-none tracking-tight",s),...n})});o.displayName="CardTitle";let c=n.forwardRef((e,r)=>{let{className:s,...n}=e;return(0,t.jsx)("p",{ref:r,className:(0,a.cn)("text-sm text-muted-foreground",s),...n})});c.displayName="CardDescription";let d=n.forwardRef((e,r)=>{let{className:s,...n}=e;return(0,t.jsx)("div",{ref:r,className:(0,a.cn)("p-6 pt-0",s),...n})});d.displayName="CardContent",n.forwardRef((e,r)=>{let{className:s,...n}=e;return(0,t.jsx)("div",{ref:r,className:(0,a.cn)("flex items-center p-6 pt-0",s),...n})}).displayName="CardFooter"},8501:function(e,r,s){"use strict";s.d(r,{I:function(){return l}});var t=s(5893),n=s(7294),a=s(456);let l=n.forwardRef((e,r)=>{let{className:s,type:n,...l}=e;return(0,t.jsx)("input",{type:n,className:(0,a.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Roxo focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",s),ref:r,...l})});l.displayName="Input"},428:function(e,r,s){"use strict";s.d(r,{_:function(){return c}});var t=s(5893),n=s(7294),a=s(9102),l=s(5139),i=s(456);let o=(0,l.j)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),c=n.forwardRef((e,r)=>{let{className:s,...n}=e;return(0,t.jsx)(a.f,{ref:r,className:(0,i.cn)(o(),s),...n})});c.displayName=a.f.displayName},2360:function(e,r,s){"use strict";s.r(r),s.d(r,{default:function(){return R}});var t=s(5893),n=s(6312),a=s(7536),l=s(1604),i=s(2417),o=s(7294),c=s(8426),d=s(456),m=s(428);let x=a.RV,u=o.createContext({}),f=e=>{let{...r}=e;return(0,t.jsx)(u.Provider,{value:{name:r.name},children:(0,t.jsx)(a.Qr,{...r})})},h=()=>{let e=o.useContext(u),r=o.useContext(p),{getFieldState:s,formState:t}=(0,a.Gc)(),n=s(e.name,t);if(!e)throw Error("useFormField should be used within <FormField>");let{id:l}=r;return{id:l,name:e.name,formItemId:"".concat(l,"-form-item"),formDescriptionId:"".concat(l,"-form-item-description"),formMessageId:"".concat(l,"-form-item-message"),...n}},p=o.createContext({}),j=o.forwardRef((e,r)=>{let{className:s,...n}=e,a=o.useId();return(0,t.jsx)(p.Provider,{value:{id:a},children:(0,t.jsx)("div",{ref:r,className:(0,d.cn)("space-y-2",s),...n})})});j.displayName="FormItem";let N=o.forwardRef((e,r)=>{let{className:s,...n}=e,{error:a,formItemId:l}=h();return(0,t.jsx)(m._,{ref:r,className:(0,d.cn)(a&&"text-destructive",s),htmlFor:l,...n})});N.displayName="FormLabel";let g=o.forwardRef((e,r)=>{let{...s}=e,{error:n,formItemId:a,formDescriptionId:l,formMessageId:i}=h();return(0,t.jsx)(c.g7,{ref:r,id:a,"aria-describedby":n?"".concat(l," ").concat(i):"".concat(l),"aria-invalid":!!n,...s})});g.displayName="FormControl",o.forwardRef((e,r)=>{let{className:s,...n}=e,{formDescriptionId:a}=h();return(0,t.jsx)("p",{ref:r,id:a,className:(0,d.cn)("text-sm text-muted-foreground",s),...n})}).displayName="FormDescription";let v=o.forwardRef((e,r)=>{let{className:s,children:n,...a}=e,{error:l,formMessageId:i}=h(),o=l?String(null==l?void 0:l.message):n;return o?(0,t.jsx)("p",{ref:r,id:i,className:(0,d.cn)("text-sm font-medium text-destructive",s),...a,children:o}):null});v.displayName="FormMessage";var b=s(8501),w=s(1664),y=s.n(w);let C=l.z.object({firstname:l.z.string().min(2),lastname:l.z.string().min(2),email:l.z.string().email(),nick:l.z.string().min(2),senha:l.z.string().min(6,{message:"A senha deve ter pelo menos 6 caracteres."}),confirmsenha:l.z.string()}).refine(e=>e.senha===e.confirmsenha,{message:"As senhas n\xe3o coincidem!"});function R(){let e=(0,a.cI)({resolver:(0,n.F)(C),defaultValues:{firstname:"",lastname:"",email:"",nick:"",senha:"",confirmsenha:""}});return(0,t.jsx)(x,{...e,children:(0,t.jsxs)("form",{onSubmit:e.handleSubmit(e=>{console.log(e)}),className:"space-y-3",children:[(0,t.jsxs)("div",{className:"flex gap-4",children:[(0,t.jsx)(f,{control:e.control,name:"firstname",render:e=>{let{field:r}=e;return(0,t.jsxs)(j,{className:"flex-1",children:[(0,t.jsx)(N,{children:"Seu Nome"}),(0,t.jsx)(g,{children:(0,t.jsx)(b.I,{placeholder:"Seu Primeiro Nome",...r})})]})}}),(0,t.jsx)(f,{control:e.control,name:"lastname",render:e=>{let{field:r}=e;return(0,t.jsxs)(j,{className:"flex-1",children:[(0,t.jsx)(N,{children:"Seu Sobrenome"}),(0,t.jsx)(g,{children:(0,t.jsx)(b.I,{placeholder:"Seu Sobrenome",...r})})]})}})]}),(0,t.jsxs)("div",{className:"flex space-x-4",children:[(0,t.jsx)(f,{control:e.control,name:"email",render:e=>{let{field:r}=e;return(0,t.jsxs)(j,{className:"flex-1",children:[(0,t.jsx)(N,{children:"Seu Email"}),(0,t.jsx)(g,{children:(0,t.jsx)(b.I,{type:"email",placeholder:"Informe um Email",...r})})]})}}),(0,t.jsx)(f,{control:e.control,name:"nick",render:e=>{let{field:r}=e;return(0,t.jsxs)(j,{className:"flex-1",children:[(0,t.jsx)(N,{children:"Nick"}),(0,t.jsx)(g,{children:(0,t.jsx)(b.I,{placeholder:"Informe o seu Nick",...r})})]})}})]}),(0,t.jsx)(f,{control:e.control,name:"senha",render:e=>{let{field:r}=e;return(0,t.jsxs)(j,{children:[(0,t.jsx)(N,{children:"Sua Senha"}),(0,t.jsx)(g,{children:(0,t.jsx)(b.I,{type:"password",placeholder:"Informe uma Senha",...r})}),(0,t.jsx)(v,{className:"text-red-500"})]})}}),(0,t.jsx)(f,{control:e.control,name:"confirmsenha",render:e=>{let{field:r}=e;return(0,t.jsxs)(j,{children:[(0,t.jsx)(N,{children:"Confirmar Senha"}),(0,t.jsx)(g,{children:(0,t.jsx)(b.I,{type:"password",placeholder:"Confirme a sua Senha",...r})}),(0,t.jsx)(v,{className:"text-red-500"})]})}}),(0,t.jsxs)("div",{className:"flex flex-col w-full justify-center",children:[(0,t.jsxs)("p",{className:"mb-5 text-center text-sm text-zinc-300",children:["Ao clicar em",(0,t.jsx)("span",{className:"font-medium",children:" Concluir Cadastro"}),", voc\xea concorda com nossos",(0,t.jsx)(y(),{href:"/termos-de-servico",children:(0,t.jsx)("span",{className:"font-medium transition-colors text-white hover:text-Roxo",children:" Termos de Servi\xe7o"})})," e",(0,t.jsx)(y(),{href:"/politica-de-privacidade",children:(0,t.jsx)("span",{className:"font-medium transition-colors text-white hover:text-Roxo",children:" Pol\xedtica de Privacidade"})}),"."]}),(0,t.jsx)(i.z,{className:"bg-Roxo transition-colors text-white hover:bg-RoxoClaro",children:"Concluir Cadastro"})]})]})})}},8700:function(e,r,s){"use strict";s.r(r);var t=s(5893),n=s(1064),a=s(1664),l=s.n(a),i=s(5675),o=s.n(i),c=s(2360);r.default=function(){return(0,t.jsx)("div",{className:"relative pt-14 bg-gradient-to-bl from-blue-100 via-transparent dark:from-Roxo dark:via-transparent",children:(0,t.jsx)("div",{className:"max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto",children:(0,t.jsxs)("div",{className:"grid items-center md:grid-cols-2 gap-8 lg:gap-12",children:[(0,t.jsxs)("div",{className:"mt-4 md:mb-12 max-w-2xl",children:[(0,t.jsx)("div",{className:"flex justify-center",children:(0,t.jsx)(o(),{className:"mb-5",src:"/assets/logo.webp",width:500,height:500,priority:!0,alt:"U4nted Cup",style:{width:"auto",height:"auto"}})}),(0,t.jsx)("h1",{className:"mb-4 font-semibold text-center  text-gray-800 text-4xl lg:text-5xl dark:text-neutral-200",children:"Elevando a Experi\xeancia do E-Sports Amador ao Profissional."}),(0,t.jsx)("p",{className:"text-gray-600 text-center dark:text-neutral-400",children:"Junte-se a n\xf3s agora mesmo e mergulhe em uma experi\xeancia verdadeiramente imersiva de um jogador de esportes profissional!                     "})]}),(0,t.jsx)("div",{className:"flex justify-end",children:(0,t.jsxs)(n.Zb,{className:"max-w-lg",children:[(0,t.jsxs)(n.Ol,{children:[(0,t.jsx)(n.ll,{className:"text-center",children:"Formul\xe1rio de Inscri\xe7\xe3o"}),(0,t.jsxs)(n.SZ,{className:"text-center",children:["J\xe1 possui uma conta ?",(0,t.jsxs)(l(),{href:"/player/login",children:[" ",(0,t.jsx)("span",{className:"text-Roxo hover:text-white",children:"Fazer Login"})]})]})]}),(0,t.jsxs)(n.aY,{children:[(0,t.jsx)("hr",{className:"mb-5"}),(0,t.jsx)(c.default,{})]})]})})]})})})}}},function(e){e.O(0,[763,888,774,179],function(){return e(e.s=6730)}),_N_E=e.O()}]);