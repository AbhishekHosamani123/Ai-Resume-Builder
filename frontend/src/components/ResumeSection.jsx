import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { infoStyles as styles } from '../assets/dummystyle';
import { parseBullets } from './templates/TemplateHelpers';

export const Progress = ({ progress, color }) => (
  <div className={styles.progressWrapper}>
    <div className={styles.progressBar(color)} style={{ width: `${progress * 20}%`, backgroundColor: color }} />
  </div>
);

export const ActionLink = ({ icon, link, bgColor }) => (
  <div className={styles.actionWrapper}>
    <div className={styles.actionIconWrapper} style={{ backgroundColor: bgColor }}>
      {icon}
    </div>
    <p className={styles.actionLink}>{link}</p>
  </div>
);

export const CertificationInfo = ({ title, issuer, year, bgColor }) => (
  <div className={styles.certContainer}>
    <h3 className={styles.certTitle}>{title}</h3>
    <div className={styles.certRow}>
      {year && <div className={styles.certYear(bgColor)} style={{ backgroundColor: bgColor }}>{year}</div>}
      <p className={styles.certIssuer}>{issuer}</p>
    </div>
  </div>
);

export const ContactInfo = ({ icon, iconBG, value }) => (
  <div className={styles.contactRow}>
    <div className={styles.contactIconWrapper} style={{ backgroundColor: iconBG }}>{icon}</div>
    <p className={styles.contactText}>{value}</p>
  </div>
);

export const EducationInfo = ({ degree, institution, duration }) => (
  <div className={styles.eduContainer}>
    <h3 className={styles.eduDegree}>{degree}</h3>
    <p className={styles.eduInstitution}>{institution}</p>
    <p className={styles.eduDuration}>{duration}</p>
  </div>
);

const InfoBlock = ({ label, progress, accentColor }) => (
  <div className={styles.infoRow}>
    <p className={styles.infoLabel}>{label}</p>
    {progress > 0 && <Progress progress={(progress / 100) * 5} color={accentColor} />}
  </div>
);

export const LanguageSection = ({ languages, accentColor }) => (
  <div>
    {languages.map((lang, idx) => (
      <InfoBlock key={idx} label={lang.name} progress={lang.progress} accentColor={accentColor} />
    ))}
  </div>
);

export const SkillSection = ({ skills, accentColor }) => (
  <div className={styles.skillGrid}>
    {skills.map((skill, idx) => (
      <InfoBlock key={idx} label={skill.name} progress={skill.progress} accentColor={accentColor} />
    ))}
  </div>
);

export const ProjectInfo = ({ title, description, githubLink, liveDemoUrl, isPreview }) => {
  const bullets = parseBullets(description);
  return (
    <div className={styles.projectContainer}>
      <h3 className={styles.projectTitle(isPreview)}>{title}</h3>
      {bullets.length > 0 ? (
        <div className="space-y-1 text-xs text-gray-700 mt-1 pl-1">
          {bullets.map((b, i) => (
            <div key={i} className="flex items-start gap-2">
              <span
                className="shrink-0 mt-1.5"
                style={{
                  display: "inline-block",
                  width: "4.5px",
                  height: "4.5px",
                  borderRadius: "50%",
                  backgroundColor: "#475569",
                }}
              />
              <span className="flex-1 leading-relaxed">{b}</span>
            </div>
          ))}
        </div>
      ) : description ? (
        <p className={styles.projectDesc}>{description}</p>
      ) : null}
      <div className="mt-2.5 flex items-center gap-4 font-medium text-brand-600">
        {githubLink && (
          <a href={githubLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs transition-colors hover:text-brand-700">
            <Github size={14} className="shrink-0" /><span>GitHub</span>
          </a>
        )}
        {liveDemoUrl && (
          <a href={liveDemoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs transition-colors hover:text-brand-700">
            <ExternalLink size={14} className="shrink-0" /><span>Live Demo</span>
          </a>
        )}
      </div>
    </div>
  );
};

export const RatingInput = ({ value = 0, total = 5, onChange = () => {}, color = '#10b981', bgColor = '#e5e7eb' }) => {
  const displayValue = Math.round((value / 100) * total);
  return (
    <div className={styles.ratingWrapper}>
      {[...Array(total)].map((_, idx) => (
        <div
          key={idx}
          onClick={() => onChange(Math.round(((idx + 1) / total) * 100))}
          className={styles.ratingDot}
          style={{ backgroundColor: idx < displayValue ? color : bgColor }}
        />
      ))}
    </div>
  );
};

export const WorkExperience = ({ company, role, duration, durationColor, description }) => {
  const bullets = parseBullets(description);
  return (
    <div className={styles.workContainer}>
      <div className={styles.workHeader}>
        <div>
          <h3 className={styles.workCompany}>{company}</h3>
          <p className={styles.workRole}>{role}</p>
        </div>
        <p className={styles.workDuration(durationColor)} style={{ color: durationColor }}>{duration}</p>
      </div>
      {bullets.length > 0 ? (
        <div className="space-y-1 text-xs text-gray-700 mt-1 pl-1">
          {bullets.map((b, i) => (
            <div key={i} className="flex items-start gap-2">
              <span
                className="shrink-0 mt-1.5"
                style={{
                  display: "inline-block",
                  width: "4.5px",
                  height: "4.5px",
                  borderRadius: "50%",
                  backgroundColor: "#475569",
                }}
              />
              <span className="flex-1 leading-relaxed">{b}</span>
            </div>
          ))}
        </div>
      ) : description ? (
        <p className={styles.workDesc}>{description}</p>
      ) : null}
    </div>
  );
};