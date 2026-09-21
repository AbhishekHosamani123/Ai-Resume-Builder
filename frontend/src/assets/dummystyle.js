// ============================================================
// Design system for the app chrome (blue / ink / mist theme).
// Keys are consumed across Dashboard, EditResume, Forms, Inputs,
// Cards, Model — keep every export and key shape when editing.
// ============================================================

export const landingPageStyles = {
  container: "min-h-screen bg-white font-sans text-ink",
};

export const dashboardStyles = {
  container: "mx-auto w-full max-w-6xl px-5 sm:px-8 py-8",
  headerWrapper: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8",
  headerTitle: "font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight",
  headerSubtitle: "text-sm text-slate-500 mt-1",

  statsRow: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8",
  statCard: "rounded-2xl border border-line bg-white px-5 py-4 shadow-[var(--shadow-soft)]",
  statLabel: "text-xs font-semibold uppercase tracking-wider text-slate-400",
  statValue: "font-display text-2xl font-bold text-ink mt-1",

  createButton: "inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 hover:bg-brand-700",
  createButtonOverlay: "hidden",
  createButtonContent: "inline-flex items-center gap-2",

  spinnerWrapper: "flex justify-center items-center py-16",
  spinner: "animate-spin rounded-full h-10 w-10 border-2 border-brand-100 border-t-brand-600",

  emptyStateWrapper: "flex flex-col items-center justify-center py-16 text-center card px-8",
  emptyIconWrapper: "flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 mb-5",
  emptyTitle: "font-display text-xl font-bold text-ink mb-2",
  emptyText: "max-w-sm text-sm leading-relaxed text-slate-500 mb-6",

  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",

  newResumeCard: "group flex min-h-[280px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-line bg-mist/60 p-6 cursor-pointer transition-all hover:border-brand-300 hover:bg-brand-50/60",
  newResumeIcon: "flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-[var(--shadow-soft)] transition-transform group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white",
  newResumeTitle: "font-display text-base font-bold text-ink mt-4",
  newResumeText: "mt-1 text-center text-xs leading-relaxed text-slate-500",

  modalHeader: "flex justify-between items-center mb-4",
  modalTitle: "font-display text-lg font-bold text-ink",
  modalCloseButton: "text-slate-400 hover:text-ink",

  deleteIconWrapper: "flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500 mb-4",
  deleteTitle: "font-display text-lg font-bold text-ink mb-1",
  deleteText: "text-sm leading-relaxed text-slate-500 mb-2",
};

