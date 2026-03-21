import HomeScreen from '@/components/home/HomeScreen'
import { supabase } from '@/lib/supabase'
import type { Country, Tour } from '@/types'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('is_priority', true)
    .eq('is_active', true)
    .order('order')

  const { data: popularTours, error: popularToursError } = await supabase
    .from('tours')
    .select('*, country:countries(*), media:tour_media(*)')
    .eq('is_active', true)
    .limit(4)

  if (error) {
    console.error('Failed to load priority countries', error)
  }

  if (popularToursError) {
    console.error('Failed to load popular tours', popularToursError)
  }

  const countries = (data ?? []) as Country[]
  const tours = (popularTours ?? []) as Tour[]

  return <HomeScreen countries={countries} popularTours={tours} />
}
