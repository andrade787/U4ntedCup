import { TeamInfos, Tournament, User } from "@/lib/types";
import IsPartTournament from "./IsPartTournament";
import { Button } from "@/components/ui/button";
import EnterTournament from "./EnterTournament";

interface EnterCampProps {
  tournament: Tournament;
  tournamentTeams: TeamInfos[];
  user: User;
  teamsRemaining: number;
  playerTeam: TeamInfos | null;
}

export default function Participation({ tournament, tournamentTeams, user, playerTeam, teamsRemaining }: EnterCampProps) {
  let teamPlayerData = null;

  const userTeamData = tournamentTeams.map((team) => {
    let currentTeamData = null;

    if (team.id === playerTeam?.id) {
      currentTeamData = {
        ...team,
        TeamPlayerIsPartTournament: true,
      };
    }

    if (team.owner === user.uid) {
      currentTeamData = {
        ...(currentTeamData || team),
        PlayerOwner: true,
      };
    }

    if (currentTeamData) {
      teamPlayerData = currentTeamData;
    }

    return currentTeamData;
  }).filter(Boolean);

  if (playerTeam && teamPlayerData) {
    return (<IsPartTournament teamPlayerData={teamPlayerData} tournamentId={tournament.id} />);
  }

  return (
    <>
      <EnterTournament tournament={tournament} playerTeam={playerTeam} user={user} />
      <p className="text-yellow-500 font-semibold mt-1 text-center">Restam {teamsRemaining} Vagas</p>
    </>
  );
}