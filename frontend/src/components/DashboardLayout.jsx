import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, Gauge, LayoutTemplate } from 'lucide-react'
import { getUserName } from '../lib/resumeStore'

// App shell for dashboard / editor / ATS pages.
// No authentication: the user's actual name comes from their resume
// (profileInfo.fullName) — the resume IS the profile. No "Guest" placeholders.

const NameChip = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')

  useEffect(() => {
    let alive = true
    getUserName().then((n) => alive && setName(n))
    return () => { alive = false }
  }, [])

  if (!name) return null

  return (
    <button
      className="flex items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pl-1.5 pr-4 shadow-[var(--shadow-soft)] transition-all hover:border-brand-200"
      onClick={() => navigate('/dashboard')}
      title="Name from your resume"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-deep text-xs font-bold text-white">
        {name.charAt(0).toUpperCase()}
      </span>
      <span className="max-w-[130px] truncate text-xs font-semibold text-ink">{name}</span>
    </button>
  )
}

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate()

  return (
    <div className="relative z-0 min-h-screen bg-[#f8fafc] isolate">
      <header className="sticky top-0 z-40 border-b border-line/70 bg-white/85 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white">
              <LayoutTemplate size={18} strokeWidth={2.2} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-ink">
              Resume<span className="text-brand-500">Xpert</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-ice hover:text-teal-500 sm:flex"
              onClick={() => navigate('/dashboard')}
            >
              <LayoutTemplate size={15} /> My Resumes
            </button>
            <button
              className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-ice hover:text-teal-500 sm:flex"
              onClick={() => navigate('/ats')}
            >
              <Gauge size={15} /> ATS Checker
            </button>
            <button className="btn-primary !px-5 !py-2.5 text-xs" onClick={() => navigate('/dashboard')}>
              <FileText size={14} /> New Resume
            </button>
            <NameChip />
          </div>
        </div>
      </header>

      <main className="pb-16 pt-2">{children}</main>
    </div>
  )
}

export default DashboardLayout
