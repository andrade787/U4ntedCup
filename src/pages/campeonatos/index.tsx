import TournamentCard from "@/components/campeonatos/cards/TournamentCard";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Tournament, User } from "@/lib/types";
import { GetServerSideProps } from "next";
import { withUser } from "@/lib/auth";
import { useUser } from "@/context/UserContext";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingCardTournament } from "@/components/campeonatos/Loading";
import SEO from "@/components/SEO";

interface Campeonatos {
  user: User | null;
}
export default function Campeonatos({ user }: Campeonatos) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const { setUser } = useUser();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch('/api/tournaments');
        if (!response.ok) {
          throw new Error('Ocorreu um erro ao buscar os campeonatos. Por favor, tente novamente mais tarde!');
        }
        const data: any[] = await response.json();

        // Convertendo as datas para strings formatadas
        const formattedData: Tournament[] = data.map((tournament) => ({
          ...tournament,
          startDate: new Date(tournament.startDate._seconds * 1000).toLocaleDateString('pt-BR'),
          endDate: new Date(tournament.endDate._seconds * 1000).toLocaleDateString('pt-BR'),
        }));

        setTournaments(formattedData);
      } catch (err) {
        setError('Ocorreu um erro ao buscar os campeonatos. Por favor, tente novamente mais tarde!');
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const filteredTournaments = tournaments.filter((tournament) =>
    tournament.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <SEO
        title="U4nted Cup | Campeonatos"
        description="Participe dos melhores campeonatos de CS2 e Valorant na U4nted Cup. Jogue, compita e ganhe prêmios incríveis!"
        keywords="campeonatos, CS2, Valorant, eSports, U4nted Cup, torneios de jogos"
        author="U4nted Cup"
        url="https://www.u4ntedcup.com.br"
        image="https://www.u4ntedcup.com.br/assets/images/tournaments.webp"
        twitterHandle="u4ntedcup"
      />
      <div className="pt-32 bg-gradient-to-br from-Roxo/70 via-transparent">
        <div className="container px-3">
          <div className="flex items-center relative rounded-xl min-h-52 mb-10 -z-20 w-full bg-cover bg-center bg-[url('/assets/images/timesbg.webp')]">
            <div className="bg-gradient-to-r from-zinc-900 w-full -z-10 h-full absolute rounded-xl"></div>
            <div className="flex flex-col p-5 w-full relative">
              <h3 className="text-4xl font-semibold">Campeonatos</h3>
              <p className="font-medium text-base">Confira abaixo, todos os campeonatos da U4nted Cup</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-Roxo/10 to-zinc-900 backdrop-blur-xl w-full p-2 px-4 rounded-xl mb-7 flex justify-between items-center">
            <div>
              <h3><span className="font-semibold">{filteredTournaments.length}</span> Campeonatos Encontrados</h3>
            </div>
            <div className="p-4">
              <div className="relative">
                <SearchIcon className="absolute left-2 top-2.5 h-4 w-4" />
                <Input
                  className="flex h-9 w-full pl-8 bg-zinc-900"
                  placeholder="Procurar por campeonato"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-5">

            {loading && <LoadingCardTournament />}

            {error && <p>{error}</p>}

            {!loading && filteredTournaments && filteredTournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                status={tournament.status}
                startDate={tournament.startDate}
                endDate={tournament.endDate}
                title={tournament.name}
                prize={`R$${tournament.prize} Em Prêmios`}
                imageUrl={tournament.imageCamp}
                tournamentLink={`/campeonatos/${tournament.campUrl}`}
              />
            ))}
          </div>
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
