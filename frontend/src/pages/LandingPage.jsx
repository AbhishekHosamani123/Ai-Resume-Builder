import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, ArrowLeft, BadgeCheck, Bot, CheckCircle2, ChevronDown, FileText, FileCheck2,
  Gauge, LayoutTemplate, Menu, MousePointerClick, PencilRuler, Share2, Sparkles, Star, X, Zap,
} from 'lucide-react'
import { resumeTemplates } from '../utils/data'

// ------------------------------------------------------------------ helpers

const BRAND = {
  logo: (
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-[var(--shadow-glow)]">
      <FileText size={18} strokeWidth={2.2} />
    </span>
  ),
}

function Navbar({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const links = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Templates', href: '#templates' },
    { label: 'ATS Checker', href: '/ats', to: true },
    { label: 'FAQ', href: '#faq' },
  ]
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-white/85 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center justify-between">
        <button className="flex items-center gap-2.5" onClick={() => onNavigate('/')}>
          {BRAND.logo}
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            Resume<span className="text-brand-600">Xpert</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <button
              key={l.label}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700"
              onClick={() => onNavigate(l.href, l.to)}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button className="btn-ghost" onClick={() => onNavigate('/dashboard')}>My Resumes</button>
          <button className="btn-primary" onClick={() => onNavigate('/dashboard')}>
            Build My Resume <ArrowRight size={16} />
          </button>
        </div>

        <button className="rounded-lg p-2 text-ink md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <button
                key={l.label}
                className="rounded-xl px-4 py-3 text-left text-sm font-medium text-ink hover:bg-brand-50"
                onClick={() => { setOpen(false); onNavigate(l.href, l.to) }}
              >
                {l.label}
              </button>
            ))}
            <button className="btn-primary mt-2" onClick={() => { setOpen(false); onNavigate('/dashboard') }}>
              Build My Resume <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

// ------------------------------------------------------------------- hero

