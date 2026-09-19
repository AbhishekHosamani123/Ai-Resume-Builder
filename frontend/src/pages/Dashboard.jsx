import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { dashboardStyles as styles } from '../assets/dummystyle'
import { useNavigate } from 'react-router-dom'
import { Plus, FilePlus, Trash2, Gauge, FileText, Clock } from 'lucide-react'
import { listResumes, deleteResume, getUserName } from '../lib/resumeStore'
import { analyzeQuality } from '../lib/ats'
import { ResumeSummaryCard } from '../components/Cards'
import toast from 'react-hot-toast'
import Modal from '../components/Model'
import CreateResumeForm from '../components/CreateResumeForm'

// Calculate completion percentage for a resume
const calculateCompletion = (resume) => {
  let completedFields = 0;
  let totalFields = 0;

  totalFields += 3;
  if (resume.profileInfo?.fullName) completedFields++;
  if (resume.profileInfo?.designation) completedFields++;
  if (resume.profileInfo?.summary) completedFields++;

  totalFields += 2;
  if (resume.contactInfo?.email) completedFields++;
  if (resume.contactInfo?.phone) completedFields++;

  resume.workExperience?.forEach(exp => {
    totalFields += 5;
    if (exp.company) completedFields++;
    if (exp.role) completedFields++;
    if (exp.startDate) completedFields++;
    if (exp.endDate) completedFields++;
    if (exp.description) completedFields++;
  });

  resume.education?.forEach(edu => {
    totalFields += 4;
    if (edu.degree) completedFields++;
    if (edu.institution) completedFields++;
    if (edu.startDate) completedFields++;
    if (edu.endDate) completedFields++;
  });

  resume.skills?.forEach(skill => {
    totalFields += 2;
    if (skill.name) completedFields++;
    if (skill.progress > 0) completedFields++;
  });

  resume.projects?.forEach(project => {
    totalFields += 4;
    if (project.title) completedFields++;
    if (project.description) completedFields++;
    if (project.github) completedFields++;
    if (project.liveDemo) completedFields++;
  });

  resume.certifications?.forEach(cert => {
    totalFields += 3;
    if (cert.title) completedFields++;
    if (cert.issuer) completedFields++;
    if (cert.year) completedFields++;
  });

  resume.languages?.forEach(lang => {
    totalFields += 2;
    if (lang.name) completedFields++;
    if (lang.progress > 0) completedFields++;
  });

  totalFields += (resume.interests?.length || 0);
  completedFields += (resume.interests?.filter(i => i?.trim() !== "")?.length || 0);

  return Math.round((completedFields / totalFields) * 100);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allResumes, setAllResumes] = useState([]);
  const [loading, setLoading] = useState(true)
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    let alive = true
    getUserName().then((n) => alive && setUserName(n))
    return () => { alive = false }
  }, [])

  const fetchAllResumes = useCallback(async () => {
    try {
      setLoading(true)
      const resumes = await listResumes()
      const decorated = resumes.map(resume => ({
        ...resume,
        completion: calculateCompletion(resume),
        ats: analyzeQuality(resume).score,
      }))
      setAllResumes(decorated)
    } catch (error) {
      console.error('Error loading resumes: ', error)
      toast.error('Could not load your resumes')
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchAllResumes();
  }, [fetchAllResumes]);

  const handleDeleteResume = async () => {
    if (!resumeToDelete) return;
    try {
      await deleteResume(resumeToDelete)
      toast.success('Resume deleted')
      fetchAllResumes()
    } catch (error) {
      console.error('Error deleting resume:', error)
      toast.error('Failed to delete resume')
    } finally {
      setResumeToDelete(null)
      setShowDeleteConfirm(false)
    }
  }

  const handleDeleteClick = (id) => {
    setResumeToDelete(id);
    setShowDeleteConfirm(true);
  }

  const avgCompletion = allResumes.length
    ? Math.round(allResumes.reduce((s, r) => s + r.completion, 0) / allResumes.length)
    : 0
  const bestAts = allResumes.length
    ? Math.max(...allResumes.map((r) => r.ats))
    : 0
  const lastUpdated = allResumes[0]?.updatedAt

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.headerWrapper}>
          <div>
            <h1 className={styles.headerTitle}>
              Welcome{userName ? `, ${userName}` : ''}!
            </h1>
            <p className={styles.headerSubtitle}>
              {allResumes.length > 0
                ? `You have ${allResumes.length} resume${allResumes.length !== 1 ? 's' : ''} — saved privately in this browser`
                : 'Start building your professional resume — no sign-up needed'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className={styles.createButton} onClick={() => navigate('/ats')}>
              <Gauge size={17} /> ATS Checker
            </button>
            <button className={styles.createButton} onClick={() => setOpenCreateModal(true)}>
              <Plus size={18} />
              <span>Create New Resume</span>
            </button>
          </div>
        </div>

        {/* Stats row */}
        {!loading && allResumes.length > 0 && (
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}><span className="inline-flex items-center gap-1.5"><FileText size={12} /> Resumes</span></div>
              <div className={styles.statValue}>{allResumes.length}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Avg completion</div>
              <div className={styles.statValue}>{avgCompletion}%</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}><span className="inline-flex items-center gap-1.5"><Gauge size={12} /> Best ATS score</span></div>
              <div className={styles.statValue}>{bestAts}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}><span className="inline-flex items-center gap-1.5"><Clock size={12} /> Last updated</span></div>
              <div className={`${styles.statValue} text-lg`}>
                {lastUpdated ? new Date(lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
              </div>
            </div>
          </div>
        )}

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
              <FilePlus size={26} />
            </div>
            <h3 className={styles.emptyTitle}>No Resumes Yet</h3>
            <p className={styles.emptyText}>
              Create your first resume in minutes — pick a template, fill in your details and
              export a job-ready PDF. Everything stays private in your browser.
            </p>
            <button className={styles.createButton} onClick={() => setOpenCreateModal(true)}>
              <Plus size={18} />
              <span>Create Your First Resume</span>
            </button>
          </div>
        )}

        {/* GRID VIEW */}
        {!loading && allResumes.length > 0 && (
          <div className={styles.grid}>
            <div className={styles.newResumeCard} onClick={() => setOpenCreateModal(true)}>
              <div className={styles.newResumeIcon}>
                <Plus size={22} />
              </div>
              <h3 className={styles.newResumeTitle}>Create New Resume</h3>
              <p className={styles.newResumeText}>
                Start building your professional resume with our easy-to-use builder
              </p>
            </div>

            {allResumes.map((resume) => (
              <ResumeSummaryCard key={resume._id} id={resume._id}
                title={resume.title} createdAt={resume.createdAt} updatedAt={resume.updatedAt}
                onSelect={() => navigate(`/resume/${resume._id}`)}
                onDelete={() => handleDeleteClick(resume._id)}
                completion={resume.completion || 0}
                atsScore={resume.ats}
              />
            ))}
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} hideHeader>
        <div className='p-2'>
          <CreateResumeForm onSuccess={() => {
            setOpenCreateModal(false);
            fetchAllResumes();
          }} />
        </div>
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title='Confirm Deletion'
        showActionBtn actionBtnText='Delete' onActionClick={handleDeleteResume}>
        <div className='p-6'>
          <div className='flex flex-col items-center text-center'>
            <div className={styles.deleteIconWrapper}>
              <Trash2 size={22} />
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
