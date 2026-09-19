import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle2, FileText, Gauge, Loader2, RefreshCw, UploadCloud, XCircle,
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { listResumes, getResume } from '../lib/resumeStore'
import { computeAtsReport, computeTextAtsReport, extractTextFromPdf, bandFor } from '../lib/ats'
import toast from 'react-hot-toast'

// ------------------------------------------------------------------ gauge

const ScoreGauge = ({ score, band }) => {
  const [shown, setShown] = useState(0)
  const r = 52
  const circumference = 2 * Math.PI * r

  useEffect(() => {
    let frame
    const start = performance.now()
    const tick = (t) => {
      const p = Math.min((t - start) / 900, 1)
      setShown(Math.round(score * (1 - Math.pow(1 - p, 3))))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [score])

  return (
    <div className="relative mx-auto h-48 w-48">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e7ecf3" strokeWidth="11" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={band.color} strokeWidth="11" strokeLinecap="round"
          strokeDasharray={`${circumference * (shown / 100)} ${circumference}`}
          style={{ transition: 'stroke .4s' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl font-extrabold tracking-tight text-ink">{shown}</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">out of 100</span>
        <span className="mt-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white" style={{ background: band.color }}>
          {band.label}
        </span>
      </div>
    </div>
  )
}

const CategoryBar = ({ label, score, max, issues }) => {
  const pct = Math.round((score / max) * 100)
  const color = pct >= 80 ? 'bg-success' : pct >= 50 ? 'bg-warning' : 'bg-danger'
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <span className="text-xs font-bold text-ink-soft">{score}<span className="text-slate-400">/{max}</span></span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-mist">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      {issues.map((issue) => (
        <p key={issue} className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-slate-500">
          <XCircle size={12} className="mt-0.5 shrink-0 text-amber-500" /> {issue}
        </p>
      ))}
    </div>
  )
}

