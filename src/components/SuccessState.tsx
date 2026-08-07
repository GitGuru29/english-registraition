import { copy } from '../lib/copy'

type Props = { regNo?: number | null }

export default function SuccessState({ regNo }: Props) {
  const storedNo = localStorage.getItem('grade6_registered_no')
  const displayNo = regNo ?? (storedNo ? Number(storedNo) : null)

  return (
    <section aria-live="polite" className="sinhala mt-6 rounded-2xl border border-leaf/20 bg-[#effaf5] p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-leaf text-2xl text-white">✓</div>
      <h2 className="mt-4 text-xl font-bold">{copy.successTitle}</h2>
      {displayNo && (
        <div className="my-3 inline-block rounded-xl border border-leaf/30 bg-white px-5 py-2 text-base font-extrabold text-[#126950] shadow-sm">
          ලියාපදිංචි අංකය: #{displayNo}
        </div>
      )}
      <p className="mt-1 text-slate-700">{copy.successMessage}</p>
      <p className="mt-1 text-xs text-slate-600">{copy.successHelp}</p>
    </section>
  )
}
