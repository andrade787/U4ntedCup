import { Frown } from "lucide-react";
import Link from "next/link";
interface TeamNotFoundProps {
  ValueUrl: string | null;
}

export default function TeamNotFound({ ValueUrl }: TeamNotFoundProps) {
  return (
    <div className="relative bg-gradient-to-br from-Roxo/70 via-transparent">
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center justify-center w-full max-w-xl rounded-xl bg-zinc-800/50 p-5 m-3">
          <Frown size={100} />
          <h1 className="text-3xl text-zinc-100 font-medium text-center mb-2">
            Nenhum time encontrado para <span className="font-semibold">{ValueUrl}</span>
          </h1>
          <p className="text-zinc-300 text-center leading-7">
            O time pode ter mudado de nome ou sido removido.
            Tente procurar novamente na aba <Link href="/times" className="font-semibold bg-zinc-700/50 hover:bg-zinc-700/20 transition-colors rounded-xl p-1">Times</Link> e veja se consegue encontrá-lo pelo nome que você lembra.
          </p>
        </div>
      </div>
    </div>
  );
}