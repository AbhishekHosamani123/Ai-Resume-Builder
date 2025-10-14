import Resume from '../models/resumeModel.js'
import fs from 'fs'
import path from 'path' ;


// Helper to sanitize and normalize resume payload
const sanitizeResumePayload = (payload) => {
    const safe = {};
    if (!payload || typeof payload !== 'object') return safe;

    // Do not allow overriding identifiers
    const {
        _id: _ignoreId,
        id: _ignoreId2,
        userId: _ignoreUserId,
        createdAt: _ignoreCreated,
        updatedAt: _ignoreUpdated,
        ...rest
    } = payload;

    // Title
    if (typeof rest.title === 'string') safe.title = rest.title;

    // Thumbnail link
    if (typeof rest.thumbnailLink === 'string') safe.thumbnailLink = rest.thumbnailLink;

    // Template
    if (rest.template && typeof rest.template === 'object') {
        safe.template = {
            theme: typeof rest.template.theme === 'string' ? rest.template.theme : '01',
            colorPalette: Array.isArray(rest.template.colorPalette)
                ? rest.template.colorPalette.map(String)
                : []
        }
    }

    // Profile info
    if (rest.profileInfo && typeof rest.profileInfo === 'object') {
        safe.profileInfo = {
            profilePreviewUrl: typeof rest.profileInfo.profilePreviewUrl === 'string' ? rest.profileInfo.profilePreviewUrl : '',
            fullName: typeof rest.profileInfo.fullName === 'string' ? rest.profileInfo.fullName : '',
            designation: typeof rest.profileInfo.designation === 'string' ? rest.profileInfo.designation : '',
            summary: typeof rest.profileInfo.summary === 'string' ? rest.profileInfo.summary : '',
        }
    }

    // Contact info
    if (rest.contactInfo && typeof rest.contactInfo === 'object') {
        safe.contactInfo = {
            email: typeof rest.contactInfo.email === 'string' ? rest.contactInfo.email : '',
            phone: typeof rest.contactInfo.phone === 'string' ? rest.contactInfo.phone : '',
            location: typeof rest.contactInfo.location === 'string' ? rest.contactInfo.location : '',
            linkedin: typeof rest.contactInfo.linkedin === 'string' ? rest.contactInfo.linkedin : '',
            github: typeof rest.contactInfo.github === 'string' ? rest.contactInfo.github : '',
            website: typeof rest.contactInfo.website === 'string' ? rest.contactInfo.website : '',
        }
    }

    // Normalizers
    const normalizeArrayOfObjects = (arr, shape) => {
        if (!Array.isArray(arr)) return [];
        return arr.map(item => {
            const normalized = {};
            Object.entries(shape).forEach(([key, type]) => {
                if (type === 'string') normalized[key] = typeof item?.[key] === 'string' ? item[key] : '';
                if (type === 'number') {
                    const n = Number(item?.[key]);
                    normalized[key] = Number.isFinite(n) ? n : 0;
                }
            })
            return normalized;
        })
    }

    // Work experience
    if (rest.workExperience) {
        safe.workExperience = normalizeArrayOfObjects(rest.workExperience, {
            company: 'string', role: 'string', startDate: 'string', endDate: 'string', description: 'string'
        })
    }

    // Education
    if (rest.education) {
        safe.education = normalizeArrayOfObjects(rest.education, {
            degree: 'string', institution: 'string', startDate: 'string', endDate: 'string'
        })
    }

    // Skills
    if (rest.skills) {
        safe.skills = normalizeArrayOfObjects(rest.skills, { name: 'string', progress: 'number' })
            .map(s => ({ ...s, progress: Math.max(0, Math.min(100, s.progress)) }))
    }

    // Projects
    if (rest.projects) {
        safe.projects = normalizeArrayOfObjects(rest.projects, {
            title: 'string', description: 'string', github: 'string', liveDemo: 'string'
        })
    }

    // Certifications
    if (rest.certifications) {
        safe.certifications = normalizeArrayOfObjects(rest.certifications, {
            title: 'string', issuer: 'string', year: 'string'
        })
    }

    // Languages
    if (rest.languages) {
        safe.languages = normalizeArrayOfObjects(rest.languages, { name: 'string', progress: 'number' })
            .map(l => ({ ...l, progress: Math.max(0, Math.min(100, l.progress)) }))
    }

    // Interests
    if (rest.interests) {
        safe.interests = Array.isArray(rest.interests)
            ? rest.interests.map(v => String(v)).filter(v => v.trim() !== '')
            : []
    }

    return safe;
}

export const createResume = async (req, res) => {
    try {
        const { title } = req.body;

        // DEFAULT T (Incomplete comment or code)
         // Default template
        const defaultResumeData = {
            profileInfo: {
                profilePreviewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            interests: [''],
        };

        const newResume = await Resume.create({
            userId: req.user._id,
            title,
            ...defaultResumeData,
            ...req.body
        })
        res.status(201).json(newResume)
    } 
    catch (error) {
        res.status(500).json({ message: "Failed to create resume", error: error.message } )
    }
}

// GET FUNCTION
export const getUserResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id }).sort({
            updatedAt: -1
        });
        res.json(resumes)
    }
     catch (error) {
        res.status(500).json({ message: "Failed to get resumes", error: error.message })
    }
}

