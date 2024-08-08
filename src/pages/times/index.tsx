// pages/times.tsx
import { useUser } from "@/context/UserContext";
import { GetServerSideProps } from "next";
import { useEffect, useState, useMemo, useCallback } from "react";
import { User } from "@/lib/types";
import Image from "next/image";
import { ValorantIcon } from "@/components/icons";
import { Frown, SearchIcon } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import debounce from "debounce";
import { withUser } from "@/lib/auth";
import SEO from "@/components/SEO";

interface Team {
  name: string;
  logo: string;
  url: string;
  privacy: string;
  createdAt: string;
}

interface TimesProps {
  user: User | null;
}

export default function Times({ user }: TimesProps) {
  const { setUser } = useUser();
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  const fetchTeams = useCallback(async () => {
    try {
      const response = await fetch('/api/teams/get-teams', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
        }),
      });

      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleSearch = debounce((term: string) => {
    setSearchTerm(term);
    setPage(1);
  }, 300);

  const filteredTeams = useMemo(() => {
    return teams.filter((team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teams, searchTerm]);

  const paginatedTeams = useMemo(() => {
    return filteredTeams.slice(0, page * itemsPerPage);
  }, [filteredTeams, page, itemsPerPage]);

  const handlePagination = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      <SEO
        title="Times | U4nted Cup"
        description="Confira os melhores times de CS2 e Valorant na U4nted Cup."
        keywords="campeonatos, CS2, Valorant, eSports, U4nted Cup, torneios de jogos"
        author="U4nted Cup"
        url="https://www.u4ntedcup.com.br/times"
        image="https://www.u4ntedcup.com.br/assets/images/timesbg.webp"
        twitterHandle="u4ntedcup"
      />
      <div className="pt-32 bg-gradient-to-br from-Roxo/70 via-transparent">
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
                {loading ? (<><div className="flex gap-1"> <Skeleton className="w-2 h-4 bg-zinc-700" /><Skeleton className="w-36 h-4 bg-zinc-700" /></div></>)
                  : (
                    <h3 className="animate-in zoom-in"><span className="font-semibold">{filteredTeams.length}</span> Times Encontrados</h3>
                  )}
              </div>
              <div className="p-4">
                <div className="relative">
                  {loading ? (<><Skeleton className="absolute left-2 top-2.5 h-4 w-4 bg-zinc-600" /><Skeleton className="flex h-9 w-56 pl-8 bg-zinc-800" /></>)
                    : (
                      <>
                        <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 animate-in zoom-in" />
                        <Input
                          className="flex h-9 w-full pl-8 bg-zinc-900 animate-in zoom-in-50"
                          placeholder="Pesquisar por time"
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                      </>
                    )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <Skeleton key={index} className="flex flex-1 md:min-w-96 relative bg-zinc-900 rounded-xl">
                    <Skeleton className="rounded-l-xl bg-zinc-700 w-28 h-28" />
                    <div className="flex justify-between items-center w-full p-3 gap-1">
                      <Skeleton className="rounded-xl bg-zinc-700 w-36 h-5" />
                      <Skeleton className="rounded-xl bg-zinc-700 w-12 h-12" />
                    </div>
                  </Skeleton>
                ))
              ) : paginatedTeams.length > 0 ? (
                paginatedTeams.map((team) => (
                  <Link key={team.url} href={'/times/' + team.url} className="flex flex-1 md:min-w-96 relative group bg-zinc-900 hover:bg-zinc-800 transition-colors rounded-xl animate-in zoom-in group">
                    <Image className="rounded-l-xl group-hover:-translate-x-2 transition-all bg-zinc-800" alt={team.name} width={100} height={100} src={team.logo} />
                    <div className="flex justify-between items-center w-full p-3 gap-1">
                      <h3 className="font-semibold text-xl group-hover:-translate-x-2 transition-all">{team.name}</h3>
                      <ValorantIcon size={50} />
                    </div>
                  </Link>
                ))
              ) : searchTerm ? (
                <div className="flex gap-2 items-center justify-center w-full p-5 bg-zinc-900 hover:bg-zinc-800 transition-colors rounded-xl animate-in fade-in-30">
                  <Frown size={45} /> <h2 className="text-xl">Nenhum time com o nome {searchTerm} encontrado</h2>
                </div>
              ) : (
                <div className="flex gap-2 items-center justify-center w-full p-5 bg-zinc-900 hover:bg-zinc-800 transition-colors rounded-xl animate-in fade-in-30">
                  <Frown size={45} /> <h2 className="text-xl">Nenhum time cadastrado até o momento..</h2>
                </div>
              )}
            </div>

            {filteredTeams.length > paginatedTeams.length && (
              <div className="flex justify-center mt-5">
                <Button
                  variant='outline'
                  className="flex items-center gap-1"
                  onClick={handlePagination}
                  disabled={page * itemsPerPage >= filteredTeams.length}
                >
                  Mostrar Mais Times
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await withUser(context);
  return {
    props: { user },
  };
};
