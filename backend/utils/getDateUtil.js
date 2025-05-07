export function getDayRange(dateStr) {
  const base = new Date(dateStr);
  const start = new Date(base.setHours(0, 0, 0, 0));
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}
