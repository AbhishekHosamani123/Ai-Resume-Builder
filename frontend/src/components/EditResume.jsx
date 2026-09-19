 import React, { useCallback, useEffect, useRef, useState } from 'react'
import DashboardLayout from './DashboardLayout'
import { buttonStyles, containerStyles, statusStyles, iconStyles } from '../assets/dummystyle'
import { TitleInput } from './Inputs'
import { useNavigate, useParams } from 'react-router-dom'
import { Eye, Palette, Trash2, ArrowLeft, Loader2, Save, Download, AlertCircle, Check, Gauge } from 'lucide-react'
import { getResume, updateResume as persistResume, deleteResume as removeResume, setRecentResumeId } from '../lib/resumeStore'
import toast from 'react-hot-toast'
import StepProgress from './StepProgress'
import RenderResume from './RenderResume'
import Modal from './Model'
import ThemeSelector from './ThemeSelector'
import { 
  ProfileInfoForm, 
  ContactInfoForm, 
  WorkExperienceForm, 
  EducationDetailsForm, 
  SkillsInfoForm, 
  ProjectDetailForm, 
  CertificationInfoForm, 
  AdditionalInfoForm 
} from './Forms'

import html2pdf from 'html2pdf.js'
import html2canvas from 'html2canvas'

// RESIZE OBSERVER HOOK
const useResizeObserver = () => {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const ref = useCallback((node) => {
      if (node) {
        const resizeObserver = new ResizeObserver((entries) => {
          const { width, height } = entries[0].contentRect;
          setSize({ width, height });
        });
  
        resizeObserver.observe(node);
      }
    }, [])
    return {...size, ref }
  }

// Utility functions
const fixTailwindColors = (element) => {
  const clonedElement = element.cloneNode(true);
  const computedStyle = window.getComputedStyle(element);
  
  // Apply computed styles to cloned element
  const style = clonedElement.style;
  style.color = computedStyle.color;
  style.backgroundColor = computedStyle.backgroundColor;
  style.borderColor = computedStyle.borderColor;
  
  // Fix any Tailwind classes that might not be applied
  clonedElement.className = element.className;
  
  // Append to body temporarily
  clonedElement.style.position = 'absolute';
  clonedElement.style.left = '-9999px';
  clonedElement.style.top = '-9999px';
  document.body.appendChild(clonedElement);
  
  return clonedElement;
};

