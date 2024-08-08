import { TeamInfos } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
interface InformacoesProps {
  Team: TeamInfos | null;
}

export default function TeamPlayer({ Team }: InformacoesProps) {

  return (
    <>
      {Team &&
        <Link href={`/times/${Team.url}`} className='flex items-center gap-2 rounded-xl cursor-pointer group hover:bg-zinc-800 '>
          <Image
            className='rounded-2xl object-cover w-10 h-10 group-hover:translate-x-1 transition-all'
            src={Team.logo}
            alt={Team.logo}
            width={40}
            height={40}
          />
          <h3 className="font-base group-hover:text-zinc-300">{Team.name}</h3>
        </Link>
      }
    </>
  );
}