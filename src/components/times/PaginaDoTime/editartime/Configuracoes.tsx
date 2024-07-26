import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useTeam } from "@/context/TeamContext";

export default function ConfiguracoesTime() {
  const { team, updateTeam } = useTeam();
  const [isPrivate, setIsPrivate] = useState(team.privacy === 'private');

  const handleSwitchChange = () => {
    const newPrivacy = isPrivate ? 'public' : 'private';
    setIsPrivate(!isPrivate);
    updateTeam({ privacy: newPrivacy });
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
          <Switch checked={isPrivate} onCheckedChange={handleSwitchChange} />
        </div>
      </div>
    </div>
  );
}
