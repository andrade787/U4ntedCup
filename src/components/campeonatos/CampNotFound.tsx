import { Frown } from "lucide-react";
interface CampNotFoundProps {
  campUrl: string | null;
}

export default function CampNotFound({ campUrl }: CampNotFoundProps) {
  return (
    <div className="relative bg-gradient-to-br from-Roxo/70 via-transparent">
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center justify-center w-full max-w-xl rounded-xl bg-zinc-800/50 p-5 m-3">
          <Frown size={100} />
          <h1 className="text-3xl text-zinc-100 font-medium text-center mb-2">
            Nenhum campeonato com a url <span className="font-semibold">{campUrl}</span>
          </h1>
          <p className="text-zinc-300 text-center leading-7">
            Verifique se você acessou o campeonato pela URL corretamente.
          </p>
        </div>
      </div>
    </div>
  );
}