import { Button } from "@/components/ui/button";
import { useSmoothScrollOnView } from "@/lib/SmoothScroll";
import { CalendarClock, Clock } from "lucide-react";
import Link from "next/link";

export default function Matchs() {
  const containerRef = useSmoothScrollOnView('.smooth');

  return (
    <div ref={containerRef}>
      <div className="bg-zinc-800 rounded-xl">
        <h2 className="font-semibold text-2xl bg-zinc-900 p-4 rounded-t-xl smooth">Partidas do Campeonato</h2>
        <p className="p-4">A tabela de partidas ficará disponível após o sorteio dos grupos em live.</p>

        {/*    <div className="grid md:grid-cols-2 gap-5 p-4">

          <div className="flex items-center flex-col p-4 rounded-xl bg-zinc-900">
            <h1 className="font-bold text-3xl mb-5 flex items-center gap-2"><CalendarClock size={30} />20/04/2024</h1>
            <div className="flex flex-col space-y-6 w-full">


              <div className="flex items-center flex-col">
                <div className="flex w-full justify-between items-center bg-zinc-800/70 rounded-t-xl p-1 px-2">
                  <h4 className="flex gap-1 justify-center items-center "><Clock size={18} />18H</h4>
                  Fase de Grupos
                </div>

                <div className="grid grid-cols-9 rounded-xl w-full">
                  <div className="flex justify-center md:justify-start items-center col-span-9 md:col-span-4 gap-2 p-2 bg-gradient-to-r from-zinc-950/80 to-zinc-950/50 md:rounded-bl-xl">
                    <Link className="hover:brightness-75 transition-all" href='X' target="_blank">
                      <img className="w-10 h-10 object-cover rounded-full" src="https://storage.googleapis.com/uanted.appspot.com/PhotoUser/7abb23cd-324c-4818-a1e1-efdfe0e33f47.webp" />
                    </Link>
                    <Link className="hover:brightness-75 transition-all" href='X' target="_blank">
                      <h3 className="font-semibold">Nome do Time</h3>
                    </Link>
                  </div>
                  <div className="bg-zinc-950/50 col-span-9 md:col-span-1 flex items-center justify-center p-2">
                    <h3 className="font-bold text-zinc-400">VS</h3>
                  </div>
                  <div className="flex justify-center md:justify-end items-center col-span-9 md:col-span-4 gap-2 p-2 bg-gradient-to-l from-zinc-950/80 to-zinc-950/50 rounded-br-xl">
                    <Link className="hover:brightness-75 transition-all" href='X' target="_blank">
                      <h3 className="font-semibold md:text-start text-end">Nome do Time</h3>
                    </Link>
                    <Link className="hover:brightness-75 transition-all" href='X' target="_blank">
                      <img className="w-10 h-10 object-cover rounded-full" src="https://storage.googleapis.com/uanted.appspot.com/PhotoUser/7abb23cd-324c-4818-a1e1-efdfe0e33f47.webp" />
                    </Link>
                  </div>
                </div>

              </div>

              <div className="flex items-center flex-col">
                <div className="flex w-full justify-between items-center bg-zinc-800/70 rounded-t-xl p-1 px-2">
                  <h4 className="flex gap-1 justify-center items-center "><Clock size={18} />18H</h4>
                  Fase de Grupos
                </div>

                <div className="grid grid-cols-9 rounded-xl w-full">
                  <div className="flex justify-center md:justify-start items-center col-span-9 md:col-span-4 gap-2 p-2 bg-gradient-to-r from-green-950/80 to-zinc-950/50">
                    <Link className="transition-all flex items-center group justify-center relative" href='X' target="_blank">
                      <img className="w-10 h-10 object-cover rounded-full brightness-[30%] opacity-70" src="https://storage.googleapis.com/uanted.appspot.com/PhotoUser/7abb23cd-324c-4818-a1e1-efdfe0e33f47.webp" />
                      <h3 className="absolute font-semibold shadow group-hover:brightness-50 transition-all">13</h3>
                    </Link>
                    <Link className="hover:brightness-75 transition-all" href='X' target="_blank">
                      <h3 className="font-semibold">Nome do Time</h3>
                    </Link>
                  </div>
                  <div className="bg-zinc-950/50 col-span-9 md:col-span-1 flex items-center justify-center p-2">
                    <h3 className="font-bold text-zinc-400">VS</h3>
                  </div>
                  <div className="flex justify-center md:justify-end items-center col-span-9 md:col-span-4 gap-2 p-2 bg-gradient-to-l from-zinc-950/80 to-zinc-950/50">
                    <Link className="hover:brightness-75 transition-all" href='X' target="_blank">
                      <h3 className="font-semibold md:text-start text-end brightness-[30%]">Nome do Time</h3>
                    </Link>
                    <Link className="transition-all flex items-center group justify-center relative" href='X' target="_blank">
                      <img className="w-10 h-10 object-cover rounded-full brightness-[30%] opacity-70" src="https://storage.googleapis.com/uanted.appspot.com/PhotoUser/7abb23cd-324c-4818-a1e1-efdfe0e33f47.webp" />
                      <h3 className="absolute font-semibold shadow group-hover:brightness-50 transition-all">5</h3>
                    </Link>
                  </div>
                </div>
                <div className="w-full">
                  <Button className="w-full h-auto bg-transparent rounded-t-none text-zinc-200 bg-gradient-to-r hover:bg-zinc-600 from-zinc-800 md:from-green-950/80 md:via-zinc-950/50 to-zinc-800 md:to-zinc-950/80 py-1">Ver Partida</Button>
                </div>
              </div>


            </div>
          </div>
 
        </div> */}

      </div>
    </div>
  );
}