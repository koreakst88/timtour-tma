export function formatTourDuration(days: number) {
  const normalizedDays = Math.abs(days)
  const lastTwoDigits = normalizedDays % 100
  const lastDigit = normalizedDays % 10

  let label = 'дней'

  if (lastTwoDigits < 11 || lastTwoDigits > 14) {
    if (lastDigit === 1) {
      label = 'день'
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      label = 'дня'
    }
  }

  return `${days} ${label}`
}
