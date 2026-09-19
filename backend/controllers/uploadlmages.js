import Resume from '../models/resumeModel.js'
import upload from '../middleware/uploadMiddleware.js'

// Convert an uploaded file (held in memory by multer) to a data URL so it can
// be stored directly in MongoDB. This works on any host, including serverless
// platforms like Vercel that have a read-only filesystem.
const toDataUrl = (file) => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`

export const uploadResumeImages = async (req, res) => {
    try {
        // CONFIGURE MULTER TO HANDLE IMAGES
        const uploadFields = upload.fields([{ name: "thumbnail" }, { name: "profileImage" }]);

        uploadFields(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: "File upload failed", error: err.message })
            }

            const resumeId = req.params.id;
            const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id })

            if (!resume) {
                return res.status(404).json({ message: "Resume not found or unauthorized" })
            }

            const newThumbnail = req.files?.thumbnail?.[0];
            const newProfileImage = req.files?.profileImage?.[0];

            if (newThumbnail) {
                resume.thumbnailLink = toDataUrl(newThumbnail);
            }

            // Same for profile preview image
            if (newProfileImage) {
                if (!resume.profileInfo) resume.profileInfo = {}
                resume.profileInfo.profilePreviewUrl = toDataUrl(newProfileImage);
            }

            await resume.save();
            res.status(200).json({
                message: "Image uploaded successfully",
                thumbnailLink: resume.thumbnailLink,
                profilePreviewUrl: resume.profileInfo?.profilePreviewUrl
            })
        })
    } catch (err) {
        console.error('Error uploading images:', err);
        res.status(500).json({
            message: "Failed to upload images",
            error: err.message
        })
    }
}
