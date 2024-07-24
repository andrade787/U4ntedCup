import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, CircleFadingPlus, LoaderCircle } from "lucide-react"
import { useState } from "react";
import RoleCardComein from "./RoleCardComein";
import { useToast } from "@/components/ui/use-toast";

export function ComeIn() {
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const { toast } = useToast();

  // toast({
  //  title: 'Erro!',
  //  variant: 'destructive',
  //  description: 'Ocorreu um erro ao enviar seu pedido para entrar no time. Por favor, tente novamente mais tarde.'
  // })

  const roles = [
    { role: 'Controlador', imageUrl: '/assets/Valorant/Roles/ControllerClassSymbol.webp', altText: 'Controlador' },
    { role: 'Duelista', imageUrl: '/assets/Valorant/Roles/DuelistClassSymbol.webp', altText: 'Duelista' },
    { role: 'Iniciador', imageUrl: '/assets/Valorant/Roles/InitiatorClassSymbol.webp', altText: 'Iniciador' },
    { role: 'Sentinela', imageUrl: '/assets/Valorant/Roles/SentinelClassSymbol.webp', altText: 'Sentinela' },
  ];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex items-center gap-1" variant='roxo'><CircleFadingPlus size={19} /> Entrar no Time</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">

        <div className="flex flex-col items-center bg-gradient-to-b from-green-800 rounded-xl p-2">
          <Check size={50} />
          <p className="text-center font-medium">Seu pedido para entrar no time foi enviado!</p>
          <p className="text-center text-sm text-zinc-200">Agora, aguarde a aprovação do dono do time.</p>
        </div>

        <div className="grid gap-4">
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
          {activeRole &&
            <p className="text-center animate-in zoom-in">Você selecionou {activeRole}</p>
          }
          <Button>Pedir Para Entrar</Button>
          <Button disabled className="flex items-center gap-2"><LoaderCircle className="animate-spin" /> Enviando Pedido..</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
