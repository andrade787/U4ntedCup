import React from 'react';

interface ComentarioPlayerProps {
  text: string;
}

const ComentarioPlayer: React.FC<ComentarioPlayerProps> = ({ text }) => {
  const formatTextWithLineBreaks = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="break-words overflow-auto text-sm max-h-[400px] max-w-5xl">
      {formatTextWithLineBreaks(text)}
    </div>
  );
};

export default ComentarioPlayer;
