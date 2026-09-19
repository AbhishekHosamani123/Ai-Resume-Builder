import multer from 'multer'

// Use memory storage instead of disk storage: serverless platforms (e.g. Vercel)
// have a read-only filesystem, so uploaded images are held in memory and stored
// in MongoDB as data URLs (see controllers/uploadlmages.js).
const storage = multer.memoryStorage()

// FILE FILTER
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Only .jpeg, .jpg, .png are allowed formats"), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        // Keep under Vercel's ~4.5MB request body limit
        fileSize: 2 * 1024 * 1024, // 2MB limit
        files: 2 // Maximum 2 files
    }
})

export default upload
