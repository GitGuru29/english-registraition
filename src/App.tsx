import { useEffect, useState } from 'react'
import RegistrationForm from './components/RegistrationForm'
import SuccessState from './components/SuccessState'
import { copy } from './lib/copy'
import AdminDashboard from './components/AdminDashboard'

export default function App() {
  if (window.location.pathname === '/admin') return <AdminDashboard />
  const [success, setSuccess] = useState(false)
  useEffect(() => { document.title = copy.appName }, [])
  return <main className="mx-auto min-h-screen max-w-xl px-4 py-5 sm:px-6 sm:py-10">
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_18px_45px_rgb(20_33_61_/_0.08)]">
      <header className="border-b border-slate-100 px-6 pb-7 pt-8 text-center sm:px-10 sm:pt-10">
        <h1 className="font-serif text-[2.35rem] font-bold leading-[.98] tracking-[-0.025em] text-ink sm:text-5xl">{copy.appName}</h1>
        <div className="mt-7 border-y border-[#dce8e1] py-4">
          <p className="sinhala text-[1.65rem] font-extrabold leading-tight text-[#126950] sm:text-3xl">{copy.intro} <span className="ml-1 text-ink">{copy.classYear}</span></p>
          <p className="sinhala mx-auto mt-3 max-w-sm text-sm font-semibold leading-6 text-slate-700">{copy.infoTitle}</p>
        </div>
      </header>
      <section aria-labelledby="form-title" className="px-6 py-7 sm:px-10 sm:py-8">
        <div className="sinhala text-center"><h2 id="form-title" className="text-2xl font-bold tracking-[-0.02em]">{copy.formTitle}</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">{copy.formHelp}</p></div>
        {success ? <SuccessState onReset={() => setSuccess(false)} /> : <RegistrationForm onSuccess={() => setSuccess(true)} />}
      </section>
    </div>
    <p className="sinhala py-5 text-center text-xs text-slate-500">{copy.privacyNote}</p>
  </main>
}
