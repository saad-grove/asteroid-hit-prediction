export const keplersLaw = (M: number, e: number, iterations = 6) => {
  let E = M;
  for (let i = 0; i < iterations; i++) {
    E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  }
  return E;
};
