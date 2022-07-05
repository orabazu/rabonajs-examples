export const mirrorImage = (a: number, b: number, x1: number, y1: number) => {
  const temp = (-2 * (a * x1 + b * y1)) / (a * a + b * b);
  const x = temp * a + x1;
  const y = temp * b + y1;
  return [x, y];
};

// Driver code to test above function
const a = -1.0;
const b = 1.0;
const x1 = 1.0;
const y1 = 0.0;

const [x, y] = mirrorImage(a, b, x1, y1);
