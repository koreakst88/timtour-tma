export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24">
      <div className="flex animate-pulse items-center justify-between px-4 pt-4 pb-3">
        <div className="h-10 w-10 rounded-xl bg-gray-200" />
        <div className="flex flex-col items-center space-y-1">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-3 w-20 rounded bg-gray-200" />
        </div>
        <div className="h-10 w-10 rounded-full bg-gray-200" />
      </div>
      <div className="mt-2 space-y-4 px-4">
        <div className="h-12 animate-pulse rounded-2xl bg-gray-200" />
        <div className="h-28 animate-pulse rounded-2xl bg-gray-200" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="aspect-square animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  )
}
