// Resume data layer. Replaces the previous REST API with fully local,
// offline-first persistence:
//   - resumes live in IndexedDB (structured, large quota for image data URLs)
//   - lightweight profile/preferences live in localStorage
// Every resume keeps the same shape the UI already expects
// (profileInfo, contactInfo, workExperience, education, skills, ...).

import { idb, STORES } from './idb'

const RESUMES = STORES.RESUMES

function uid() {
  if (crypto.randomUUID) return crypto.randomUUID()
  return 'r-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10)
}

function blankResume(title) {
  return {
    _id: uid(),
    title: title || 'Untitled Resume',
    thumbnailLink: '',
    template: { theme: '01', colorPalette: [] },
    profileInfo: { profilePreviewUrl: '', fullName: '', designation: '', summary: '' },
    contactInfo: { email: '', phone: '', location: '', linkedin: '', github: '', website: '' },
    workExperience: [{ company: '', role: '', startDate: '', endDate: '', description: '' }],
    education: [{ degree: '', institution: '', startDate: '', endDate: '' }],
    skills: [{ name: '', progress: 0 }],
    projects: [{ title: '', description: '', github: '', liveDemo: '' }],
    certifications: [{ title: '', issuer: '', year: '' }],
    languages: [{ name: '', progress: 0 }],
    interests: [''],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// ---------- Resumes ----------

export async function listResumes() {
  const all = await idb.getAll(RESUMES)
  return all.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

export async function getResume(id) {
  return idb.get(RESUMES, id)
}

export async function createResume({ title } = {}) {
  const resume = blankResume(title)
  await idb.put(RESUMES, undefined, resume)
  setRecentResumeId(resume._id)
  return resume
}

export async function updateResume(id, patch) {
  const existing = await idb.get(RESUMES, id)
  if (!existing) throw new Error('Resume not found')
  const updated = { ...existing, ...patch, _id: existing._id, createdAt: existing.createdAt, updatedAt: new Date().toISOString() }
  await idb.put(RESUMES, undefined, updated)
  return updated
}

export async function deleteResume(id) {
  await idb.delete(RESUMES, id)
  if (getRecentResumeId() === id) localStorage.removeItem('rx_recentResume')
}

// Add suggested keywords to a resume's skills section (deduped,
// case-insensitive). Returns the updated resume.
export async function addSkillsToResume(id, terms) {
  const resume = await idb.get(RESUMES, id)
  if (!resume) throw new Error('Resume not found')
  const existing = (resume.skills || []).map((s) => (s.name || '').trim().toLowerCase())
  const added = []
  const skills = [...(resume.skills || [])]
  for (const term of terms) {
    const t = String(term).trim()
    if (!t) continue
    if (existing.includes(t.toLowerCase())) continue
    skills.push({ name: t, progress: 75 })
    existing.push(t.toLowerCase())
    added.push(t)
  }
  if (added.length) {
    await updateResume(id, { skills })
  }
  return { resume: await idb.get(RESUMES, id), added }
}

// ---------- Local profile & preferences (localStorage) ----------

const PROFILE_KEY = 'rx_profile'

export function getProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY)) || { name: '', email: '' }
  } catch {
    return { name: '', email: '' }
  }
}

export function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile || { name: '', email: '' }))
}

export function getRecentResumeId() {
  return localStorage.getItem('rx_recentResume') || null
}

export function setRecentResumeId(id) {
  localStorage.setItem('rx_recentResume', id)
}

// The user's actual name — taken from the Full Name in their most recently
// updated resume (there is no login; the resume IS the profile).
export async function getUserName() {
  const resumes = await listResumes()
  for (const r of resumes) {
    const name = r.profileInfo?.fullName?.trim()
    if (name) return name
  }
  return ''
}
