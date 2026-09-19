import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, ArrowLeft, BadgeCheck, CheckCircle2, ChevronDown, FileText, Gauge,
  LayoutTemplate, Menu, MousePointerClick, PencilRuler, Sparkles, Star, X,
} from 'lucide-react'
import { resumeTemplates } from '../utils/data'
import { scrollToTarget } from '../lib/smoothScroll'
import Reveal from '../components/Reveal'

const LOGO = (
  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white">
    <FileText size={17} strokeWidth={2.2} />
  </span>
)

function handleNav(navigate, href, isRoute) {
  if (isRoute || href.startsWith('/')) {
    navigate(href.startsWith('/') ? href : '/dashboard')
    window.scrollTo({ top: 0 })
    return
  }
  if (href.startsWith('#')) {
    scrollToTarget(href)
    return
  }
  navigate(href)
}

// ------------------------------------------------------------------- navbar

function Navbar({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const links = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Templates', href: '#templates' },
    { label: 'ATS Checker', href: '/ats', to: true },
    { label: 'FAQ', href: '#faq' },
  ]
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between rounded-full border border-deep/8 bg-white/80 pl-4 pr-2 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:pl-5">
        <button className="flex items-center gap-2.5" onClick={() => onNavigate('/')}>
          {LOGO}
          <span className="font-display text-base font-bold tracking-tight text-ink">
            Resume<span className="text-brand-500">Xpert</span>
          </span>
        </button>

        <nav className="hidden items-center gap-0.5 md:flex">
          {links.map((l) => (
            <button
              key={l.label}
              className="rounded-full px-3.5 py-2 text-[13px] font-medium text-ink-mute transition-colors hover:bg-ice hover:text-teal-500"
              onClick={() => onNavigate(l.href, l.to)}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button className="btn-ghost !text-[13px]" onClick={() => onNavigate('/dashboard')}>My Resumes</button>
          <button className="btn-primary !px-5 !py-2.5 !text-[13px]" onClick={() => onNavigate('/dashboard')}>
            Build My Resume <ArrowRight size={14} />
          </button>
        </div>

        <button className="rounded-full p-2 text-ink md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-4xl rounded-3xl border border-deep/8 bg-white/95 p-3 shadow-[var(--shadow-lift)] backdrop-blur-xl md:hidden">
          {links.map((l) => (
            <button
              key={l.label}
              className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-ink hover:bg-ice"
              onClick={() => { setOpen(false); onNavigate(l.href, l.to) }}
            >
              {l.label}
            </button>
          ))}
          <button className="btn-primary mt-2 w-full" onClick={() => { setOpen(false); onNavigate('/dashboard') }}>
            Build My Resume <ArrowRight size={15} />
          </button>
        </div>
      )}
    </header>
  )
}

// ------------------------------------------------------------------- hero

