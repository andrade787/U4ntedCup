import Link from "next/link";
import Image from "next/image";
import LoadingPartidasdoTime from "./Loading";

export default function CardPartidastime() {
  return (
    <>
      <LoadingPartidasdoTime />
      <Link href='#' target="_blank" className="flex relative bg-zinc-900 hover:bg-zinc-800 transition-colors rounded-xl w-full animate-in zoom-in">
        <div className="absolute rounded-xl opacity-50 z-10 w-full h-full bg-win-gradient" />
        <div className="flex w-full z-20 p-2 justify-evenly relative">
          <div className="flex flex-col items-center">
            <Image className="rounded-xl" src="/assets/images/tag_novo_tapa_buraco.jpg" width={100} height={100} alt="Nome Time" />
            <h3 className="font-medium">Tapa Buraco</h3>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center">
              <div className="flex gap-5 mb-2">
                <p className="bg-zinc-800 text-xl font-medium w-10 text-center p-1 rounded-xl">13</p>
                <p className="bg-zinc-800 text-xl font-medium w-10 text-center p-1 rounded-xl">11</p>
              </div>
              <div className=""><h4 className="text-sm text-center">23/07/2024</h4> <h4 className="text-xs text-center">Fase de Grupos</h4></div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Image className="rounded-xl" src="/assets/images/tag_novo_tapa_buraco.jpg" width={100} height={100} alt="Nome Time" />
            <h3 className="font-medium">Nome do outro</h3>
          </div>
        </div>
      </Link>
    </>
  );
}