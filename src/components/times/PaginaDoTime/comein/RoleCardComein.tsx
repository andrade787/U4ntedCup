import Image from 'next/image';

interface RoleCardProps {
  role: string;
  imageUrl: string;
  altText: string;
  isActive: boolean;
  onClick: () => void;
}

export default function RoleCardComein({ role, imageUrl, altText, isActive, onClick }: RoleCardProps) {
  return (
    <div
      className={`flex flex-col items-center p-2 rounded-xl cursor-pointer transition-colors ${isActive ? 'bg-zinc-700' : 'bg-zinc-900 hover:bg-zinc-800'
        }`}
      onClick={onClick}
    >
      <Image width={40} height={40} alt={altText} src={imageUrl} />
      <p className="font-medium">{role}</p>
    </div>
  );
};

