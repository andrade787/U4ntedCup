import Image from 'next/image';
import Link from 'next/link';
import { Star, Twitch, Calendar, DollarSign } from 'lucide-react'; // Substitua pela biblioteca de ícones que você está usando
import { ValorantIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';

interface TournamentCardProps {
  status: 'upcoming' | 'finished' | 'ongoing';
  startDate: string;
  endDate: string;
  title: string;
  prize: string;
  imageUrl: string;
  tournamentLink: string;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ status, startDate, endDate, title, prize, imageUrl, tournamentLink }) => {
  const statusClasses = {
    upcoming: 'bg-white text-black',
    finished: 'bg-red-800 text-zinc-100',
    ongoing: 'bg-green-800 text-zinc-100',
  };

  const statusText = {
    upcoming: `De ${startDate} até ${endDate}`,
    finished: `Finalizado em ${endDate}`,
    ongoing: 'Em Andamento',
  };

  return (
    <div className="flex flex-col rounded-xl border hover:bg-zinc-100/5 transition-all">
      <div className="relative flex flex-col rounded-xl">
        <Image
          className='rounded-t-xl w-full max-h-60 object-cover filter brightness-50'
          src={imageUrl}
          alt='imagem'
          width={384}
          height={230}
        />
        <Link href={tournamentLink}>
          <h1 className="animate-in zoom-in absolute bottom-0 left-0 w-full text-xl font-semibold text-center flex justify-center items-center gap-2 bg-gradient-to-b pb-5 from-transparent to-background text-white hover:text-white/80 mt-2">
            <ValorantIcon size={25} color="text-white" /> {title}
          </h1>
        </Link>
      </div>

      <div className="flex flex-col p-2 space-y-2 mt-2">
        <div className="flex items-center flex-col animate-in zoom-in-125">
          <p className="flex gap-2 items-center"><Star size={16} /> Fase de Grupos + Playoffs</p>
          <p className="flex gap-2 items-center"><Twitch size={16} /> Jogos transmitidos ao vivo</p>
          <p className="flex gap-2 items-center"><DollarSign size={16} /> {prize}</p>
        </div>
        <hr className="py-1" />
        <div className="flex flex-col items-center animate-in zoom-in-125">
          <div className={`flex gap-2 items-center mb-2 py-1 px-2 rounded-xl w-full justify-center ${statusClasses[status]}`}>
            <Calendar size={17} /> {statusText[status]}
          </div>
          <Link className="w-full" href={tournamentLink}>
            <Button variant='roxo' className="w-full">
              {status === 'upcoming' ? 'Participar / Informações' : 'Ver'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;
