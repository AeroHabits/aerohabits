export function ChartGradients() {
  return (
    <defs>
      <linearGradient id="completed" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.4} />
        <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E5E7EB" stopOpacity={0.4} />
        <stop offset="100%" stopColor="#E5E7EB" stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}