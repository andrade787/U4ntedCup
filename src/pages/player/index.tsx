import { GetServerSideProps } from "next";
import { withUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import PlayersUantedCup from "@/components/player/Players";
import { User } from "@/lib/types";
import SEO from "@/components/SEO";

interface AnotherPageProps {
  user: User | null;
}

const AnotherPage = ({ user }: AnotherPageProps) => {
  const { setUser } = useUser();
  const [search, setSearch] = useState<string>("");
  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);






  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <>
      <SEO
        title="Players | U4nted Cup"
        description="Confira os melhores jogadores de CS2 e Valorant da U4nted Cup."
        keywords="campeonatos, CS2, Valorant, eSports, U4nted Cup, torneios de jogos"
        author="U4nted Cup"
        url="https://www.u4ntedcup.com.br/player"
        image="https://www.u4ntedcup.com.br/assets/images/PlayerBG.webp"
        twitterHandle="u4ntedcup"
      />
      <section className='flex pt-32 bg-gradient-to-br from-blue-100 via-transparent dark:from-Roxo/70 dark:via-transparent'>
        <div className="container px-3">


          <div className="flex items-center relative rounded-xl mb-10 min-h-52 -z-10 w-full bg-cover bg-top bg-[url('/assets/images/PlayerBG.webp')]">
            <div className=" bg-gradient-to-r from-zinc-900 w-full -z-10  h-full absolute rounded-xl"></div>
            <div className="flex flex-col p-5 w-full relative">
              <h3 className="text-4xl font-semibold z-30">Players</h3>
              <p className="font-medium text-base">Confira abaixo, todos os players da U4nted Cup</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-Roxo/10 to-zinc-900 backdrop-blur-xl w-full p-2 px-4 rounded-xl mb-7 flex justify-between items-center">
            <div>
              <h3><span className="font-semibold"></span> Players Encontrados</h3>
            </div>
            <div className="p-4">
              <div className="relative">
                <SearchIcon className="absolute left-2 top-2.5 h-4 w-4" />
                <Input
                  className="flex h-9 w-full pl-8 bg-zinc-900"
                  placeholder="Pesquisar por nick"
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
          <PlayersUantedCup search={search} />
        </div>
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await withUser(context);
  return {
    props: { user },
  };
};

export default AnotherPage;