function ResumeMockCard({ src, className = '', style }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-deep/8 bg-white shadow-[var(--shadow-lift)] ${className}`} style={style}>
      <img src={src} alt="Resume template preview" className="w-full object-cover object-top" />
    </div>
  )
}

function Hero({ onNavigate }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ice-2 via-white to-white pt-36 pb-20 sm:pt-44">
      <div className="glow-blob -left-40 top-24 h-[480px] w-[480px]" />
      <div className="glow-blob -right-32 bottom-0 h-[420px] w-[420px]" />

      <div className="container-x relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-deep/8 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-teal-500 shadow-[var(--shadow-soft)]">
              <Sparkles size={12} /> The #1 free resume builder
            </span>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="mt-6 font-display text-[2.7rem] font-bold leading-[1.04] tracking-tight text-ink sm:text-6xl lg:text-[4.2rem]">
              Create a Job-Ready<br />
              Resume in <span className="relative inline-block text-brand-500">Minutes<svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 200 10" preserveAspectRatio="none"><path d="M2 8 C 60 2, 140 2, 198 7" stroke="#0b282e" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.85" /></svg></span>
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-mute sm:text-lg">
              Create your resume easily with our free builder and professional templates —
              then beat the bots with a built-in ATS score checker.
            </p>
          </Reveal>
          <Reveal delay={270}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button className="btn-primary px-7 py-3.5 text-base" onClick={() => onNavigate('/dashboard')}>
                Build My Resume <ArrowRight size={17} />
              </button>
              <button className="btn-secondary px-7 py-3.5 text-base" onClick={() => onNavigate('/ats')}>
                <Gauge size={17} className="text-brand-500" /> Check ATS Score
              </button>
            </div>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {['A', 'R', 'S', 'K'].map((ch, i) => (
                  <span
                    key={ch}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white"
                    style={{ background: ['#0b282e', '#1e7280', '#0099ff', '#12b76a'][i] }}
                  >
                    {ch}
                  </span>
                ))}
              </div>
              <p className="max-w-xs text-xs leading-relaxed text-ink-mute">
                Join <span className="font-semibold text-ink">thousands of professionals</span> who
                got hired faster with ResumeXpert — 100% free, no sign-up.
              </p>
            </div>
          </Reveal>
        </div>

        {/* parallax hero artwork */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="glow-blob left-1/2 top-1/2 h-[380px] w-[380px]" />
          <div className="relative px-6 sm:px-10">
            <div data-parallax="0.06">
              <ResumeMockCard src={resumeTemplates[0].thumbnailImg} className="-rotate-3" />
            </div>
            <div data-parallax="-0.1" className="absolute -bottom-12 right-0 w-44 sm:w-56">
              <ResumeMockCard src={resumeTemplates[1].thumbnailImg} className="rotate-3" />
            </div>

            <div data-parallax="0.16" className="animate-float absolute -left-1 top-10 flex items-center gap-2 rounded-2xl border border-deep/8 bg-white px-4 py-3 shadow-[var(--shadow-lift)] sm:left-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/10 text-success">
                <BadgeCheck size={18} />
              </span>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint">ATS Score</div>
                <div className="font-display text-sm font-bold text-ink">92 / 100</div>
              </div>
            </div>

            <div data-parallax="-0.14" className="animate-float absolute -bottom-8 left-0 rounded-2xl border border-deep/8 bg-white px-4 py-3 shadow-[var(--shadow-lift)] sm:left-8" style={{ animationDelay: '1.2s' }}>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-white">
                  <CheckCircle2 size={12} />
                </span>
                <span className="text-xs font-semibold text-ink">Dream Job</span>
              </div>
              <div className="font-display mt-1 text-lg font-bold text-ink">$5,500</div>
              <div className="flex gap-1.5 pt-1.5">
                {['Full-time', 'Remote', 'Product'].map((t) => (
                  <span key={t} className="rounded-full bg-ice px-2 py-0.5 text-[9px] font-semibold text-teal-500">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ----------------------------------------------------------------- marquee

function Marquee() {
  const items = ['PENSKE', 'VOYA', 'IBM', 'Batteries+Bulls', 'intuit', 'GRIFOLS', 'SHOPIFY', 'NOTION', 'STRIPE', 'LINEAR']
  const row = [...items, ...items]
  return (
    <section className="border-y border-deep/5 bg-white py-8">
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">
        Our users got hired by
      </p>
      <div className="marquee-mask mt-5 overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-14 pr-14">
          {row.map((name, i) => (
            <span key={i} className="font-display whitespace-nowrap text-lg font-semibold tracking-wide text-ink/25">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// -------------------------------------------------------------- how it works

function HowItWorks({ onNavigate }) {
  const steps = [
    {
      n: '1.', title: 'Choose a Free Resume Template',
      text: "You've got plenty of formatting and style options — all ATS-friendly.",
      active: true,
    },
    {
      n: '2.', title: 'Customize the Design',
      text: 'Make your own resume easily and customize all content with live preview.',
    },
    {
      n: '3.', title: 'Check ATS, Share as PDF',
      text: 'Scan your score against a job description, then download or share.',
    },
  ]
  return (
    <section id="how-it-works" className="bg-white py-20 sm:py-28">
      <div className="container-x">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-md">
            <div className="glow-blob left-10 top-10 h-72 w-72" />
            <div data-parallax="0.08" className="relative z-10 w-3/5 -rotate-2">
              <ResumeMockCard src={resumeTemplates[0].thumbnailImg} />
            </div>
            <div data-parallax="-0.06" className="absolute -top-8 right-0 z-20 w-3/5 rotate-2">
              <ResumeMockCard src={resumeTemplates[2].thumbnailImg} />
            </div>
          </div>

          <div>
            <Reveal><span className="eyebrow">How it works</span></Reveal>
            <Reveal delay={90}>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
                3 Steps.<br />5 Minutes.
              </h2>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ink-mute">
                Getting that dream job can seem like an impossible task. Give yourself a real
                advantage with the best resume maker — designed by experts, improved by data,
                trusted by professionals.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <button className="btn-primary mt-8" onClick={() => onNavigate('/dashboard')}>
                Create Resume Now <ArrowRight size={16} />
              </button>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 130} y={34}>
              <div
                className={
                  s.active
                    ? 'group h-full rounded-[28px] bg-deep p-7 text-white shadow-[var(--shadow-lift)] transition-transform duration-300 hover:-translate-y-1.5'
                    : 'group h-full rounded-[28px] border border-deep/8 bg-white p-7 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]'
                }
              >
                <span className={
                  s.active
                    ? 'flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 font-display text-lg font-bold text-white'
                    : 'flex h-12 w-12 items-center justify-center rounded-2xl bg-ice font-display text-lg font-bold text-teal-500'
                }>
                  {s.n}
                </span>
                {s.active && <div className="mt-10 h-1 w-14 rounded-full bg-white/20" />}
                <h3 className={`font-display mt-6 text-xl font-bold ${s.active ? 'text-white' : 'text-ink'}`}>
                  {s.title}
                </h3>
                <p className={`mt-2.5 text-sm leading-relaxed ${s.active ? 'text-white/60' : 'text-ink-mute'}`}>
                  {s.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ------------------------------------------------------------- writing tips

function WritingTips() {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="container-x grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <div>
          <Reveal><span className="eyebrow">Tips</span></Reveal>
          <Reveal delay={90}>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
              Get the Advantage<br />with Writing Tips
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-mute">
              You don't have to be a professional writer to create a job-winning resume. Built-in
              expert suggestions help you craft an outstanding one — right where you're typing.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <ul className="mt-7 space-y-3.5">
              {['Hundreds of pre-written suggestions', 'ATS keyword guidance', 'Real-time completion scoring'].map((t) => (
                <li key={t} className="flex items-center gap-3 text-sm font-medium text-ink">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mint text-teal-500">
                    <CheckCircle2 size={12} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={150} y={38}>
          <div className="relative mx-auto w-full max-w-md">
            <div className="glow-blob right-0 top-0 h-64 w-64" />
            <div data-parallax="0.05" className="card relative p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-teal-500">
                  <Sparkles size={15} /> Expert Insights
                </div>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mist text-ink-faint">
                  <X size={12} />
                </span>
              </div>
              <p className="mt-3 rounded-2xl bg-ice p-4 text-xs leading-relaxed text-ink-soft">
                Recruiters spend less than 10 seconds on average reviewing a resume — be concise,
                and keep the top of page one for your strongest info.
              </p>
              <div className="mt-5 space-y-3">
                {[90, 72, 84, 60].map((w, i) => (
                  <div key={i} className="h-3 rounded-full bg-mist" style={{ width: `${w}%` }} />
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-deep/8 p-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-brand-500 px-2.5 py-1 text-[10px] font-bold text-white">Do</span>
                  <span className="text-xs font-semibold text-ink">Strong opening line</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink-mute">
                  Start your summary with your professional title so recruiters instantly see relevance.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ------------------------------------------------------------- live preview

function LivePreview({ onNavigate }) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-x text-center">
        <Reveal><span className="eyebrow">Features</span></Reveal>
        <Reveal delay={90}>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            Quick, Easy &amp; Flexible Editing with Live Preview
          </h2>
        </Reveal>

        <Reveal delay={180} y={40}>
          <div className="relative mx-auto mt-14 max-w-4xl">
            <div className="glow-blob left-1/4 top-10 h-80 w-80" />
            <div data-parallax="0.04" className="relative overflow-hidden rounded-[24px] border border-deep/8 bg-mist shadow-[var(--shadow-lift)]">
              <div className="flex items-center gap-1.5 border-b border-deep/8 bg-white px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                <span className="ml-3 hidden rounded-md bg-mist px-3 py-1 text-[10px] font-medium text-ink-faint sm:block">
                  resumexpert.app/resume/backend-engineer
                </span>
              </div>
              <div className="grid grid-cols-[1fr_1.4fr_0.8fr] gap-4 p-4 sm:p-6">
                <div className="hidden rounded-xl border border-deep/8 bg-white p-3 text-left sm:block">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Customize</div>
                  {['Layout', 'Text', 'Colors', 'Section order'].map((t) => (
                    <div key={t} className="mt-2 flex items-center justify-between rounded-lg bg-mist px-2.5 py-2 text-[11px] font-semibold text-ink-soft">
                      {t} <ChevronDown size={11} className="text-ink-faint" />
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-deep/8 bg-white p-3 shadow-soft">
                  <div className="mx-auto h-2 w-16 rounded-full bg-ink/80" />
                  <div className="mx-auto mt-1.5 h-1.5 w-10 rounded-full bg-line" />
                  <div className="mt-3 space-y-1.5">
                    {[100, 84, 92, 70].map((w, i) => (
                      <div key={i} className="h-1.5 rounded-full bg-mist" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                  <div className="mt-3 text-[9px] font-bold uppercase tracking-wider text-teal-500">Experience</div>
                  <div className="mt-1.5 space-y-1.5">
                    {[95, 88, 90, 60, 85].map((w, i) => (
                      <div key={i} className="h-1.5 rounded-full bg-mist" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                  <div className="mt-3 text-[9px] font-bold uppercase tracking-wider text-teal-500">Education</div>
                  <div className="mt-1.5 space-y-1.5">
                    {[80, 65].map((w, i) => (
                      <div key={i} className="h-1.5 rounded-full bg-mist" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                </div>
                <div className="hidden rounded-xl border border-deep/8 bg-white p-3 text-left sm:block">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Align</div>
                  <div className="mt-2 grid grid-cols-3 gap-1">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className={`h-4 rounded ${i === 4 ? 'bg-brand-500' : 'bg-mist'}`} />
                    ))}
                  </div>
                  <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-ink-faint">Font size</div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-mist">
                    <div className="h-full w-2/3 rounded-full bg-brand-500" />
                  </div>
                  <div className="mt-3 rounded-lg bg-mint px-2 py-1.5 text-center text-[10px] font-bold text-success">
                    PDF export ready
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="mx-auto mt-9 max-w-xl text-sm leading-relaxed text-ink-mute">
            Choose font types, sizes and spacing. Bold, italicize and underline your text. No MS
            Word wrestling — we take care of the formatting, you focus on the content.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <button className="btn-primary mt-7" onClick={() => onNavigate('/dashboard')}>
            <PencilRuler size={16} /> Edit Your Resume
          </button>
        </Reveal>
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
    const shift = ((offset % arr.length) + arr.length) % arr.length
    return [...arr.slice(shift), ...arr.slice(0, shift)]
  }, [offset])

  return (
    <section id="templates" className="bg-ice-2 py-20 sm:py-28">
      <div className="container-x text-center">
        <Reveal><span className="eyebrow">Optimized designs</span></Reveal>
        <Reveal delay={90}>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            Make Your Resume with Proven Professional Templates
          </h2>
        </Reveal>
        <Reveal delay={170}>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink-mute">
            Use one of our field-tested resume templates, designed by a team of HR experts and
            typographers.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-9 inline-flex flex-wrap justify-center gap-1.5 rounded-full border border-deep/8 bg-white p-1.5 shadow-[var(--shadow-soft)]">
            {tabs.map((t, i) => (
              <button
                key={t}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  i === activeTab ? 'bg-deep text-white' : 'text-ink-mute hover:bg-ice'
                }`}
                onClick={() => setActiveTab(i)}
              >
                {t}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={140} y={38}>
          <div className="relative mx-auto mt-12 flex max-w-4xl items-center justify-center gap-5 sm:gap-8">
            <button
              className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-deep text-white transition-transform hover:scale-105"
              onClick={() => setOffset((o) => o - 1)}
              aria-label="Previous template"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="grid flex-1 grid-cols-3 items-center gap-4 sm:gap-6">
              {ordered.map((t, i) => (
                <button
                  key={t.id}
                  className={`overflow-hidden rounded-2xl border border-deep/8 bg-white shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)] ${
                    i === 1 ? 'z-10 scale-110 shadow-[var(--shadow-lift)]' : 'opacity-90'
                  }`}
                  onClick={() => onNavigate('/dashboard')}
                >
                  <img src={t.thumbnailImg} alt={`Template ${t.id}`} className="aspect-[3/4] w-full object-cover object-top" />
                </button>
              ))}
            </div>

            <button
              className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-deep text-white transition-transform hover:scale-105"
              onClick={() => setOffset((o) => o + 1)}
              aria-label="Next template"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <button className="btn-secondary mt-12" onClick={() => onNavigate('/dashboard')}>
            Use This Template
          </button>
        </Reveal>
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
    <section className="bg-white py-20 sm:py-28">
      <div className="container-x text-center">
        <Reveal><span className="eyebrow">Categories</span></Reveal>
        <Reveal delay={90}>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            Get Inspired by Resume Samples from Various Industries
          </h2>
        </Reveal>
        <Reveal delay={170}>
          <div className="mx-auto mt-9 flex max-w-2xl flex-wrap justify-center gap-3">
            {industries.map((name) => (
              <button key={name} className="chip" onClick={() => onNavigate('/dashboard')}>
                {name}
              </button>
            ))}
          </div>
        </Reveal>
        <Reveal delay={240}>
          <button className="btn-primary mt-10" onClick={() => onNavigate('/dashboard')}>
            Explore All Samples <ArrowRight size={16} />
          </button>
        </Reveal>
      </div>
    </section>
  )
}

