import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, Gauge, LayoutTemplate, Check } from 'lucide-react'
import { getProfile, saveProfile } from '../lib/resumeStore'

// App shell for dashboard / editor / ATS pages.
// No authentication: a lightweight local profile (name) is stored in
// localStorage purely for personalization.

const ProfileChip = () => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(getProfile().name)
  const [saved, setSaved] = useState(false)

  const save = () => {
    saveProfile({ ...getProfile(), name: name.trim() })
    setSaved(true)
    setTimeout(() => { setSaved(false); setOpen(false) }, 700)
  }

  const initial = (name || 'G').charAt(0).toUpperCase()

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pl-1.5 pr-4 shadow-[var(--shadow-soft)] transition-all hover:border-brand-200"
        onClick={() => setOpen(!open)}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
          {initial}
        </span>
        <span className="max-w-[110px] truncate text-xs font-semibold text-ink">
          {name || 'Guest'}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-line bg-white p-4 shadow-[var(--shadow-lift)]">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Your local profile</div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
            Stored only in this browser — no account needed.
          </p>
          <input
            className="input-base mt-3 !py-2.5 text-sm"
            placeholder="Your name"
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && save()}
          />
          <button className="btn-primary mt-3 w-full !py-2.5 text-xs" onClick={save}>
            {saved ? <><Check size={14} /> Saved</> : 'Save name'}
          </button>
        </div>
      )}
    </div>
  )
}

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-mist/60">
      <header className="sticky top-0 z-40 border-b border-line/70 bg-white/85 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-[var(--shadow-glow)]">
              <LayoutTemplate size={18} strokeWidth={2.2} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-ink">
              Resume<span className="text-brand-600">Xpert</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700 sm:flex"
              onClick={() => navigate('/dashboard')}
            >
              <LayoutTemplate size={15} /> My Resumes
            </button>
            <button
              className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700 sm:flex"
              onClick={() => navigate('/ats')}
            >
              <Gauge size={15} /> ATS Checker
            </button>
            <button className="btn-primary !px-5 !py-2.5 text-xs" onClick={() => navigate('/dashboard')}>
              <FileText size={14} /> New Resume
            </button>
            <ProfileChip />
          </div>
        </div>
      </header>

      <main className="pb-16 pt-2">{children}</main>
    </div>
  )
}

export default DashboardLayout
