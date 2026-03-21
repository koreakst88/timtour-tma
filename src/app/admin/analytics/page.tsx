import Link from 'next/link'
import { requireAdminAccess } from '@/lib/admin'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const getTourTitle = (tour: { title?: string } | { title?: string }[] | null | undefined) =>
  Array.isArray(tour) ? tour[0]?.title ?? 'Без названия' : tour?.title ?? 'Без названия'

const weekRanges = Array.from({ length: 4 }, (_, index) => {
  const end = new Date()
  end.setDate(end.getDate() - index * 7)
  const start = new Date(end)
  start.setDate(start.getDate() - 6)
  return { start, end }
}).reverse()

const formatShortDate = (value: Date) =>
  new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short' }).format(value)

export default async function AdminAnalyticsPage() {
  await requireAdminAccess()

  const since = new Date()
  since.setDate(since.getDate() - 27)

  const { data: recentBookings } = await supabase
    .from('bookings')
    .select('id, created_at, tour:tours(title)')
    .gte('created_at', since.toISOString())

  const weeklyStats = weekRanges.map((range) => {
    const count =
      recentBookings?.filter((booking) => {
        const bookingDate = new Date(booking.created_at)
        return bookingDate >= range.start && bookingDate <= range.end
      }).length ?? 0

    return {
      label: `${formatShortDate(range.start)} — ${formatShortDate(range.end)}`,
      count,
    }
  })

  const topToursMap = new Map<string, number>()
  for (const booking of recentBookings ?? []) {
    const title = getTourTitle(booking.tour)
    topToursMap.set(title, (topToursMap.get(title) ?? 0) + 1)
  }

  const topTours = Array.from(topToursMap.entries())
    .map(([title, count]) => ({ title, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-[#1F1F1B]">
      <div className="mx-auto w-full max-w-md space-y-5">
        <header>
          <Link href="/admin" className="text-sm font-bold text-[#FF6B35]">
            ← Назад
          </Link>
          <h1 className="mt-2 text-[28px] font-extrabold tracking-[-0.03em]">Аналитика</h1>
        </header>

        <section className="space-y-3">
          {weeklyStats.map((item) => (
            <article
              key={item.label}
              className="rounded-[18px] border border-black/5 bg-[#FFF7F2] p-4 shadow-[0_10px_24px_rgba(25,20,16,0.05)]"
            >
              <p className="text-xs font-bold text-[#6F6F68]">Заявки за неделю</p>
              <p className="mt-1 text-sm font-medium text-[#4F4E49]">{item.label}</p>
              <p className="mt-2 text-2xl font-extrabold text-[#FF6B35]">{item.count}</p>
            </article>
          ))}
        </section>

        <section className="rounded-[20px] border border-black/5 bg-white p-4 shadow-[0_10px_24px_rgba(25,20,16,0.05)]">
          <h2 className="text-lg font-extrabold">Топ-3 тура</h2>
          <div className="mt-4 space-y-3">
            {topTours.length > 0 ? (
              topTours.map((tour, index) => (
                <div
                  key={tour.title}
                  className="flex items-center justify-between rounded-[14px] bg-[#FAFAFA] px-3 py-3"
                >
                  <p className="font-bold text-[#1F1F1B]">
                    {index + 1}. {tour.title}
                  </p>
                  <span className="text-sm font-bold text-[#FF6B35]">{tour.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#6F6F68]">Пока недостаточно данных</p>
            )}
          </div>
        </section>

        <section className="rounded-[20px] border border-black/5 bg-white p-4 shadow-[0_10px_24px_rgba(25,20,16,0.05)]">
          <h2 className="text-lg font-extrabold">Конверсия</h2>
          <p className="mt-3 text-3xl font-extrabold text-[#FF6B35]">12%</p>
          <p className="mt-2 text-sm text-[#6F6F68]">Просмотры → заявки (заглушка)</p>
        </section>
      </div>
    </main>
  )
}
