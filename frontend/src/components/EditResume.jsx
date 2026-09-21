import React, { useCallback, useEffect, useRef, useState } from 'react'
import DashboardLayout from './DashboardLayout'
import './A4.css'
import { buttonStyles, containerStyles, statusStyles, iconStyles } from '../assets/dummystyle'
import { TitleInput } from './Inputs'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Eye, Palette, Trash2, ArrowLeft, Loader2, Save, Download, AlertCircle, Check, Gauge, FileText, Printer, MousePointerClick, User, Mail, Briefcase, GraduationCap, Code, FolderGit2, Award, Globe } from 'lucide-react'
import { getResume, updateResume as persistResume, deleteResume as removeResume, setRecentResumeId } from '../lib/resumeStore'
import { buildWordBlob } from '../lib/exportWord'
import { convertOklchInTree, convertOklchVarsInDocument } from '../lib/colors'
import { saveWithChosenFolder } from '../lib/saveLocation'
import { addSearchableTextLayer } from '../lib/textLayer'

const FORM_SECTIONS = [
  { id: "profile-info", label: "Profile", icon: User },
  { id: "contact-info", label: "Contact", icon: Mail },
  { id: "work-experience", label: "Experience", icon: Briefcase },
  { id: "education-info", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Code },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "additionalInfo", label: "More", icon: Globe },
];
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

import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

// RESIZE OBSERVER HOOK
const useResizeObserver = () => {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const ref = useCallback((node) => {
      if (node) {
        const resizeObserver = new ResizeObserver((entries) => {
          if (entries && entries[0]) {
            const { width, height } = entries[0].contentRect;
            setSize({ width, height });
          }
        });
        resizeObserver.observe(node);
      }
    }, []);
    return { ...size, ref };
};

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

