import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, CircleFadingPlus, LoaderCircle } from "lucide-react";
import { useState } from "react";
import RoleCardComein from "./RoleCardComein";
import { useToast } from "@/components/ui/use-toast";
import Message from "./Message";
import { useTeam } from "@/context/TeamContext";

export default function JoinTeam() {
  const team = useTeam();
  const teamId = team.team.id;
  const playerId = team.user?.uid;
  const playerNick = team.user?.nickname;
  const playerUrl = team.user?.url;

  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const roles = [
    { role: 'Controlador', imageUrl: '/assets/Valorant/Roles/Controlador.webp', altText: 'Controlador' },
    { role: 'Duelista', imageUrl: '/assets/Valorant/Roles/Duelista.webp', altText: 'Duelista' },
    { role: 'Iniciador', imageUrl: '/assets/Valorant/Roles/Iniciador.webp', altText: 'Iniciador' },
    { role: 'Sentinela', imageUrl: '/assets/Valorant/Roles/Sentinela.webp', altText: 'Sentinela' },
  ];

  const handleRequestJoin = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/teams/requests/join-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerNick, playerId, teamId, role: activeRole, playerUrl })
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        throw new Error(result.error || 'Falha ao enviar pedido');
      }
    } catch (error) {
      let errorMessage = 'Ocorreu um erro ao enviar seu pedido para entrar no time. Por favor, tente novamente mais tarde.';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      toast({
        title: 'Erro!',
        variant: 'destructive',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex items-center gap-1 w-full flex-1" variant='roxo'>
          <CircleFadingPlus size={19} /> Entrar no Time
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        {success && <Message />}
        {!success && (
          <div className="grid gap-4 animate-in zoom-in p-5">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Entrar no time</h4>
              <p className="text-sm text-muted-foreground">
                Por favor, selecione qual será a sua função no time
              </p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {roles.map(({ role, imageUrl, altText }) => (
                <RoleCardComein
                  key={role}
                  role={role}
                  imageUrl={imageUrl}
                  altText={altText}
                  isActive={activeRole === role}
                  onClick={() => setActiveRole(role)}
                />
              ))}
            </div>
            {activeRole && (
              <p className="text-center animate-in zoom-in">Você selecionou {activeRole}</p>
            )}
            <Button
              onClick={handleRequestJoin}
              disabled={loading || !activeRole}
            >
              {!loading ? 'Pedir Para Entrar' : (<><LoaderCircle className="animate-spin" /> Enviando Pedido.</>)}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
