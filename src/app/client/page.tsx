import { Suspense } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Tabbar from '@/components/layout/Tabbar'
import { SkeletonCountryCard } from '@/components/shared/SkeletonCard'
import WeekendTourCard from '@/components/tours/WeekendTourCard'
import { supabase } from '@/lib/supabase'
import type { Country, Tour } from '@/types'

export const revalidate = 60

type TourWithRelations = Tour & {
  country?: Country | null
}

const preferredCountryNames = ['Малайзия', 'Вьетнам', 'Филиппины', 'Китай']

function isKoreaTour(tour: TourWithRelations) {
  const haystack = `${tour.title} ${tour.description ?? ''} ${tour.country?.name ?? ''}`.toLowerCase()
  return tour.category === 'weekend' || haystack.includes('сеул') || haystack.includes('пусан') || haystack.includes('коре')
}

function isEnglishCampTour(tour: TourWithRelations) {
  const haystack = `${tour.title} ${tour.description ?? ''}`.toLowerCase()
  return tour.category === 'english_camp' || haystack.includes('english camp')
}

async function BannerSection() {
  const { data, error } = await supabase
    .from('tours')
    .select('title, country:countries(name), media:tour_media(*)')
    .eq('is_active', true)
    .limit(12)

  if (error) {
    console.error('Failed to load hero banner', error)
  }

  const tours = ((data ?? []) as Array<
    Pick<Tour, 'title' | 'media'> & {
      country?: Array<Pick<Country, 'name'>> | null
    }
  >).filter((tour) => (tour.media ?? []).some((mediaItem) => mediaItem.type === 'photo'))

  const preferredDirections = [
    'таиланд',
    'фукуок',
    'филиппин',
    'боракай',
    'пхукет',
    'вьетнам',
  ]

  const tour =
    tours.find((item) => {
      const countryName = item.country?.[0]?.name ?? ''
      const haystack = `${item.title} ${countryName}`.toLowerCase()
      return preferredDirections.some((direction) => haystack.includes(direction))
    }) ??
    tours[0] ??
    null

  const heroImage = [...(tour?.media ?? [])]
    .filter((mediaItem) => mediaItem.type === 'photo' && Boolean(mediaItem.url))
    .sort((left, right) => left.order - right.order)[0]?.url

  return (
    <section className="relative mt-5 overflow-hidden rounded-[30px] bg-[#E7B288] text-white shadow-[0_24px_50px_rgba(166,103,64,0.18)]">
      <div className="absolute inset-0">
        {heroImage ? (
          <img
            src={heroImage}
            alt={tour?.title ?? 'Весенние туры'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.35),_transparent_30%),linear-gradient(135deg,_#E29A66,_#F2C49D)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#734226]/58 via-[#B96B3E]/26 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/14" />
      </div>

      <div className="relative flex min-h-[210px] flex-col justify-between p-6">
        <div className="mt-10 flex items-end justify-between gap-4">
          <div className="max-w-[13.5rem]">
            <p className="text-[2rem] font-extrabold leading-[0.95] tracking-[-0.04em]">
              Весенние
              <br />
              туры
            </p>
            <p className="mt-3 text-sm font-medium text-white/88">
              Скидки до 20% на лучшие пляжные и курортные маршруты
            </p>
          </div>

          <div className="shrink-0 rounded-[26px] border border-white/16 bg-white/14 p-1.5 backdrop-blur-md">
            <Link
              href="/catalog?tab=weekend"
              className="inline-flex h-12 items-center justify-center rounded-[20px] bg-white px-5 text-sm font-semibold text-[#8B4A29] shadow-[0_8px_20px_rgba(255,255,255,0.16)] transition hover:bg-[#FFF7F1]"
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

async function WeekendSection() {
  const { data, error } = await supabase
    .from('tours')
    .select('*, country:countries(*), media:tour_media(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load weekend tours', error)
  }

  const weekendTours = ((data ?? []) as TourWithRelations[])
    .filter(isKoreaTour)
    .slice(0, 6)

  if (weekendTours.length === 0) return null

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="text-lg font-black text-gray-900">🌸 Туры выходного дня</h2>
        <Link href="/catalog?tab=weekend" className="text-sm font-bold text-[#FF6B35]">
          Все →
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {weekendTours.map((tour) => (
          <WeekendTourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </section>
  )
}

async function CountriesSection() {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('is_active', true)
    .order('order')

  if (error) {
    console.error('Failed to load countries', error)
  }

  const countries = (data ?? []) as Country[]
  const preferredOrder = preferredCountryNames
  const malaysiaFallback: Country = {
    id: 'malaysia',
    name: 'Малайзия',
    flag_emoji: '🇲🇾',
    cover_url: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&q=80',
    is_priority: true,
    order: 0,
    is_active: true,
  }

  const preferredCountries = preferredOrder
    .map((name) => {
      const foundCountry = countries.find((country) => country.name === name)

      if (foundCountry) return foundCountry

      if (name === 'Малайзия') return malaysiaFallback

      return null
    })
    .filter(Boolean) as Country[]

  const fallbackCountries = countries.filter(
    (country) => !preferredOrder.includes(country.name),
  )

  const displayCountries = [...preferredCountries, ...fallbackCountries].slice(0, 4)

  if (displayCountries.length === 0) return null

  return (
    <section className="mt-8 px-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[22px] font-extrabold tracking-[-0.02em]">✈️ Куда все летят</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {displayCountries.map((country) => {
          const href =
            country.id === 'malaysia'
              ? '/catalog?tab=international&country=malaysia'
              : `/catalog?tab=international&country=${country.id}`

          return (
            <Link
              key={country.id}
              href={href}
              prefetch={true}
              className="tap-effect relative aspect-square cursor-pointer overflow-hidden rounded-[20px] shadow-md transition-transform duration-200 active:scale-[0.98]"
            >
              <div className="relative h-full w-full">
                {country.cover_url ? (
                  <img
                    src={country.cover_url}
                    alt={country.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-[#FF6B35] to-[#F4A261]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 text-sm font-bold text-white">
                  {country.flag_emoji ? `${country.flag_emoji} ` : ''}
                  {country.name}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

async function EnglishCampSection() {
  const { data, error } = await supabase
    .from('tours')
    .select('*, media:tour_media(*)')
    .eq('category', 'english_camp')
    .eq('is_active', true)
    .limit(1)

  if (error) {
    console.error('Failed to load English Camp tours', error)
  }

  const fallbackCamp = {
    title: 'English Camp',
    media: [
      {
        url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
      },
    ],
  }

  const tour = ((data ?? [])[0] as (Tour & { media?: Array<{ url: string }> }) | undefined) ?? fallbackCamp
  const imageUrl = tour.media?.[0]?.url ?? fallbackCamp.media[0].url

  return (
    <section className="mx-4 mt-6">
      <Link
        href="/catalog?tab=english_camp"
        className="tap-effect relative block h-40 cursor-pointer overflow-hidden rounded-3xl transition-transform active:scale-[0.98]"
      >
        <img
          src={imageUrl}
          alt={tour.title ?? 'English Camp'}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />

        <div className="absolute inset-0 flex flex-col justify-center px-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/80">
            Для детей и подростков
          </p>
          <h3 className="mb-2 text-xl font-black leading-tight text-white">
            🎒 English Camp
          </h3>
          <p className="text-xs text-white/70">
            Малайзия · Филиппины · Дубай и др.
          </p>
        </div>

        <div className="absolute bottom-4 right-4">
          <div className="rounded-full bg-white px-4 py-2 text-xs font-bold text-gray-900">
            Подробнее →
          </div>
        </div>
      </Link>
    </section>
  )
}

function AllDirectionsButton() {
  return (
    <Link
      href="/catalog?tab=international"
      className="mx-4 mt-6 mb-6 inline-flex h-14 w-[calc(100%-2rem)] items-center justify-center rounded-[20px] border border-[#FF6B35] bg-transparent px-5 text-base font-bold text-[#FF6B35] transition hover:bg-[#FF6B35]/5"
    >
      Все направления →
    </Link>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1F1F1B]">
      <main className="page-transition mx-auto min-h-screen w-full max-w-md bg-[#FAFAF8] pb-24 pt-6">
        <Header />

        <Suspense
          fallback={
            <section className="mt-5 px-5">
              <div className="h-[210px] animate-pulse rounded-[30px] bg-[#F1E2D7]" />
            </section>
          }
        >
          <BannerSection />
        </Suspense>

        <Suspense
          fallback={
            <section className="mt-6">
              <div className="mb-3 flex items-center justify-between px-4">
                <div className="h-6 w-44 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-14 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="flex gap-3 overflow-hidden px-4">
                <div className="h-44 w-44 shrink-0 animate-pulse rounded-2xl bg-white shadow-md" />
                <div className="h-44 w-44 shrink-0 animate-pulse rounded-2xl bg-white shadow-md" />
                <div className="h-44 w-44 shrink-0 animate-pulse rounded-2xl bg-white shadow-md" />
              </div>
            </section>
          }
        >
          <WeekendSection />
        </Suspense>

        <Suspense
          fallback={
            <section className="mt-8 px-4">
              <div className="mb-4 h-6 w-40 animate-pulse rounded bg-gray-200" />
              <div className="grid grid-cols-2 gap-4">
                <SkeletonCountryCard />
                <SkeletonCountryCard />
                <SkeletonCountryCard />
                <SkeletonCountryCard />
              </div>
            </section>
          }
        >
          <CountriesSection />
        </Suspense>

        <Suspense
          fallback={
            <section className="mx-4 mt-6">
              <div className="h-40 animate-pulse rounded-3xl bg-[#EEDFD4]" />
            </section>
          }
        >
          <EnglishCampSection />
        </Suspense>

        <AllDirectionsButton />
      </main>
      <Tabbar active="home" />
    </div>
  )
}