function ResumeMockCard({ src, className = '' }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-lift)] ${className}`}>
      <img src={src} alt="Resume template preview" className="w-full object-cover object-top" />
    </div>
  )
}

function Hero({ onNavigate }) {
  return (
    <section className="relative overflow-hidden bg-mist">
      <div className="glow-blob -left-40 top-10 h-[480px] w-[480px]" />
      <div className="glow-blob -right-32 bottom-0 h-[420px] w-[420px]" />

      <div className="container-x relative grid grid-cols-1 items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="animate-fade-in-up">
          <span className="eyebrow rounded-full border border-brand-100 bg-white px-3 py-1.5">
            <Sparkles size={13} /> The #1 free resume builder
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Create a Job-Ready<br />Resume in Minutes
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
            Create your resume easily with our free builder and professional templates — then
            beat the bots with a built-in ATS score checker.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button className="btn-primary px-7 py-3.5 text-base" onClick={() => onNavigate('/dashboard')}>
              Build My Resume <ArrowRight size={18} />
            </button>
            <button className="btn-secondary px-7 py-3.5 text-base" onClick={() => onNavigate('/ats')}>
              <Gauge size={18} className="text-brand-600" /> Check ATS Score
            </button>
          </div>

          <div className="mt-9 flex items-center gap-4">
            <div className="flex -space-x-2.5">
              {['A', 'R', 'S', 'K'].map((ch, i) => (
                <span
                  key={ch}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white"
                  style={{ background: ['#2e5fe8', '#12b76a', '#f59e0b', '#0b1b33'][i] }}
                >
                  {ch}
                </span>
              ))}
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-slate-500">
              Join <span className="font-semibold text-ink">thousands of professionals</span> who
              got hired faster with ResumeXpert — 100% free, no sign-up.
            </p>
          </div>
        </div>

        {/* hero artwork */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="glow-blob left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2" />

          <div className="relative px-6 sm:px-10">
            <ResumeMockCard src={resumeTemplates[0].thumbnailImg} className="animate-float-slow -rotate-3" />
            <ResumeMockCard src={resumeTemplates[1].thumbnailImg} className="animate-float absolute -bottom-10 right-0 w-40 rotate-3 sm:w-48" />

            {/* floating ATS chip */}
            <div className="animate-float absolute -left-1 top-8 flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 shadow-[var(--shadow-lift)] sm:left-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/10 text-success">
                <BadgeCheck size={18} />
              </span>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">ATS Score</div>
                <div className="font-display text-sm font-bold text-ink">92 / 100</div>
              </div>
            </div>

            {/* floating dream-job card */}
            <div className="animate-float absolute -bottom-6 left-0 rounded-2xl border border-line bg-white px-4 py-3 shadow-[var(--shadow-lift)] sm:left-6" style={{ animationDelay: '1.2s' }}>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-white">
                  <CheckCircle2 size={12} />
                </span>
                <span className="text-xs font-semibold text-ink">Dream Job</span>
              </div>
              <div className="font-display mt-1 text-lg font-bold text-ink">$5,500</div>
              <div className="flex gap-1.5 pt-1.5">
                {['Full-time', 'Remote', 'Product'].map((t) => (
                  <span key={t} className="rounded-full bg-mist px-2 py-0.5 text-[9px] font-semibold text-slate-500">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// -------------------------------------------------------------- how it works

function HowItWorks({ onNavigate }) {
  const steps = [
    {
      n: '1.',
      title: 'Choose a Free Resume Template',
      text: "You've got plenty of formatting and style options — all ATS-friendly.",
      active: true,
    },
    {
      n: '2.',
      title: 'Customize the Design',
      text: 'Make your own resume easily and customize all content with live preview.',
    },
    {
      n: '3.',
      title: 'Check ATS, Share as PDF',
      text: 'Scan your score against a job description, then download or share.',
    },
  ]
  return (
    <section id="how-it-works" className="bg-white py-16 sm:py-24">
      <div className="container-x">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* stacked template previews */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="glow-blob left-10 top-10 h-72 w-72" />
            <ResumeMockCard src={resumeTemplates[0].thumbnailImg} className="relative z-10 w-3/5 -rotate-2" />
            <ResumeMockCard src={resumeTemplates[2].thumbnailImg} className="absolute -top-6 right-0 z-20 w-3/5 rotate-2" />
          </div>

          <div>
            <span className="eyebrow">How it works</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
              3 Steps.<br />5 Minutes.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
              Getting that dream job can seem like an impossible task. Give yourself a real
              advantage with the best resume maker — designed by experts, improved by data,
              trusted by professionals.
            </p>
            <button className="btn-primary mt-7" onClick={() => onNavigate('/dashboard')}>
              Create Resume Now <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* step cards */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className={
                s.active
                  ? 'rounded-3xl bg-brand-600 p-7 text-white shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-1'
                  : 'rounded-3xl border border-line bg-white p-7 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]'
              }
            >
              <span
                className={
                  s.active
                    ? 'flex h-12 w-12 items-center justify-center rounded-2xl bg-white font-display text-lg font-bold text-brand-600'
                    : 'flex h-12 w-12 items-center justify-center rounded-2xl bg-ink font-display text-lg font-bold text-white'
                }
              >
                {s.n}
              </span>
              <div className={s.active ? 'mt-10 h-1 w-14 rounded-full bg-white/40' : 'hidden'} />
              <h3 className={`font-display mt-6 text-xl font-bold ${s.active ? 'text-white' : 'text-ink'}`}>
                {s.title}
              </h3>
              <p className={`mt-2 text-sm leading-relaxed ${s.active ? 'text-brand-100' : 'text-slate-500'}`}>
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ------------------------------------------------------------- writing tips

function WritingTips() {
  const tips = [
    'Recruiters spend less than 10 seconds on average reviewing a resume — be concise, and keep the top of page one for your strongest info.',
    'Start every experience bullet with an action verb: led, built, launched, reduced…',
    'Quantify everything you can — “reduced API latency by 40%” beats “improved performance”.',
    'Mirror the job description keywords so both robots and humans see the match.',
  ]
  return (
    <section className="bg-mist py-16 sm:py-24">
      <div className="container-x grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="eyebrow">Tips</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Get the Advantage<br />with Writing Tips
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
            You don't have to be a professional writer to create a job-winning resume. Built-in
            expert suggestions help you craft an outstanding one — right where you're typing.
          </p>
          <ul className="mt-6 space-y-3">
            {['Hundreds of pre-written suggestions', 'ATS keyword guidance', 'Real-time completion scoring'].map((t) => (
              <li key={t} className="flex items-center gap-3 text-sm font-medium text-ink">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <CheckCircle2 size={13} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* tips card mock */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="glow-blob right-0 top-0 h-64 w-64" />
          <div className="card relative p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-brand-700">
                <Sparkles size={16} /> Expert Insights
              </div>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mist text-slate-400">
                <X size={12} />
              </span>
            </div>
            <p className="mt-3 rounded-2xl bg-brand-50/70 p-4 text-xs leading-relaxed text-ink-soft">
              {tips[0]}
            </p>
            <div className="mt-5 space-y-3">
              {[90, 72, 84, 60].map((w, i) => (
                <div key={i} className="h-3 rounded-full bg-mist" style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-line p-4">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-brand-600 px-2.5 py-1 text-[10px] font-bold text-white">Do</span>
                <span className="text-xs font-semibold text-ink">Strong opening line</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Start your summary with your professional title so recruiters instantly see relevance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ------------------------------------------------------------- live preview

function LivePreview({ onNavigate }) {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-x text-center">
        <span className="eyebrow">Features</span>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Quick, Easy &amp; Flexible Editing with Live Preview
        </h2>

        {/* browser mock */}
        <div className="relative mx-auto mt-12 max-w-4xl">
          <div className="glow-blob left-1/4 top-10 h-80 w-80" />
          <div className="relative overflow-hidden rounded-2xl border border-line bg-mist shadow-[var(--shadow-lift)]">
            <div className="flex items-center gap-1.5 border-b border-line bg-white px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-success" />
              <span className="ml-3 hidden rounded-md bg-mist px-3 py-1 text-[10px] font-medium text-slate-400 sm:block">
                resumexpert.app/resume/backend-engineer
              </span>
            </div>
            <div className="grid grid-cols-[1fr_1.4fr_0.8fr] gap-4 p-4 sm:p-6">
              {/* customize panel */}
              <div className="hidden rounded-xl border border-line bg-white p-3 text-left sm:block">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Customize</div>
                {['Layout', 'Text', 'Colors', 'Section order'].map((t) => (
                  <div key={t} className="mt-2 flex items-center justify-between rounded-lg bg-mist px-2.5 py-2 text-[11px] font-semibold text-ink-soft">
                    {t} <ChevronDown size={11} className="text-slate-400" />
                  </div>
                ))}
              </div>
              {/* resume preview */}
              <div className="rounded-xl border border-line bg-white p-3 shadow-soft">
                <div className="mx-auto h-2 w-16 rounded-full bg-ink/80" />
                <div className="mx-auto mt-1.5 h-1.5 w-10 rounded-full bg-line" />
                <div className="mt-3 space-y-1.5">
                  {[100, 84, 92, 70].map((w, i) => (
                    <div key={i} className="h-1.5 rounded-full bg-mist" style={{ width: `${w}%` }} />
                  ))}
                </div>
                <div className="mt-3 text-[9px] font-bold uppercase tracking-wider text-brand-700">Experience</div>
                <div className="mt-1.5 space-y-1.5">
                  {[95, 88, 90, 60, 85].map((w, i) => (
                    <div key={i} className="h-1.5 rounded-full bg-mist" style={{ width: `${w}%` }} />
                  ))}
                </div>
                <div className="mt-3 text-[9px] font-bold uppercase tracking-wider text-brand-700">Education</div>
                <div className="mt-1.5 space-y-1.5">
                  {[80, 65].map((w, i) => (
                    <div key={i} className="h-1.5 rounded-full bg-mist" style={{ width: `${w}%` }} />
                  ))}
                </div>
              </div>
              {/* align panel */}
              <div className="hidden rounded-xl border border-line bg-white p-3 text-left sm:block">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Align</div>
                <div className="mt-2 grid grid-cols-3 gap-1">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className={`h-4 rounded ${i === 4 ? 'bg-brand-600' : 'bg-mist'}`} />
                  ))}
                </div>
                <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Font size</div>
                <div className="mt-1.5 h-1.5 rounded-full bg-mist">
                  <div className="h-full w-2/3 rounded-full bg-brand-600" />
                </div>
                <div className="mt-3 rounded-lg bg-success/10 px-2 py-1.5 text-center text-[10px] font-bold text-success">
                  PDF export ready
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-slate-500">
          Choose font types, sizes and spacing. Bold, italicize and underline your text. No MS
          Word wrestling — we take care of the formatting, you focus on the content.
        </p>
        <button className="btn-primary mt-6" onClick={() => onNavigate('/dashboard')}>
          <PencilRuler size={16} /> Edit Your Resume
        </button>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- templates

function Templates({ onNavigate }) {
  const tabs = ['ATS-Friendly', 'Professional', 'Modern', 'Creative']
  const [activeTab, setActiveTab] = useState(0)
  const [offset, setOffset] = useState(0)

  const ordered = useMemo(() => {
    const arr = [...resumeTemplates]
    const shift = offset % arr.length
    return [...arr.slice(shift), ...arr.slice(0, shift)]
  }, [offset])

  return (
    <section id="templates" className="bg-mist py-16 sm:py-24">
      <div className="container-x text-center">
        <span className="eyebrow">Optimized designs</span>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Make Your Resume with Proven Professional Templates
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-500">
          Use one of our field-tested resume templates, designed by a team of HR experts and
          typographers.
        </p>

        {/* tabs */}
        <div className="mt-8 inline-flex flex-wrap justify-center gap-2 rounded-full border border-line bg-white p-1.5 shadow-[var(--shadow-soft)]">
          {tabs.map((t, i) => (
            <button
              key={t}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                i === activeTab ? 'bg-brand-600 text-white shadow-[var(--shadow-glow)]' : 'text-ink-soft hover:bg-brand-50'
              }`}
              onClick={() => setActiveTab(i)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* carousel */}
        <div className="relative mx-auto mt-10 flex max-w-4xl items-center justify-center gap-5 sm:gap-8">
          <button
            className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
            onClick={() => setOffset((o) => o - 1)}
            aria-label="Previous template"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="grid flex-1 grid-cols-3 items-center gap-4 sm:gap-6">
            {ordered.map((t, i) => (
              <button
                key={t.id}
                className={`overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-soft)] transition-all duration-300 ${
                  i === 1 ? 'z-10 scale-110 shadow-[var(--shadow-lift)]' : 'opacity-80 hover:opacity-100'
                }`}
                onClick={() => onNavigate('/dashboard')}
              >
                <img src={t.thumbnailImg} alt={`Template ${t.id}`} className="aspect-[3/4] w-full object-cover object-top" />
              </button>
            ))}
          </div>

          <button
            className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
            onClick={() => setOffset((o) => o + 1)}
            aria-label="Next template"
          >
            <ArrowRight size={18} />
          </button>
        </div>

        <button className="btn-secondary mt-10" onClick={() => onNavigate('/dashboard')}>
          Use This Template
        </button>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- industries

