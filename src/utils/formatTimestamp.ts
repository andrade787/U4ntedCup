export const formatTimestamp = (timestamp: { _seconds: number; _nanoseconds: number }) => {
  const date = new Date(timestamp._seconds * 1000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const units = [
    { name: 'minuto', milliseconds: 1000 * 60 },
    { name: 'hora', milliseconds: 1000 * 60 * 60 },
    { name: 'dia', milliseconds: 1000 * 60 * 60 * 24 }
  ];

  for (let i = units.length - 1; i >= 0; i--) {
    const unitValue = Math.floor(diffMs / units[i].milliseconds);
    if (unitValue >= 1) {
      return `Há ${unitValue} ${units[i].name}${unitValue > 1 ? 's' : ''}`;
    }
  }

  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(',', ' às');
};
