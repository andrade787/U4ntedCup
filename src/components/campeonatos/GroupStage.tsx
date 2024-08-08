import { useSmoothScrollOnView } from "@/lib/SmoothScroll";
import GroupTable from "./groupStage/GroupTable";
const teams = [
  {
    position: 1,
    logo: 'https://storage.googleapis.com/uanted.appspot.com/LogoTeam/k-Bh8Ujy12b5Rjf5ixVcc.webp',
    name: 'Time 1',
    wins: 3,
    losses: 1,
    matches: 4,
  },
  {
    position: 2,
    logo: 'https://storage.googleapis.com/uanted.appspot.com/LogoTeam/k-Bh8Ujy12b5Rjf5ixVcc.webp',
    name: 'Time 2',
    wins: 2,
    losses: 2,
    matches: 4,
  },
];
export default function GroupStage() {
  const containerRef = useSmoothScrollOnView('.smooth');

  return (
    <div ref={containerRef}>
      <div className="bg-zinc-800 rounded-xl">
        <h2 className="font-semibold text-2xl bg-zinc-900 p-4 rounded-t-xl smooth">Fase de Grupos</h2>
        <p className="p-4">A tabela da fase de grupos ficará disponível após o sorteio dos grupos em live.</p>

        {/*   <div className="grid md:grid-cols-2 grid-cols-1 p-4 gap-6">

          <GroupTable groupName="Grupo A" teams={teams} />

          <GroupTable groupName="Grupo B" teams={teams} /> 

        </div>
 */}
      </div>
    </div>
  );
}