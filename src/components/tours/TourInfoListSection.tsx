type TourInfoListSectionProps = {
  title: string
  items?: string[]
  emptyText?: string
  icon?: string
}

export default function TourInfoListSection({
  title,
  items = [],
  emptyText,
  icon = '•',
}: TourInfoListSectionProps) {
  const normalizedItems = items.map((item) => item.trim()).filter(Boolean)

  if (normalizedItems.length === 0 && !emptyText) return null

  return (
    <section className="rounded-[24px] bg-white p-5 shadow-[0_14px_30px_rgba(32,26,23,0.06)]">
      <h2 className="text-lg font-extrabold text-[#1F1F1B]">{title}</h2>

      {normalizedItems.length > 0 ? (
        <div className="mt-4 space-y-3">
          {normalizedItems.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-[18px] bg-[#FAFAF8] px-4 py-3 ring-1 ring-black/5"
            >
              <span className="mt-0.5 text-sm leading-none text-[#FF6B35]">{icon}</span>
              <p className="break-words text-sm font-medium leading-6 text-[#4F4E49]">{item}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-[18px] border border-dashed border-[#FF6B35]/20 bg-[#FFF8F3] px-4 py-4">
          <p className="text-sm leading-6 text-[#6F6F68]">{emptyText}</p>
        </div>
      )}
    </section>
  )
}
