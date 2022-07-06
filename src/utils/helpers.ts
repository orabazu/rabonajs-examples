export const norm = (val: number, max = 2, min = 0) => {
  return (val - min) / (max - min);
};
