import { DropdownMenuGroup, DropdownMenuSeparator, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ChevronDown, MailQuestion, X } from "lucide-react";

interface StatusComeinProps {
  status: string;
  type: string | null;
}

export default function StatusComein({ status, type }: StatusComeinProps) {
  const statusInfo: { [key: string]: { message: string, triggerMessage: string, triggerClass: string } } = {
    team_invite: {
      message: 'Você foi convidado para se juntar ao time.',
      triggerMessage: 'Convite Recebido',
      triggerClass: 'bg-blue-800 hover:bg-blue-900'
    },
    pending: {
      message: 'Aguardando o dono do time aceitar o seu pedido para fazer parte do time.',
      triggerMessage: 'Pedido Pendente',
      triggerClass: 'bg-yellow-800 hover:bg-yellow-900'
    },
    accepted: {
      message: 'Seu pedido para entrar no time foi aceito!',
      triggerMessage: 'Pedido Aceito',
      triggerClass: 'bg-green-800 hover:bg-green-900'
    },
    rejected: {
      message: 'Seu pedido para entrar no time foi rejeitado.',
      triggerMessage: 'Pedido Rejeitado',
      triggerClass: 'bg-red-800 hover:bg-red-900'
    }
  };

  if (type === 'team_invite') {
    return (
      <div className="bg-Roxo flex flex-col items-center text-white p-4 rounded-xl animate-in slide-in-from-right-14">
        <MailQuestion />
        <h3 className="text-center">Você foi convidado para entrar nesse time</h3>
        <div className="flex items-center gap-8 mt-1">
          <span className="bg-zinc-800/60 rounded-xl py-1 px-2 cursor-pointer hover:bg-zinc-800/80 transition-colors">Aceitar</span>
          <span className="bg-zinc-800/30 rounded-xl py-1 px-2 cursor-pointer hover:bg-zinc-800/80 transition-colors">Rejeitar</span>
        </div>
      </div>
    );
  }

  const key = status || 'pending';
  const info = statusInfo[key];

  if (!info) {
    return null;
  }

  const { message, triggerMessage, triggerClass } = info;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className={`w-full group ${triggerClass} transition-colors rounded-xl p-2 cursor-pointer animate-in zoom-in`} asChild>
          <div className="flex items-center gap-1">
            {triggerMessage}
            <ChevronDown className="group-hover:translate-x-1 transition-all" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 p-0">
          <h4 className="p-3 text-center text-sm">{message}</h4>
          <DropdownMenuSeparator className="mb-0" />
          {status !== 'rejected' && (
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex justify-center cursor-pointer rounded-t-none p-2 bg-red-800">
                <span className="text-center flex items-center"><X size={18} /> Cancelar Solicitação</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
          {status === 'rejected' && (
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex justify-center cursor-pointer rounded-t-none p-2 bg-red-800">
                <span className="text-center flex items-center"><X size={18} /> Solicitar Novamente</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
