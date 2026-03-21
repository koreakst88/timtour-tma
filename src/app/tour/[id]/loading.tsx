import { SkeletonCard } from '@/components/shared/SkeletonCard'

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24">
      <div className="h-72 w-full animate-pulse bg-gray-200" />
      <div className="space-y-3 px-4 pt-4">
        <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-1/4 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="px-4 pt-6">
        <SkeletonCard />
      </div>
    </div>
  )
}
