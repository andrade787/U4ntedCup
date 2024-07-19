import React from 'react';

interface ScoreCardProps {
  score: string;
  label: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, label }) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-base font-semibold">{score}</h3>
      <p className="text-zinc-400">{label}</p>
    </div>
  );
};

export default ScoreCard;
