export const convertFirestoreTimestampToString = (timestamp: { _seconds: number, _nanoseconds: number }): string => {
  const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
  return date.toISOString();
};