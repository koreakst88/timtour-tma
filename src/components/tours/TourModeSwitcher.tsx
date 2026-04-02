'use client'

type TourMode = 'group' | 'individual'

type TourModeSwitcherProps = {
  mode: TourMode
  onChange: (mode: TourMode) => void
}

export default function TourModeSwitcher({ mode, onChange }: TourModeSwitcherProps) {
  return (
    <div className="mb-5 rounded-[22px] bg-[#F5F2EE] p-1">
      <div className="grid grid-cols-2 gap-1">
        {[
          { id: 'group' as const, label: '👥 Групповой' },
          { id: 'individual' as const, label: '🧳 Индивидуальный' },
        ].map((item) => {
          const isActive = mode === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={[
                'rounded-[18px] px-4 py-3 text-sm font-bold transition-all duration-200',
                isActive
                  ? 'bg-white text-[#1F1F1B] shadow-[0_10px_24px_rgba(25,20,16,0.08)]'
                  : 'text-[#7A766D]',
              ].join(' ')}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