export const cardStyles = {
  profileCard: "flex items-center gap-3 rounded-full border border-line bg-white py-1.5 pl-1.5 pr-4 shadow-[var(--shadow-soft)]",
  profileInitialsContainer: "flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white",
  profileInitialsText: "font-bold text-white",
  profileName: "text-xs font-semibold text-ink",
  logoutButton: "text-[11px] font-semibold text-slate-400 hover:text-red-500 transition-colors",

  resumeCard: "group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] cursor-pointer",
  cardBackground: "absolute inset-0 bg-gradient-to-br from-brand-50/80 via-transparent to-brand-100/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
  previewArea: "relative flex-1 overflow-hidden p-4",
  emptyPreview: "flex h-[190px] flex-col items-center justify-center rounded-2xl bg-mist",
  emptyPreviewIcon: "flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-[var(--shadow-soft)]",
  emptyPreviewText: "mt-3 text-sm font-semibold text-ink",
  emptyPreviewSubtext: "mt-0.5 text-xs text-slate-400",
  infoArea: "border-t border-line bg-white px-5 py-4",
  title: "truncate font-display text-sm font-bold text-ink transition-colors group-hover:text-brand-700",
  dateInfo: "mt-1 flex items-center gap-2 text-xs text-slate-400",

  actionOverlay: "absolute inset-4 flex items-end justify-center rounded-2xl bg-gradient-to-t from-ink/30 to-transparent p-5 opacity-0 transition-all duration-300 group-hover:opacity-100",
  actionButtonsContainer: "flex gap-2.5",
  editButton: "flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-600 shadow-[var(--shadow-lift)] transition-transform hover:scale-110",
  deleteButton: "flex h-11 w-11 items-center justify-center rounded-full bg-white text-red-500 shadow-[var(--shadow-lift)] transition-transform hover:scale-110",
  buttonIcon: "text-current",

  progressBar: "relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line",
  progressFill: "h-full rounded-full bg-brand-600 transition-all duration-700",
  progressGlow: "hidden",
  progressIndicator: "hidden",
  completionStatus: "mt-2 flex items-center justify-between",
  statusText: "text-[11px] font-medium text-slate-400",
  percentageText: "text-[11px] font-bold text-ink",

  completionIndicator: "absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-[var(--shadow-soft)] backdrop-blur",
  completionDot: "flex h-4 w-4 items-center justify-center rounded-full",
  completionDotInner: "hidden",
  completionPercentageText: "text-[11px] font-bold text-ink",

  completionHigh: "bg-success",
  completionMedium: "bg-warning",
  completionLow: "bg-danger",

  atsBadge: "inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700",

  templateCard: "relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-soft)] transition-all duration-200 cursor-pointer hover:shadow-[var(--shadow-lift)] hover:-translate-y-0.5",
  templateCardSelected: "ring-2 ring-brand-600 shadow-[var(--shadow-lift)]",
  templateCardDefault: "hover:border-brand-200",
  templateDesign: "relative h-56 w-full bg-slate-100/70 overflow-hidden flex items-center justify-center p-2 border-b border-slate-100",
  templateOverlay: "absolute inset-0 bg-white/10",
  selectionIndicator: "absolute right-3 top-3 z-20",
  selectionCircle: "flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 shadow-md",
  selectionIcon: "text-white",
  templateHoverEffect: "absolute inset-0 bg-brand-600/5 opacity-0 transition-opacity duration-200 hover:opacity-100",
  templateName: "text-sm font-medium text-ink",
  emptyTemplate: "relative h-full w-full overflow-hidden rounded-2xl",
  emptyTemplateIcon: "rounded-full bg-white/90 p-3 shadow-sm",
  emptyTemplateText: "mt-1 text-xs text-slate-500",
};

export const shimmerStyle = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .animate-shimmer { animation: shimmer 2s infinite; }
  .animate-flow { animation: flow 4s infinite linear; }
