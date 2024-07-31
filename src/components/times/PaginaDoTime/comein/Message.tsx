import { Check } from "lucide-react";

export default function Message() {
  return (
    <div className="flex flex-col items-center animate-in zoom-in-150 bg-gradient-to-b from-green-800 rounded-md p-2">
      <Check size={50} />
      <p className="text-center font-medium">Seu pedido para entrar no time foi enviado!</p>
      <p className="text-center text-sm text-zinc-200">Agora, aguarde a aprovação do dono do time.</p>
    </div>
  );
}