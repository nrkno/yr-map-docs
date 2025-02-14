export function rescale({
  fromX,
  from,
  to,
}: {
  fromX: number;
  from: { min: number; max: number };
  to: { min: number; max: number };
}) {
  return ((fromX - from.min) * (to.max - to.min)) / (from.max - from.min) + to.min;
}
