export const formatPhoneNumber = (value: string): string => {
  const cleaned = ('' + value).replace(/\D/g, '');

  const limited = cleaned.slice(0, 11);

  const match = limited.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
  }

  return limited;
};