const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const EditResume = () => {

    const { resumeId } = useParams()
  const navigate = useNavigate()
  const resumeDownloadRef = useRef(null)
  const thumbnailRef = useRef(null)

  const [openThemeSelector, setOpenThemeSelector] = useState(false)
  const [openPreviewModal, setOpenPreviewModal] = useState(false)
  const [currentPage, setCurrentPage] = useState("profile-info")
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [completionPercentage, setCompletionPercentage] = useState(0)

  const { width: previewWidth, ref: previewContainerRef } = useResizeObserver();

  const [resumeData, setResumeData] = useState({
    title: "Professional Resume",
    thumbnailLink: "",
    profileInfo: {
      profilePreviewUrl: "",
      fullName: "",
      designation: "",
      summary: "",
    },
    template: {
      theme: "01",
      colorPalette: []
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    workExperience: [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: [
      {
        name: "",
        progress: 0,
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        github: "",
        liveDemo: "",
      },
    ],
    certifications: [
      {
        title: "",
        issuer: "",
        year: "",
      },
    ],
    languages: [
      {
        name: "",
        progress: 0,
      },
    ],
    interests: [],
  })

  // Calculate completion percentage
  const calculateCompletion = () => {
    let completedFields = 0;
    let totalFields = 0;

    // Profile Info
    totalFields += 3;
    if (resumeData.profileInfo.fullName) completedFields++;
    if (resumeData.profileInfo.designation) completedFields++;
    if (resumeData.profileInfo.summary) completedFields++;

    // Contact Info
    totalFields += 2;
    if (resumeData.contactInfo.email) completedFields++;
    if (resumeData.contactInfo.phone) completedFields++;

    // Work Experience
    resumeData.workExperience.forEach(exp => {
      totalFields += 5;
      if (exp.company) completedFields++;
      if (exp.role) completedFields++;
      if (exp.startDate) completedFields++;
      if (exp.endDate) completedFields++;
      if (exp.description) completedFields++;
    });

    // Education
    resumeData.education.forEach(edu => {
      totalFields += 4;
      if (edu.degree) completedFields++;
      if (edu.institution) completedFields++;
      if (edu.startDate) completedFields++;
      if (edu.endDate) completedFields++;
    });

    // Skills
    resumeData.skills.forEach(skill => {
      totalFields += 2;
      if (skill.name) completedFields++;
      if (skill.progress > 0) completedFields++;
    });

    // Projects
    resumeData.projects.forEach(project => {
      totalFields += 4;
      if (project.title) completedFields++;
      if (project.description) completedFields++;
      if (project.github) completedFields++;
      if (project.liveDemo) completedFields++;
    });

    // Certifications
    resumeData.certifications.forEach(cert => {
      totalFields += 3;
      if (cert.title) completedFields++;
      if (cert.issuer) completedFields++;
      if (cert.year) completedFields++;
    });

    // Languages
    resumeData.languages.forEach(lang => {
      totalFields += 2;
      if (lang.name) completedFields++;
      if (lang.progress > 0) completedFields++;
    });

    // Interests
    totalFields += resumeData.interests.length;
    completedFields += resumeData.interests.filter(i => i.trim() !== "").length;

    const percentage = Math.round((completedFields / totalFields) * 100);
    setCompletionPercentage(percentage);
    return percentage;
  };

  useEffect(() => {
    calculateCompletion();
  }, [resumeData]);

 // Validate Inputs
 const validateAndNext = (e) => {
    const errors = []

    switch (currentPage) {
      case "profile-info":
        const { fullName, designation, summary } = resumeData.profileInfo
        if (!fullName.trim()) errors.push("Full Name is required")
        if (!designation.trim()) errors.push("Designation is required")
        if (!summary.trim()) errors.push("Summary is required")
        break

      case "contact-info":
        const { email, phone } = resumeData.contactInfo
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errors.push("Valid email is required.")
        if (!phone.trim() || !/^\d{10}$/.test(phone)) errors.push("Valid 10-digit phone number is required")
        break

      case "work-experience":
        resumeData.workExperience.forEach(({ company, role, startDate, endDate }, index) => {
          if (!company || !company.trim()) errors.push(`Company is required in experience ${index + 1}`)
          if (!role || !role.trim()) errors.push(`Role is required in experience ${index + 1}`)
          if (!startDate || !endDate) errors.push(`Start and End dates are required in experience ${index + 1}`)
        })
        break

      case "education-info":
        resumeData.education.forEach(({ degree, institution, startDate, endDate }, index) => {
          if (!degree.trim()) errors.push(`Degree is required in education ${index + 1}`)
          if (!institution.trim()) errors.push(`Institution is required in education ${index + 1}`)
          if (!startDate || !endDate) errors.push(`Start and End dates are required in education ${index + 1}`)
        })
        break

      case "skills":
        resumeData.skills.forEach(({ name, progress }, index) => {
          if (!name.trim()) errors.push(`Skill name is required in skill ${index + 1}`)
          if (progress < 1 || progress > 100)
            errors.push(`Skill progress must be between 1 and 100 in skill ${index + 1}`)
        })
        break

      case "projects":
        resumeData.projects.forEach(({ title, description }, index) => {
          if (!title.trim()) errors.push(`Project Title is required in project ${index + 1}`)
          if (!description.trim()) errors.push(`Project description is required in project ${index + 1}`)
        })
        break

      case "certifications":
        resumeData.certifications.forEach(({ title, issuer }, index) => {
          if (!title.trim()) errors.push(`Certification Title is required in certification ${index + 1}`)
          if (!issuer.trim()) errors.push(`Issuer is required in certification ${index + 1}`)
        })
        break

      case "additionalInfo":
        if (resumeData.languages.length === 0 || !resumeData.languages[0].name?.trim()) {
          errors.push("At least one language is required")
        }
        break

      default:
        break
    }

    if (errors.length > 0) {
      setErrorMsg(errors.join(", "))
      return
    }

    setErrorMsg("")
    goToNextStep()
  }

  

  const goToNextStep = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ]

    if (currentPage === "additionalInfo") setOpenPreviewModal(true)

    const currentIndex = pages.indexOf(currentPage)
    if (currentIndex !== -1 && currentIndex < pages.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentPage(pages[nextIndex])

      const percent = Math.round((nextIndex / (pages.length - 1)) * 100)
      setProgress(percent)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const goBack = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ]

    if (currentPage === "profile-info") navigate("/dashboard")

    const currentIndex = pages.indexOf(currentPage)
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentPage(pages[prevIndex])

      const percent = Math.round((prevIndex / (pages.length - 1)) * 100)
      setProgress(percent)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const renderForm = () => {
    switch (currentPage) {
      case "profile-info":
        return (
          <ProfileInfoForm
            profileData={resumeData?.profileInfo}
            updateSection={(key, value) => updateSection("profileInfo", key, value)}
            onEnhanceSummary={() => {
              const name = (resumeData?.profileInfo?.fullName || '').trim()
              const role = (resumeData?.profileInfo?.designation || '').trim()
              const current = (resumeData?.profileInfo?.summary || '').trim()

              // Build a polished, concise professional summary
              const opener = role
                ? `Results-driven ${role}`
                : 'Results-driven professional'
              const tail = 'skilled in cross-functional collaboration, problem solving, and continuous improvement.'

              let enhanced
              if (!current) {
                enhanced = `${opener} with a proven track record of delivering impactful outcomes; ${tail} Passionate about crafting high-quality solutions and driving measurable business results.`
              } else {
                // Light rewrite that preserves user's content and adds polish
                const trimmed = current.replace(/\s+/g, ' ').trim()
                enhanced = `${opener}: ${trimmed} Focused on measurable outcomes, clarity, and continuous improvement.`
              }

              updateSection("profileInfo", "summary", enhanced)
              try { toast.success('Summary enhanced') } catch (_) {}
            }}
            onNext={validateAndNext}
          />
        )

      case "contact-info":
        return (
          <ContactInfoForm
            contactInfo={resumeData?.contactInfo}
            updateSection={(key, value) => updateSection("contactInfo", key, value)}
          />
        )

      case "work-experience":
        return (
          <WorkExperienceForm
            workExperience={resumeData?.workExperience}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("workExperience", index, key, value)
            }}
            addArrayItem={(newItem) => addArrayItem("workExperience", newItem)}
            removeArrayItem={(index) => removeArrayItem("workExperience", index)}
            onEnhanceDescription={(idx) => {
              const exp = resumeData?.workExperience?.[idx] || {}
              const company = (exp.company || '').trim()
              const role = (exp.role || '').trim()
              const current = (exp.description || '').trim()

              const opener = role && company
                ? `Delivered impact as ${role} at ${company}`
                : role
                  ? `Delivered impact as ${role}`
                  : 'Delivered measurable impact'

              const enhanced = current
                ? `${opener}. ${current.replace(/\s+/g, ' ').trim()} Drove outcomes through ownership, collaboration, and a focus on quality.`
                : `${opener}. Led initiatives end-to-end, improved team efficiency, and shipped high-quality features with clear, measurable outcomes.`

              updateArrayItem("workExperience", idx, "description", enhanced)
              try { toast.success('Description enhanced') } catch (_) {}
            }}
          />
        )

      case "education-info":
        return (
          <EducationDetailsForm
            educationInfo={resumeData?.education}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("education", index, key, value)
            }}
            addArrayItem={(newItem) => addArrayItem("education", newItem)}
            removeArrayItem={(index) => removeArrayItem("education", index)}
          />
        )

      case "skills":
        return (
          <SkillsInfoForm
            skillsInfo={resumeData?.skills}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("skills", index, key, value)
            }}
            addArrayItem={(newItem) => addArrayItem("skills", newItem)}
            removeArrayItem={(index) => removeArrayItem("skills", index)}
          />
        )

      case "projects":
        return (
          <ProjectDetailForm
            projectInfo={resumeData?.projects}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("projects", index, key, value)
            }}
            addArrayItem={(newItem) => addArrayItem("projects", newItem)}
            removeArrayItem={(index) => removeArrayItem("projects", index)}
            onEnhanceProjectDescription={(idx) => {
              const proj = resumeData?.projects?.[idx] || {}
              const title = (proj.title || '').trim()
              const current = (proj.description || '').trim()

              const opener = title ? `Project: ${title}` : 'Project'
              const enhanced = current
                ? `${opener} — ${current.replace(/\s+/g, ' ').trim()} Highlighted impact, technical decisions, and measurable results.`
                : `${opener} — designed and implemented end-to-end, focusing on clean architecture, performance, and a great user experience. Delivered measurable outcomes and clear documentation.`

              updateArrayItem("projects", idx, "description", enhanced)
              try { toast.success('Project description enhanced') } catch (_) {}
            }}
          />
        )

      case "certifications":
        return (
          <CertificationInfoForm
            certifications={resumeData?.certifications}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("certifications", index, key, value)
            }}
            addArrayItem={(newItem) => addArrayItem("certifications", newItem)}
            removeArrayItem={(index) => removeArrayItem("certifications", index)}
          />
        )

      case "additionalInfo":
        return (
          <AdditionalInfoForm
            languages={resumeData.languages}
            interests={resumeData.interests}
            updateArrayItem={(section, index, key, value) => updateArrayItem(section, index, key, value)}
            addArrayItem={(section, newItem) => addArrayItem(section, newItem)}
            removeArrayItem={(section, index) => removeArrayItem(section, index)}
          />
        )

      default:
        return null
    }
  }

  const updateSection = (section, key, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  const updateArrayItem = (section, index, key, value) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]]

      if (key === null) {
        updatedArray[index] = value
      } else {
        updatedArray[index] = {
          ...updatedArray[index],
          [key]: value,
        }
      }

      return {
        ...prev,
        [section]: updatedArray,
      }
    })
  }

  const addArrayItem = (section, newItem) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }))
  }

  const removeArrayItem = (section, index) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }))
  }

  const fetchResumeDetailsById = async () => {
    try {
      const resumeInfo = await getResume(resumeId)

      if (resumeInfo && resumeInfo.profileInfo) {
        setResumeData((prevState) => ({
          ...prevState,
          title: resumeInfo?.title || "Untitled",
          template: resumeInfo?.template || prevState?.template,
          profileInfo: resumeInfo?.profileInfo || prevState?.profileInfo,
          contactInfo: resumeInfo?.contactInfo || prevState?.contactInfo,
          workExperience: resumeInfo?.workExperience || prevState?.workExperience,
          education: resumeInfo?.education || prevState?.education,
          skills: resumeInfo?.skills || prevState?.skills,
          projects: resumeInfo?.projects || prevState?.projects,
          certifications: resumeInfo?.certifications || prevState?.certifications,
          languages: resumeInfo?.languages || prevState?.languages,
          interests: resumeInfo?.interests || prevState?.interests,
        }))
      }
    } catch (error) {
      console.error("Error fetching resume:", error)
      toast.error("Failed to load resume data")
    }
  }
  const uploadResumeImages = async () => {
    try {
      setIsLoading(true)

      const thumbnailElement = thumbnailRef.current
      if (!thumbnailElement) {
        throw new Error("Thumbnail element not found")
      }

      const fixedThumbnail = fixTailwindColors(thumbnailElement)

      // html2canvas cannot parse Tailwind v4's oklch() colors — force safe
      // rgb colors while capturing (same approach as downloadPDF below).
      const override = document.createElement("style")
      override.textContent = `
        * {
          color: #000 !important;
          background-color: #fff !important;
          border-color: #000 !important;
        }
      `
      document.head.appendChild(override)

      let thumbnailCanvas
      try {
        thumbnailCanvas = await html2canvas(fixedThumbnail, {
          scale: 0.5,
          backgroundColor: "#FFFFFF",
          logging: false,
        })
      } finally {
        document.head.removeChild(override)
      }

      document.body.removeChild(fixedThumbnail)

      const thumbnailDataUrl = thumbnailCanvas.toDataURL("image/png")

      // Everything is local now — the generated data URL is stored directly
      await updateResumeDetails(thumbnailDataUrl)

      toast.success("Resume Updated Successfully")
      navigate("/dashboard")
    } catch (error) {
      console.error("Error Uploading Images:", error)
      toast.error("Failed to upload images")
    } finally {
      setIsLoading(false)
    }
  }


  // Fetch resume data
  const fetchResumeData = async () => {
    try {
      setIsLoading(true)
      const resume = await getResume(resumeId)
      if (resume) {
        setResumeData(resume)
        setRecentResumeId(resumeId)
      } else {
        toast.error("Resume not found")
        navigate("/dashboard")
      }
    } catch (error) {
      console.error("Error fetching resume:", error)
      toast.error("Failed to load resume")
      navigate("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  // Save resume data
  const saveResumeData = async () => {
    try {
      setIsLoading(true)
      
      // Clean the data before sending
      const cleanResumeData = {
        ...resumeData,
        // Ensure arrays are properly formatted
        workExperience: resumeData.workExperience || [],
        education: resumeData.education || [],
        skills: resumeData.skills || [],
        projects: resumeData.projects || [],
        certifications: resumeData.certifications || [],
        languages: resumeData.languages || [],
        interests: resumeData.interests || [],
        // Ensure objects exist
        profileInfo: resumeData.profileInfo || {},
        contactInfo: resumeData.contactInfo || {},
        template: resumeData.template || { theme: "01", colorPalette: [] }
      }
      
      await persistResume(resumeId, cleanResumeData)
      toast.success("Resume saved successfully")
    } catch (error) {
      console.error("Error saving resume:", error)
      toast.error("Failed to save resume")
    } finally {
      setIsLoading(false)
    }
  }

  const updateResumeDetails = async (thumbnailLink) => {
    try {
      setIsLoading(true)

      await persistResume(resumeId, {
        ...resumeData,
        thumbnailLink: thumbnailLink || "",
      })
    } catch (err) {
      console.error("Error updating resume:", err)
      toast.error("Failed to update resume details")
    } finally {
      setIsLoading(false)
    }
  }

  // delete function to delete any resume
  const handleDeleteResume = async () => {
    try {
      setIsLoading(true)
      await removeResume(resumeId)
      toast.success("Resume deleted successfully")
      navigate("/dashboard")
    } catch (error) {
      console.error("Error deleting resume:", error)
      toast.error("Failed to delete resume")
    } finally {
      setIsLoading(false)
    }
  }
  const downloadPDF = async () => {
    const element = resumeDownloadRef.current;
    console.log("Download PDF - Element:", element);
    if (!element) {
      console.error("resumeDownloadRef.current is null");
      toast.error("Failed to generate PDF. Please try again.");
      return;
    }

    if (!html2pdf) {
      console.error("html2pdf is not available");
      toast.error("PDF library not loaded. Please refresh the page.");
      return;
    }
  
    setIsDownloading(true);
    setDownloadSuccess(false);
    const toastId = toast.loading("Generating PDF...");

    // Small delay to ensure the hidden element is rendered
    await new Promise(resolve => setTimeout(resolve, 100));
  
    const override = document.createElement("style");
    override.id = "__pdf_color_override__";
    override.textContent = `
      * {
        color: #000 !important;
        background-color: #fff !important;
        border-color: #000 !important;
      }
    `;
    document.head.appendChild(override);
  
    try {
      console.log("Starting PDF generation...");
      await html2pdf()
        .set({
          margin:       0,
          filename:     `${(resumeData.title || "Resume").replace(/[^a-z0-9]/gi, "_")}.pdf`,
          image:        { type: "png", quality: 1.0 },
          html2canvas:  {
            scale:           2,
            useCORS:         true,
            backgroundColor: "#FFFFFF",
            logging:         false,
            windowWidth:     element.scrollWidth,
          },
          jsPDF:        {
            unit:       "mm",
            format:     "a4",
            orientation:"portrait",
          },
          pagebreak: {
            mode: ['avoid-all', 'css', 'legacy']
          }
        })
        .from(element)
        .save();
  
      toast.success("PDF downloaded successfully!", { id: toastId });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
  
    } catch (err) {
      console.error("PDF error:", err);
      toast.error(`Failed to generate PDF: ${err.message}`, { id: toastId });
  
    } finally {
      document.getElementById("__pdf_color_override__")?.remove();
      setIsDownloading(false);
    }
  };

  const updateTheme = (theme) => {
    setResumeData(prev => ({
      ...prev,
      template: {
        theme: theme,
        colorPalette: []
      }
    }));
  }

  useEffect(() => {
    if (resumeId) {
      fetchResumeDetailsById()
    }
  }, [resumeId]) 
  // Load resume data on component mount
  useEffect(() => {
    if (resumeId) {
      fetchResumeData()
    }
  }, [resumeId])

  // Auto-save functionality
  useEffect(() => {
    if (resumeId && resumeData.title !== "Professional Resume") {
      const timeoutId = setTimeout(() => {
        saveResumeData()
      }, 2000) // Increased timeout to 2 seconds to reduce server load
      return () => clearTimeout(timeoutId)
    }
  }, [resumeData, resumeId])


  if (isLoading && !resumeData.title) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className={containerStyles.main}>
        <div className={containerStyles.header}>
            <TitleInput title={resumeData.title} 
            setTitle={(value) => setResumeData((prev) => ({
                ...prev,
                title: value,
            }))} />
            <div className='flex flex-wrap items-center gap-3'>
                <button onClick={() => setOpenThemeSelector(true)} className={buttonStyles.theme}>
                    <Palette size={16} />
                    <span className='text-sm'>Theme</span>
                </button>
                <button onClick={handleDeleteResume} className={buttonStyles.delete} disabled={isLoading}>
                    <Trash2 size={16} />
                    <span className='text-sm'>Delete</span>
                </button>

                <button onClick={() => navigate(`/ats?resume=${resumeId}`)} className={buttonStyles.ats}>
                    <Gauge size={15} />
                    <span className='text-sm'>ATS Score</span>
                </button>

                <button onClick={() => setOpenPreviewModal(true)} className={buttonStyles.preview}>
                    <Eye size={16} />
                    <span className='text-sm'>Preview</span>
                </button>
            </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Resume Completion</span>
            <span className="text-sm font-bold text-violet-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>


        {/* STEP PROGRESS */}
        <div className={containerStyles.grid}>
        <div className={containerStyles.formContainer}>
            <StepProgress progress={progress}/>
            {renderForm()}
            <div className="p-4 sm:p-6">
            {errorMsg && (
                <div className={statusStyles.error}>
                <AlertCircle size={16}/>
                {errorMsg}
                </div>
            )}

            <div className="flex flex-wrap items-center justify-end gap-3">
            <button className={buttonStyles.back} onClick={goBack} disabled={isLoading}>
                <ArrowLeft size={16}/>
                Back
            </button>
            <button className={buttonStyles.save} onClick={uploadResumeImages} disabled={isLoading}>
            {isLoading ? <Loader2 size={16} className="animate-spin" />
                : <Save size={16} />}
            {isLoading ? "Saving..." : "Save & Exit"}
            </button>

            {currentPage === "additionalInfo" && (
              <button className={buttonStyles.ats} onClick={() => navigate(`/ats?resume=${resumeId}`)} disabled={isLoading}>
                <Gauge size={16} />
                ATS Score
              </button>
            )}

            <button className={buttonStyles.next} onClick={currentPage === "additionalInfo" ? downloadPDF : validateAndNext} disabled={isLoading}>
            {currentPage === "additionalInfo" && <Download size={16} />}
            {currentPage === "additionalInfo" ? "Preview & Download" : "Next"}
            {currentPage === "additionalInfo" && <ArrowLeft size={16} className="rotate-180" />}
            </button>
            </div>
            </div>
        </div>


        <div className="hidden lg:block">
        <div className={containerStyles.previewContainer}>
            <div className="text-center mb-4">
            <div className={statusStyles.completionBadge}>
                <div className={iconStyles.pulseDot}></div>
                <span> Preview - {completionPercentage}% Complete</span>
            </div>
            </div>

            <div className="preview-container relative" ref={previewContainerRef}>
                <div className={containerStyles.previewInner}>
                    <RenderResume 
                    key={`preview-${resumeData?.template?.theme}`}
                    templateId={resumeData?.template?.theme || ""}
                    resumeData={resumeData}
                    containerWidth={previewWidth}
                    />
                </div>
                </div>
        </div>
        </div>

        </div>
      </div>


        {/* MODAL DATA HERE */}
        <Modal isOpen={openThemeSelector} onClose={() => setOpenThemeSelector(false)} title="Change Title">
        <div className={containerStyles.modalContent}>
            <ThemeSelector
            selectedTheme={resumeData?.template.theme}
            setSelectedTheme={updateTheme}
            resumeData={resumeData}
            onClose={() => setOpenThemeSelector(false)}
            />
        </div>
        </Modal>

        <Modal
        isOpen={openPreviewModal}
        onClose={() => setOpenPreviewModal(false)}
        title={resumeData.title}
        showActionBtn
        actionBtnText={isDownloading ? "Generating..."
            : downloadSuccess ? "Downloaded" : "Download PDF" }

            actionBtnIcon={
              isDownloading ? (
                <Loader2 size={16} className="animate-spin" />
              ) :
              downloadSuccess ? (
                <Check size={16}  className="text-white" />
              ) : (
                <Download size={16} />
              )
            }
            onActionClick={downloadPDF}
        >

      <div className='relative'>
        <div className='text-center mb-4'>
        <div className={statusStyles.modalBadge}>
          <div className={iconStyles.pulseDot}>
            <span>Completion:{completionPercentage}%</span>
          </div>
        </div>

        <div className={containerStyles.pdfPreview}>
        <div className="a4-wrapper">
            <div className="w-full h-full">
                <RenderResume key={`pdf-${resumeData?.template?.theme}`}
                              templateId={resumeData?.template?.theme || ""}
                              resumeData={resumeData}
                              containerWidth={null}
                />
            </div>
        </div>
    </div>
        </div>
      </div>
            </Modal>

      {/* PDF capture source: rendered off-screen (html2canvas cannot capture
          display:none elements) but invisible to the user */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: "0",
          pointerEvents: "none",
        }}
      >
        <div ref={resumeDownloadRef} className="a4-wrapper">
            <div className="w-full h-full">
                <RenderResume key={`download-${resumeData?.template?.theme}`}
                              templateId={resumeData?.template?.theme || ""}
                              resumeData={resumeData}
                              containerWidth={null}
                />
            </div>
        </div>
      </div>

      {/* Thumbnail capture source: rendered off-screen (html2canvas cannot
          capture display:none elements) but invisible to the user */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: "0",
          pointerEvents: "none",
        }}
        ref={thumbnailRef}
      >
          <div className={containerStyles.hiddenThumbnail}>
              <RenderResume key={`thumb-${resumeData?.template?.theme}`}
                            templateId={resumeData?.template?.theme || ""}
                             resumeData={resumeData}
              />
          </div>
      </div>

        </DashboardLayout>
  )
}

export default EditResume