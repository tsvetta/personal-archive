export const getDateFormatted = (date?: number | Date) => {
  const now = date ? new Date(date) : new Date();

  console.log(222, now);

  const d = ('0' + now.getDate()).slice(-2);
  const m = ('0' + (now.getMonth() + 1)).slice(-2);
  const y = now.getFullYear();

  return `${y}-${m}-${d}`;
};

export const nowRu = new Date().toLocaleDateString('ru-RU');