// GET RESUME BY ID
export const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id })

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" })
        }
        res.json(resume)
    } catch (error) {
        res.status(500).json({ message: "Failed to get resumes", error: error.message })
    }
}


// update resumes
export const updateResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found or not authorized" })
        }

        // MERGE UPDATED RESUMES with sanitized payload
        const sanitized = sanitizeResumePayload(req.body);
        Object.assign(resume, sanitized)
        
        // Migrate old data structure to new schema
        if (resume.profileInfo && resume.profileInfo.profileImg) {
            resume.profileInfo.profilePreviewUrl = resume.profileInfo.profileImg;
            delete resume.profileInfo.profileImg;
        }
        
        if (resume.profileInfo && resume.profileInfo.previewUrl) {
            resume.profileInfo.profilePreviewUrl = resume.profileInfo.previewUrl;
            delete resume.profileInfo.previewUrl;
        }
        
        // Validate and fix data types before saving
        if (resume.languages && Array.isArray(resume.languages)) {
            resume.languages.forEach((lang, index) => {
                if (lang && typeof lang === 'object') {
                    if (typeof lang.progress !== 'number') {
                        lang.progress = parseInt(lang.progress) || 0;
                    }
                    // Ensure progress is within valid range
                    if (lang.progress < 0) lang.progress = 0;
                    if (lang.progress > 100) lang.progress = 100;
                }
            });
        }
        
        // Validate skills progress as well
        if (resume.skills && Array.isArray(resume.skills)) {
            resume.skills.forEach((skill, index) => {
                if (skill && typeof skill === 'object') {
                    if (typeof skill.progress !== 'number') {
                        skill.progress = parseInt(skill.progress) || 0;
                    }
                    // Ensure progress is within valid range
                    if (skill.progress < 0) skill.progress = 0;
                    if (skill.progress > 100) skill.progress = 100;
                }
            });
        }
        
        if (resume.interests && Array.isArray(resume.interests)) {
            resume.interests = resume.interests.filter(interest => interest && interest.trim() !== '');
        }
        
        // Ensure profileInfo has the required field
        if (!resume.profileInfo) {
            resume.profileInfo = {};
        }
        if (!resume.profileInfo.profilePreviewUrl) {
            resume.profileInfo.profilePreviewUrl = '';
        }
        
        // Ensure all required fields exist
        if (!resume.contactInfo) {
            resume.contactInfo = {};
        }
        if (!resume.workExperience) {
            resume.workExperience = [];
        }
        if (!resume.education) {
            resume.education = [];
        }
        if (!resume.skills) {
            resume.skills = [];
        }
        if (!resume.projects) {
            resume.projects = [];
        }
        if (!resume.certifications) {
            resume.certifications = [];
        }
        if (!resume.languages) {
            resume.languages = [];
        }
        if (!resume.interests) {
            resume.interests = [];
        }
        
        // SAVE UPDATED RESUME
        const savedResume = await resume.save();
        res.json(savedResume);

    } catch (error) {
        console.error('Update resume error:', error);
        console.error('Error stack:', error.stack);
        
        if (error.name === 'ValidationError') {
            console.error('Validation errors:', error.errors);
            return res.status(400).json({ 
                message: "Validation error", 
                errors: error.errors 
            });
        }
        
        if (error.name === 'CastError') {
            console.error('Cast error:', error.message);
            return res.status(400).json({ 
                message: "Invalid data format", 
                error: error.message
            });
        }
        
        res.status(500).json({ 
            message: "Failed to update resume", 
            error: error.message
        }) 
    }
}


// DELETE RESUME
export const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id
        })

        if (!resume) {
            return res.status(404).json({ message: "Resume not found or not authorized" })
        }
        
        // CREATE A UPLOADS FOLDER AND STORE THE RESUME THERE 
        const uploadsFolder = path.join(process.cwd(), 'uploads')

        // DELETE THUMBNAIL FUNCTION
        if (resume.thumbnailLink) {
            const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink))
            if (fs.existsSync(oldThumbnail)) {
                fs.unlinkSync(oldThumbnail)
            }
        }

        if (resume.profileInfo.profilePreviewUrl) {
            const oldProfile = path.join(
                uploadsFolder,
                path.basename(resume.profileInfo.profilePreviewUrl)
            )
            if (fs.existsSync(oldProfile)) {
                fs.unlinkSync(oldProfile)
            }
        }

            // DELTE RESUME DOC
            const deleted = await Resume.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        })

        if (!deleted) {
            return res.status(404).json({ message: "Resume not found or not authorized" })
        }
        res.json({ message: "Resume deleted successfull" })

    }
    catch (error) {
    res.status(500).json({ message: "Failed to delete resume", error: error.message }) 
    }
}
   