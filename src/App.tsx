import { useEffect, useState } from 'react'
import RegistrationForm from './components/RegistrationForm'
import SuccessState from './components/SuccessState'
import { copy } from './lib/copy'
import AdminDashboard from './components/AdminDashboard'

export default function App() {
  if (window.location.pathname.startsWith('/admin')) return <AdminDashboard />

  const [success, setSuccess] = useState(() => {
    return Boolean(localStorage.getItem('grade6_registered_submitted'))
  })

  useEffect(() => {
    document.title = copy.appName
  }, [])

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-3.5 py-4 sm:px-6 sm:py-10 flex flex-col justify-center">
      <div className="overflow-hidden rounded-2xl sm:rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_18px_45px_rgb(20_33_61_/_0.08)]">
        <header className="border-b border-slate-100 px-5 pb-6 pt-7 text-center sm:px-10 sm:pt-10">
          <h1 className="font-serif text-3xl font-bold leading-[1.05] tracking-[-0.025em] text-ink sm:text-5xl">{copy.appName}</h1>
          <div className="mt-5 border-y border-[#dce8e1] py-3.5">
            <p className="sinhala text-2xl font-extrabold leading-tight text-[#126950] sm:text-3xl">
              {copy.intro} <span className="ml-1 text-ink">{copy.classYear}</span>
            </p>
            <p className="sinhala mx-auto mt-2 max-w-sm text-xs font-semibold leading-5 text-slate-700 sm:text-sm">{copy.infoTitle}</p>
          </div>
        </header>
        <section aria-labelledby="form-title" className="px-5 py-6 sm:px-10 sm:py-8">
          <div className="sinhala text-center">
            <h2 id="form-title" className="text-xl font-bold tracking-[-0.02em] sm:text-2xl">{copy.formTitle}</h2>
            <p className="mx-auto mt-1.5 max-w-sm text-xs text-slate-600 sm:text-sm">{copy.formHelp}</p>
          </div>
          {success ? <SuccessState /> : <RegistrationForm onSuccess={() => setSuccess(true)} />}
        </section>
      </div>
      <p className="sinhala py-4 text-center text-[11px] text-slate-500 sm:text-xs">{copy.privacyNote}</p>
    </main>
  )
}
