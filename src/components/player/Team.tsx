import { User } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
interface InformacoesProps {
  user: User | null;
}

export default function Team({ user }: InformacoesProps) {

  return (
    <Link href={'/times/' + user?.urlTeam || "#"} className='flex items-center gap-2 rounded-xl cursor-pointer group hover:bg-zinc-800 '>
      <Image
        className='rounded-2xl object-cover w-10 h-10 group-hover:translate-x-1 transition-all'
        src={user?.logoTeam || ''}
        alt={user?.nameTeam || ''}
        width={40}
        height={40}
      />
      <h3 className="font-base group-hover:text-zinc-300">{user?.nameTeam || ''}</h3>
    </Link>
  );
}