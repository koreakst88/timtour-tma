import type { Tour } from '@/types'

export function isMiniGroupTour(tour: Pick<Tour, 'category' | 'country'>) {
  return tour.category === 'weekend' && tour.country?.name === 'Корея'
}
