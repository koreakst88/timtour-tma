import HomeScreen from '@/components/home/HomeScreen'
import { supabase } from '@/lib/supabase'
import type { Country } from '@/types'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('is_priority', true)
    .eq('is_active', true)
    .order('order')

  if (error) {
    console.error('Failed to load priority countries', error)
  }

  const countries = (data ?? []) as Country[]

  return <HomeScreen countries={countries} />
}
