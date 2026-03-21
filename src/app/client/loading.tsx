import {
  SkeletonCard,
  SkeletonCountryCard,
  SkeletonHeader,
} from '@/components/shared/SkeletonCard'

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1F1F1B]">
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-32 pt-6">
        <SkeletonHeader />

        <div className="mt-6 h-14 w-full animate-pulse rounded-[20px] bg-white shadow-sm" />
        <div className="mt-5 h-36 w-full animate-pulse rounded-[28px] bg-gradient-to-br from-[#FF6B35]/80 to-[#F4A261]/80" />

        <div className="mt-8 h-6 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-4 grid grid-cols-2 gap-4">
          <SkeletonCountryCard />
          <SkeletonCountryCard />
          <SkeletonCountryCard />
          <SkeletonCountryCard />
        </div>

        <div className="mt-5 h-14 w-full animate-pulse rounded-[20px] bg-white shadow-sm" />

        <div className="mt-6 mb-6">
          <div className="mb-3 h-6 w-36 animate-pulse rounded bg-gray-200" />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </main>
    </div>
  )
}
