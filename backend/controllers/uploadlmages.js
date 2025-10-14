import fs from 'fs'
import path from 'path'
import Resume from '../models/resumeModel.js'
import upload from '../middleware/uploadMiddleware.js'
import {error} from 'console' 

export const uploadResumeImages = async (req, res) => {
    try {
        // CONFIGURE MULTER TO HANDLE IMAGES
        const uploadFields = upload.fields([{ name: "thumbnail" }, { name: "profileImage" }]);
        
        uploadFields(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ message: "File upload failed", error: err.message })
                }
                
                const resumeId = req.params.id;
                const resume = await Resume.findOne({_id: resumeId, userId: req.user._id}) 
             

                if (!resume) {
                    return res.status(404).json({ message: "Resume not found or unauthorized" })
                }

                // USE PROCESS CWD TO LOCATE UPLOADS FOLDER
                const uploadsFolder = path.join(process.cwd(), "uploads")
                
                // Ensure uploads directory exists
                if (!fs.existsSync(uploadsFolder)) {
                    fs.mkdirSync(uploadsFolder, { recursive: true });
                }
                const baseURL = `${req.protocol}://${req.get("host")}`;

                const newThumbnail = req.files.thumbnail?.[0];
                const newProfileImage = req.files.profileImage?.[0];

               if (newThumbnail) {
                    if (resume.thumbnailLink) {
                        const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
                        if (fs.existsSync(oldThumbnail)) 
                            fs.unlinkSync(oldThumbnail)
                    }
                    resume.thumbnailLink = `${baseURL}/uploads/${newThumbnail.filename}`;
                }
                    
                // Same for profilepreview image
                if (newProfileImage) {
                    if (resume.profileInfo?.profilePreviewUrl) {
                        const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
                        if (fs.existsSync(oldProfile))
                            fs.unlinkSync(oldProfile)
                    }
                    resume.profileInfo.profilePreviewUrl = `${baseURL}/uploads/${newProfileImage.filename}`;
                }

                await resume.save();
                res.status(200).json({
                    message: "Image uploaded successfully",
                    thumbnailLink: resume.thumbnailLink,
                    profilePreviewUrl: resume.profileInfo.profilePreviewUrl
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