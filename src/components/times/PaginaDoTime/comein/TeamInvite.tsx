// TeamInvite.tsx
import { Button } from "@/components/ui/button";
import { MailQuestion, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";

export default function TeamInvite() {
  const { notifications } = useUser();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const teamInviteNotification = notifications.find(notification => notification.type === 'team_invite');
  const requestId = teamInviteNotification?.additionalInfo?.[0] || '';

  const handleResponse = async (status: 'accepted' | 'rejected') => {
    if (!requestId) {
      toast({
        variant: 'destructive',
        title: "Erro de solicitação",
        description: "ID de solicitação inválido.",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/player/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notificationId: teamInviteNotification?.notificationId }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: "Ocorreu um erro!",
          description: data.message || "Ocorreu um erro ao aceitar o convite. Tente novamente mais tarde.",
        });
        setLoading(false);
        throw new Error('Failed to update the request');
      }

      toast({
        variant: 'success',
        title: data.message || 'Convite aceito com sucesso!',
      });
      setLoading(false);

    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Ocorreu um erro!",
        description: "Ocorreu um erro ao aceitar o convite. Tente novamente mais tarde.",
      });
      setLoading(false);
    }
  };

  if (!teamInviteNotification) {
    return null;
  }

  return (
    <div className="bg-Roxo flex flex-col items-center text-white p-4 rounded-xl animate-in slide-in-from-right-14">
      <MailQuestion />
      <h3 className="text-center">Você foi convidado para entrar nesse time</h3>
      <div className="flex items-center gap-8 mt-1">
        <Button
          className="bg-zinc-800/60 text-zinc-100 rounded-xl py-1 px-2 cursor-pointer hover:bg-zinc-800/80 transition-colors"
          onClick={() => handleResponse('accepted')}
          disabled={loading}
        >
          {loading ? (<LoaderCircle className="animate-spin" />) : 'Aceitar'}
        </Button>
        <Button
          className="bg-zinc-800/30 text-zinc-100 rounded-xl py-1 px-2 cursor-pointer hover:bg-zinc-800/80 transition-colors"
          onClick={() => handleResponse('rejected')}
          disabled={loading}
        >
          {loading ? (<LoaderCircle className="animate-spin" />) : 'Rejeitar'}
        </Button>
      </div>
    </div>
  );
}
