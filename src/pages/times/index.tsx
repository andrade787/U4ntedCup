import { useUser } from "@/context/UserContext";
import { withUser } from "@/lib/auth";
import { GetServerSideProps } from "next";
import { useEffect } from "react";
import { User } from "@/lib/types";
import Image from "next/image";
import { ValorantIcon } from "@/components/icons";
import { Frown, SearchIcon, User2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
interface TimesProps {
  user: User | null;
}

export default function Times({ user }: TimesProps) {
  const { setUser } = useUser();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return (
    <div className="bg-gradient-to-br pt-32  from-blue-100 via-transparent dark:from-Roxo/70 dark:via-transparent">
      <div className="container px-3">

        <div className="flex items-center relative rounded-xl min-h-52 mb-10 -z-20 w-full bg-cover bg-center bg-[url('/assets/images/timesbg.webp')]">
          <div className="bg-gradient-to-r from-zinc-900 w-full -z-10 h-full absolute rounded-xl"></div>
          <div className="flex flex-col p-5 w-full relative">
            <h3 className="text-4xl font-semibold">Times</h3>
            <p className="font-medium text-base">Confira abaixo, todos os times do nosso campeonato</p>
          </div>
        </div>


        <section>
          <div className="bg-gradient-to-r from-Roxo/10 to-zinc-900 backdrop-blur-xl w-full p-2 px-4 rounded-xl mb-7 flex justify-between items-center">
            <div>
              <h3><span className="font-semibold">10</span> Times Encontrados</h3>
            </div>
            <div className="p-4">
              <div className="relative">
                <SearchIcon className="absolute left-2 top-2.5 h-4 w-4" />
                <Input className="flex h-9 w-full pl-8 bg-zinc-900" placeholder="Pesquisar por time" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">

            <Skeleton className="flex flex-1 min-w-96 relative bg-zinc-900 rounded-xl">
              <Skeleton className="rounded-l-xl bg-zinc-700 w-28 h-28" />
              <div className="flex justify-between items-center w-full p-3 gap-1">
                <Skeleton className="rounded-xl bg-zinc-700 w-36 h-5" />
                <Skeleton className="rounded-xl bg-zinc-700 w-12 h-12" />
              </div>
            </Skeleton>
            <div className="flex gap-2 items-center justify-center w-full p-5 bg-zinc-900 hover:bg-zinc-800 transition-colors rounded-xl animate-in fade-in-30">
              <Frown size={45} /> <h2 className="text-xl">Nenhum time cadastrado até o momento..</h2>
            </div>
            <Link href='#' className="flex flex-1 min-w-96 relative group bg-zinc-900 hover:bg-zinc-800 transition-colors rounded-xl animate-in fade-in-30 group">
              <Image className="rounded-l-xl group-hover:-translate-x-2 transition-all bg-zinc-800" alt="Nome Time" width={100} height={100} src="/assets/images/tag_novo_tapa_buraco.jpg" />
              <div className="flex justify-between items-center w-full p-3 gap-1">
                <h3 className="font-semibold text-xl group-hover:-translate-x-2 transition-all">Nome do Time</h3>
                <ValorantIcon size={50} />
              </div>
            </Link>
          </div>
        </section>

      </div>
    </div>

  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await withUser(context);
  return {
    props: { user },
  };
};