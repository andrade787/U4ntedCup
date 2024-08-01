import { useState } from "react"
import { ShieldAlert, UserRoundPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, } from "@/components/ui/drawer"
import { TeamPlayers, User, TeamInfos } from "@/lib/types"
import SearchPlayers from "./SearchPlayers"

interface AddPlayerTimeProps {
  team_players: TeamPlayers[];
  user: User;
  team: TeamInfos;
}
export function AddPlayerTime({ team_players, user, team }: AddPlayerTimeProps) {
  const playerCount = Object.keys(team_players).length;
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

              {playerCount < 6 ? (
                <SearchPlayers team_players={team_players} team={team} />
              ) : (
                <div className="flex flex-col justify-center items-center p-2">
                  <ShieldAlert className="mb-1 text-red-800" size={40} />
                  <p className="text-center">Seu time já está completo.</p>
                  <p className="text-sm text-zinc-400 text-center">
                    Você já atingiu o limite de 6 jogadores no seu time. Para trocar um jogador, remova um existente.
                  </p>
                </div>
              )}


            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Adicionar Depois</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent >
    </Drawer >
  )
}