// ------------------------------------------------------------ testimonials

function Testimonials() {
  const testimonials = [
    {
      quote: 'I rebuilt my resume in one sitting and the ATS checker flagged exactly what my old resume was missing. Three interviews the same week.',
      name: 'Aarav Mehta', role: 'Backend Engineer', tint: 'bg-cream', ring: 'ring-sand',
    },
    {
      quote: 'The live preview is unreal — what you see is literally the PDF. No Word, no formatting disasters, no exporting ten times.',
      name: 'Sara Klein', role: 'Product Designer', tint: 'bg-ice', ring: 'ring-teal-100',
    },
    {
      quote: 'No signup was the hook, but the keyword suggestions are what got me the job. Added the missing skills, score jumped 20 points.',
      name: 'Rohit Sharma', role: 'Data Analyst', tint: 'bg-mint', ring: 'ring-green-100',
    },
  ]
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-x">
        <div className="text-center">
          <Reveal><span className="eyebrow">Success stories</span></Reveal>
          <Reveal delay={90}>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
              Real People. Real Offers.
            </h2>
          </Reveal>
        </div>

        <Reveal delay={140} y={36}>
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { v: '50K+', l: 'Resumes created' },
              { v: '4.9★', l: 'User rating' },
              { v: '5 min', l: 'Average build time' },
              { v: '92%', l: 'Pass ATS after check' },
            ].map((s) => (
              <div key={s.l} className="rounded-3xl border border-deep/8 bg-mist px-4 py-6 text-center">
                <div className="font-display text-2xl font-bold text-ink sm:text-3xl">{s.v}</div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 130} y={34}>
              <div className={`flex h-full flex-col rounded-[28px] ${t.tint} p-7 shadow-[var(--shadow-soft)] transition-transform duration-300 hover:-translate-y-1.5`}>
                <div className="flex gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">“{t.quote}”</p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-deep text-sm font-bold text-white">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-ink">{t.name}</div>
                    <div className="text-xs text-ink-mute">{t.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------- ats

function AtsSection({ onNavigate }) {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="container-x grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <div>
          <Reveal><span className="eyebrow">ATS score checker</span></Reveal>
          <Reveal delay={90}>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
              Beat the Bots.<br />Land on the Shortlist.
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-mute">
              75% of resumes are filtered out by ATS software before a human ever sees them. Run an
              instant ATS check on the resume you just built — with or without a job description —
              and fix the gaps in one click.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <ul className="mt-7 space-y-3.5">
              {[
                'Scanned automatically — no re-uploading your resume',
                'Match against a job description for keyword gaps',
                'Actionable fixes: skills, formatting, structure & more',
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 text-sm font-medium text-ink">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mint text-teal-500">
                    <CheckCircle2 size={12} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={340}>
            <button className="btn-primary mt-9" onClick={() => onNavigate('/ats')}>
              <Gauge size={17} /> Check My ATS Score
            </button>
          </Reveal>
        </div>

        <Reveal delay={150} y={40}>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="glow-blob right-0 top-4 h-72 w-72" />
            <div data-parallax="0.06" className="card relative p-7">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-faint">ATS Report</span>
                <span className="rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-bold text-success">PASSED</span>
              </div>

              <div className="relative mx-auto mt-5 h-44 w-44">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e8e8e8" strokeWidth="12" />
                  <circle
                    cx="60" cy="60" r="52" fill="none" stroke="#12b76a" strokeWidth="12"
                    strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 52 * 0.86} ${2 * Math.PI * 52}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-4xl font-extrabold text-ink">86</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">out of 100</span>
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

            <div data-parallax="-0.12" className="animate-float absolute -right-4 top-10 rounded-2xl border border-deep/8 bg-white px-3.5 py-2.5 shadow-[var(--shadow-lift)]">
              <div className="text-[9px] font-bold uppercase tracking-wider text-ink-faint">Missing keyword</div>
              <div className="font-display text-xs font-bold text-ink">kubernetes</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ dark CTA

function DarkCta({ onNavigate }) {
  return (
    <section className="relative overflow-hidden bg-deep py-24">
      <div className="glow-blob left-10 top-0 h-96 w-96 opacity-50" />
      <div className="glow-blob bottom-0 right-10 h-80 w-80 opacity-40" />
      <div className="container-x relative text-center">
        <Reveal><span className="eyebrow !text-brand-300">Download</span></Reveal>
        <Reveal delay={90}>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Get Hired Faster and<br />Land Your Dream Job
          </h2>
        </Reveal>
        <Reveal delay={180}>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/60">
            Start for free — your data stays on your device, your resume is ready in minutes.
          </p>
        </Reveal>
        <Reveal delay={270}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button className="btn-blue px-8 py-4 text-base" onClick={() => onNavigate('/dashboard')}>
              <LayoutTemplate size={17} /> Build My Resume — It's Free
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
              onClick={() => onNavigate('/ats')}
            >
              <Gauge size={18} /> Try the ATS Checker
            </button>
          </div>
        </Reveal>
        <Reveal delay={350}>
          <div className="mt-9 flex items-center justify-center gap-1.5 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} fill="currentColor" />)}
            <span className="ml-2 text-xs font-medium text-white/50">Loved by professionals worldwide</span>
          </div>
        </Reveal>
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
    <section id="faq" className="bg-white py-20 sm:py-28">
      <div className="container-x max-w-3xl">
        <div className="text-center">
          <Reveal><span className="eyebrow">FAQ</span></Reveal>
          <Reveal delay={90}>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
              Frequently Asked Questions
            </h2>
          </Reveal>
        </div>
        <Reveal delay={160}>
          <div className="mt-11 space-y-3">
            {faqs.map((f, i) => (
              <div
                key={i}
                className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
                  openIdx === i ? 'border-teal-500/30 bg-ice/50' : 'border-line hover:border-deep/15'
                }`}
              >
                <button
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                >
                  <span className="font-display text-sm font-bold text-ink sm:text-base">{f.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-ink-faint transition-transform duration-300 ${openIdx === i ? 'rotate-180 text-teal-500' : ''}`}
                  />
                </button>
                <div className={`grid transition-all duration-300 ${openIdx === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-ink-mute">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={220}>
          <p className="mt-9 text-center text-xs text-ink-faint">
            More questions? Explore the builder — it's free and needs no sign-up.
          </p>
        </Reveal>
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
    <footer className="border-t border-deep/8 bg-mist">
      <div className="container-x grid grid-cols-1 gap-10 py-14 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <button className="flex items-center gap-2.5" onClick={() => onNavigate('/')}>
            {LOGO}
            <span className="font-display text-base font-bold tracking-tight text-ink">
              Resume<span className="text-brand-500">Xpert</span>
            </span>
          </button>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-mute">
            The free resume builder with a built-in ATS score checker. Private by design — your
            data never leaves your browser.
          </p>
          <div className="mt-6">
            <div className="text-xs font-bold uppercase tracking-wider text-ink-faint">Stay updated</div>
            <div className="mt-2 flex max-w-xs gap-2">
              <input className="input-base !py-2.5 text-xs" placeholder="Enter your email" />
              <button className="btn-primary shrink-0 !px-4 !py-2.5 text-xs">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {cols.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-bold uppercase tracking-wider text-ink-faint">{col.title}</div>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <button
                      className="text-sm text-ink-mute transition-colors hover:text-teal-500"
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
      <div className="border-t border-deep/8">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-ink-faint sm:flex-row">
          <span>© {new Date().getFullYear()} ResumeXpert. Crafted with care by Abhishek.</span>
          <div className="flex gap-5">
            <button className="hover:text-teal-500">Privacy Policy</button>
            <button className="hover:text-teal-500">Terms of Service</button>
            <button className="hover:text-teal-500">Cookie Settings</button>
          </div>
        </div>
      </div>
    </footer>
  )
}

// --------------------------------------------------------------------- page

export default function LandingPage() {
  const navigate = useNavigate()

  const onNavigate = (href, isRoute) => handleNav(navigate, href, isRoute)

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={onNavigate} />
      <main>
        <Hero onNavigate={onNavigate} />
        <Marquee />
        <HowItWorks onNavigate={onNavigate} />
        <WritingTips />
        <LivePreview onNavigate={onNavigate} />
        <Templates onNavigate={onNavigate} />
        <Industries onNavigate={onNavigate} />
        <AtsSection onNavigate={onNavigate} />
        <Testimonials />
        <DarkCta onNavigate={onNavigate} />
        <Faq />
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
