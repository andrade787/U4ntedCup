import { GetServerSideProps } from "next";
import { withUser } from "@/lib/auth";
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { User } from "@/lib/types";
import { Calendar, Dot, Goal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ValorantIcon } from "@/components/icons/ValorantIcon";
import { DiscordIcon } from "@/components/icons/DiscordIcon";
import Image from "next/image";

interface HomePageProps {
  user: User | null;
}

const HomePage = ({ user }: HomePageProps) => {
  const numberOfLines = 16;
  const spacing = 6; // initial spacing in percentage
  const { setUser } = useUser();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return (
    <>
      <section className="bg-RoxoEscuro pb-32 relative z-10 pt-28 w-full">
        <div className="absolute w-[400px] h-[300px] transform rotate-90 top-0 left-0 rounded-[150px] bg-gradient-to-r from-Roxo to-Roxo filter blur-[255.5px] -z-10"></div>
        <div className="absolute w-[400px] h-[300px] transform rotate-90 top-0 right-0 rounded-[150px] bg-gradient-to-r from-Roxo to-Roxo filter blur-[255.5px] -z-10"></div>
        <div className="absolute top-[150px] right-[150px] max-w-52">
          <div className="max-h-36">
            <Image
              className='animate-pulse'
              src='/assets/images/big-star.png'
              alt='imagem'
              width={92}
              height={91}
            />
          </div>
        </div>
        <div className="container pt-32 pb-14">
          <div className="flex gap-6 justify-between">

            <div className=" w-5/12 flex-0">
              <div>
                <ul className="inline-flex items-center text-xl font-normal"><li>Uanted</li> <li> <Dot className="text-Roxo" /></li>  <li> Cup</li> </ul>
                <h4 className="text-6xl font-bold leading-snug">LIGA DE <br /><span className="bg-Roxo px-2 rounded-xl">CAMPEONATOS</span><br /> AMADORES</h4>
                <p className=" text-lg">Apresentamos uma experiência única, desenhada para proporcionar a você uma vivência o mais próxima possível daquela de um jogador profissional!
                </p>
                <Button className="mt-4" variant='roxo'><Goal className="mr-2" /> JOGAR AGORA</Button>
              </div>
            </div>

            <div className="w-1/4">
              <div className="absolute top-0 left-1/2 bottom-0 transform -translate-x-1/2 -z-10">
                <div className="absolute top-0 left-0 bottom-0 right-0 transform -translate-x-1/2 -z-10 w-[520px] h-[950px]">
                  <Image
                    className='w-full'
                    src='/assets/images/bg-1.webp'
                    alt='imagem'
                    width={517}
                    height={962}
                  />
                </div>
                <div className="absolute bottom-0 left-0 top-60 transform -translate-x-2/5 w-[500px] h-[700px] -z-10">
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


            <div className="w-1/3">
              <div className="flex flex-col border rounded-xl p-2 bg-zinc-900/50">
                <h1 className="font-bold flex items-center text-xl"><Dot className="text-Roxo" /> Últimos Campeões</h1>
                <hr className="my-2" />
                <div className="flex mt-2">
                  <a href="#" className="flex items-center hover:bg-zinc-100/10 w-full rounded-2xl cursor-pointer transition-colors">

                    <Image
                      className='rounded-2xl w-14 object-cover mr-3'
                      src='/assets/images/tag_novo_tapa_buraco.jpg'
                      alt='imagem'
                      width={960}
                      height={960}
                    />

                    <div className="flex flex-col">
                      <h2 className="text-xl font-semibold">Nome do time</h2>
                      <p className="flex items-center text-red-500">5ª Edição | <ValorantIcon size={25} color="text-red-500 mx-1" /> Valorant
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </div>


          </div>
        </div>
        <div className="absolute inset-0 -z-30">
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
      </section>

      <section className="pt-28 pb-28 bg-background z-20 relative">
        <div className="absolute w-full h-[90px] -top-9 bg-gradient-to-b from-RoxoEscuro to-background filter blur-[20px] -z-10"></div>
        <div className="container flex items-center px-3">
          <div className="w-1/2">

            <Image
              className='max-w-lg'
              src='/assets/images/about.webp'
              alt='imagem'
              width={647}
              height={526}
            />
          </div>
          <div className="w-1/2">
            <h1 className="font-bold text-4xl mb-2">SOBRE A U4NTED CUP</h1>
            <p className="leading-[1.5] font-normal text-[20px]">A U4NTED CUP chegou para agitar o cenário amador de esports, unindo jogadores de Counter-Strike 2 (CS2) e agora Valorant. Em um ambiente descontraído, a competição promete partidas emocionantes e a oportunidade perfeita para equipes amadoras brilharem. Seja veterano ou novato, todos estão convidados a mostrar suas habilidades táticas e aproveitar a experiência única da U4NTED CUP.</p>
          </div>
        </div>
      </section>


      <section className="pt-10 pb-28 bg-background z-20 relative">
        <div className="container flex items-center border rounded-xl p-5">
          <div className="flex flex-col w-full">

            <div className="flex justify-between">
              <h1 className="font-bold text-4xl mb-2">CAMPEONATOS</h1>
              <Button variant='roxo'>Ver Todos</Button>
            </div>

            <div className="flex flex-col rounded-xl w-1/4 border hover:bg-zinc-100/5 transition-all">

              <div className="relative flex flex-col rounded-xl">

                <Image
                  className='rounded-t-xl filter brightness-50'
                  src='/assets/images/tournament1.png'
                  alt='imagem'
                  width={384}
                  height={230}
                />
                <a href="#">
                  <h1 className="absolute bottom-0 left-0 w-full text-xl font-semibold text-center flex justify-center items-center gap-2 bg-gradient-to-b pb-5 from-transparent to-background text-white hover:text-white/80 mt-2">
                    <ValorantIcon size={25} color="text-white" /> Valorant Elite Invitational
                  </h1>
                </a>
              </div>

              <div className="flex flex-col p-2 space-y-2 mt-2">
                <div className="flex items-center flex-col">
                  <p className="flex gap-2 items-center"><Star size={16} /> PlayOffs (MD3)</p>
                  <p className="flex gap-2 items-center"><Star size={16} /> PickBan Personalizado</p>
                  <p className="flex gap-2 items-center"><Star size={16} /> R$400 Em Prêmios</p>
                </div>
                <hr className="py-1" />
                <div className="flex flex-col items-center">
                  <div className="flex gap-2 items-center mb-2 bg-white text-black py-1 px-2 rounded-xl w-full justify-center"><Calendar size={17} />De 20/05 Até 25/05</div>
                  <Button variant='roxo' className="w-full">Participar / Informações</Button>
                </div>
              </div>

            </div>




          </div>
        </div>
      </section>


      <section>
        <div className="container px-3">
          <div className="bg-discord-gradient rounded-xl py-3 px-6 flex items-center">
            <div className="w-1/2">
              <h1 className="text-white text-4xl font-noto font-bold leading-none shadow-md mb-3">
                DISCORD DO CAMPEONATO
              </h1>
              <p className="text-lg">Em nosso servidor Discord, contamos com um bot personalizado que simplifica a organização da U4nted Cup. Com ele, os times têm salas personalizadas garantidas para todas as partidas do campeonato. Dessa forma, todos os participantes podem competir em um ambiente familiar e bem-organizado. Junte-se a nós e experimente a praticidade e a emoção deste campeonato!
              </p>
              <a className="flex items-center gap-2 w-full bg-white text-zinc-900 font-semibold rounded-xl p-2 mt-5 text-2xl justify-center cursor-pointer hover:bg-white/80 transition-colors"><DiscordIcon color="text-zinc-900" /> ACESSAR SERVIDOR</a>
            </div>
            <div className="w-1/2">
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
