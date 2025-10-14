import React, { useState, useContext, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { dashboardStyles as styles } from '../assets/dummystyle'
import { UserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { Plus, FileText, Download, Edit, FilePlus, Trash2 } from 'lucide-react'
import axiosInstance from '../utils/axioslnstance'
import { API_PATHS } from '../utils/apiPathsjs'
import { ResumeSummaryCard } from '../components/Cards'
import moment from 'moment'

import toast from 'react-hot-toast'
import Modal from '../components/Model'
import CreateResumeForm from '../components/CreateResumeForm'

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [allResumes, setAllResumes] = useState([]);
    const [loading, setLoading] = useState(true)
    const [resumeToDelete, setResumeToDelete] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Calculate completion percentage for a resume
  const calculateCompletion = (resume) => {
    let completedFields = 0;
    let totalFields = 0;

    // Profile Info
    totalFields += 3;
    if (resume.profileInfo?.fullName) completedFields++;
    if (resume.profileInfo?.designation) completedFields++;
    if (resume.profileInfo?.summary) completedFields++;

    // Contact Info
    totalFields += 2;
    if (resume.contactInfo?.email) completedFields++;
    if (resume.contactInfo?.phone) completedFields++;

    // Work Experience
    resume.workExperience?.forEach(exp => {
      totalFields += 5;
      if (exp.company) completedFields++;
      if (exp.role) completedFields++;
      if (exp.startDate) completedFields++;
      if (exp.endDate) completedFields++;
      if (exp.description) completedFields++;
    });

    // Education
    resume.education?.forEach(edu => {
      totalFields += 4;
      if (edu.degree) completedFields++;
      if (edu.institution) completedFields++;
      if (edu.startDate) completedFields++;
      if (edu.endDate) completedFields++;
    });

    // Skills
    resume.skills?.forEach(skill => {
      totalFields += 2;
      if (skill.name) completedFields++;
      if (skill.progress > 0) completedFields++;
    });

    // Projects
    resume.projects?.forEach(project => {
      totalFields += 4;
      if (project.title) completedFields++;
      if (project.description) completedFields++;
      if (project.github) completedFields++;
      if (project.liveDemo) completedFields++;
    });

    // Certifications
    resume.certifications?.forEach(cert => {
      totalFields += 3;
      if (cert.title) completedFields++;
      if (cert.issuer) completedFields++;
      if (cert.year) completedFields++;
    });

    // Languages
    resume.languages?.forEach(lang => {
      totalFields += 2;
      if (lang.name) completedFields++;
      if (lang.progress > 0) completedFields++;
    });

    // Interests
    totalFields += (resume.interests?.length || 0);
    completedFields += (resume.interests?.filter(i => i?.trim() !== "")?.length || 0);

    return Math.round((completedFields / totalFields) * 100);
  };

  // IT WILL SHOW IF COMPLETED OR FILLED IT WILL DO ++.
const fetchAllResumes = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL)
      // ADD COMPLETION PERCENTAGE TO EACH RESUMES
      const resumesWithCompletion = response.data.map(resume => ({
        ...resume,
        completion: calculateCompletion(resume)
      }))

      setAllResumes(resumesWithCompletion)
    } catch (error) {
        console.error('Error fetching resumes: ', error)
    }
     finally{
         setLoading(false)
     }
  }

  useEffect(() =>{
    fetchAllResumes();
}, []);


    const handleDeleteResume = async () => {
        if(!resumeToDelete) return;
        try{
            await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeToDelete))
            toast.success('Resume Deleted successfully ')
            fetchAllResumes()
        }
        catch (error) {
            console.error('Error deleting resume:', error)
            toast.error('failed to delete resume')
          }
          finally {
            setResumeToDelete(null)
            setShowDeleteConfirm(false)
          }
    }

    const handleDeleteClick = (id) => {
        setResumeToDelete(id);
        setShowDeleteConfirm(true);
}
    return (
        <DashboardLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.headerWrapper}>
                    <div>
                        <h1 className={styles.headerTitle}>
                            Welcome back, {user?.name || 'User'}!
                        </h1>
                        <p className={styles.headerSubtitle}>
                            {allResumes.length > 0 
                                ? `You have ${allResumes.length} resume${allResumes.length !== 1 ? 's' : ''}`
                                : 'Start building your professional resume'
                            }
                        </p>
                    </div>
                    <button className={styles.createButton} onClick={() => setOpenCreateModal(true)}>
                        <div className={styles.createButtonOverlay}></div>
                        <div className={styles.createButtonContent}>
                            <Plus size={20} />
                             <span>Create New Resume</span>
                        </div>
                    </button>
                </div>

                {/* Resume Grid */}
                <div className={styles.grid}>

                    {/* Sample Resume Cards
                    {allResumes.length === 0 && (
                        <div className={styles.resumeCard}>
                            <div className={styles.previewArea}>
                                <div className={styles.emptyPreview}>
                                    <div className={styles.emptyPreviewIcon}>
                                        <FileText size={24} className="text-violet-600" />
                                    </div>
                                    <div className={styles.emptyPreviewText}>Software Engineer Resume</div>
                                    <div className={styles.emptyPreviewSubtext}>Last updated: 2 days ago</div>
                                </div>
                            </div>
                            <div className={styles.infoArea}>
                                <h3 className={styles.title}>Software Engineer Resume</h3>
                                <div className={styles.dateInfo}>
                                    <span>Updated 2 days ago</span>
                                </div>
                            </div>
                            <div className={styles.actionOverlay}>
                                <div className={styles.actionButtonsContainer}>
                                    <button className={styles.editButton}>
                                        <Edit size={16} className={styles.buttonIcon} />
                                    </button>
                                    <button className={styles.deleteButton}>
                                        <Download size={16} className={styles.buttonIcon} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )} */}

                    {/* Render actual resumes when they exist
                    {allResumes.map((resume, index) => (
                        <div key={index} className={styles.resumeCard}>
                            <div className={styles.previewArea}>
                                <div className={styles.emptyPreview}>
                                    <div className={styles.emptyPreviewIcon}>
                                        <FileText size={24} className="text-violet-600" />
                                    </div>
                                    <div className={styles.emptyPreviewText}>{resume.title || 'Untitled Resume'}</div>
                                    <div className={styles.emptyPreviewSubtext}>Last updated: {resume.updatedAt || 'Recently'}</div>
                                </div>
                            </div>
                            <div className={styles.infoArea}>
                                <h3 className={styles.title}>{resume.title || 'Untitled Resume'}</h3>
                                <div className={styles.dateInfo}>
                                    <span>Updated {resume.updatedAt || 'Recently'}</span>
                                </div>
                            </div>
                            <div className={styles.actionOverlay}>
                                <div className={styles.actionButtonsContainer}>
                                    <button className={styles.editButton}>
                                        <Edit size={16} className={styles.buttonIcon} />
                                    </button>
                                    <button className={styles.deleteButton}>
                                        <Download size={16} className={styles.buttonIcon} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))} */}
                </div>


            {/* Loading State */}
        {loading && (
        <div className={styles.spinnerWrapper}>
        <div className={styles.spinner}></div>
        </div>
        )}

        {/* EMPTY STATE */}
        {!loading && allResumes.length === 0 && (
        <div className={styles.emptyStateWrapper}>
             <div className={styles.emptyIconWrapper}>
                 <FilePlus size={32} className='text-violet-600'/>

                <h3 className={styles.emptyTitle}>No Resumes Yet</h3>
                <p className={styles.emptyText}>
                You haven't created any resumes yet. Start building your professional resume to land your
                dream job.
                </p>
                 <button className={styles.createButton} onClick={() => setOpenCreateModal(true)}>
                 <div className={styles.createButtonOverlay}></div>
                 <div className={styles.createButtonContent}>
                     <Plus size={20} />
                     <span>Create Your First Resume</span>
                 </div>
                 </button>

            </div>
            </div>
        )}

        {/* GRID VIEW */}
        {!loading && allResumes.length > 0 && (
        <div className={styles.grid}>
             <div className={styles.newResumeCard} onClick={() => setOpenCreateModal(true)}>
                 <div className={styles.newResumeIcon}>
                     <Plus size={24} className="text-white" />
                 </div>
                 <h3 className={styles.newResumeTitle}>Create New Resume</h3>
                 <p className={styles.newResumeText}>
                     Start building your professional resume with our easy-to-use builder
                 </p>
             </div>

             {allResumes.map((resume) => (
                <ResumeSummaryCard key={resume._id} id={resume._id} imgUrl={resume.thmbnailLink}
                title={resume.title} createdAt={resume.createdAt} updatedAt={resume.updatedAt}
                onSelect={() => navigate(`/resume/${resume._id}`)}
                onDelete={() => handleDeleteClick(resume._id)}
                completion={resume.completion || 0}
                isPremium={resume.isPremium}
                isNew = {moment().diff(moment(resume.createdAt), 'days') < 7 }
                />
             ))}
        </div>
        )}

            </div>



             {/* CREATE MODAL */}
             <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} hideHeader>
                 <div className='p-6'>
                     <div className={styles.modalHeader}>
                         <h3 className={styles.modalTitle}>Create New Resume</h3>
                     </div>
                     <CreateResumeForm onSuccess={() => {
                         setOpenCreateModal(false);
                         fetchAllResumes();
                     }}/>
                 </div>
             </Modal>


{/* DELETE MODAL */}
<Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title='Confirm Deletion'
  showActionBtn actionBtnText='Delete' onActionClick={handleDeleteResume}>

  <div className='p-4'>
    <div className='flex flex-col items-center text-center'>
      <div className={styles.deleteIconWrapper}>
        <Trash2 className='text-orange-600' size={24} />
      </div>

      <h3 className={styles.deleteTitle}>Delete Resume?</h3>
      <p className={styles.deleteText}>
        Are you sure you want to delete this resume? This action cannot be undone.
      </p>
    </div>
  </div>
</Modal>


        </DashboardLayout>
    )
}

export default Dashboard 