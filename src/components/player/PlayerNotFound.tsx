import { Frown } from "lucide-react";
import Link from "next/link";

export default function PlayerNotFound() {
  return (
    <div className="relative bg-gradient-to-br from-Roxo/70 via-transparent">
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center justify-center w-full max-w-xl rounded-xl bg-zinc-800/50 p-5 m-3">
          <Frown size={100} />
          <h1 className="text-3xl text-zinc-100 font-medium text-center mb-2">
            <span className="font-semibold">Nenhum player</span> encontrado com essa url.
          </h1>
          <p className="text-zinc-300 text-center leading-7">
            O jogador pode ter mudado de nome ou ter sido removido.
            Tente procurar novamente na aba <Link href="/player" className="font-semibold bg-zinc-700/50 hover:bg-zinc-700/20 transition-colors rounded-xl p-1">Players</Link> e veja se consegue encontrá-lo pelo nome que você lembra.
          </p>
        </div>
      </div>
    </div>
  );
}