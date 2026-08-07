import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type Registration = { id: string; student_name: string; whatsapp_number: string; created_at: string }

const formatDate = (date: string) => new Intl.DateTimeFormat('en-LK', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    if (!supabase) return
    setLoading(true)
    const { data, error } = await supabase.from('registrations').select('*').order('created_at', { ascending: false })
    if (!error) setRegistrations(data ?? [])
    setLoading(false)
  }
  useEffect(() => { if (!supabase) { setLoading(false); return }; supabase.auth.getUser().then(({ data }) => setUser(data.user)); const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null)); return () => listener.subscription.unsubscribe() }, [])
  useEffect(() => { if (user) void load() }, [user])
  const filtered = useMemo(() => { const term = query.trim().toLowerCase(); return term ? registrations.filter(item => item.student_name.toLowerCase().includes(term) || item.whatsapp_number.includes(term)) : registrations }, [registrations, query])
  const signIn = async (event: FormEvent) => { event.preventDefault(); if (!supabase) return; setAuthError(''); const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) setAuthError('Unable to sign in. Check your email and password.') }
  const remove = async (id: string) => { if (!supabase || !window.confirm('Delete this registration? This cannot be undone.')) return; const { error } = await supabase.from('registrations').delete().eq('id', id); if (!error) setRegistrations(items => items.filter(item => item.id !== id)) }
  const exportCsv = () => { const rows = [['Student Name', 'WhatsApp Number', 'Registered'], ...filtered.map(item => [item.student_name, item.whatsapp_number, item.created_at])]; const escape = (v: string) => `"${v.replaceAll('"', '""')}"`; const blob = new Blob([rows.map(row => row.map(escape).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'grade-6-registrations.csv'; link.click(); URL.revokeObjectURL(link.href) }
  if (!supabase) return <AdminShell><p className="rounded-xl bg-red-50 p-4 text-red-800">Supabase is not configured. Add the environment variables and restart the site.</p></AdminShell>
  if (!user) return <AdminShell><h1 className="text-3xl font-bold">Admin sign in</h1><p className="mt-2 text-slate-600">Use the administrator email and password.</p><form onSubmit={signIn} className="mt-7 space-y-4"><input className="h-12 w-full rounded-xl border px-4" placeholder="Email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required /><input className="h-12 w-full rounded-xl border px-4" placeholder="Password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required />{authError && <p role="alert" className="text-sm text-red-700">{authError}</p>}<button className="h-12 w-full rounded-xl bg-leaf font-bold text-white">Sign in</button></form></AdminShell>
  return <AdminShell><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-wider text-leaf">Private</p><h1 className="mt-1 text-3xl font-bold">Registrations</h1><p className="mt-1 text-slate-600">{registrations.length} total registration{registrations.length === 1 ? '' : 's'}</p></div><button onClick={() => void supabase.auth.signOut()} className="rounded-lg border px-3 py-2 text-sm font-semibold">Sign out</button></div><div className="mt-7 flex flex-col gap-3 sm:flex-row"><input className="h-12 flex-1 rounded-xl border px-4" placeholder="Search name or WhatsApp number" value={query} onChange={e => setQuery(e.target.value)} /><button onClick={exportCsv} className="h-12 rounded-xl bg-ink px-4 font-bold text-white">Export CSV</button></div><div className="mt-5 overflow-x-auto rounded-xl border"><table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-mist text-slate-700"><tr><th className="px-4 py-3">Student Name</th><th className="px-4 py-3">WhatsApp Number</th><th className="px-4 py-3">Registered</th><th className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead><tbody>{loading ? <tr><td colSpan={4} className="px-4 py-7 text-center text-slate-500">Loading registrations…</td></tr> : filtered.length ? filtered.map(item => <tr key={item.id} className="border-t"><td className="px-4 py-3 font-medium">{item.student_name}</td><td className="px-4 py-3">{item.whatsapp_number}</td><td className="px-4 py-3 text-slate-600">{formatDate(item.created_at)}</td><td className="px-4 py-3 text-right"><button onClick={() => void remove(item.id)} className="font-semibold text-red-700">Delete</button></td></tr>) : <tr><td colSpan={4} className="px-4 py-7 text-center text-slate-500">No matching registrations.</td></tr>}</tbody></table></div></AdminShell>
}

function AdminShell({ children }: { children: ReactNode }) { return <main className="mx-auto min-h-screen max-w-5xl px-4 py-7 sm:px-6"><div className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">{children}</div></main> }
