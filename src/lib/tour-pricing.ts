import type { PricingOption, Tour } from '@/types'

function formatFromPrice(value?: string | null) {
  const normalizedValue = value?.trim()

  if (!normalizedValue) return 'По запросу'
  if (/^от\b/i.test(normalizedValue)) return normalizedValue
  if (/по\s+запросу/i.test(normalizedValue)) return normalizedValue

  return `от ${normalizedValue}`
}

function normalizePricingOptions(value?: PricingOption[] | string | null) {
  if (!value) return []

  const rawItems =
    typeof value === 'string'
      ? (() => {
          try {
            const parsed = JSON.parse(value)
            return Array.isArray(parsed) ? parsed : []
          } catch {
            return []
          }
        })()
      : value

  return rawItems
    .map((item) => {
      if (!item || typeof item !== 'object') return null

      const record = item as Partial<PricingOption>
      const price =
        typeof record.price === 'number'
          ? record.price
          : typeof record.price === 'string'
            ? Number(record.price)
            : NaN

      if (!record.title || !record.occupancy || !record.label || Number.isNaN(price) || !record.currency) {
        return null
      }

      return {
        title: record.title,
        occupancy: record.occupancy,
        label: record.label,
        price,
        currency: record.currency,
      }
    })
    .filter((item): item is PricingOption => Boolean(item))
}

export function formatPricingOptionPrice(option: PricingOption) {
  return `${option.price} ${option.currency}`
}

export function getDisplayPriceLabel(value?: string | null) {
  return formatFromPrice(value)
}

export function getEducationPricingOptions(tour: Pick<Tour, 'pricing_options'>) {
  return normalizePricingOptions(tour.pricing_options)
}

export function getEducationPriceFrom(tour: Pick<Tour, 'tour_format' | 'pricing_options'>) {
  if (tour.tour_format !== 'education') return null

  const options = normalizePricingOptions(tour.pricing_options)

  if (options.length === 0) return null

  return [...options].sort((left, right) => left.price - right.price)[0]
}

export function getDisplayTourPrice(tour: Pick<Tour, 'price' | 'tour_format' | 'pricing_options'>) {
  const educationPrice = getEducationPriceFrom(tour)
  return educationPrice ? formatFromPrice(formatPricingOptionPrice(educationPrice)) : formatFromPrice(tour.price)
}
