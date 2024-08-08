import { GetServerSideProps } from "next";
import { withUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Tournament, User } from "@/lib/types";
import { BadgeDollarSign, Calendar, Dot, Goal, Star, Twitch, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ValorantIcon } from "@/components/icons/ValorantIcon";
import { DiscordIcon } from "@/components/icons/DiscordIcon";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion"
import { CampeonatosBackground, textVariants } from "@/lib/framer/homepage";
import { Cs2Icon } from "@/components/icons";
import SEO from "@/components/SEO";
import TournamentCard from "@/components/campeonatos/cards/TournamentCard";
import { LoadingCardTournament } from "@/components/campeonatos/Loading";


interface HomePageProps {
  user: User | null;
}

const HomePage = ({ user }: HomePageProps) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { setUser } = useUser();
  const numberOfLines = 16;
  const spacing = 6;

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

  return (
    <>
      <SEO
        title="U4nted Cup"
        description="Participe dos melhores campeonatos de CS2 e Valorant na U4nted Cup. Jogue, compita e ganhe prêmios incríveis!"
        keywords="campeonatos, CS2, Valorant, eSports, U4nted Cup, torneios de jogos"
        author="U4nted Cup"
        url="https://www.u4ntedcup.com.br"
        image="https://www.u4ntedcup.com.br/assets/images/uanted_thumb.webp"
        twitterHandle="u4ntedcup"
      />
      <section className="bg-RoxoEscuro pb-32 relative z-10 pt-28 w-full">
        <div className="absolute w-[400px] h-[300px] transform rotate-90 top-0 left-0 rounded-[150px] bg-gradient-to-r from-Roxo to-Roxo filter blur-[255.5px] -z-10"></div>
        <div className="absolute w-[400px] h-[300px] transform rotate-90 top-0 right-0 rounded-[150px] bg-gradient-to-r from-Roxo to-Roxo filter blur-[255.5px] -z-10"></div>

        <div className="container px-3 md:pt-32 md:pb-14">
          <div className="flex flex-wrap gap-6 justify-between w-full">
            <div className="md:w-5/12">

              <h4 className="text-6xl max-md:text-4xl max-md:text-center max-md:leading-snug font-bold leading-snug">
                LIGA DE <br />
                <span className="bg-Roxo px-2 rounded-xl bg-gradient-to-r from-Roxo via-RoxoClaro/90 to-Roxo bg-[length:200%_200%]">
                  CAMPEONATOS
                </span>
                <br /> AMADORES
              </h4>
              <p className="text-lg w-full max-md:text-center mt-4">
                Experiência única e imersiva, feita para você sentir a adrenalina e emoção de um campeonato profissional!
              </p>
              <div className="mt-4 w-full">
                <Link href='/cadastro/' className="flex items-center justify-center cursor-pointer font-semibold text-xl bg-gradient-to-r from-Roxo/50 via-Roxo to-Roxo/50 text-white py-3 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105">
                  <Goal className="mr-2" /> FAÇA SUA CONTA AGORA
                </Link>
              </div>

            </div>




            <div className="absolute top-0 left-1/2 bottom-0 transform -translate-x-1/2 -z-10 ">
              <div className="absolute top-0 left-0 bottom-0 right-0 transform -translate-x-1/2 -z-10 max-md:hidden w-[520px] h-[950px]">
                <Image
                  className='w-full'
                  src='/assets/images/bg-1.webp'
                  alt='imagem'
                  width={517}
                  height={962}
                />
              </div>
              <div className="w-1/4">
                <div className="absolute max-md:hidden bottom-0 left-0 top-60 transform -translate-x-2/5 w-[500px] h-[700px] -z-10">
                  <Image
                    className='w-full'
                    src='/assets/images/hero.webp'
                    alt='imagem'
                    width={587}
                    height={900}
                  />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/3">
              <div className="flex flex-col border rounded-xl p-2 bg-zinc-900/50">
                <h1 className="font-bold flex items-center gap-1 text-lg text-yellow-400">
                  <BadgeDollarSign className="text-yellow-400" /> Premiação Recente
                </h1>
                <hr className="my-2 border-yellow-400" />
                <div className="flex flex-col mt-2">
                  <a href="#" className="flex items-center hover:bg-zinc-800 w-full rounded-xl p-2 transition-colors cursor-pointer">
                    <Image
                      className='rounded-xl w-12 h-12 object-cover mr-2'
                      src='/assets/images/TheKnights.webp'
                      alt='imagem'
                      width={960}
                      height={960}
                    />
                    <div className="flex flex-col flex-grow">
                      <h2 className="text-lg font-semibold text-white">TheKnights</h2>
                      <p className="flex items-center text-gray-400 text-sm">1ª Edição | <ValorantIcon size={20} /> Valorant</p>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-sm font-semibold text-yellow-400">Prêmio</p>
                      <p className="text-lg font-bold text-green-400">R$ 400</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div className="max-md:hidden absolute inset-0 -z-30">
            <div className="absolute inset-0 grid grid-cols-16 gap-x-1">
              {[...Array(numberOfLines)].map((_, index) => (
                <div
                  key={index}
                  className={`line`}
                  style={{
                    left: `${spacing * (index + 1)}%`,
                  }}
                ></div>
              ))}
            </div>
            <div className="absolute inset-0 grid grid-rows-10 gap-y-1">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="line"></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pt-28 md:pb-28 max-md:pt-20 bg-background -top-12 z-20 relative">
        <div className="absolute w-full h-[90px] -top-9 bg-gradient-to-b from-RoxoEscuro to-background filter blur-[20px] -z-10"></div>
        <div className="container flex flex-wrap items-center px-3">
          <div className="md:w-1/2">

            <Image
              className='md:max-w-lg'
              src='/assets/images/about.webp'
              alt='imagem'
              width={647}
              height={526}
            />
          </div>
          <div className="md:w-1/2 w-full">
            <h1 className="font-bold text-4xl max-md:text-2xl max-md:text-center mb-2 w-full">O QUE É A U4NTED CUP</h1>
            <p className="leading-[1.5] font-normal text-[20px] w-full max-md:text-center">A U4NTED CUP chegou para agitar o cenário amador de esports, unindo jogadores de Counter-Strike 2 (CS2) e agora Valorant. Em um ambiente descontraído, a competição promete partidas emocionantes e a oportunidade perfeita para equipes amadoras brilharem.</p>
          </div>
        </div>
      </section>


      <section className="pt-10 pb-28 bg-background z-20 relative">
        <div className="container flex items-center border rounded-xl p-5">
          <div className="flex flex-col w-full">

            <div className="flex items-center justify-between mb-4">
              <h1 className="font-bold text-2xl md:text-4xl">CAMPEONATOS</h1>
              <Link href='/campeonatos'><Button variant='roxo'>Ver Todos</Button></Link>
            </div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">


              {loading && <LoadingCardTournament />}

              {error && <p>{error}</p>}

              {!loading && tournaments && tournaments.map((tournament) => (
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
      </section>


      <section>
        <div className="container px-3">
          <div className="bg-discord-gradient rounded-xl py-3 px-6 flex max-md:flex-col items-center">
            <div className="md:w-1/2">
              <h1 className="text-white text-4xl font-noto font-bold leading-none shadow-md mb-3">
                DISCORD DO CAMPEONATO
              </h1>
              <p className="text-lg">Em nosso servidor Discord, contamos com um bot personalizado que simplifica a organização da U4nted Cup. Com ele, os times têm salas personalizadas garantidas para todas as partidas do campeonato. Dessa forma, todos os participantes podem competir em um ambiente familiar e bem-organizado. Junte-se a nós e experimente a praticidade e a emoção deste campeonato!
              </p>
              <Link href='https://discord.gg/t7dxqNHH' target="_blank" className="flex items-center gap-2 w-full bg-white text-zinc-900 font-semibold rounded-xl p-2 mt-5 text-2xl justify-center cursor-pointer hover:bg-white/80 transition-colors"><DiscordIcon color="text-zinc-900" /> ACESSAR SERVIDOR</Link>
            </div>
            <div className="md:w-1/2">
              <Image
                className='relative top-4'
                src='/assets/images/discordimg.webp'
                alt='imagem'
                width={643}
                height={492}
              />
            </div>
          </div>
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

export default HomePage;
