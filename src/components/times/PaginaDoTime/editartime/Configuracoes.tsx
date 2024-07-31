// components/ConfiguracoesTime.tsx
import { TeamInfos } from "@/lib/types";
import { Switch } from "@/components/ui/switch";

interface ConfiguracoesTimeProps {
  localTeam: TeamInfos;
  setLocalTeam: React.Dispatch<React.SetStateAction<TeamInfos>>;
}

export default function ConfiguracoesTime({ localTeam, setLocalTeam }: ConfiguracoesTimeProps) {

  const handleSwitchChange = (checked: boolean) => {
    setLocalTeam((prevTeam: TeamInfos) => ({ ...prevTeam, privacy: checked ? 'private' : 'public' }));
  };

  return (
    <div>
      <h3 className="mb-2 text-lg font-medium">Privacidade do time</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-2 border rounded-xl p-3">
          <div className="flex flex-col flex-grow">
            <h3 className="font-medium text-base">Só Convite</h3>
            <p className="text-sm text-zinc-300">Se ativado, outros players não podem solicitar para entrar no seu time, só você pode convidar.</p>
          </div>
          <Switch checked={localTeam.privacy === 'private'} onCheckedChange={handleSwitchChange} />
        </div>
      </div>
    </div>
  );
}
