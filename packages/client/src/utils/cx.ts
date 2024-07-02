export const cx = (classes: any[]) => {
  return classes.filter(Boolean).join(' ');
};
