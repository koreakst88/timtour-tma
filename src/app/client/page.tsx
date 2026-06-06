import { Suspense } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Tabbar from '@/components/layout/Tabbar'
import { SkeletonCountryCard } from '@/components/shared/SkeletonCard'
import WeekendTourCard from '@/components/tours/WeekendTourCard'
import { supabase } from '@/lib/supabase'
import { getTourMediaUrl } from '@/lib/tour-media'
import type { Country, Tour } from '@/types'

export const revalidate = 60

type TourWithRelations = Tour & {
  country?: Country | null
}

const preferredCountryNames = ['Япония', 'Вьетнам', 'Филиппины', 'Китай']
const preferredWeekendTourTitles = ['сеул: концептуальный шоппинг']
const preferredWeekendDestinations = ['пуё', 'чеджу', 'самчок']
const countryCoverFallbacks: Record<string, string> = {
  Китай: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
}

function isKoreaTour(tour: TourWithRelations) {
  const haystack = `${tour.title} ${tour.description ?? ''} ${tour.country?.name ?? ''}`.toLowerCase()
  return tour.category === 'weekend' || haystack.includes('сеул') || haystack.includes('пусан') || haystack.includes('коре')
}

function isEnglishCampTour(tour: TourWithRelations) {
  const haystack = `${tour.title} ${tour.description ?? ''}`.toLowerCase()
  return (
    tour.category === 'english_camp' ||
    haystack.includes('english camp') ||
    haystack.includes('learn & travel') ||
    haystack.includes('learn and travel')
  )
}

function getWeekendTourPriority(tour: TourWithRelations) {
  const haystack = `${tour.title} ${tour.description ?? ''} ${tour.country?.name ?? ''}`.toLowerCase()
  const preferredTitleIndex = preferredWeekendTourTitles.findIndex((title) =>
    haystack.includes(title),
  )

  if (preferredTitleIndex !== -1) {
    return preferredTitleIndex - preferredWeekendTourTitles.length
  }

  const priorityIndex = preferredWeekendDestinations.findIndex((destination) =>
    haystack.includes(destination),
  )

  return priorityIndex === -1 ? Number.MAX_SAFE_INTEGER : priorityIndex
}

async function BannerSection() {
  const heroImage =
    'https://images.unsplash.com/photo-1760779550145-8a9f5c4255dd?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&dl=lex-brogan-a6Q277e26v4-unsplash.jpg&w=1200'

  return (
    <section className="relative mt-5 overflow-hidden rounded-[30px] bg-[#E7B288] text-white shadow-[0_24px_50px_rgba(166,103,64,0.18)]">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Фудзи и пагода Чурейто"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#22150D]/72 via-[#3B2519]/38 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/38 via-black/10 to-white/10" />
      </div>

      <div className="relative flex min-h-[210px] flex-col justify-between p-6">
        <div className="max-w-max rounded-full border border-white/18 bg-white/18 px-3 py-1.5 backdrop-blur-md">
          <p className="text-[11px] font-semibold tracking-[-0.01em] text-white">
            🇯🇵 Новое направление
          </p>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="max-w-[15rem]">
            <p className="text-[2rem] font-extrabold leading-[0.95] tracking-[-0.04em] text-white">
              Откройте Азию
              <br />
              вместе с TimTour
            </p>
            <p className="mt-3 max-w-[13.75rem] text-[13px] font-medium leading-[1.35] text-white/88">
              Авторские туры по Корее, Японии, Вьетнаму, Китаю, Филиппинам и Дубаю
            </p>
          </div>

          <div className="shrink-0 rounded-[26px] border border-white/16 bg-white/14 p-1.5 backdrop-blur-md">
            <Link
              href="/catalog?tab=weekend&from=home"
              className="inline-flex h-12 items-center justify-center rounded-[20px] bg-white px-5 text-sm font-semibold text-[#8B4A29] shadow-[0_8px_20px_rgba(255,255,255,0.16)] transition hover:bg-[#FFF7F1]"
            >
              Выбрать тур
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
    .sort((left, right) => getWeekendTourPriority(left) - getWeekendTourPriority(right))
    .slice(0, 6)

  if (weekendTours.length === 0) return null

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="text-lg font-black text-gray-900">🌸 Туры выходного дня</h2>
        <Link href="/catalog?tab=weekend&from=home" className="text-sm font-bold text-[#FF6B35]">
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
  const preferredCountries = preferredOrder
    .map((name) => {
      const foundCountry = countries.find((country) => country.name === name)

      if (foundCountry) return foundCountry

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
          const href = `/catalog?tab=international&country=${country.id}`
          const hrefWithSource = `${href}&from=home`
          const coverUrl = country.cover_url || countryCoverFallbacks[country.name]

          return (
            <Link
              key={country.id}
              href={hrefWithSource}
              prefetch={true}
              className="tap-effect relative aspect-square cursor-pointer overflow-hidden rounded-[20px] shadow-md transition-transform duration-200 active:scale-[0.98]"
            >
              <div className="relative h-full w-full">
                {coverUrl ? (
                  <img
                    src={coverUrl}
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
    console.error('Failed to load Learn & Travel tours', error)
  }

  const fallbackCamp = {
    title: 'Learn & Travel',
    media: [
      {
        url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
      },
    ],
  }

  const tour = ((data ?? [])[0] as (Tour & { media?: Array<{ url: string }> }) | undefined) ?? fallbackCamp
  const imageUrl = getTourMediaUrl(tour.media?.[0]?.url ?? fallbackCamp.media[0].url)

  return (
    <section className="mx-4 mt-6">
      <Link
        href="/catalog?tab=english_camp&from=home"
        className="tap-effect relative block h-40 cursor-pointer overflow-hidden rounded-3xl transition-transform active:scale-[0.98]"
      >
        <img
          src={imageUrl}
          alt={tour.title ?? 'Learn & Travel'}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />

        <div className="absolute inset-0 flex flex-col justify-center px-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/80">
            Для детей и подростков
          </p>
          <h3 className="mb-2 text-xl font-black leading-tight text-white">
            🎒 Learn & Travel
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
      href="/catalog?tab=international&from=home"
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
