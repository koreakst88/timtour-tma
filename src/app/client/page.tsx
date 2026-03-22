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
    <section className="relative mt-5 overflow-hidden rounded-[30px] bg-[#D58B62] text-white shadow-[0_24px_50px_rgba(166,103,64,0.22)]">
      <div className="absolute inset-0">
        {heroImage ? (
          <img
            src={heroImage}
            alt={tour?.title ?? 'Весенние туры'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.24),_transparent_34%),linear-gradient(135deg,_#B76439,_#E29A66)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#5A2D17]/76 via-[#8C4A27]/42 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/14 via-transparent to-white/8" />
      </div>

      <div className="relative flex min-h-[210px] flex-col justify-between p-6">
        <div className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/92 backdrop-blur-sm">
          Spring selection
        </div>

        <div className="mt-8 flex items-end justify-between gap-4">
          <div className="max-w-[13.5rem]">
            <p className="text-[2rem] font-extrabold leading-[0.95] tracking-[-0.04em]">
              Весенние
              <br />
              туры
            </p>
            <p className="mt-3 text-sm font-medium text-white/82">
              Скидки до 20% на самые яркие маршруты сезона
            </p>
          </div>

          <div className="shrink-0 rounded-[26px] border border-white/18 bg-white/16 p-1.5 backdrop-blur-md">
            <Link
              href="/catalog"
              className="inline-flex h-12 items-center justify-center rounded-[20px] bg-white px-5 text-sm font-semibold text-[#8B4A29] shadow-[0_8px_20px_rgba(255,255,255,0.18)] transition hover:bg-[#FFF7F1]"
            >
              Смотреть
              <span className="ml-2 text-base">→</span>
            </Link>
          </div>
        </div>
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
