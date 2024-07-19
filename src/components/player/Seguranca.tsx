import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/UserContext";
import { useRouter } from 'next/router';

const passwordSchema = z.object({
  newPassword: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string().min(6, { message: "A confirmação de senha deve ter pelo menos 6 caracteres" }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"], // Path of error
});

export default function Seguranca() {
  const { user, setUser } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ newPassword: '', confirmPassword: '' });

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({ newPassword: '', confirmPassword: '' });

    const formData = { newPassword, confirmPassword };
    const parseResult = passwordSchema.safeParse(formData);

    if (!parseResult.success) {
      const formErrors = parseResult.error.format();
      setErrors({
        newPassword: formErrors.newPassword?._errors[0] || '',
        confirmPassword: formErrors.confirmPassword?._errors[0] || '',
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.uid, password: newPassword }),
      });

      if (response.ok) {
        toast({
          variant: "success",
          title: "Sucesso",
          description: "Senha alterada com sucesso",
        });
        setNewPassword('');
        setConfirmPassword('');
        setUser(null); // Desconectar o usuário
        router.push('/login');
      } else {
        const result = await response.json();
        toast({
          variant: "destructive",
          title: "Erro",
          description: result.error || 'Erro ao alterar a senha',
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: 'Erro ao alterar a senha',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <h2 className="font-semibold mb-1">Alterar Senha</h2>
        <hr />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="newPassword" className="text-right">
          Nova Senha
        </Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="col-span-3"
        />
        {errors.newPassword && (
          <span className="col-span-4 text-red-500 text-right">{errors.newPassword}</span>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="confirmPassword" className="text-right">
          Confirmação de Nova Senha
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="col-span-3"
        />
        {errors.confirmPassword && (
          <span className="col-span-4 text-red-500 text-right">{errors.confirmPassword}</span>
        )}
      </div>
      <div className="flex justify-center">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Carregando...' : 'Alterar Senha'}
        </Button>
      </div>
    </>
  );
}
