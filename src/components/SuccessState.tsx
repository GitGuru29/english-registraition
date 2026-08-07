import { copy } from '../lib/copy'

export default function SuccessState() {
  return (
    <section aria-live="polite" className="sinhala mt-6 rounded-2xl border border-leaf/20 bg-[#effaf5] p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-leaf text-2xl text-white">✓</div>
      <h2 className="mt-4 text-xl font-bold">{copy.successTitle}</h2>
      <p className="mt-2 text-slate-700">{copy.successMessage}</p>
      <p className="mt-1 text-xs text-slate-600">{copy.successHelp}</p>
    </section>
  )
}
