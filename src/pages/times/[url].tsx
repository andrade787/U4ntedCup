import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ValorantIcon } from "@/components/icons";
import { LockKeyhole, UnlockKeyhole, Users } from "lucide-react";
import Image from "next/image";
import EditarTime from "@/components/times/PaginaDoTime/editartime/EditarTime";
import { TabNavigation, PlayersDoTime, PartidasDoTime, CampeonatosDoTime, TeamNotFound } from '@/components/times/PaginaDoTime/tabs';
import { GetServerSideProps } from "next";
import { withUser } from "@/lib/auth";
import { TeamProps } from "@/lib/types";
import { useUser } from "@/context/UserContext";
import ComeIn from "@/components/times/PaginaDoTime/comein";
import { TeamProvider, useTeam } from "@/context/TeamContext";
import React from "react";
import MyTeamPlayer from "@/components/times/PaginaDoTime/editartime/MyTeamPlayer";
import { getTeam, getTeamPlayers } from "@/controllers/teams";
import SEO from "@/components/SEO";

type TabType = 'players' | 'partidas' | 'campeonatos';

const TimePage = ({ user, team }: TeamProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('players');
  const [isReady, setIsReady] = useState(false);
  const { setUser, playerTeam, playerTeamLoading } = useUser();
  const { players } = useTeam();

  let playerCount = null;
  if (players) {
    playerCount = Object.keys(players).length;
  }

  const router = useRouter();
  const { tab } = router.query;

  const userTeam = playerTeam?.id == team.id; // valido se é o time do usuario logado
  const userOwnerTeam = user && user.uid == team.owner; // valido se o usuario logado é o dono do time
  const joinTeam = user && !playerTeamLoading && !playerTeam && playerCount && playerCount < 6 && team.privacy == 'public';


  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  useEffect(() => {
    const validTabs: TabType[] = ['players', 'partidas', 'campeonatos'];
    setActiveTab(validTabs.includes(tab as TabType) ? (tab as TabType) : 'players');
    setIsReady(true);
  }, [tab]);

  const handleTabChange = (newTab: TabType) => {
    if (!team?.url) {
      return;
    }

    router.push({
      pathname: `/times/${team.url}`,
      query: { tab: newTab },
    }, undefined, { shallow: true });
    setActiveTab(newTab);
  };

  if (!isReady) {
    return null;
  }

  if (!team) {
    return (
      <TeamNotFound />
    );
  }

  return (
    <>
      <SEO
        title={`${team.name || 'Time Não Encontrado'} | U4nted Cup`}
        description={`Confira o time ${team?.name} da U4nted Cup. Esses são craques!`}
        keywords="campeonatos, CS2, Valorant, eSports, U4nted Cup, torneios de jogos"
        author="U4nted Cup"
        url={`https://www.u4ntedcup.com.br/times/${team.url}`}
        image={team.logo}
        twitterHandle="u4ntedcup"
      />


      <section className="">
        <div className="relative bg-gradient-to-br from-Roxo/70 via-transparent">
          <div className="container px-3 pt-36">
            <div className="flex max-md:flex-col max-md:flex-wrap justify-between items-center bg-gradient-to-l from-zinc-900 backdrop-blur-xl rounded-xl">
              <div className="flex items-center w-full">
                <Image className="rounded-l-xl max-md:w-full max-md:h-44 object-cover max-md:mb-3" src={team.logo} width={200} height={200} alt={team.name} />
                <div className="flex items-center flex-col justify-center w-full">
                  <h1 className="font-semibold text-3xl mb-1 text-center">{team.name}</h1>
                  <div className="flex gap-2">
                    <p className="flex items-center gap-2"><Users size={16} />{playerCount} Players</p>
                    <p className="flex gap-2">| <ValorantIcon /></p>
                  </div>
                </div></div>

              <div className="flex items-center md:flex-col gap-3 max-md:w-full min-w-40 r-3 p-2">

                {user && userOwnerTeam && <EditarTime />}

                <div className="flex flex-col gap-2 flex-1">

                  <div className="flex items-center justify-center gap-1 p-2 bg-zinc-800 rounded-xl">
                    {team.privacy === 'private' ? <LockKeyhole size={18} /> : <UnlockKeyhole size={18} />}
                    <h3>Time {team.privacy === 'private' ? 'Privado' : 'Público'}</h3>
                  </div>

                  {!playerTeamLoading && user && user.uid !== team.owner && userTeam && <MyTeamPlayer user={user} team={team} players={players} />}

                  {/*                 {joinTeam && <ComeIn team={team} user={user} />}*/}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-t max-md:pt-8 pt-16 pb-32 from-zinc-950 from-55%">
            <div className="container px-3">
              <div className='w-full'>
                <div className='flex flex-wrap border border-zinc-400/20 bg-zinc-950/30 rounded-xl'>
                  <TabNavigation activeTab={activeTab} handleTabChange={handleTabChange} />
                </div>
              </div>

              {activeTab === 'players' && <PlayersDoTime players={players} user={user} team={team} />}
              {activeTab === 'partidas' && <PartidasDoTime />}
              {activeTab === 'campeonatos' && <CampeonatosDoTime />}

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const Team = ({ user, team, players }: TeamProps) => {
  return (
    <TeamProvider user={user} team={team} players={players} >
      <TimePage user={user} team={team} players={players} />
    </TeamProvider>
  );
};



export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const user = await withUser(context); // Supondo que você tenha uma função withUser para obter o usuário

  const url = params?.url;
  if (!url || typeof url !== 'string') {
    return {
      props: {
        user,
        team: null,
        players: [],
      },
    };
  }

  try {
    // Obtém as informações do time
    const team = await getTeam(url, 'url');
    // Obtém os jogadores do time
    const players = await getTeamPlayers(team.id, 'active'); // Pode ajustar o 'active' conforme necessário
    console.log(players)
    return {
      props: {
        user,
        team,
        players,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        user,
        team: null,
        players: [],
      },
    };
  }
};

export default React.memo(Team);
