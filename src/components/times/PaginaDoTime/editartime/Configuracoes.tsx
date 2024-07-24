import { Switch } from "@/components/ui/switch";

export default function ConfiguracoesTime() {
  return (
    <div>
      <h3 className="mb-2 text-lg font-medium">Privacidade do time</h3>
      <div className="space-y-4">

        <div className="flex items-center gap-2 border rounded-xl p-3">
          <div className="flex flex-col">
            <h3 className="font-medium text-base">Só Convite</h3>
            <p className="text-sm text-zinc-300">Se ativado, outros players não podem solicitar para entrar no seu time, só você pode convidar.</p>
          </div>
          <Switch />
        </div>

      </div>
    </div>
  );
}