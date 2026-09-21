import { cardStyles as styles } from "../assets/dummystyle"
import { Edit, Trash2, Check, Download } from "lucide-react"

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—"

// Resume summary card shown on the dashboard
export const ResumeSummaryCard = ({
  title = "Untitled Resume",
  createdAt = null,
  updatedAt = null,
  onSelect,
  onDelete,
  onDownload,
  completion = 85,
  atsScore = null,
}) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  return (
    <div className={styles.resumeCard} onClick={onSelect}>
      <div className={styles.cardBackground} />

      <div className={styles.previewArea}>
        {/* completion indicator */}
        <div className={styles.completionIndicator}>
          <span className={`${styles.completionDot} ${completion >= 90 ? styles.completionHigh : completion >= 70 ? styles.completionMedium : styles.completionLow}`}>
            <span className={styles.completionDotInner} />
          </span>
          <span className={styles.completionPercentageText}>{completion}%</span>
        </div>

        {atsScore != null && (
          <div className="absolute left-4 top-4 z-10">
            <span className={styles.atsBadge}>
              <Check size={11} /> ATS {atsScore}
            </span>
          </div>
        )}

        {/* generated preview design */}
        <div className="flex h-[190px] flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-mist to-brand-50">
          <div className="w-28 rounded-lg border border-line bg-white p-3 shadow-[var(--shadow-soft)] transition-transform duration-300 group-hover:-rotate-2">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-ink/80" />
            <div className="mx-auto mt-1 h-1 w-8 rounded-full bg-line" />
            <div className="mt-2.5 space-y-1">
              {[100, 82, 90, 66].map((w, i) => (
                <div key={i} className="h-1 rounded-full bg-mist" style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="mt-2 h-1 w-8 rounded-full bg-brand-600/70" />
            <div className="mt-1.5 space-y-1">
              {[88, 74].map((w, i) => (
                <div key={i} className="h-1 rounded-full bg-mist" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
          <div className={styles.emptyPreviewText}>{title}</div>
          <div className={styles.emptyPreviewSubtext}>
            {completion}% complete
          </div>
        </div>
      </div>

      <div className={styles.infoArea}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.dateInfo}>
          <span>Created: {formatDate(createdAt)}</span>
          <span className="text-line">•</span>
          <span>Updated: {formatDate(updatedAt)}</span>
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${completion}%` }} />
        </div>
        <div className={styles.completionStatus}>
          <span className={styles.statusText}>
            {completion >= 90 ? "Ready to go!" : completion >= 50 ? "Making progress" : "Getting started"}
          </span>
          <span className={styles.percentageText}>{completion}% Complete</span>
        </div>
      </div>

      {/* hover actions */}
      <div className={styles.actionOverlay}>
        <div className={styles.actionButtonsContainer}>
          <button
            className={styles.editButton}
            onClick={(e) => { e.stopPropagation(); onSelect && onSelect() }}
            title="Edit resume"
          >
            <Edit size={16} className={styles.buttonIcon} />
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition-all hover:scale-110 hover:bg-brand-50 hover:text-brand-600"
            onClick={(e) => {
              e.stopPropagation();
              if (onDownload) onDownload();
              else if (onSelect) onSelect();
            }}
            title="Download resume"
          >
            <Download size={16} className={styles.buttonIcon} />
          </button>
          <button
            className={styles.deleteButton}
            onClick={handleDeleteClick}
            title="Delete resume"
          >
            <Trash2 size={16} className={styles.buttonIcon} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Template picker card (used inside the theme selector)
export const TemplateCard = ({
  thumbnailImg,
  isSelected,
  onSelect,
  name,
  category,
  atsScore,
  layoutType,
}) => {
  return (
    <div
      className={`${styles.templateCard} ${isSelected ? styles.templateCardSelected : styles.templateCardDefault} flex flex-col relative group`}
      onClick={() => onSelect && onSelect()}
    >
      {isSelected && (
        <div className={styles.selectionIndicator}>
          <div className={styles.selectionCircle}>
            <Check size={14} className={styles.selectionIcon} />
          </div>
        </div>
      )}

      {/* Floating ATS rating pill */}
      {atsScore && (
        <div className="absolute top-2 right-2 z-10">
          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-600/90 text-white shadow-xs backdrop-blur-xs">
            <Check size={9} /> ATS {atsScore}
          </span>
        </div>
      )}

      {thumbnailImg ? (
        <div className={styles.templateDesign}>
          <img src={thumbnailImg} alt={name || "Template preview"} className="h-full w-full object-cover object-top" />
          <div className={styles.templateHoverEffect} />
        </div>
      ) : (
        <div className={styles.emptyTemplate}>
          <div className="flex h-full items-center justify-center bg-mist">
            <div className="text-center">
              <div className={styles.emptyTemplateIcon}>📄</div>
              <div className={styles.emptyTemplateText}>No template</div>
            </div>
          </div>
        </div>
      )}
      {name && (
        <div className="p-2.5 bg-white border-t border-slate-100 flex flex-col gap-1">
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-xs font-bold text-slate-800 truncate">{name}</span>
            {category && (
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
                category === "Shanidhya" 
                  ? "bg-teal-50 text-teal-700 border border-teal-200"
                  : category === "Reactive Resume"
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  : "bg-slate-100 text-slate-600"
              }`}>
                {category === "Reactive Resume" ? "Reactive" : category}
              </span>
            )}
          </div>
          {layoutType && (
            <span className="text-[10px] text-slate-400 font-medium">
              {layoutType}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
