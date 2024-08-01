// components/RequestStatusButton.tsx
import { useState } from 'react';
import { CirclePlus, LoaderCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from '@/components/ui/use-toast';
interface RequestStatusButtonProps {
  status: 'pending' | 'rejected' | string;
  nickname: string;
  playerId: string;
  teamId: string;
  onStatusChange: (playerId: string, newStatus: string) => void;
}

const RequestStatusButton = ({ status, nickname, playerId, teamId, onStatusChange }: RequestStatusButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/teams/requests/team_invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId, teamId, type: 'team_invite' }),
      });
      const data = await response.json();
      if (response.ok) {
        onStatusChange(playerId, 'pending');
        toast({
          title: 'Usuário Convidado Com Sucesso!',
          description: 'Aguarde que o mesmo aceite o seu convite.',
          variant: 'success'
        })
      } else {
        toast({
          title: 'Ocorreu um erro.',
          description: 'Por favor, tente novamente mais tarde!',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Ocorreu um erro.',
        description: 'Por favor, tente novamente mais tarde!',
        variant: 'destructive'
      })
    } finally {
      setLoading(false);
    }
  };

  const statusConfig: Record<string, { bgClass: string; tooltip: string; label?: string; icon?: JSX.Element }> = {
    pending: {
      bgClass: "from-yellow-800",
      tooltip: `Aguardando ${nickname} aceitar o seu convite`,
      label: "Convidado",
    },
    rejected: {
      bgClass: "from-red-800",
      tooltip: `${nickname} não aceitou o seu convite`,
      label: "Recusado",
    },
    default: {
      bgClass: "",
      tooltip: "Convidar para se unir ao seu time",
      icon: <CirclePlus />,
    },
  };

  const config = statusConfig[status] || statusConfig.default;

  return status === 'pending' || status === 'rejected' ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className={`bg-gradient-to-r ${config.bgClass} hover:bg-zinc-800 p-1 transition-colors rounded-xl`}>
            <p className="text-sm">{config.label}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent className={`bg-gradient-to-r ${config.bgClass}`}>
          <p>{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="hover:bg-zinc-800/70 p-1 transition-colors rounded-xl" onClick={handleClick} disabled={loading}>
          {loading ? (<LoaderCircle className='animate-spin' />)
            : (
              <>
                {config.icon}
              </>
            )
          }
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RequestStatusButton;
