import React from 'react';

interface InfoCardProps {
  icon: JSX.Element;
  title: string;
  content: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, content }) => (
  <div className="p-3 bg-zinc-900 rounded-xl">
    <h3 className="font-semibold flex items-center gap-1">{icon} {title}</h3>
    <p className="text-zinc-300">{content}</p>
  </div>
);

export default InfoCard;
