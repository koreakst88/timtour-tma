// Страна/направление
export type Country = {
  id: string
  name: string
  flag_emoji: string
  cover_url: string
  is_priority: boolean
  order: number
  is_active: boolean
}

// Тур
export type Tour = {
  id: string
  country_id: string
  country?: Country
  title: string
  description: string
  price: string
  duration_days: number
  type: 'group' | 'individual'
  category?: 'weekend' | 'international' | 'english_camp'
  has_individual?: boolean
  individual_price_from?: string | null
  individual_description?: string | null
  booking_terms?: string | null
  cancellation_terms?: string | null
  highlights?: string[]
  is_active: boolean
  created_at: string
  media?: TourMedia[]
  dates?: TourDate[]
  program?: TourProgramDay[]
}

export type TourProgramDay = {
  id: string
  tour_id: string
  day_number: number
  title: string
  description?: string | null
  created_at: string
}

// Медиа тура
export type TourMedia = {
  id: string
  tour_id: string
  url: string
  type: 'photo' | 'video'
  order: number
}

// Даты групповых туров
export type TourDate = {
  id: string
  tour_id: string
  date_start: string
  date_end: string
  seats_total: number
  seats_left: number
}

// Заявка на бронирование
export type Booking = {
  id: string
  tour_id: string
  tour?: Tour
  user_tg_id: string
  user_name: string
  phone: string
  comment?: string
  travel_date: string
  people_count: number
  status: 'new' | 'processing' | 'confirmed'
  created_at: string
}

// Избранное
export type Favorite = {
  id: string
  user_tg_id: string
  tour_id: string
  created_at: string
  tour?: Tour
}

// Отзыв
export type Review = {
  id: string
  tour_id: string
  user_tg_id: string
  user_name: string
  text: string
  rating: number
  is_visible: boolean
  created_at: string
}

// Пользователь Telegram
export type TelegramUser = {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}
