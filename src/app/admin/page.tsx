import Link from 'next/link'
import { BackHeader } from '@/components/layout/BackHeader'
import { requireAdminAccess } from '@/lib/admin'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const getTourTitle = (tour: { title?: string } | { title?: string }[] | null | undefined) =>
  Array.isArray(tour) ? tour[0]?.title ?? 'Тур' : tour?.title ?? 'Тур'

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))

export default async function AdminPage() {
  const [
    { count: bookingsCount },
    { count: toursCount },
    { count: reviewsCount },
    { count: newBookingsCount },
    { data: recentBookings },
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('tours').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('reviews').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase
      .from('bookings')
      .select('*, tour:tours(title)')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const cards = [
    { label: '📋 Всего заявок', value: bookingsCount ?? 0 },
    { label: '🆕 Новых заявок', value: newBookingsCount ?? 0 },
    { label: '✈️ Активных туров', value: toursCount ?? 0 },
    { label: '⭐ Отзывов', value: reviewsCount ?? 0 },
  ]

  return (
    <main className="page-transition min-h-screen bg-[#FAFAF8] pb-10 text-[#1F1F1B]">
      <div className="mx-auto w-full max-w-md">
        <BackHeader title="Панель управления" />

        <div className="space-y-6 px-4 pt-4">
          <section className="grid grid-cols-2 gap-3">
            {cards.map((card) => (
              <article
                key={card.label}
                className="rounded-[18px] border border-black/5 bg-[#FFF7F2] p-4 shadow-[0_10px_24px_rgba(25,20,16,0.05)]"
              >
                <p className="text-xs font-bold text-[#6F6F68]">{card.label}</p>
                <p className="mt-2 text-2xl font-extrabold text-[#FF6B35]">{card.value}</p>
              </article>
            ))}
          </section>

          <section className="rounded-[20px] border border-black/5 bg-white p-4 shadow-[0_10px_24px_rgba(25,20,16,0.05)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold">Последние заявки</h2>
              <Link href="/admin/bookings" className="text-sm font-bold text-[#FF6B35]">
                Все
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {(recentBookings ?? []).map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-[14px] bg-[#FAFAFA] px-3 py-3 text-sm text-[#4F4E49]"
                >
                  <p className="font-bold text-[#1F1F1B]">{booking.user_name}</p>
                  <p className="mt-1">{getTourTitle(booking.tour)}</p>
                  <p className="mt-1 text-xs text-[#8A8982]">{formatDate(booking.created_at)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-3">
            <Link
              href="/admin/bookings"
              className="rounded-[16px] bg-[#FF6B35] px-4 py-4 text-sm font-bold text-white"
            >
              📋 Все заявки
            </Link>
            <Link
              href="/admin/tours"
              className="rounded-[16px] border border-[#FF6B35]/20 bg-white px-4 py-4 text-sm font-bold text-[#FF6B35]"
            >
              ✈️ Туры
            </Link>
            <Link
              href="/admin/analytics"
              className="rounded-[16px] border border-[#FF6B35]/20 bg-white px-4 py-4 text-sm font-bold text-[#FF6B35]"
            >
              📊 Аналитика
            </Link>
          </section>
        </div>
      </div>
    </main>
  )
}
