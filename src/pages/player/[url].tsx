import { GetServerSideProps } from 'next';
import { firestore } from '@/firebase/firebaseAdmin';
import { withUser } from '@/lib/auth';
import { useRouter } from 'next/router';
import { ValorantIcon } from '@/components/icons/ValorantIcon';
import { Cs2Icon } from '@/components/icons/Cs2Icon';
import { Button } from '@/components/ui/button';
import { ListCollapse, User as UserIcon, Trophy } from 'lucide-react';
import EditPlayer from '../../components/player/edit/EditPlayer';
import { EditCapa } from '../../components/player/edit/EditCapa';
import React, { useEffect } from 'react';
import { Campeonatos, Informacoes, Partidas } from '@/components/player/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { PlayerProps } from '@/lib/types';
import { PlayerProvider, usePlayer } from '@/context/PlayerContext';
import { useUser } from "@/context/UserContext";
import { User } from "@/lib/types";


interface Props {
  user: User | null;
}
const PlayerPageContent = ({ user }: Props) => {
  const { setUser } = useUser();
  const { isOwner, playerData, handleTabClick, tabRef } = usePlayer();
  const router = useRouter();
  const activeTab = router.query.tab as string || 'informacoes';
  const initialName = playerData?.nickname.match(/(\b\S)?/g)?.join("").match(/(^\S|\S$)?/g)?.join("").toUpperCase();
  console.log(playerData)
  useEffect(() => {
    if (user) {
      setUser(user);
      console.log(user)
    }
  }, [user, setUser]);

  if (!playerData) {
    return <div>Player not found</div>;
  }

  return (
    <div className='bg-gradient-to-br from-Roxo/70 via-transparent pb-20'>
      <section className='flex pt-32'>
        <div className='container px-4'>
          <div className="relative rounded-xl w-full pt-10 pb-10">
            <div
              className={`relative flex justify-between rounded-xl p-5 pt-10 pb-10 w-full ${playerData.capaUrl ? '' : 'from-Roxo/80 bg-gradient-to-r'}`}
              style={{
                backgroundImage: playerData.capaUrl ? `url('${playerData.capaUrl}')` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {playerData.capaUrl &&
                <div className="absolute z-10 inset-0 from-zinc-900 bg-gradient-to-r rounded-lg"></div>
              }
              <div className='flex items-center gap-5 w-full z-20'>
                <Avatar className='w-48 h-48 '>
                  <AvatarImage className='w-full object-cover' src={playerData.photoURL} />
                  <AvatarFallback className='bg-zinc-900/70 text-6xl font-semibold'>{initialName}</AvatarFallback>
                </Avatar>
                <div className='flex justify-between items-center w-full'>
                  <div>
                    <h3 className='text-2xl font-semibold'>{playerData.nickname}</h3>
                    <h4 className='text-xl font-normal text-white/80'>{playerData.name}</h4>
                    <div className='flex'>
                      {playerData.valorant && <ValorantIcon size={30} color='text-white' />}
                      {playerData.cs2 && <Cs2Icon size={30} color='text-white' />}
                    </div>
                  </div>
                  <div className='flex flex-col gap-3'>
                    {isOwner &&
                      <>
                        <EditPlayer />

                        <EditCapa capaUrl={playerData.capaUrl} />
                      </>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className='container px-3 mt-10 flex gap-5'>
          <div className='flex flex-col w-1/5'>
            <div className='border bg-zinc-950/30 rounded-xl'>
              <Button
                variant={activeTab === 'informacoes' ? 'roxo' : 'ghost'}
                className={`w-full hover:bg-zinc-900/60 text-base ${activeTab === 'informacoes' ? 'hover:bg-Roxo rounded-b-none' : ''}`}
                onClick={() => handleTabClick('informacoes')}
              >
                <UserIcon size={20} className='mr-2' />Informações
              </Button>
              <Button
                variant={activeTab === 'partidas' ? 'roxo' : 'ghost'}
                className={`w-full hover:bg-zinc-900/60 text-base ${activeTab === 'partidas' ? 'hover:bg-Roxo' : ''}`}
                onClick={() => handleTabClick('partidas')}
              >
                <ListCollapse size={20} className='mr-2' /> Partidas
              </Button>
              <Button
                variant={activeTab === 'campeonatos' ? 'roxo' : 'ghost'}
                className={`w-full hover:bg-zinc-900/60 text-base ${activeTab === 'campeonatos' ? 'hover:bg-Roxo' : ''}`}
                onClick={() => handleTabClick('campeonatos')}
              >
                <Trophy size={20} className='mr-2' /> Campeonatos
              </Button>
            </div>
          </div>
          <div className='flex flex-1 flex-col'>
            <div ref={tabRef}>
              {activeTab === 'informacoes' && (
                <Informacoes user={user} />
              )}
              {activeTab === 'partidas' && (
                <Partidas />
              )}
              {activeTab === 'campeonatos' && (
                <Campeonatos />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const PlayerPage: React.FC<PlayerProps> = ({ playerData, user }) => {
  return (
    <PlayerProvider playerData={playerData} user={user}>
      <PlayerPageContent user={user} />
    </PlayerProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await withUser(context);
  const { url } = context.params as { url: string };

  if (!url) {
    return {
      props: {
        playerData: null,
      },
    };
  }

  try {
    const userDocRef = firestore.collection("players").where("url", "==", url).limit(1);
    const userSnapshot = await userDocRef.get();
    if (userSnapshot.empty) {
      return {
        props: {
          playerData: null,
        },
      };
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    const gameAccountsSnapshot = await firestore
      .collection(`players/${userDoc.id}/game_account`)
      .get();

    const gameAccounts = gameAccountsSnapshot.empty
      ? null
      : gameAccountsSnapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        if (data.last_update) {
          data.last_update = data.last_update.toDate().toISOString();
        }
        acc[doc.id] = data;
        return acc;
      }, {} as { [key: string]: any });


    return {
      props: {
        user,
        playerData: {
          id: userDoc.id,
          name: userData.firstName || "Indefinido",
          photoURL: userData.photoURL || null,
          nickname: userData.nickname || "Sem NickName",
          url: userData.url || null,
          capaUrl: userData.capaUrl || null,
          assinaturaPlayer: userData.assinaturaPlayer || null,
          gameAccounts,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      props: {
        playerData: null,
      },
    };
  }
};

export default React.memo(PlayerPage);
