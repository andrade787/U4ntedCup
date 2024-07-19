import { GetServerSideProps } from "next";
import { withUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import PlayersUantedCup from "@/components/player/Players";
import { User } from "@/lib/types";

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
    <section className='flex pt-32'>
      <div className="container px-4">
        <div className="from-Roxo/80 to-zinc-900 to-40% bg-gradient-to-br w-full p-2 px-4 rounded-xl mb-7 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-2xl">Players</h3>
            <p className="text-zinc-200">Confira todos os jogadores da Uanted Cup</p>
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
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await withUser(context);
  return {
    props: { user },
  };
};

export default AnotherPage;
