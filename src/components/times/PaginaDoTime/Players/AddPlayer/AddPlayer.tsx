import { useState } from "react"
import { CirclePlus, CircleUserRound, Frown, PlusCircle, ShieldAlert, UserRoundPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, } from "@/components/ui/drawer"
import SearchInput from "@/components/ui/inputsearch"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import LoadingAddPlayerTime from "./Loading"

export function AddPlayerTime() {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="flex items-center gap-2" variant="default">
          <UserRoundPlus size={19} /> Convidar Player
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Convide Jogadores</DrawerTitle>
            <DrawerDescription>Explore e convide jogadores disponíveis para se juntar ao seu time.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex flex-col border rounded-xl">


              <div className="flex flex-col justify-center items-center p-2">
                <ShieldAlert className="mb-1 text-red-800" size={40} />
                <p className="text-center ">Seu time já está completo.</p>
                <p className="text-sm text-zinc-400 text-center">Você já atingiu o limite de 6 jogadores no seu time. Para trocar um jogador, remova um existente.</p>
              </div>

              <div className="flex flex-col justify-center items-center p-2">
                <Frown className="mb-1" size={40} />
                <p className="text-center">No momento, não há nenhum jogador disponível para você convidar.</p>
                <p className="text-sm text-zinc-400 text-center">Se você já possui um time completo e quer adicionar novos membros, peça que todos os jogadores criem uma conta para que você possa convidá-los.</p>
              </div>

              <SearchInput
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Pesquisar Jogador"
              />
              <div className="flex flex-col">
                <ScrollArea className="h-52">
                  <div className="space-y-2">

                    <div className="flex flex-col justify-center items-center p-2">
                      <Frown className="mb-1" size={40} />
                      <p className="text-center">Jogador não encontrado <br />com o nick <span className='bg-zinc-900 p-1 rounded-xl'>Qrzera</span></p>
                      <p className="text-sm text-zinc-400 text-center">Confira se o nick está correto ou se o jogador já faz parte de uma outra equipe.</p>
                    </div>

                    <LoadingAddPlayerTime />

                    <div className="flex items-center bg-gradient-to-r hover:from-zinc-900 px-2 py-2 gap-2 justify-between ">
                      <div className="flex w-full">
                        <div className="flex gap-2">
                          <Avatar className="flex items-center">
                            <AvatarImage className="rounded-full" width={23} src="" />
                            <AvatarFallback className="flex items-center justify-center bg-zinc-600 h-[23px] w-[23px] text-xs rounded-full py-1 px-1">QZ</AvatarFallback>
                          </Avatar>
                          <p className="text-base">QRzera</p>
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="hover:bg-zinc-800/70 p-1 transition-colors rounded-xl">
                            <CirclePlus />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Convidar para se unir ao seu time</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger className="hover:bg-zinc-800/70 p-1 transition-colors rounded-xl">
                            <Link href="#" target="_blank"><CircleUserRound /></Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver Perfil de QRZera</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center bg-gradient-to-r hover:from-zinc-900 px-2 py-2 gap-2 justify-between ">
                      <div className="flex w-full">
                        <div className="flex gap-2">
                          <Avatar className="flex items-center">
                            <AvatarImage className="rounded-full" width={23} src="" />
                            <AvatarFallback className="flex items-center justify-center bg-zinc-600 h-[23px] w-[23px] text-xs rounded-full py-1 px-1">QZ</AvatarFallback>
                          </Avatar>
                          <p className="text-base">QRzera</p>
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="bg-gradient-to-r from-yellow-800 hover:bg-zinc-800 p-1 transition-colors rounded-xl">
                              <p className="text-sm">Convidado</p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gradient-to-r from-yellow-800">
                            <p>Aguardando QRZera aceitar o seu convite</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger className="hover:bg-zinc-800/70 p-1 transition-colors rounded-xl">
                            <Link href="#" target="_blank"><CircleUserRound /></Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver Perfil de QRZera</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center bg-gradient-to-r hover:from-zinc-900 px-2 py-2 gap-2 justify-between ">
                      <div className="flex w-full">
                        <div className="flex gap-2">
                          <Avatar className="flex items-center">
                            <AvatarImage className="rounded-full" width={23} src="" />
                            <AvatarFallback className="flex items-center justify-center bg-zinc-600 h-[23px] w-[23px] text-xs rounded-full py-1 px-1">QZ</AvatarFallback>
                          </Avatar>
                          <p className="text-base">QRzera</p>
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="bg-gradient-to-r from-red-800 hover:bg-zinc-800 p-1 transition-colors rounded-xl">
                              <p className="text-sm">Recusado</p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gradient-to-r from-red-800">
                            <p>QRZera não aceitou o seu convite</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger className="hover:bg-zinc-800/70 p-1 transition-colors rounded-xl">
                            <CirclePlus />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Convidar para se unir ao seu time</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger className="hover:bg-zinc-800/70 p-1 transition-colors rounded-xl">
                            <Link href="#" target="_blank"><CircleUserRound /></Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver Perfil de QRZera</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </ScrollArea>
                <div className="flex justify-center z-0 relative">
                  <div className="absolute w-full h-5 -top-3 bg-gradient-to-b from-zinc-950 to-background filter blur-[4px] -z-10" />
                  <Button variant='ghost' className="flex gap-1 w-full rounded-t-none"><PlusCircle size={17} /> Mostrar Mais</Button>
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Adicionar Depois</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