const EditResume = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeDownloadRef = useRef(null);
  const thumbnailRef = useRef(null);

  const [openThemeSelector, setOpenThemeSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [pageCount, setPageCount] = useState(1)
  const [currentPage, setCurrentPage] = useState("profile-info")
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [showOversizeDialog, setShowOversizeDialog] = useState(false)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeData]);

 // Validate Inputs
 const validateAndNext = () => {
    const errors = []

    switch (currentPage) {
      case "profile-info": {
        const { fullName, designation, summary } = resumeData.profileInfo || {}
        if (!fullName?.trim()) errors.push("Full Name is required")
        if (!designation?.trim()) errors.push("Designation is required")
        if (!summary?.trim()) errors.push("Summary is required")
        break
      }

      case "contact-info": {
        const { email, phone } = resumeData.contactInfo || {}
        if (!email?.trim() || !/^\S+@\S+\.\S+$/.test(email)) errors.push("Valid email is required.")
        if (!phone?.trim() || !/^\d{10}$/.test(phone)) errors.push("Valid 10-digit phone number is required")
        break
      }

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

  const jumpToSection = (pageId) => {
    const pages = FORM_SECTIONS.map((s) => s.id);
    if (pages.includes(pageId)) {
      setCurrentPage(pageId);
      const idx = pages.indexOf(pageId);
      setProgress(Math.round((idx / (pages.length - 1)) * 100));
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handleResumeDoubleClick = (e) => {
    const el = e.target;
    if (!el) return;

    const sectionEl = el.closest('[data-section]');
    let targetPage = "profile-info";

    if (sectionEl) {
      targetPage = sectionEl.getAttribute('data-section');
    } else {
      const text = (el.innerText || el.textContent || "").toLowerCase();
      const parent = el.closest('.resume-section, section, header, aside, main, div');
      const combined = `${text} ${(parent?.innerText || '').toLowerCase()}`;

      if (combined.includes('experience') || combined.includes('work') || combined.includes('intern') || combined.includes('employment')) {
        targetPage = 'work-experience';
      } else if (combined.includes('project') || combined.includes('github') || combined.includes('demo')) {
        targetPage = 'projects';
      } else if (combined.includes('skill') || combined.includes('technolog')) {
        targetPage = 'skills';
      } else if (combined.includes('education') || combined.includes('degree') || combined.includes('college') || combined.includes('university') || combined.includes('bca')) {
        targetPage = 'education-info';
      } else if (combined.includes('certificat') || combined.includes('achievement')) {
        targetPage = 'certifications';
      } else if (combined.includes('language') || combined.includes('interest')) {
        targetPage = 'additionalInfo';
      } else if (combined.includes('@') || combined.includes('linkedin') || combined.includes('phone') || el.closest('a')) {
        targetPage = 'contact-info';
      } else {
        targetPage = 'profile-info';
      }
    }

    if (openPreviewModal) {
      setOpenPreviewModal(false);
    }

    jumpToSection(targetPage);
    const label = FORM_SECTIONS.find(s => s.id === targetPage)?.label || "section";
    toast.success(`Jumped to edit ${label}`);
  };

  const renderForm = () => {
    switch (currentPage) {
      case "profile-info":
        return (
          <ProfileInfoForm
            profileData={resumeData?.profileInfo}
            updateSection={(key, value) => updateSection("profileInfo", key, value)}
            onEnhanceSummary={() => {
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
              try { toast.success('Summary enhanced') } catch { /* ignore */ }
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
              try { toast.success('Description enhanced') } catch { /* ignore */ }
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
              try { toast.success('Project description enhanced') } catch { /* ignore */ }
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

      // html2canvas cannot parse Tailwind v4's oklch() colors — convert them
      // to rgb on the clone so the thumbnail keeps the template's real colors
      convertOklchInTree(fixedThumbnail)

      let thumbnailCanvas
      try {
        thumbnailCanvas = await html2canvas(fixedThumbnail, {
          scale: 0.5,
          backgroundColor: "#FFFFFF",
          logging: false,
        })
      } finally {
        document.body.removeChild(fixedThumbnail)
      }

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
  // Build the single-page A4 PDF blob from the hidden capture section.
  // Returns { blob, filename, appliedScale }.
  const buildResumePdf = async () => {
    const element = resumeDownloadRef.current;
    if (!element) throw new Error("Resume preview is not ready yet");

    // Wait for webfonts to finish loading across all browsers
    if (typeof document !== "undefined" && document.fonts) {
      try {
        await document.fonts.ready;
      } catch (e) {
        console.warn("document.fonts.ready wait failed:", e);
      }
    }

    // Allow layout and webfonts to settle
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Standard A4 dimensions in px at 96 DPI: 210mm = 794px, 297mm = 1122.5px
    const A4_H_PX = 1122.5;
    const inner = element.firstElementChild;
    let appliedScale = 1;
    element.style.minHeight = "0";

    // If content exceeds single-page A4 height, scale down uniformly from top-left,
    // adjusting width so it stays exactly 794px wide with NO horizontal margin distortion
    const contentH = element.scrollHeight;
    if (inner && contentH > A4_H_PX + 2) {
      appliedScale = Math.max(0.70, A4_H_PX / contentH);
      inner.style.transformOrigin = "top left";
      inner.style.transform = `scale(${appliedScale})`;
      inner.style.width = `${794 / appliedScale}px`;
      const templateEl = inner.querySelector(".a4-wrapper");
      if (templateEl) {
        templateEl.style.width = "100%";
        templateEl.style.maxWidth = "100%";
      }
    }

    element.style.height = `${A4_H_PX}px`;
    element.style.overflow = "hidden";

    const parentWrapper = element.parentElement;
    if (parentWrapper) {
      parentWrapper.style.top = "0";
    }

    // convert oklch/oklab colors in the LIVE document (variables at stylesheet
    // level + the capture subtree), so html2canvas never parses them
    const varStyle = convertOklchVarsInDocument(document);
    convertOklchInTree(element);

    try {
      // capture the rendered resume at high resolution (scale: 2.5 for crisp print quality)
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: "#FFFFFF",
        logging: false,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        windowHeight: 1122.5,
        width: 794,
        height: 1122.5,
        onclone: async (clonedDoc) => {
          // Copy any font face if available
          if (typeof document !== "undefined" && document.fonts && clonedDoc.fonts) {
            try {
              for (const font of document.fonts) {
                clonedDoc.fonts.add(font);
              }
            } catch {
              /* ignore */
            }
          }
          if (clonedDoc.fonts) {
            try {
              await clonedDoc.fonts.ready;
            } catch {
              /* ignore */
            }
          }
        },
      });

      // build a SINGLE-page A4 PDF; fills full 210mm x 297mm page
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
      const imgW = 210;
      const imgH = 297;
      const x = 0;
      const y = 0;

      // Add crisp lossless PNG image
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", x, y, imgW, imgH, undefined, "FAST");

      // Invisible searchable ATS text layer on top for ATS parsers and selection
      addSearchableTextLayer(pdf, element, { imgX: x, imgY: y, imgW, imgH });

      const pdfFilename = `${(resumeData.title || "Resume").replace(/[^a-z0-9]/gi, "_")}.pdf`;
      return { blob: pdf.output("blob"), filename: pdfFilename, appliedScale };
    } finally {
      if (inner) {
        inner.style.transform = "";
        inner.style.transformOrigin = "";
        inner.style.width = "";
        const templateEl = inner.querySelector(".a4-wrapper");
        if (templateEl) {
          templateEl.style.width = "";
          templateEl.style.maxWidth = "";
        }
      }
      if (parentWrapper) {
        parentWrapper.style.top = "-9999px";
      }
      element.style.height = "";
      element.style.minHeight = "";
      varStyle?.remove();
    }
  };

  // Actual save: auto-saves into the user's chosen folder (set up on first
  // download — no "Save As" dialog on any download after that), with a
  // classic browser download as fallback.
  const performDownload = async () => {
    const toastId = toast.loading("Generating PDF...");
    try {
      const { blob, filename, appliedScale } = await buildResumePdf();

      // keep the generated PDF accessible (debugging / tests)
      window.__lastResumePdf = blob;

      const result = await saveWithChosenFolder(blob, filename);
      if (result.method === "folder") {
        toast.success(`Saved automatically to "${result.dirName}" — 1 page A4`, { id: toastId });
      } else {
        toast.success("PDF downloaded successfully — 1 page A4!", { id: toastId });
      }
      if (appliedScale < 1) {
        toast.error(
          `Your content was long, so it was scaled to ${Math.round(appliedScale * 100)}% to fit one page. Tip: shorten older roles or descriptions — most ATS reject 2-page resumes.`,
          { duration: 8000 }
        );
      }
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("PDF error:", err);
      toast.error(`Failed to generate PDF: ${err.message}`, { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  // Download button handler. If the content exceeds one page, first suggest
  // trimming — 1 page is the industry standard and many ATS auto-reject
  // multi-page resumes — then let the user decide.
  const downloadPDF = async () => {
    if (pageCount > 1) {
      setShowOversizeDialog(true);
      return;
    }
    setIsDownloading(true);
    await performDownload();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]) 
  // Load resume data on component mount
  useEffect(() => {
    if (resumeId) {
      fetchResumeData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId])

  // Auto-save functionality
  useEffect(() => {
    if (resumeId && resumeData.title !== "Professional Resume") {
      const timeoutId = setTimeout(() => {
        saveResumeData()
      }, 2000) // Increased timeout to 2 seconds to reduce server load
      return () => clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeData, resumeId])

  // ONE PAGE RULE: live page-length estimate from the hidden A4 capture
  // section. A single page is the industry standard — many ATS auto-reject
  // multi-page resumes, so we warn the user as soon as content overflows.
  useEffect(() => {
    const measure = () => {
      const el = resumeDownloadRef.current
      if (!el) return
      el.style.minHeight = "0" // ignore the A4 min-height while measuring
      // Provide a 10px subpixel/padding tolerance so near-exact fits don't trigger the oversize warning
      const pages = Math.max(1, Math.ceil((el.scrollHeight - 10) / 1122.5))
      el.style.minHeight = ""
      setPageCount(pages)
    }
    const timeoutId = setTimeout(measure, 600)
    return () => clearTimeout(timeoutId)
  }, [resumeData])

  // Auto-open preview modal if redirected with ?autoDownload=true
  useEffect(() => {
    if (searchParams.get("autoDownload") === "true" && resumeData?.title && !isLoading) {
      setOpenPreviewModal(true);
    }
  }, [searchParams, resumeData?.title, isLoading]);

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
                <button
                  onClick={downloadPDF}
                  disabled={isLoading || isDownloading}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
                  title="Direct 1-Click PDF Download"
                >
                  {isDownloading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : downloadSuccess ? (
                    <Check size={16} className="text-white" />
                  ) : (
                    <Download size={16} />
                  )}
                  <span className="text-sm font-bold">
                    {isDownloading ? "Generating..." : downloadSuccess ? "Downloaded!" : "Download PDF"}
                  </span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all text-sm cursor-pointer"
                  title="Print or Save as Vector PDF (Ctrl+P)"
                >
                  <Printer size={15} />
                  <span>Print</span>
                </button>

                <button onClick={() => setOpenThemeSelector(true)} className={buttonStyles.theme}>
                    <Palette size={16} />
                    <span className='text-sm'>Theme</span>
                </button>

                <button onClick={() => setOpenPreviewModal(true)} className={buttonStyles.preview}>
                    <Eye size={16} />
                    <span className='text-sm'>Preview</span>
                </button>

                <button onClick={() => navigate(`/ats?resume=${resumeId}`)} className={buttonStyles.ats}>
                    <Gauge size={15} />
                    <span className='text-sm'>ATS Score</span>
                </button>

                <button onClick={handleDeleteResume} className={buttonStyles.delete} disabled={isLoading}>
                    <Trash2 size={16} />
                    <span className='text-sm'>Delete</span>
                </button>
            </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Resume Completion</span>
            <span className="flex items-center gap-3">
              {pageCount > 1 ? (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700"
                  title="Recruiters and many ATS prefer one-page resumes — trim older or less relevant content"
                >
                  ⚠ Exceeds 1 page — consider trimming
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
                  ✓ 1 page — ATS friendly
                </span>
              )}
              <span className="text-sm font-bold text-violet-600">{completionPercentage}%</span>
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* ONE PAGE RULE: live guidance — 1 page is the industry standard and
            many ATS auto-reject 2-page resumes, so coach the user early. */}
        {pageCount > 1 && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Keep your resume to one page ({pageCount} pages detected).</p>
              <p className="mt-1">
                One page is the industry standard — many ATS auto-reject 2-page resumes. When
                downloading, the content is auto-scaled to fit one page, but trimming gives the
                cleanest result: shorten the summary, keep the 3 most recent roles, use 3–4
                bullets per role, and drop older certifications or interests.
              </p>
            </div>
          </div>
        )}

        {/* Quick Jump Section Bar */}
        <div className="mb-4 bg-white border border-violet-100 rounded-2xl p-2.5 shadow-xs">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MousePointerClick size={14} className="text-violet-600" />
              Quick Section Jump
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">Jump directly to any section to edit</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {FORM_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = currentPage === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => jumpToSection(sec.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-xs"
                      : "bg-slate-50 text-slate-600 hover:bg-violet-50 hover:text-violet-700 border border-slate-200/60"
                  }`}
                  title={`Jump directly to ${sec.label}`}
                >
                  <Icon size={13} />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP PROGRESS & FORM */}
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
            <div className="text-center mb-3">
              <div className="flex items-center justify-between mb-2">
                <div className={statusStyles.completionBadge}>
                    <div className={iconStyles.pulseDot}></div>
                    <span> Preview - {completionPercentage}% Complete</span>
                </div>
                <button
                  onClick={downloadPDF}
                  disabled={isLoading || isDownloading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  title="Download PDF"
                >
                  <Download size={13} />
                  <span>Download PDF</span>
                </button>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 border border-violet-200/80 rounded-full text-[11px] font-medium text-violet-700">
                <MousePointerClick size={12} className="text-violet-600 animate-pulse" />
                <span>Double-click any section to edit it directly</span>
              </div>
            </div>

            <div
              className="preview-container relative cursor-pointer"
              ref={previewContainerRef}
              onDoubleClick={handleResumeDoubleClick}
              title="Double-click any section on the resume to edit it directly"
            >
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
            secondaryAction={{
              icon: <FileText size={14} />,
              label: 'Word (.doc)',
              onClick: async () => {
                try {
                  const { blob, filename } = buildWordBlob(resumeData, resumeData.title || 'Resume')
                  const result = await saveWithChosenFolder(blob, filename)
                  if (result.method === 'folder') {
                    toast.success(`Word file saved automatically to "${result.dirName}"`)
                  } else {
                    toast.success('Word file downloaded')
                  }
                } catch (err) {
                  console.error('Word export failed:', err)
                  toast.error('Failed to generate Word file')
                }
              },
            }}
        >

      <div className='relative'>
        <div className='flex flex-wrap items-center justify-between gap-3 mb-4 px-2'>
          <div className="flex items-center gap-3">
            <div className={statusStyles.modalBadge}>
              <div className={iconStyles.pulseDot}>
                <span>Completion: {completionPercentage}%</span>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-violet-700 bg-violet-50 px-3 py-1 rounded-full border border-violet-200/70 font-medium">
              <MousePointerClick size={13} className="text-violet-600" />
              Double-click any section to edit
            </span>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs cursor-pointer transition-all border border-slate-200"
            title="Print or Save as Vector PDF via browser (Ctrl+P)"
          >
            <Printer size={14} />
            <span>Print / Vector PDF</span>
          </button>
        </div>

        <div
          className="flex w-full justify-center p-2 sm:p-4 overflow-auto max-h-[75vh] bg-slate-100/70 rounded-xl cursor-pointer"
          onDoubleClick={handleResumeDoubleClick}
          title="Double-click any section to edit it directly"
        >
          <div className="a4-wrapper shadow-2xl rounded-sm border border-slate-200 bg-white" style={{ width: "794px", minHeight: "1122.5px" }}>
            <div className="w-full h-full">
                <RenderResume key={`pdf-${resumeData?.template?.theme}`}
                              templateId={resumeData?.template?.theme || ""}
                              resumeData={resumeData}
                              containerWidth={794}
                />
            </div>
          </div>
        </div>
      </div>
            </Modal>

        {/* ONE PAGE RULE: advise trimming BEFORE downloading when the content
            exceeds one page — 1 page is the industry standard and many ATS
            auto-reject multi-page resumes. */}
        <Modal
        isOpen={showOversizeDialog}
        onClose={() => setShowOversizeDialog(false)}
        title="Your resume is longer than one page"
        showActionBtn
        actionBtnText={isDownloading ? "Generating..." : "Download anyway (auto-fit 1 page)"}
        actionBtnIcon={isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        onActionClick={async () => {
          setShowOversizeDialog(false)
          setIsDownloading(true)
          await performDownload()
        }}
        secondaryAction={{
          label: "I'll trim it first",
          onClick: () => setShowOversizeDialog(false),
        }}
        >
          <div className="p-4 text-sm text-gray-700">
            <p className="font-semibold text-gray-900">Recruiters expect a one-page resume.</p>
            <p className="mt-2">
              Your content currently spans <strong>{pageCount} pages</strong>. Many ATS automatically
              reject 2-page resumes, and one page forces you to show only what matters.
            </p>
            <p className="mt-3 font-medium text-gray-900">To keep it to one page:</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>Shorten the Professional Summary to 2–3 lines</li>
              <li>Keep the 3 most recent roles — merge or drop older ones</li>
              <li>Use 3–4 short bullet points per role instead of long paragraphs</li>
              <li>Remove older certifications, interests or less relevant projects</li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              If you download now, the resume will be scaled down to fit one A4 page
              (it may look smaller than usual).
            </p>
          </div>
        </Modal>

      {/* Hidden high-fidelity A4 capture element.
          Kept in active viewport coordinates (left:0, top:0) with zIndex:-9999 (behind page background)
          and opacity:1 so that html2canvas and textLayer.js compute layout, webfonts, and text words
          with 100% fidelity without rejection. */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: "-9999px",
          width: "794px",
          zIndex: -9999,
          pointerEvents: "none",
        }}
      >
        <div ref={resumeDownloadRef} className="a4-wrapper print-resume-target" style={{ width: "794px" }}>
            <div className="w-full h-full">
                <RenderResume key={`download-${resumeData?.template?.theme}`}
                              templateId={resumeData?.template?.theme || ""}
                              resumeData={resumeData}
                              containerWidth={794}
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