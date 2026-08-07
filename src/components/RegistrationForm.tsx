import { useState, type FormEvent } from 'react'
import { copy } from '../lib/copy'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { normalizeSriLankanMobile, validateName } from '../lib/validation'

type Props = { onSuccess: () => void }
type FieldErrors = { name?: string; phone?: string; form?: string }

async function getClientIpOrIdentifier(): Promise<string> {
  // 1. Try ipify API
  try {
    const res = await fetch('https://api.ipify.org?format=json', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (data.ip) return data.ip
    }
  } catch {}

  // 2. Try db-ip API
  try {
    const res = await fetch('https://api.db-ip.com/v2/free/self', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (data.ipAddress) return data.ipAddress
    }
  } catch {}

  // 3. Try ipapi API
  try {
    const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (data.ip) return data.ip
    }
  } catch {}

  // 4. Device Fingerprint fallback (ensures identifier is NEVER NULL)
  let devId = localStorage.getItem('grade6_device_id')
  if (!devId) {
    devId = 'DEV-' + (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2))
    localStorage.setItem('grade6_device_id', devId)
  }
  return devId
}

export default function RegistrationForm({ onSuccess }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()

    if (localStorage.getItem('grade6_registered_submitted')) {
      setErrors({ form: copy.ipDuplicate })
      return
    }

    const studentName = validateName(name)
    const whatsapp = normalizeSriLankanMobile(phone)
    const next: FieldErrors = {}
    if (!studentName) next.name = copy.invalidName
    if (!whatsapp) next.phone = copy.invalidPhone
    setErrors(next)
    if (Object.keys(next).length) return

    if (!supabase || !isSupabaseConfigured) {
      setErrors({ form: copy.notConfigured })
      return
    }

    setSubmitting(true)

    try {
      const clientIp = await getClientIpOrIdentifier()

      // Pre-check database for existing IP/Device registration
      const { data: existing } = await supabase
        .from('registrations')
        .select('id')
        .eq('ip_address', clientIp)
        .limit(1)

      if (existing && existing.length > 0) {
        localStorage.setItem('grade6_registered_submitted', 'true')
        setErrors({ form: copy.ipDuplicate })
        setSubmitting(false)
        return
      }

      const { error } = await supabase.from('registrations').insert({
        student_name: studentName,
        whatsapp_number: whatsapp,
        ip_address: clientIp
      })

      if (error) {
        console.error('Supabase insert error:', error)
        setErrors({ form: error.code === '23505' ? copy.duplicate : copy.genericError })
        return
      }

      localStorage.setItem('grade6_registered_submitted', 'true')
      onSuccess()
    } catch (err) {
      console.error('Submission failed:', err)
      setErrors({ form: copy.networkError })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="sinhala mt-8 space-y-5">
      <div>
        <label htmlFor="studentName" className="mb-2 block text-sm font-semibold">{copy.studentLabel}</label>
        <input
          id="studentName"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={copy.studentPlaceholder}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className="h-14 w-full rounded-xl border bg-white px-4 text-base outline-none transition focus:border-leaf focus:ring-4 focus:ring-leaf/15"
        />
        {errors.name && <p id="name-error" className="mt-2 text-sm text-red-700">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="whatsapp" className="mb-2 block text-sm font-semibold">{copy.phoneLabel}</label>
        <input
          id="whatsapp"
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder={copy.phonePlaceholder}
          autoComplete="tel"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          className="h-14 w-full rounded-xl border bg-white px-4 text-base outline-none transition focus:border-leaf focus:ring-4 focus:ring-leaf/15"
        />
        {errors.phone && <p id="phone-error" className="mt-2 text-sm text-red-700">{errors.phone}</p>}
      </div>
      {errors.form && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{errors.form}</p>}
      <button
        disabled={submitting}
        className="sinhala flex h-14 w-full items-center justify-center rounded-xl bg-leaf px-5 text-base font-bold text-white shadow-sm transition hover:bg-[#126950] active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-65"
      >
        {submitting ? copy.submitting : copy.submit}
      </button>
    </form>
  )
}
