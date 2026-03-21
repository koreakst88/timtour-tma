export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] px-4 pt-4 pb-24">
      <div className="mb-4 h-8 w-1/2 animate-pulse rounded bg-gray-200" />
      <div className="mb-4 h-12 animate-pulse rounded-2xl bg-gray-200" />
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="overflow-hidden rounded-2xl bg-white shadow-sm animate-pulse"
          >
            <div className="h-48 bg-gray-200" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
              <div className="h-3 w-1/4 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
