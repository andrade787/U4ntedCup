import { Check, X } from "lucide-react";
import Image from "next/image";

export default function CardPlayerInvite() {
  return (
    <div className="flex flex-col hover:bg-zinc-800/20 rounded-tl-xl rounded-tr-xl bg-gradient-to-r from-Roxo/80 to-transparent">
      <div className="flex border-b-2 transition-colors">
        <div className="flex p-4 flex-col w-full">
          <div className="flex items-center gap-2">
            <Image className="" src="/assets/favicon.png" width={20} height={20} alt="icon" />
            <p className="text-zinc-100">
              QRZera quer fazer parte do seu time! <span className="font-medium">Deseja aceitar?</span>
            </p>
          </div>
          <p className="text-sm text-zinc-200 ml-7">Há 3 min</p>
        </div>
        <div className="flex bg-gradient-to-l from-zinc-900/20 rounded-tl-xl rounded-tr-xl items-center gap-2 py-4 pr-2">
          <div className="flex items-center gap-1 p-2 rounded-full hover:bg-zinc-700/50 transition-colors cursor-pointer">
            <Check size={20} /> Aceitar
          </div>
          <div className="flex items-center gap-1 p-2 rounded-full hover:border hover:border-white transition-all cursor-pointer">
            <X size={20} /> Recusar
          </div>
        </div>
      </div>
    </div>
  );
}
