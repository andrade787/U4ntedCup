// components/InformacoesTime.tsx
import { TeamInfos } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageSquareWarning } from "lucide-react";

interface InformacoesTimeProps {
  localTeam: TeamInfos;
  setLocalTeam: React.Dispatch<React.SetStateAction<TeamInfos>>;
}

export default function InformacoesTime({ localTeam, setLocalTeam }: InformacoesTimeProps) {

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTeam(prevTeam => ({ ...prevTeam, name: e.target.value }));
  };

  return (
    <div className="flex flex-col space-y-2 mt-4 mb-5">
      <div className="mb-3">
        <Label>Nome do Time</Label>
        <div className="flex items-center gap-1">
          <Input
            className="flex-1"
            value={localTeam.name}
            onChange={handleNameChange}
            placeholder="Informe o nome do seu time"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="hover:bg-zinc-800/70 p-1 transition-colors rounded-xl">
                <MessageSquareWarning className="cursor-default" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm leading-6">Ao alterar o nome do seu time, a URL <span className="bg-zinc-800 p-1 rounded-xl">/times/{localTeam.url}</span> também será atualizada.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
