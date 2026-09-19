// Minimal promise-based IndexedDB wrapper.
// IndexedDB is the primary data store for this app: it is persistent, async,
// supports structured data and large values (resume thumbnails are stored as
// data URLs), and works fully offline. Small preferences (profile name, last
// opened resume) live in localStorage instead — see lib/profile.js.

const DB_NAME = 'resumexpert'
const DB_VERSION = 1
const STORE_RESUMES = 'resumes'
const STORE_KV = 'kv'

let dbPromise = null

function openDB() {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_RESUMES)) {
        const store = db.createObjectStore(STORE_RESUMES, { keyPath: '_id' })
        store.createIndex('updatedAt', 'updatedAt')
      }
      if (!db.objectStoreNames.contains(STORE_KV)) {
        db.createObjectStore(STORE_KV)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  return dbPromise
}

function promisify(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function withStore(name, mode, fn) {
  const db = await openDB()
  const tx = db.transaction(name, mode)
  const result = await fn(tx.objectStore(name))
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(result)
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

export const idb = {
  async put(store, key, value) {
    return withStore(store, 'readwrite', (s) => promisify(key === undefined ? s.put(value) : s.put(value, key)))
  },
  async get(store, key) {
    return withStore(store, 'readonly', (s) => promisify(s.get(key)))
  },
  async getAll(store) {
    return withStore(store, 'readonly', (s) => promisify(s.getAll()))
  },
  async delete(store, key) {
    return withStore(store, 'readwrite', (s) => promisify(s.delete(key)))
  },
}

export const kv = {
  get: (key) => idb.get(STORE_KV, key),
  set: (key, value) => idb.put(STORE_KV, key, value),
}

export const STORES = { RESUMES: STORE_RESUMES }
