'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useDeferredValue, useState } from 'react'
import { Search } from 'lucide-react'
import type { Country } from '@/types'

type CountriesGridClientProps = {
  countries: Country[]
}

export default function CountriesGridClient({ countries }: CountriesGridClientProps) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const normalizedQuery = deferredQuery.trim().toLowerCase()

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(normalizedQuery)
  )

  return (
    <>
      <section className="mt-6">
        <label className="relative block">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9B9B93]">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск туров..."
            className="h-14 w-full rounded-[20px] border border-white bg-white pl-12 pr-4 text-[15px] text-[#1F1F1B] shadow-[0_14px_35px_rgba(32,26,23,0.07)] outline-none transition placeholder:text-[#B3B2AA] focus:border-[#FF6B35]/30 focus:ring-4 focus:ring-[#FF6B35]/10"
          />
        </label>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[22px] font-extrabold tracking-[-0.02em]">✈️ Куда все летят</h2>
        </div>

        {filteredCountries.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredCountries.map((country) => (
              <Link
                key={country.id}
                href={`/catalog?country=${country.id}`}
                className="relative aspect-square cursor-pointer overflow-hidden rounded-[20px] shadow-md transition-transform duration-200 active:scale-[0.98]"
              >
                <div className="relative h-full w-full">
                  {country.cover_url ? (
                    <Image
                      src={country.cover_url}
                      alt={country.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
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
            ))}
          </div>
        ) : (
          <div className="rounded-[20px] bg-white p-5 text-sm font-medium text-[#6F6F68] shadow-[0_14px_30px_rgba(32,26,23,0.06)]">
            По вашему запросу направления не найдены.
          </div>
        )}
      </section>

      <Link
        href="/catalog"
        className="mt-5 inline-flex h-14 w-full items-center justify-center rounded-[20px] border border-[#FF6B35] bg-transparent px-5 text-base font-bold text-[#FF6B35] transition hover:bg-[#FF6B35]/5"
      >
        Все направления →
      </Link>
    </>
  )
}
