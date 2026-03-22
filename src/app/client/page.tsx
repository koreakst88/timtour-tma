import { Suspense } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Tabbar from '@/components/layout/Tabbar'
import CountriesGridClient from '@/components/home/CountriesGridClient'
import { SkeletonCard, SkeletonCountryCard } from '@/components/shared/SkeletonCard'
import TourCard from '@/components/tours/TourCard'
import { supabase } from '@/lib/supabase'
import type { Country, Tour } from '@/types'

export const revalidate = 60

async function HeroBanner() {
  const { data, error } = await supabase
    .from('tours')
    .select('title, media:tour_media(*)')
    .eq('is_active', true)
    .limit(1)

  if (error) {
    console.error('Failed to load hero banner', error)
  }

  const tour = (data?.[0] ?? null) as Pick<Tour, 'title' | 'media'> | null
  const heroImage = [...(tour?.media ?? [])]
    .filter((mediaItem) => mediaItem.type === 'photo' && Boolean(mediaItem.url))
    .sort((left, right) => left.order - right.order)[0]?.url

  return (
    <section className="relative mt-5 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#FF6B35] to-[#F4A261] text-white shadow-[0_22px_45px_rgba(255,107,53,0.28)]">
      <div className="absolute inset-0">
        {heroImage ? (
          <img
            src={heroImage}
            alt={tour?.title ?? 'Весенние туры'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.32),_transparent_42%),linear-gradient(135deg,_#FF6B35,_#F4A261)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35]/92 via-[#FF6B35]/70 to-[#F4A261]/42" />
      </div>

      <div className="relative flex min-h-[196px] items-end justify-between gap-4 p-5">
        <div className="max-w-[12rem]">
          <p className="text-2xl font-extrabold leading-tight">🔥 Весенние туры</p>
          <p className="mt-2 text-sm font-medium text-white/85">Скидки до 20%</p>
        </div>
        <Link
          href="/catalog"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-white/22 px-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/28"
        >
          Смотреть →
        </Link>
      </div>
    </section>
  )
}

async function CountriesGrid() {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('is_priority', true)
    .eq('is_active', true)
    .order('order')

  if (error) {
    console.error('Failed to load priority countries', error)
  }

  return <CountriesGridClient countries={(data ?? []) as Country[]} />
}

async function PopularToursSection() {
  const { data: popularTours, error } = await supabase
    .from('tours')
    .select('*, country:countries(*), media:tour_media(*)')
    .eq('is_active', true)
    .limit(4)

  if (error) {
    console.error('Failed to load popular tours', error)
  }

  const tours = (popularTours ?? []) as Tour[]

  return (
    <section className="mt-6 mb-6 px-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">🔥 Популярные туры</h2>
        <Link href="/catalog" className="text-sm font-bold text-[#FF6B35]">
          Все →
        </Link>
      </div>

      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1F1F1B]">
      <main className="page-transition mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-32 pt-6">
        <Header />
        <HeroBanner />

        <Suspense
          fallback={
            <>
              <section className="mt-6">
                <div className="h-14 w-full animate-pulse rounded-[20px] bg-white shadow-sm" />
              </section>
              <section className="mt-8">
                <div className="mb-4 h-6 w-40 animate-pulse rounded bg-gray-200" />
                <div className="grid grid-cols-2 gap-3 px-4">
                  <SkeletonCountryCard />
                  <SkeletonCountryCard />
                  <SkeletonCountryCard />
                  <SkeletonCountryCard />
                </div>
              </section>
            </>
          }
        >
          <CountriesGrid />
        </Suspense>

        <Suspense
          fallback={
            <div className="mt-6 mb-6 px-4">
              <div className="mb-3 h-6 w-36 animate-pulse rounded bg-gray-200" />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          }
        >
          <PopularToursSection />
        </Suspense>
      </main>
      <Tabbar active="home" />
    </div>
  )
}
