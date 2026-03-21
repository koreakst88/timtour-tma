import * as amplitude from '@amplitude/analytics-browser'

const API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!

export const initAmplitude = () => {
  amplitude.init(API_KEY, {
    defaultTracking: false,
  })
}

export const trackEvent = (
  eventName: string,
  properties?: Record<string, unknown>
) => {
  amplitude.track(eventName, properties)
}

// Готовые события проекта
export const Analytics = {
  appOpened: () => trackEvent('app_opened'),
  countrySelected: (country: string) =>
    trackEvent('country_selected', { country }),
  tourViewed: (tourId: string, tourTitle: string) =>
    trackEvent('tour_viewed', { tourId, tourTitle }),
  tourFavorited: (tourId: string) =>
    trackEvent('tour_favorited', { tourId }),
  bookingStarted: (tourId: string) =>
    trackEvent('booking_started', { tourId }),
  bookingCompleted: (tourId: string) =>
    trackEvent('booking_completed', { tourId }),
}
