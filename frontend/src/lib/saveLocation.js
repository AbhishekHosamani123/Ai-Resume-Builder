// Auto-save downloads into a user-chosen folder (e.g. "output_resume") with
// NO "Save As" dialog after a one-time setup.
//
// How it works:
//  - The first download asks the user to pick a folder ONCE via the File
//    System Access API (showDirectoryPicker). The directory handle is
//    persisted in IndexedDB, so it survives reloads.
//  - Every download after that writes the file straight into that folder —
//    silently, with no dialogs.
//  - Browsers without the API (Firefox/Safari) fall back to the classic
//    anchor download, which goes to the browser's default download folder.

import { kv } from './idb'
import toast from 'react-hot-toast'

const SAVE_DIR_KEY = 'rx_saveDir'
const DECLINED_KEY = 'rx_saveDirDeclined'

// Chrome stores FileSystemDirectoryHandle as structured-cloneable since v86,
// so it round-trips through IndexedDB. Firefox/Safari don't implement
// showDirectoryPicker at all, so we guard everything.
const supported = typeof window !== 'undefined' && typeof window.showDirectoryPicker === 'function'

export function isAutoSaveSupported() {
  return supported
}

export async function getSavedDir() {
  if (!supported) return null
  try {
    const handle = await kv.get(SAVE_DIR_KEY)
    if (!handle) return null
    // Re-verify permission; Chrome may drop it after a while
    const opts = { mode: 'readwrite' }
    if ((await handle.queryPermission?.(opts)) === 'granted') return handle
    return handle // permission needs prompting — caller decides what to do
  } catch {
    return null
  }
}

export async function hasGrantedPermission(handle) {
  if (!handle) return false
  try {
    return (await handle.queryPermission({ mode: 'readwrite' })) === 'granted'
  } catch {
    return false
  }
}

// Must be called from a user gesture (a click). Opens the OS folder picker
// ONCE. Returns the handle or null if the user cancelled.
export async function pickSaveFolder() {
  if (!supported) return null
  try {
    const handle = await window.showDirectoryPicker({
      mode: 'readwrite',
      startIn: 'documents',
      id: 'resume-exports',
    })
    await kv.set(SAVE_DIR_KEY, handle)
    return handle
  } catch {
    return null // user cancelled
  }
}

// Write a blob into the saved folder. Returns one of:
//   { ok: true, method: 'folder', dirName }  — written silently, no dialog
//   { ok: true, method: 'download' }         — fallback: default Downloads folder
//   { ok: false, cancelled }                 — picker was cancelled; caller should
//                                              fall back to anchor download itself
export async function saveBlobAuto(blob, filename) {
  const handle = await getSavedDir()
  if (handle && (await hasGrantedPermission(handle))) {
    try {
      const fileHandle = await handle.getFileHandle(filename, { create: true })
      const writable = await fileHandle.createWritable()
      await writable.write(blob)
      await writable.close()
      return { ok: true, method: 'folder', dirName: handle.name }
    } catch (err) {
      console.error('Auto-save to folder failed, falling back to browser download:', err)
    }
  }
  triggerAnchorDownload(blob, filename)
  return { ok: true, method: 'download' }
}

// Classic download — goes to the browser's download folder (may show "Save As"
// if the user has "ask where to save" enabled in the BROWSER settings).
export function triggerAnchorDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 3000)
}

// Full user-facing flow used by the Download button:
//  1. If a folder is already saved & permitted → silent save.
//  2. Else (first download ever) ask ONCE to pick a folder, e.g.
//     "output_resume" — user gesture is active inside click handlers.
//  3. If the user declines, remember it and use the classic anchor download
//     from then on (browser's default download folder) — never nag again.
export async function saveWithChosenFolder(blob, filename) {
  if (!supported) return saveBlobAuto(blob, filename)

  let declined = false
  try { declined = (await kv.get(DECLINED_KEY)) === true } catch { declined = false }

  let handle = declined ? null : await getSavedDir()
  if (handle && !(await hasGrantedPermission(handle))) {
    // Chrome requires a fresh user activation to re-grant — try silently first
    try {
      if ((await handle.requestPermission({ mode: 'readwrite' })) !== 'granted') handle = null
    } catch {
      handle = null
    }
  }
  if (!handle && !declined) {
    // One-time setup: let the user choose where resumes are saved (e.g. an
    // "output_resume" folder). Afterwards every download is fully automatic.
    toast('Pick a folder to auto-save resumes into (one time only)', { icon: '📁', duration: 6000 })
    handle = await pickSaveFolder()
    if (!handle) {
      // user cancelled — stop asking in the future, just download normally
      try { await kv.set(DECLINED_KEY, true) } catch { /* ignore */ }
      return saveBlobAuto(blob, filename)
    }
    toast.success(`Resumes will now save automatically to "${handle.name}"`, { duration: 5000 })
  }
  return saveBlobAuto(blob, filename)
}
