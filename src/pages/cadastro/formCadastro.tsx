import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { LoaderCircle } from "lucide-react";
import { useUser } from "@/context/UserContext";

const formSchema = z.object({
    firstname: z.string().min(2, { message: "Deve conter no mínimo 2 caracteres" }),
    assinaturaPlayer: z.string().min(2, { message: "Deve conter no mínimo 2 caracteres" }).max(32, { message: "A assinatura não pode ter mais de 32 caracteres" }),
    email: z.string().email(),
    nick: z.string().min(2, { message: "Deve conter no mínimo 2 caracteres" }),
    senha: z.string().min(6, {
        message: "A senha deve ter pelo menos 6 caracteres.",
    }),
    confirmsenha: z.string(),
}).refine(data => data.senha === data.confirmsenha, {
    message: "As senhas não coincidem!",
});

export default function FormCadastro() {
    const { toast } = useToast();
    const router = useRouter();
    const { setUser } = useUser(); // Usar a função setUser do contexto
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            assinaturaPlayer: "",
            email: "",
            nick: "",
            senha: "",
            confirmsenha: "",
        },
    });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error);
            }

            toast({
                variant: 'success',
                title: "Cadastro realizado com sucesso!",
                description: "Usuário registrado e logado com sucesso.",
            });

            // Redirecionar para a URL do player
            const formattedNick = data.nick.replace(/[^a-zA-Z0-9_]/g, "_").replace(/\s/g, "_");

            // Definir o usuário no contexto
            setUser({
                uid: result.uid,
                email: data.email,
                name: data.firstname,
                photoURL: null,
                nickname: data.nick,
                url: formattedNick,
            });

            router.push(`/player/${formattedNick}`);

        } catch (error) {
            if (error instanceof Error) {
                toast({
                    variant: 'destructive',
                    title: "Erro no cadastro",
                    description: error.message,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: "Erro no cadastro",
                    description: "Ocorreu um erro desconhecido.",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="firstname"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Seu Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Seu Primeiro Nome" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="assinaturaPlayer"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Sua Assinatura</FormLabel>
                                <FormControl>
                                    <Input maxLength={32} placeholder="Exemplo: eu sou o milior" {...field} />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex space-x-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Seu Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Informe um Email" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="nick"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Nick</FormLabel>
                                <FormControl>
                                    <Input placeholder="Informe o seu Nick" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="senha"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sua Senha</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Informe uma Senha" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmsenha"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirmar Senha</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Confirme a sua Senha" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <div className="flex flex-col w-full justify-center">
                    <p className="mb-5 text-center text-sm text-zinc-300">Ao clicar em
                        <span className="font-medium"> Concluir Cadastro</span>, você concorda com nossos
                        <Link href="/termos-de-servico"><span className="font-medium transition-colors text-white hover:text-Roxo"> Termos de Serviço</span></Link> e
                        <Link href="/politica-de-privacidade"><span className="font-medium transition-colors text-white hover:text-Roxo"> Política de Privacidade</span></Link>.</p>
                    <Button type="submit" className="flex items-center gap-2 bg-Roxo transition-colors text-white hover:bg-RoxoClaro" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <LoaderCircle className="animate-spin" size={18} />
                                Concluindo Cadastro...
                            </>
                        ) : (
                            "Concluir Cadastro"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
