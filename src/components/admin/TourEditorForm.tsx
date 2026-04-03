'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Country, Tour, TourProgramDay } from '@/types'

type TourEditorFormProps = {
  action: (formData: FormData) => void | Promise<void>
  countries: Country[]
  submitLabel: string
  initialTour?: Partial<Tour>
  initialProgram?: TourProgramDay[]
}

type ProgramItem = {
  id: string
  title: string
  description: string
}

function createProgramItem(day?: Partial<TourProgramDay>, index = 0): ProgramItem {
  return {
    id: day?.id ?? `new-${index + 1}`,
    title: day?.title ?? '',
    description: day?.description ?? '',
  }
}

function normalizeHighlights(highlights?: string[] | null) {
  return Array.isArray(highlights) ? highlights.join('\n') : ''
}

export default function TourEditorForm({
  action,
  countries,
  submitLabel,
  initialTour,
  initialProgram = [],
}: TourEditorFormProps) {
  const [hasIndividual, setHasIndividual] = useState(Boolean(initialTour?.has_individual))
  const [programItems, setProgramItems] = useState<ProgramItem[]>(
    initialProgram.length > 0
      ? initialProgram
          .sort((left, right) => left.day_number - right.day_number)
          .map((day, index) => createProgramItem(day, index))
      : [],
  )

  const addDay = () => {
    setProgramItems((current) => [...current, createProgramItem(undefined, current.length)])
  }

  const updateDay = (index: number, key: keyof ProgramItem, value: string) => {
    setProgramItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    )
  }

  const removeDay = (index: number) => {
    setProgramItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <form action={action} className="space-y-4 rounded-[20px] bg-[#FAFAFA] p-4">
      <section className="space-y-4 rounded-[18px] border border-black/5 bg-white p-4">
        <h2 className="text-base font-extrabold text-[#1F1F1B]">Основное</h2>

        <input
          name="title"
          defaultValue={initialTour?.title ?? ''}
          placeholder="Название тура"
          required
          className="h-12 w-full rounded-[14px] border border-black/10 bg-white px-4 text-sm outline-none"
        />

        <select
          name="country_id"
          required
          defaultValue={initialTour?.country_id ?? ''}
          className="h-12 w-full rounded-[14px] border border-black/10 bg-white px-4 text-sm outline-none"
        >
          <option value="" disabled>
            Выберите страну
          </option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.flag_emoji} {country.name}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          defaultValue={initialTour?.description ?? ''}
          placeholder="Описание"
          required
          rows={5}
          className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm outline-none"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            name="price"
            defaultValue={initialTour?.price ?? ''}
            placeholder="$1,200"
            required
            className="h-12 w-full rounded-[14px] border border-black/10 bg-white px-4 text-sm outline-none"
          />

          <input
            name="duration_days"
            type="number"
            min="1"
            defaultValue={initialTour?.duration_days ?? ''}
            placeholder="Длительность"
            required
            className="h-12 w-full rounded-[14px] border border-black/10 bg-white px-4 text-sm outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <select
            name="type"
            defaultValue={initialTour?.type ?? 'group'}
            className="h-12 w-full rounded-[14px] border border-black/10 bg-white px-4 text-sm outline-none"
          >
            <option value="group">Групповой</option>
            <option value="individual">Индивидуальный</option>
          </select>

          <select
            name="category"
            defaultValue={initialTour?.category ?? 'international'}
            className="h-12 w-full rounded-[14px] border border-black/10 bg-white px-4 text-sm outline-none"
          >
            <option value="international">International (Стандарт)</option>
            <option value="weekend">Weekend (Выходные)</option>
            <option value="english_camp">English Camp (Лагерь)</option>
          </select>
        </div>

        <input
          name="photos"
          type="file"
          multiple
          accept="image/*"
          className="w-full rounded-[14px] border border-dashed border-[#FF6B35]/30 bg-white px-4 py-3 text-sm"
        />
      </section>

      <section className="space-y-4 rounded-[18px] border border-black/5 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-[#1F1F1B]">Программа по дням</h2>
            <p className="mt-1 text-sm text-[#6F6F68]">Добавьте этапы тура в нужной последовательности.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-[#FF6B35]/20 bg-[#FFF7ED] px-4 text-[#FF6B35]"
            onClick={addDay}
          >
            + Добавить день
          </Button>
        </div>

        {programItems.length === 0 ? (
          <div className="rounded-[14px] border border-dashed border-black/10 bg-[#FAFAFA] px-4 py-5 text-sm text-[#6F6F68]">
            Пока программа не добавлена.
          </div>
        ) : (
          <div className="space-y-3">
            {programItems.map((item, index) => (
              <div key={item.id} className="rounded-[16px] border border-black/8 bg-[#FAFAFA] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-[#1F1F1B]">День {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-xl px-3 text-[#EF4444]"
                    onClick={() => removeDay(index)}
                  >
                    Удалить
                  </Button>
                </div>

                <input type="hidden" name="program_day_number" value={index + 1} />

                <input
                  name="program_title"
                  value={item.title}
                  onChange={(event) => updateDay(index, 'title', event.target.value)}
                  placeholder="Название дня"
                  className="h-11 w-full rounded-[14px] border border-black/10 bg-white px-4 text-sm outline-none"
                />

                <textarea
                  name="program_description"
                  value={item.description}
                  onChange={(event) => updateDay(index, 'description', event.target.value)}
                  placeholder="Описание дня"
                  rows={3}
                  className="mt-3 w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm outline-none"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-[18px] border border-black/5 bg-white p-4">
        <div>
          <h2 className="text-base font-extrabold text-[#1F1F1B]">Что увидите</h2>
          <p className="mt-1 text-sm text-[#6F6F68]">Каждая строка станет отдельным пунктом в карточке тура.</p>
        </div>

        <textarea
          name="highlights_text"
          defaultValue={normalizeHighlights(initialTour?.highlights ?? null)}
          placeholder={'Башни Петронас\nОстров Лангкави\nМалакка'}
          rows={5}
          className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm outline-none"
        />
      </section>

      <section className="space-y-4 rounded-[18px] border border-black/5 bg-white p-4">
        <div>
          <h2 className="text-base font-extrabold text-[#1F1F1B]">Что входит в стоимость</h2>
          <p className="mt-1 text-sm text-[#6F6F68]">Каждая строка станет отдельным пунктом в карточке тура.</p>
        </div>

        <textarea
          name="included"
          defaultValue={initialTour?.included ?? ''}
          placeholder={'Проживание\nТрансферы\nЭкскурсии'}
          rows={5}
          className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm outline-none"
        />
      </section>

      <section className="space-y-4 rounded-[18px] border border-black/5 bg-white p-4">
        <div className="flex items-start justify-between gap-3 rounded-[14px] border border-black/8 bg-[#FAFAFA] px-4 py-3">
          <div>
            <h2 className="text-base font-extrabold text-[#1F1F1B]">Индивидуальный тур</h2>
            <p className="mt-1 text-sm text-[#6F6F68]">
              Включите, если для тура доступен индивидуальный формат.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-[#1F1F1B]">
            <input
              name="has_individual"
              type="checkbox"
              checked={hasIndividual}
              onChange={(event) => setHasIndividual(event.target.checked)}
              className="h-4 w-4 rounded border-black/20 accent-[#FF6B35]"
            />
            Доступен
          </label>
        </div>

        {hasIndividual && (
          <div className="space-y-3">
            <input
              name="individual_price_from"
              defaultValue={initialTour?.individual_price_from ?? ''}
              placeholder="Цена от"
              className="h-12 w-full rounded-[14px] border border-black/10 bg-white px-4 text-sm outline-none"
            />

            <textarea
              name="individual_description"
              defaultValue={initialTour?.individual_description ?? ''}
              placeholder="Описание индивидуального тура"
              rows={4}
              className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm outline-none"
            />
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-[18px] border border-black/5 bg-white p-4">
        <div>
          <h2 className="text-base font-extrabold text-[#1F1F1B]">Условия</h2>
          <p className="mt-1 text-sm text-[#6F6F68]">Покажутся в карточке тура, если будут заполнены.</p>
        </div>

        <textarea
          name="booking_terms"
          defaultValue={initialTour?.booking_terms ?? ''}
          placeholder="Условия бронирования"
          rows={4}
          className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm outline-none"
        />

        <textarea
          name="cancellation_terms"
          defaultValue={initialTour?.cancellation_terms ?? ''}
          placeholder="Условия отмены"
          rows={4}
          className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm outline-none"
        />
      </section>

      <Button
        type="submit"
        className="flex h-12 w-full items-center justify-center rounded-[14px] bg-[#FF6B35] text-sm font-bold text-white"
      >
        {submitLabel}
      </Button>
    </form>
  )
}
