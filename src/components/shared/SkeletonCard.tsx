export function SkeletonCard() {
  return (
    <div className="mb-4 w-full animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="h-48 w-full bg-gray-200" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
        <div className="h-3 w-1/4 rounded bg-gray-200" />
      </div>
    </div>
  )
}

export function SkeletonCountryCard() {
  return (
    <div className="aspect-square animate-pulse overflow-hidden rounded-2xl bg-gray-200" />
  )
}

export function SkeletonHeader() {
  return (
    <div className="flex animate-pulse items-center justify-between px-4 pt-4 pb-3">
      <div className="h-10 w-10 rounded-xl bg-gray-200" />
      <div className="flex flex-col items-center space-y-1">
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="h-3 w-20 rounded bg-gray-200" />
      </div>
      <div className="h-10 w-10 rounded-full bg-gray-200" />
    </div>
  )
}