function Industries({ onNavigate }) {
  const industries = [
    'Arts, Culture & Media', 'Banking & Finance', 'Business', 'Education', 'Student',
    'Sales, Support & Marketing', 'Infrastructure & Engineering', 'Public Sector',
    'Science & Research', 'Service Industry', 'Technology',
  ]
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-x text-center">
        <span className="eyebrow">Categories</span>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Get Inspired by Resume Samples from Various Industries
        </h2>
        <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-3">
          {industries.map((name) => (
            <button key={name} className="chip" onClick={() => onNavigate('/dashboard')}>
              {name}
            </button>
          ))}
        </div>
        <button className="btn-primary mt-9" onClick={() => onNavigate('/dashboard')}>
          Explore All Samples <ArrowRight size={16} />
        </button>

        {/* company strip */}
        <div className="mt-14 grid grid-cols-3 gap-4 opacity-70 sm:grid-cols-6">
          {['PENSKE', 'VOYA', 'IBM', 'Batteries+ Bulls', 'intuit', 'GRIFOLS'].map((name) => (
            <div key={name} className="flex h-16 items-center justify-center rounded-2xl border border-line bg-mist/60 font-display text-xs font-bold tracking-wide text-slate-400">
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------- ats

function AtsSection({ onNavigate }) {
  return (
    <section className="bg-mist py-16 sm:py-24">
      <div className="container-x grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="eyebrow">ATS score checker</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Beat the Bots.<br />Land on the Shortlist.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
            75% of resumes are filtered out by ATS software before a human ever sees them. Run an
            instant ATS check on the resume you just built — with or without a job description —
            and fix the gaps in one click.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              'Scanned automatically — no re-uploading your resume',
              'Match against a job description for keyword gaps',
              'Actionable fixes: skills, formatting, structure & more',
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-sm font-medium text-ink">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <CheckCircle2 size={13} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <button className="btn-primary mt-8" onClick={() => onNavigate('/ats')}>
            <Gauge size={17} /> Check My ATS Score
          </button>
        </div>

        {/* score card mock */}
        <div className="relative mx-auto w-full max-w-sm">
          <div className="glow-blob right-0 top-4 h-72 w-72" />
          <div className="card relative p-7">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ATS Report</span>
              <span className="rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-bold text-success">PASSED</span>
            </div>

            {/* gauge */}
            <div className="relative mx-auto mt-5 h-44 w-44">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#e7ecf3" strokeWidth="12" />
                <circle
                  cx="60" cy="60" r="52" fill="none" stroke="#12b76a" strokeWidth="12"
                  strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 52 * 0.86} ${2 * Math.PI * 52}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-4xl font-extrabold text-ink">86</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">out of 100</span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { label: 'Keywords matched', w: '86%', c: 'bg-success' },
                { label: 'Structure & sections', w: '92%', c: 'bg-success' },
                { label: 'Skills coverage', w: '64%', c: 'bg-warning' },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-[11px] font-semibold text-ink-soft">
                    <span>{b.label}</span><span>{b.w}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-mist">
                    <div className={`h-full rounded-full ${b.c}`} style={{ width: b.w }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-float absolute -right-4 top-10 rounded-2xl border border-line bg-white px-3.5 py-2.5 shadow-[var(--shadow-lift)]">
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Missing keyword</div>
            <div className="font-display text-xs font-bold text-ink">kubernetes</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ dark CTA

function DarkCta({ onNavigate }) {
  return (
    <section className="relative overflow-hidden bg-ink py-20">
      <div className="glow-blob left-10 top-0 h-96 w-96 opacity-40" />
      <div className="glow-blob bottom-0 right-10 h-80 w-80 opacity-30" />
      <div className="container-x relative text-center">
        <span className="eyebrow text-brand-300">Download</span>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          Get Hired Faster and Land Your Dream Job
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-300">
          Start for free — your data stays on your device, your resume is ready in minutes.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button className="btn-primary px-8 py-4 text-base" onClick={() => onNavigate('/dashboard')}>
            <FileText size={18} /> Build My Resume — It's Free
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
            onClick={() => onNavigate('/ats')}
          >
            <Gauge size={18} /> Try the ATS Checker
          </button>
        </div>
        <div className="mt-8 flex items-center justify-center gap-1.5 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
          <span className="ml-2 text-xs font-medium text-slate-300">Loved by professionals worldwide</span>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------- FAQ

function Faq() {
  const faqs = [
    { q: 'What is ResumeXpert?', a: 'ResumeXpert is a free online resume builder with professional templates, a live preview editor and a built-in ATS score checker that helps your resume get past automated screening.' },
    { q: 'Is ResumeXpert really free?', a: 'Yes. Every feature — templates, PDF export and the ATS checker — is completely free.' },
    { q: 'Do I need to create an account?', a: 'No. There is no sign-up and no login. Your resumes are stored privately in your own browser (IndexedDB), so nothing leaves your device.' },
    { q: 'Where is my data stored?', a: 'Entirely on your device. We use browser storage (IndexedDB + localStorage) instead of a server — your data is private and works offline. Clearing your browser storage will remove saved resumes, so export important resumes as PDF.' },
    { q: 'Will my resume be made public?', a: 'Never. There is no server and no account — your resumes exist only in your browser until you choose to export them as PDF.' },
    { q: 'How does the ATS score checker work?', a: 'It analyzes your resume the way an ATS does: contact details, sections, skills, content depth and keywords. Add a job description and it will also show which keywords you are missing so you can close the gap before applying.' },
  ]
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <section id="faq" className="bg-white py-16 sm:py-24">
      <div className="container-x max-w-3xl">
        <div className="text-center">
          <span className="eyebrow">FAQ</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-line bg-white transition-colors hover:border-brand-200">
              <button
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
              >
                <span className="font-display text-sm font-bold text-ink sm:text-base">{f.q}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-slate-400 transition-transform duration-200 ${openIdx === i ? 'rotate-180 text-brand-600' : ''}`}
                />
              </button>
              <div className={`grid transition-all duration-300 ${openIdx === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-slate-500">{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-slate-400">
          More questions? Explore the builder — it's free and needs no sign-up.
        </p>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------- footer

function Footer({ onNavigate }) {
  const cols = [
    { title: 'Resume', links: ['Create Resume', 'Resume Templates', 'Resume Examples'] },
    { title: 'Resources', links: ['Resume Help', 'Job Interview', 'Cover Letter'] },
    { title: 'Company', links: ['About Us', 'Pricing', 'Sitemap'] },
    { title: 'Support', links: ['Help Center', 'FAQ', 'Contact Us'] },
  ]
  return (
    <footer className="border-t border-line bg-mist">
      <div className="container-x grid grid-cols-1 gap-10 py-14 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <button className="flex items-center gap-2.5" onClick={() => onNavigate('/')}>
            {BRAND.logo}
            <span className="font-display text-lg font-bold tracking-tight text-ink">
              Resume<span className="text-brand-600">Xpert</span>
            </span>
          </button>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
            The free resume builder with a built-in ATS score checker. Private by design — your
            data never leaves your browser.
          </p>
          <div className="mt-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Stay updated</div>
            <div className="mt-2 flex max-w-xs gap-2">
              <input className="input-base !py-2.5 text-xs" placeholder="Enter your email" />
              <button className="btn-primary shrink-0 !px-4 !py-2.5 text-xs">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {cols.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{col.title}</div>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <button
                      className="text-sm text-ink-soft transition-colors hover:text-brand-700"
                      onClick={() => onNavigate(l === 'Create Resume' || l === 'Resume Templates' ? '/dashboard' : '/')}
                    >
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-slate-400 sm:flex-row">
          <span>© {new Date().getFullYear()} ResumeXpert. Crafted with care by Abhishek.</span>
          <div className="flex gap-5">
            <button className="hover:text-brand-700">Privacy Policy</button>
            <button className="hover:text-brand-700">Terms of Service</button>
            <button className="hover:text-brand-700">Cookie Settings</button>
          </div>
        </div>
      </div>
    </footer>
  )
}

// --------------------------------------------------------------------- page

export default function LandingPage() {
  const navigate = useNavigate()

  const handleNavigate = (href, isRoute) => {
    if (isRoute || href.startsWith('/')) {
      navigate(href.startsWith('/') ? href : '/dashboard')
      window.scrollTo({ top: 0 })
      return
    }
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    navigate(href)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={handleNavigate} />
      <main>
        <Hero onNavigate={handleNavigate} />
        <HowItWorks onNavigate={handleNavigate} />
        <WritingTips />
        <LivePreview onNavigate={handleNavigate} />
        <Templates onNavigate={handleNavigate} />
        <Industries onNavigate={handleNavigate} />
        <AtsSection onNavigate={handleNavigate} />
        <DarkCta onNavigate={handleNavigate} />
        <Faq />
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  )
}
