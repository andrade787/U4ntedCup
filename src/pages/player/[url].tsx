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
import SEO from '@/components/SEO';
import PlayerNotFound from '@/components/player/PlayerNotFound';


interface Props {
  user: User | null;
}
const PlayerPageContent = ({ user }: Props) => {
  const { setUser } = useUser();
  const { isOwner, playerData, handleTabClick, tabRef } = usePlayer();
  const router = useRouter();
  const activeTab = router.query.tab as string || 'informacoes';
  const initialName = playerData?.nickname.match(/(\b\S)?/g)?.join("").match(/(^\S|\S$)?/g)?.join("").toUpperCase();
  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  if (!playerData) {
    return <PlayerNotFound />;
  }
  console.log(playerData)

  return (
    <>
      <SEO
        title={`${playerData.nickname} | U4nted Cup`}
        description={`${playerData.nickname} está participando dos mais emocionantes campeonatos de CS2 e Valorant na U4nted Cup. Jogue, compita e conquiste prêmios incríveis!`}
        keywords="campeonatos, CS2, Valorant, eSports, U4nted Cup, torneios de jogos, competição, prêmios"
        author="U4nted Cup"
        url={`https://www.u4ntedcup.com.br/player/${playerData.url}`}
        image={`${playerData.photoURL || 'https://www.u4ntedcup.com.br/assets/images/uanted_thumb.webp'}`}
        twitterHandle="u4ntedcup"
      />
      <div className='bg-gradient-to-br from-Roxo/70 via-transparent pb-20'>
        <section className='flex max-md:pt-20 pt-32'>
          <div className='container px-3'>
            <div className="relative rounded-xl w-full pt-10 max-md:pb-0 pb-10">
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
                <div className='flex max-md:flex-col items-center gap-5 w-full z-20'>
                  <Avatar className='w-48 h-48 '>
                    <AvatarImage className='w-full object-cover' src={playerData.photoURL} />
                    <AvatarFallback className='bg-zinc-900/70 text-6xl font-semibold'>{initialName}</AvatarFallback>
                  </Avatar>
                  <div className='flex max-md:justify-center justify-between items-center w-full'>
                    <div>
                      <h3 className='text-2xl font-semibold'>{playerData.nickname}</h3>
                      <h4 className='text-xl font-normal text-white/80'>{playerData.firstName}</h4>
                      <div className='flex'>
                        {/*      {playerData.valorant && <ValorantIcon size={30} color='text-white' />}
                        {playerData.cs2 && <Cs2Icon size={30} color='text-white' />} */}
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
            <div className='w-full flex max-md:flex-wrap max-md:flex-col gap-5'>
              <div className='flex flex-col md:w-1/5'>
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
          </div>
        </section>
      </div>
    </>
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

  let playerData = null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/player/${url}?type=url`);
    if (response.ok) {
      playerData = await response.json();
    }
  } catch (error) {
    console.error(error);
  }

  if (!playerData) {
    return {
      props: {
        playerData: null,
        user
      },
    };
  }

  return {
    props: {
      playerData,
      user
    },
  };

};

export default React.memo(PlayerPage);