const KeywordChip = ({ term, ok }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
      ok ? 'bg-success/10 text-success' : 'bg-red-50 text-red-500'
    }`}
  >
    {ok ? <CheckCircle2 size={11} /> : <XCircle size={11} />} {term}
  </span>
)

// ------------------------------------------------------------------- page

const AtsChecker = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [resumes, setResumes] = useState([])
  const [selectedId, setSelectedId] = useState(params.get('resume') || '')
  const [jdText, setJdText] = useState('')
  const [jdOpen, setJdOpen] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [report, setReport] = useState(null)
  const [reportSource, setReportSource] = useState(null) // {kind:'resume'|'pdf', label, id?}
  const [parsingPdf, setParsingPdf] = useState(false)
  const pdfTextRef = useRef(null)
  const [pdfName, setPdfName] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    listResumes().then((all) => {
      setResumes(all)
      // auto-load: ?resume=id → most recently edited resume
      if (!params.get('resume') && all.length) {
        setSelectedId(all[0]._id)
      }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const selectedResume = useMemo(
    () => resumes.find((r) => r._id === selectedId) || null,
    [resumes, selectedId]
  )

  const handleFile = async (file) => {
    if (!file) return
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please upload a PDF file')
      return
    }
    try {
      setParsingPdf(true)
      const text = await extractTextFromPdf(file)
      if (!text.trim()) {
        toast.error('Could not read text from this PDF (is it a scan?)')
        return
      }
      pdfTextRef.current = text
      setPdfName(file.name)
      setReport(null)
      toast.success(`Loaded “${file.name}”`)
    } catch (err) {
      console.error('PDF parse failed:', err)
      toast.error('Failed to read the PDF file')
    } finally {
      setParsingPdf(false)
    }
  }

  const runAnalysis = async () => {
    try {
      setAnalyzing(true)
      // slight delay so the button state is visible on fast local runs
      await new Promise((r) => setTimeout(r, 350))

      if (pdfTextRef.current) {
        const rep = computeTextAtsReport({ text: pdfTextRef.current, jdText })
        setReport(rep)
        setReportSource({ kind: 'pdf', label: pdfName })
        return
      }

      // always read the latest saved state from IndexedDB so the check
      // reflects edits made after this page was opened
      const resume = (selectedId ? await getResume(selectedId) : null) || selectedResume
      if (!resume) {
        toast.error('Create or select a resume first')
        return
      }
      const rep = computeAtsReport({ resume, jdText })
      setReport(rep)
      setReportSource({ kind: 'resume', label: resume.title, id: resume._id })
    } catch (err) {
      console.error('ATS analysis failed:', err)
      toast.error('Analysis failed — please try again')
    } finally {
      setAnalyzing(false)
    }
  }

  const clearPdf = () => {
    pdfTextRef.current = null
    setPdfName('')
    setReport(null)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8">
        <div className="mb-4">
          <button
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-brand-700"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={15} /> Back
          </button>
        </div>

        <span className="eyebrow">ATS score checker</span>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Will your resume pass the bots?
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
          Your resume is picked up automatically — no downloading and re-uploading. Optionally
          paste a job description to see exactly which keywords you're missing.
        </p>

        {/* source card */}
        <div className="card mt-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <FileText size={20} />
              </span>
              <div>
                <div className="text-sm font-bold text-ink">
                  {pdfName ? pdfName : selectedResume ? selectedResume.title : 'No resume found'}
                </div>
                <div className="text-xs text-slate-400">
                  {pdfName ? (
                    'Uploaded PDF'
                  ) : selectedResume ? (
                    <>Loaded automatically — your most recent resume</>
                  ) : (
                    'Create a resume first, or upload a PDF below'
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {resumes.length > 1 && !pdfName && (
                <select
                  className="input-base !w-auto !py-2.5 text-xs font-semibold"
                  value={selectedId}
                  onChange={(e) => { setSelectedId(e.target.value); setReport(null) }}
                >
                  {resumes.map((r) => (
                    <option key={r._id} value={r._id}>{r.title}</option>
                  ))}
                </select>
              )}
              {pdfName ? (
                <button className="btn-secondary !py-2.5 text-xs" onClick={clearPdf}>
                  Remove PDF
                </button>
              ) : (
                <button className="btn-secondary !py-2.5 text-xs" onClick={() => fileInputRef.current?.click()}>
                  <UploadCloud size={14} /> Upload another (PDF)
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          </div>

          {/* JD toggle */}
          <div className="mt-5 rounded-2xl bg-mist p-4">
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-ink">Analyze against a job description</div>
                <div className="text-xs text-slate-400">Optional — get keyword-level matching</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={jdOpen}
                onClick={() => setJdOpen(!jdOpen)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${jdOpen ? 'bg-brand-600' : 'bg-line'}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${jdOpen ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </label>
            {jdOpen && (
              <textarea
                className="input-base mt-3 min-h-[120px] resize-y bg-white text-sm"
                placeholder="Paste the job description here — responsibilities, requirements, tools…"
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
              />
            )}
          </div>

          <button className="btn-primary mt-5 w-full !py-3.5 text-base" onClick={runAnalysis} disabled={analyzing || parsingPdf}>
            {analyzing ? <><Loader2 size={18} className="animate-spin" /> Analyzing…</>
              : parsingPdf ? <><Loader2 size={18} className="animate-spin" /> Reading PDF…</>
              : <><Gauge size={18} /> Run ATS Check</>}
          </button>
        </div>

        {/* report */}
        {report && reportSource && (
          <div className="mt-6 animate-fade-in-up space-y-5">
            {/* score hero */}
            <div className="card p-7">
              <div className="grid grid-cols-1 items-center gap-7 sm:grid-cols-[auto_1fr]">
                <ScoreGauge score={report.score} band={report.band} />

                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {reportSource.kind === 'pdf' ? 'Uploaded PDF' : 'Your resume'}: {reportSource.label}
                  </div>
                  <h2 className="font-display mt-1 text-2xl font-bold text-ink">
                    {report.band.tone === 'great' && "Great — you're ready to apply!"}
                    {report.band.tone === 'ok' && 'Solid — a few tweaks will make it stronger.'}
                    {report.band.tone === 'meh' && 'Needs work before you hit apply.'}
                    {report.band.tone === 'bad' && 'This resume will struggle with ATS filters.'}
                  </h2>

                  {report.mode === 'jd' && report.keywords ? (
                    <div className="mt-3 flex flex-wrap gap-3">
                      <div className="rounded-2xl bg-mist px-4 py-2.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Keyword coverage</div>
                        <div className="font-display text-xl font-bold text-ink">{report.keywords.coverage}%</div>
                      </div>
                      <div className="rounded-2xl bg-mist px-4 py-2.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Matched</div>
                        <div className="font-display text-xl font-bold text-success">{report.keywords.matched.length}</div>
                      </div>
                      <div className="rounded-2xl bg-mist px-4 py-2.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Missing</div>
                        <div className="font-display text-xl font-bold text-red-500">{report.keywords.missing.length}</div>
                      </div>
                      <div className="rounded-2xl bg-mist px-4 py-2.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Words</div>
                        <div className="font-display text-xl font-bold text-ink">{report.stats.words}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 flex flex-wrap gap-3">
                      <div className="rounded-2xl bg-mist px-4 py-2.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Word count</div>
                        <div className="font-display text-xl font-bold text-ink">{report.stats.words}</div>
                      </div>
                      <div className="rounded-2xl bg-mist px-4 py-2.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Categories passed</div>
                        <div className="font-display text-xl font-bold text-ink">
                          {report.categories.filter((c) => c.score / c.max >= 0.8).length}/{report.categories.length}
                        </div>
                      </div>
                    </div>
                  )}

                  {reportSource.kind === 'resume' && (
                    <button
                      className="btn-secondary mt-4 !py-2.5 text-xs"
                      onClick={() => navigate(`/resume/${reportSource.id}`)}
                    >
                      Improve in Editor
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* keywords (JD mode) */}
            {report.mode === 'jd' && report.keywords && (
              <div className="card p-6">
                <h3 className="font-display text-base font-bold text-ink">Keyword analysis</h3>
                <p className="mt-1 text-xs text-slate-400">
                  {report.keywords.analyzed} key terms extracted from the job description, ranked by importance.
                </p>
                <div className="mt-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-success">Matched</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {report.keywords.matched.length
                      ? report.keywords.matched.map((k) => <KeywordChip key={k} term={k} ok />)
                      : <span className="text-xs text-slate-400">None — add these terms where they honestly apply.</span>}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-red-400">Missing</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {report.keywords.missing.length
                      ? report.keywords.missing.map((k) => <KeywordChip key={k} term={k} ok={false} />)
                      : <span className="text-xs text-slate-400">Nothing missing — impressive!</span>}
                  </div>
                </div>
              </div>
            )}

            {/* category breakdown */}
            <div>
              <h3 className="font-display mb-3 text-base font-bold text-ink">Breakdown</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {report.categories.map((cat) => (
                  <CategoryBar key={cat.key} {...cat} />
                ))}
              </div>
            </div>

            {/* suggestions */}
            {report.suggestions.length > 0 && (
              <div className="card p-6">
                <h3 className="font-display text-base font-bold text-ink">How to improve your score</h3>
                <ul className="mt-4 space-y-2.5">
                  {report.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-700">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
                {reportSource.kind === 'resume' && (
                  <button
                    className="btn-primary mt-5"
                    onClick={() => navigate(`/resume/${reportSource.id}`)}
                  >
                    Fix it in the Editor
                  </button>
                )}
              </div>
            )}

            <div className="flex justify-center pb-4">
              <button className="btn-ghost text-xs" onClick={() => setReport(null)}>
                <RefreshCw size={13} /> Run again
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AtsChecker
