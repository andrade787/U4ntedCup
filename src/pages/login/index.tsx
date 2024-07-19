import { useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { withUser } from "@/lib/auth";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { LoaderCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Por favor, insira um email válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export default function Login() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errorMessages = result.error.errors.map((error) => error.message).join(", ");
      toast({
        variant: 'destructive',
        title: 'Erro de validação',
        description: errorMessages,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const { url } = response.data.user;
      router.push(`/player/${url}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Ocorreu um erro',
        description: error.response?.data?.error || 'Erro desconhecido',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen px-2 flex flex-col gap-4 items-center justify-center pt-14 bg-gradient-to-br from-blue-100 via-transparent dark:from-Roxo dark:via-transparent">
      <Image
        width={500}
        height={500}
        src='/assets/logo.webp'
        alt='VALORANT logo'
      />

      <Card className="w-full max-w-md">
        <CardHeader className="flex text-xl justify-center items-center">Que bom ter você aqui novamente!
          <CardDescription>Por favor, informe o seu login e senha</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email"></Input>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Sua Senha"></Input>
            </div>
            <div className="flex justify-between items-center">
              <div className="space-x-2 flex items-center">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Lembrar de mim
                </label>
              </div>
              <Button variant='ghost' className="mt-2 float-right mb-4">Esqueci a senha</Button>
            </div>
            {!loading ? (
              <Button variant='roxo' type="submit" className="w-full">Entrar</Button>
            ) : (
              <Button variant='roxo' type="submit" disabled className="w-full flex items-center gap-2"><LoaderCircle size={19} className="animate-spin" /> Verificando Usuário</Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await withUser(context);

  if (user && user.url) {
    return {
      redirect: {
        destination: `/player/${user.url}`,
        permanent: false,
      },
    };
  }
  return {
    props: { user },
  };
};