`

export const commonStyles = {
  trashButton: "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl text-red-400 transition-all hover:bg-red-50 hover:text-red-500",
  addButtonBase: "inline-flex items-center gap-2 rounded-full border border-dashed border-brand-300 bg-brand-50/60 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-all hover:bg-brand-100",
};

export const additionalInfoStyles = {
  container: "p-6 sm:p-8",
  heading: "font-display text-xl font-bold text-ink mb-6",
  sectionHeading: "flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500 mb-4",
  dotViolet: "h-1.5 w-1.5 rounded-full bg-brand-600",
  dotOrange: "h-1.5 w-1.5 rounded-full bg-brand-400",
  languageItem: "relative rounded-2xl border border-line bg-mist/50 p-5 transition-colors hover:border-brand-200",
  interestItem: "relative",
  addButtonLanguage: "",
  addButtonInterest: "",
};

export const certificationInfoStyles = {
  container: "p-6 sm:p-8",
  heading: "font-display text-xl font-bold text-ink mb-6",
  item: "relative rounded-2xl border border-line bg-mist/50 p-5 transition-colors hover:border-brand-200",
  addButton: "",
};

export const contactInfoStyles = {
  container: "p-6 sm:p-8",
  heading: "font-display text-xl font-bold text-ink mb-6",
};

export const educationDetailsStyles = {
  container: "p-6 sm:p-8",
  heading: "font-display text-xl font-bold text-ink mb-6",
  item: "relative rounded-2xl border border-line bg-mist/50 p-5 transition-colors hover:border-brand-200",
  addButton: "",
};

export const profileInfoStyles = {
  container: "p-6 sm:p-8",
  heading: "font-display text-xl font-bold text-ink mb-6",
  textarea: "w-full resize-none rounded-xl border border-line bg-white p-4 text-sm text-ink outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10",
};

export const projectDetailStyles = {
  container: "p-6 sm:p-8",
  heading: "font-display text-xl font-bold text-ink mb-6",
  item: "relative rounded-2xl border border-line bg-mist/50 p-5 transition-colors hover:border-brand-200",
  textarea: "w-full resize-none rounded-xl border border-line bg-white p-4 text-sm text-ink outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10",
  addButton: "",
};

export const skillsInfoStyles = {
  container: "p-6 sm:p-8",
  heading: "font-display text-xl font-bold text-ink mb-6",
  item: "relative rounded-2xl border border-line bg-mist/50 p-5 transition-colors hover:border-brand-200",
  addButton: "",
};

export const workExperienceStyles = {
  container: "p-6 sm:p-8",
  heading: "font-display text-xl font-bold text-ink mb-6",
  item: "relative rounded-2xl border border-line bg-mist/50 p-5 transition-colors hover:border-brand-200",
  textarea: "w-full resize-none rounded-xl border border-line bg-white p-4 text-sm text-ink outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10",
  addButton: "",
};

export const containerStyles = {
  main: "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6",
  header: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-line bg-white px-5 py-4 shadow-[var(--shadow-soft)]",
  grid: "grid grid-cols-1 lg:grid-cols-2 gap-6",
  formContainer: "overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-soft)]",
  previewContainer: "overflow-hidden rounded-3xl border border-line bg-white p-4 shadow-[var(--shadow-soft)]",
  previewInner: "mx-auto w-full max-w-[800px]",
  modalContent: "h-[80vh] w-[90vw]",
  pdfPreview: "flex w-full justify-center p-4",
  hiddenThumbnail: "mx-auto max-w-[400px] bg-white shadow-lg",
};

export const buttonStyles = {
  theme: "flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink-soft transition-all hover:border-brand-300 hover:text-brand-700",
  delete: "flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition-all hover:bg-red-100",
  download: "flex items-center gap-2 rounded-full bg-success px-5 py-2.5 text-xs font-semibold text-white transition-all hover:opacity-90",
  preview: "flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white shadow-[var(--shadow-glow)] transition-all hover:bg-brand-700",
  back: "flex items-center gap-2 rounded-full bg-mist px-5 py-2.5 text-sm font-semibold text-ink-soft transition-all hover:bg-line",
  save: "flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:border-brand-300 hover:text-brand-700",
  next: "flex items-center gap-2 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 hover:bg-brand-700",
  ats: "flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-all hover:bg-brand-100",
  modalAction: "flex items-center gap-2 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-700"
};

export const statusStyles = {
  completionBadge: "inline-flex items-center gap-2 rounded-full bg-mist px-3 py-1 text-xs font-medium text-slate-500",
  modalBadge: "inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700",
  error: "mb-4 flex items-center gap-3 rounded-xl border border-warning/30 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700"
};

export const iconStyles = {
  pulseDot: "h-1.5 w-1.5 animate-pulse rounded-full bg-success"
};

export const inputStyles = {
  wrapper: "group mb-5",
  label: "mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400 transition-colors group-focus-within:text-brand-600",
  inputContainer: focused => `relative flex items-center rounded-xl border bg-white px-4 py-3 transition-all duration-200 ${focused
    ? 'border-brand-400 ring-4 ring-brand-500/10'
    : 'border-line hover:border-slate-300'}`,
  inputField: "w-full bg-transparent font-medium text-ink outline-none placeholder-slate-400",
  toggleButton: "rounded-lg p-1 text-slate-400 transition-colors hover:text-brand-600",
};

export const photoSelectorStyles = {
  container: "mb-8 flex justify-center",
  hiddenInput: "hidden",
  placeholder: hovered => `relative flex h-32 w-32 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-line bg-mist transition-all duration-200 ${hovered ? 'hover:border-brand-400 hover:bg-brand-50' : ''}`,
  cameraButton: "absolute -bottom-1 -right-1 flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white shadow-[var(--shadow-glow)] transition-transform hover:scale-110",
  previewWrapper: "relative group",
  previewImageContainer: hovered => `h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-[var(--shadow-lift)] transition-all duration-200 ${hovered ? 'group-hover:border-brand-200' : ''}`,
  previewImage: "h-full w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-110",
  overlay: "absolute inset-0 flex items-center justify-center rounded-full bg-ink/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
  actionButton: () => `flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-red-500 transition-all hover:bg-white`,
};

export const titleInputStyles = {
  container: "flex items-center gap-3",
  titleText: "font-display text-lg font-bold text-ink sm:text-xl",
  editButton: "group rounded-lg p-2 text-slate-400 transition-all hover:bg-brand-50 hover:text-brand-600",
  editIcon: "h-4 w-4 transition-colors",
  inputField: focused => `border-b-2 bg-transparent pb-1 font-display text-lg font-bold text-ink outline-none transition-all sm:text-xl ${focused ? 'border-brand-500' : 'border-line'}`,
  confirmButton: "rounded-lg bg-brand-600 p-2 text-white transition-all hover:bg-brand-700",
};

export const modalStyles = {
  overlay: "fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-ink/50 p-4 backdrop-blur-sm",
  container: "relative flex max-h-[92vh] max-w-[95vw] flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-lift)]",
  header: "flex items-center justify-between border-b border-line bg-mist/60 px-6 py-4",
  title: "font-display text-lg font-bold text-ink",
  actionButton: "mr-14 flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-brand-700",
  closeButton: "absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm transition-all hover:text-red-500",
  body: "flex-1 overflow-y-auto custom-scrollbar"
};

export const infoStyles = {
  // Progress
  progressWrapper: "h-1.5 w-20 rounded-full bg-line",
  progressBar: () => `h-full rounded-full transition-all`,

  // ActionLink
  actionWrapper: "flex items-center gap-2.5",
  actionIconWrapper: "flex h-6 w-6 items-center justify-center rounded-full",
  actionLink: "break-all text-sm font-medium text-slate-500 underline-offset-2 transition-colors hover:text-brand-600 hover:underline cursor-pointer",

  // CertificationInfo
  certContainer: "mb-4",
  certTitle: "text-base font-semibold text-ink",
  certRow: "mt-1 flex items-center gap-2",
  certYear: () => `rounded-lg bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700`,
  certIssuer: "text-sm font-medium text-slate-500",

  // ContactInfo
  contactRow: "mb-2.5 flex items-center gap-2.5",
  contactIconWrapper: "flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600",
  contactText: "flex-1 break-all text-sm font-medium text-ink-soft",

  // EducationInfo
  eduContainer: "mb-5",
  eduDegree: "pb-1 text-base font-semibold text-ink",
  eduInstitution: "text-sm font-medium text-slate-500",
  eduDuration: "mt-1 text-xs font-medium italic text-slate-400",

  // Language/Skill Info
  infoRow: "mb-2.5 flex items-center justify-between",
  infoLabel: "text-sm font-semibold text-ink",

  // Links
  linkRow: "flex items-center space-x-1 transition-colors hover:text-brand-600",

  // ProjectInfo
  projectContainer: "mb-5",
  projectTitle: isPreview => `${isPreview ? 'text-sm' : 'text-base'} font-semibold text-ink`,
  projectDesc: "mt-1 text-sm leading-relaxed text-slate-500",
  projectLinks: "mt-2.5 flex items-center gap-4 font-medium text-brand-600",

  // RatingInput
  ratingWrapper: "flex cursor-pointer gap-1.5",
  ratingDot: "h-3.5 w-3.5 rounded transition-all hover:scale-110",

  // SkillSection
  skillGrid: "mb-5 grid grid-cols-2 gap-x-6 gap-y-2",

  // WorkExperience
  workContainer: "mb-6",
  workHeader: "mb-1.5 flex items-start justify-between",
  workCompany: "pb-1 text-base font-semibold text-ink",
  workRole: "text-base font-medium text-slate-500",
  workDuration: () => `text-sm font-bold italic text-brand-600`,
  workDesc: "text-sm font-medium leading-relaxed text-slate-500"
};
