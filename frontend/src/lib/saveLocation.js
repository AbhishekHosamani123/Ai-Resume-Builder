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

// Classic download — directly downloads into browser's default download folder
// with the exact filename given by the user, without prompting for a folder location.
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

// Direct download handler: downloads directly with zero folder picker prompts
export async function saveWithChosenFolder(blob, filename) {
  triggerAnchorDownload(blob, filename)
  return { ok: true, method: 'download' }
}

