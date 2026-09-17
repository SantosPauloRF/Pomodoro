export function progressoRestante(remainingMs: number, totalMs: number): number {
  if (totalMs <= 0) {
    return 0;
  }
  return Math.min(1, Math.max(0, remainingMs / totalMs));
}
