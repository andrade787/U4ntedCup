import CardPartidastime from "../partidas";

export default function PartidasDoTime() {
  return (
    <div className="flex flex-col bg-zinc-800/20 backdrop-blur-xl rounded-xl p-4 gap-5 mt-5">
      <div className='flex-1 bg-zinc-900/50 rounded-xl border p-2 transition-colors animate-in zoom-in-90'>
        <h2 className='text-2xl font-semibold'>Partidas</h2>
        <p className='text-sm text-zinc-300'>Todas as partidas do time</p>
      </div>

      <div className="flex flex-col space-y-6">
        <CardPartidastime />
      </div>
    </div >
  );
}