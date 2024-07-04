export const getNowFormatted = () => {
  const now = new Date();
  const d = ('0' + now.getDate()).slice(-2);
  const m = ('0' + (now.getMonth() + 1)).slice(-2);
  const y = now.getFullYear();

  return `${y}-${m}-${d}`;
};
