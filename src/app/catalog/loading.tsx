import { SkeletonCard } from '@/components/shared/SkeletonCard'

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] pb-24">
      <div className="mx-auto w-full max-w-md px-4 pt-2">
        <div className="sticky top-0 z-20 -mx-4 bg-[#FAFAF8] px-4 pb-2 shadow-sm">
          <div className="h-10 w-44 animate-pulse rounded bg-gray-200 pt-4" />
          <div className="mt-4 h-14 w-full animate-pulse rounded-[20px] bg-white shadow-sm" />
          <div className="mt-4 flex gap-3 overflow-hidden">
            <div className="h-11 w-16 animate-pulse rounded-full bg-white shadow-sm" />
            <div className="h-11 w-28 animate-pulse rounded-full bg-white shadow-sm" />
            <div className="h-11 w-28 animate-pulse rounded-full bg-white shadow-sm" />
          </div>
        </div>

        <div className="w-full px-4 pb-6 pt-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </main>
  )
}
