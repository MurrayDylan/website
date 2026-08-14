export function formatDateRange(
  startDate: string,
  endDate?: string | null,
  current?: boolean
): string {
  if (current || !endDate) {
    return `${startDate} - Present`;
  }
  return `${startDate} - ${endDate}`;
}