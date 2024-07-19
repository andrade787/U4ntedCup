import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Cs2Icon, ValorantIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Plus, RotateCcw, LoaderCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

interface AddContaProps {
  gameAccounts: { [key: string]: any } | null | undefined;
}

// Defina o esquema de validação usando zod
const schema = z.object({
  nickname: z.string().min(1, "Nickname é obrigatório"),
  tag: z.string().min(1, "TAG é obrigatória"),
  role: z.string().min(1, "Função é obrigatória"),
});

type FormData = z.infer<typeof schema>;

export function AddConta({ gameAccounts }: AddContaProps) {
  const { toast } = useToast();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleGameSelection = (game: string) => {
    setSelectedGame(game);
    setError(null);
  };

  const resetSelection = () => {
    setSelectedGame(null);
    setError(null);
    reset();
  };

  const handleVerifyAccount = async (data: FormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/getAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: data.nickname, tag: data.tag, role: data.role }),
      });

      const dataResponse = await response.json();

      if (!response.ok) {
        setError(dataResponse.error || 'Erro desconhecido');
        setIsLoading(false);
        return;
      }
      toast({
        variant: "success",
        title: "Sucesso!",
        description: 'Sua conta foi adicionada com sucesso!',
      });
      setIsLoading(false);

      // Atualiza a página após 1 segundo
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (err) {
      setError('Ocorreu um erro ao verificar a conta');
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><Plus size={20} className='mr-2' /> Adicionar Conta</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicione Sua Conta</DialogTitle>
          <DialogDescription>
            Adicione a conta do jogo que você utilizará no campeonato
          </DialogDescription>
        </DialogHeader>
        <div>
          {!selectedGame ? (
            <div className="flex flex-col justify-center items-center mt-2 mb-3">
              <h3 className="mb-2 font-semibold">Selecione o jogo</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center bg-zinc-900 rounded-xl p-5 cursor-not-allowed">
                  <Cs2Icon color="text-white/20" size={60} />
                  <h4 className="text-white/20">Cs2</h4>
                </div>
                <div className={`flex flex-col items-center bg-zinc-900 ${gameAccounts?.Valorant ? 'cursor-not-allowed' : 'hover:bg-zinc-700 cursor-pointer'} transition-colors rounded-xl p-5`} onClick={() => !gameAccounts?.Valorant && handleGameSelection('valorant')}>
                  <ValorantIcon color={`${gameAccounts?.Valorant ? 'text-white/20' : ''}`} size={60} />
                  <h4 className={`${gameAccounts?.Valorant ? 'text-white/20' : ''}`}>Valorant</h4>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(handleVerifyAccount)} className="flex flex-col">
              <div className="flex items-center justify-between bg-gradient-to-r from-zinc-700 rounded-xl p-1">
                <div className="flex items-center gap-2 animate-in fade-in">
                  <ValorantIcon />
                  <h3 className="">Valorant Selecionado</h3>
                </div>
                <div className="hover:bg-zinc-800 transition-colors rounded-xl cursor-pointer p-1 animate-in fade-in" onClick={resetSelection}>
                  <RotateCcw className="hover:text-zinc-300 transition-colors" />
                </div>
              </div>
              <p className="mb-5 mt-1 text-sm text-zinc-400 animate-in fade-in-20">Agora, informe as informações da sua conta</p>
              <div className="flex flex-col space-y-3">
                <div className="flex gap-3 items-center animate-in fade-in-40">
                  <Label className="flex-shrink-0 w-28">Conta</Label>
                  <Controller
                    name="nickname"
                    control={control}
                    render={({ field }) => (
                      <Input required placeholder="Nick Valorant" {...field} />
                    )}
                  />
                  <div className="flex items-center gap-1">
                    <p>#</p>
                    <Controller
                      name="tag"
                      control={control}
                      render={({ field }) => (
                        <Input required placeholder="TAG" {...field} />
                      )}
                    />
                  </div>
                </div>
                {errors.nickname && <p className="text-red-500">{errors.nickname.message}</p>}
                {errors.tag && <p className="text-red-500">{errors.tag.message}</p>}
                <div className="flex gap-3 items-center animate-in fade-in-55">
                  <Label className="flex-shrink-0 w-28">Função</Label>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select required onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sua Função" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="duelista">Duelista</SelectItem>
                          <SelectItem value="suporte">Suporte</SelectItem>
                          <SelectItem value="iniciador">Iniciador</SelectItem>
                          <SelectItem value="controlador">Controlador</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {errors.role && <p className="text-red-500">{errors.role.message}</p>}
                <Button className="animate-in fade-in-90" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center animate-in fade-in-90">
                      <LoaderCircle size={16} className="mr-2 animate-spin" /> Verificando conta...
                    </div>
                  ) : (
                    'Adicionar Conta'
                  )}
                </Button>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Ocorreu um erro</AlertTitle>
                    <AlertDescription>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
