import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import Link from "next/link";
export default function TeamsCamp() {
  return (
    <div>
      <div className="bg-zinc-800 rounded-xl">
        <h2 className="font-semibold text-2xl mb-2 bg-zinc-900 p-4 rounded-t-xl">Times Participantes</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-4">
          <h3 className="col-span-3">Nenhum Time Encontrado até o momento</h3>
          {/*   <div className="rounded-xl bg-zinc-900">
            <div className="flex flex-col">
              <div className="flex justify-center items-center gap-2 p-2">
                <Link className="hover:brightness-50 transition-all" href='#' target="_blank">
                  <Image className="object-cover rounded-full h-14 w-14" width={70} height={70} alt="Nome Time" src='https://i.pinimg.com/originals/1d/46/27/1d4627f8b0a294c5e98e87f6cdbeaa8d.jpg' />
                </Link>
                <Link className="hover:text-zinc-400 transition-colors" href='#' target="_blank">
                  <h3 className="text-center font-semibold">Nome do Time</h3>
                </Link>
              </div>
              <hr />
              <div className="bg-gradient-to-t from-zinc-800/50 space-y-1 divide-y">
                <div className="gap-2  py-2 w-full flex justify-center items-center">
                  <Link className="hover:brightness-50 transition-all" href='#' target="_blank">
                    <Avatar>
                      <AvatarImage></AvatarImage>
                      <AvatarFallback className="bg-zinc-800 rounded-full p-2 font-semibold">TA</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link className="hover:text-zinc-400 transition-colors" href='#' target="_blank">
                      <h3>Nome Do Player</h3>
                    </Link>
                    <div className="flex items-center gap-1">
                      <Image className="object-cover rounded-full h-4 w-4" width={40} height={40} alt="Funcao do player" src='https://i.pinimg.com/originals/1d/46/27/1d4627f8b0a294c5e98e87f6cdbeaa8d.jpg' />
                      <p className="text-sm text-zinc-300">Controlador</p>
                    </div>
                  </div>
                </div>
                <div className="gap-2  py-2 w-full flex justify-center items-center">
                  <Link className="hover:brightness-50 transition-all" href='#' target="_blank">
                    <Avatar>
                      <AvatarImage></AvatarImage>
                      <AvatarFallback className="bg-zinc-800 rounded-full p-2 font-semibold">TA</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link className="hover:text-zinc-400 transition-colors" href='#' target="_blank">
                      <h3>Nome Do Player</h3>
                    </Link>
                    <div className="flex items-center gap-1">
                      <Image className="object-cover rounded-full h-4 w-4" width={40} height={40} alt="Funcao do player" src='https://i.pinimg.com/originals/1d/46/27/1d4627f8b0a294c5e98e87f6cdbeaa8d.jpg' />
                      <p className="text-sm text-zinc-300">Controlador</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
 */}
        </div>

      </div>
    </div>
  );
}