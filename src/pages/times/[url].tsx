import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ValorantIcon } from "@/components/icons";
import { LockKeyhole, UnlockKeyhole, Users } from "lucide-react";
import Image from "next/image";
import { firestore } from '@/firebase/firebaseAdmin';
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

type TabType = 'players' | 'partidas' | 'campeonatos';

const TimePage = ({ user, team, ValueUrl }: TeamProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('players');
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const { tab } = router.query;
  const { setUser } = useUser();
  const { team_players } = useTeam();
  const playerCount = Object.keys(team_players).length;

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
      <TeamNotFound ValueUrl={ValueUrl} />
    );
  }

  return (
    <section className="">
      <div className="relative bg-gradient-to-br from-Roxo/70 via-transparent">
        <div className="container px-3 pt-36">
          <div className="flex justify-between items-center bg-gradient-to-l from-zinc-900 backdrop-blur-xl rounded-xl">
            <Image className="rounded-l-xl" src={team.logo} width={200} height={200} alt={team.name} />
            <div className="flex items-center flex-col justify-center">
              <h1 className="font-semibold text-3xl mb-1">{team.name}</h1>
              <div className="flex gap-2">
                <p className="flex items-center gap-2"><Users size={16} />{playerCount} Players</p>
                <p className="flex gap-2">| <ValorantIcon /></p>
              </div>
            </div>
            <div className="flex flex-col gap-3 mr-3">

              {user && user.uid == team.owner && <EditarTime />}

              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-center gap-1 p-1 bg-zinc-800 rounded-xl">
                  {team.privacy === 'private' ? <LockKeyhole size={18} /> : <UnlockKeyhole size={18} />}
                  <h3>Time {team.privacy === 'private' ? 'Privado' : 'Público'}</h3>
                </div>

                {user && user.activeTeamId && user.uid !== team.owner && <MyTeamPlayer user={user} team={team} players={team_players} />}

                {user && !user.activeTeamId && <ComeIn team={team} user={user} />}

              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-t pt-16 pb-32 from-zinc-950 from-55%">
          <div className="container px-3">
            <div className='w-full'>
              <div className='flex border border-zinc-400/20 bg-zinc-950/30 rounded-xl'>
                <TabNavigation activeTab={activeTab} handleTabChange={handleTabChange} />
              </div>
            </div>

            {activeTab === 'players' && <PlayersDoTime />}
            {activeTab === 'partidas' && <PartidasDoTime />}
            {activeTab === 'campeonatos' && <CampeonatosDoTime />}

          </div>
        </div>
      </div>
    </section>
  );
};

const Team = ({ user, team, team_players, ValueUrl }: TeamProps) => {
  return (
    <TeamProvider user={user} team={team} team_players={team_players} >
      <TimePage user={user} team={team} team_players={team_players} ValueUrl={ValueUrl} />
    </TeamProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const user = await withUser(context);
  console.log(user)
  const url = params?.url;

  if (!url || typeof url !== 'string') {
    return {
      props: {
        ValueUrl: url || null,
        user,
        team: null,
        players: [],
      },
    };
  }

  try {
    const teamSnapshot = await firestore.collection('teams').where('url', '==', url).limit(1).get();

    if (teamSnapshot.empty) {
      return {
        props: {
          ValueUrl: url,
          user,
          team: null,
          players: [],
        },
      };
    }


    const teamDoc = teamSnapshot.docs[0];
    const teamData = teamDoc.data();
    const serializedTeamData = {
      ...teamData,
      createdAt: teamData.createdAt ? teamData.createdAt.toDate().toISOString() : null,
    };

    const playersSnapshot = await teamDoc.ref.collection('players')
      .where('status', '==', 'active')
      .get();

    const playersData = await Promise.all(playersSnapshot.docs.map(async playerDoc => {
      const playerData = playerDoc.data();
      const playerId = playerData.playerId;

      const fullPlayerDoc = await firestore.collection('players').doc(playerId).get();
      const fullPlayerData = fullPlayerDoc.data();

      return {
        ...fullPlayerData,
        playerId: playerId,
        createdAt: playerData.createdAt ? playerData.createdAt.toDate().toISOString() : null,
        leaveDate: playerData.leaveDate ? playerData.leaveDate.toDate().toISOString() : null,
        roles: playerData.roles,
      };
    }));
    return {
      props: {
        user,
        team: serializedTeamData,
        team_players: playersData,
        ValueUrl: url,
      },
    };
  } catch (error) {
    console.error('Error fetching team data:', error);

    return {
      props: {
        ValueUrl: url,
        user,
        team: null,
        players: [],
      },
    };
  }
};
export default React.memo(Team);
