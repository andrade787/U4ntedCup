import CampeonatosTimes from "../campeonatos/CardCampeonatosTimes";

export default function CampeonatosDoTime() {
  return (
    <div className="flex bg-zinc-800/20 backdrop-blur-xl rounded-xl p-4 mt-5 flex-col">
      <div className='flex-1 flex flex-col gap-5'>
        <div className='flex-1 bg-zinc-900/50 rounded-xl border p-2 transition-colors animate-in zoom-in-90'>
          <h2 className='text-2xl font-semibold'>Campeonatos</h2>
          <p className='text-sm text-zinc-300'>Todos os campeonatos que o time participou</p>
        </div>
        <p>O Player não jogou nenhum campeonato na U4nted Cup ainda.</p>
        {/*  <CampeonatosTimes /> */}
      </div>
    </div>
  );
}