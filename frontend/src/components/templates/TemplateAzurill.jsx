import React from "react";
import {
  useResumeScale,
  parseContactItem,
  getContactIcon,
  formatDates,
  parseBullets,
  BulletList,
  Avatar,
} from "./TemplateHelpers";
import { ExternalLink, Award, Briefcase, GraduationCap, FolderGit2 } from "lucide-react";

export const TemplateAzurill = ({ resumeData = {}, containerWidth }) => {
  const { resumeRef, baseWidth, scale } = useResumeScale(containerWidth);

  const {
    profileInfo = {},
    contactInfo = {},
    education = [],
    workExperience = [],
    projects = [],
    skills = [],
    certifications = [],
    languages = [],
    interests = [],
  } = resumeData;

  const avatarUrl = profileInfo.profilePreviewUrl || profileInfo.previewUrl;
  const jobs = workExperience.filter((w) => (w.company || "").trim() || (w.role || "").trim());
  const edus = education.filter((e) => (e.degree || "").trim() || (e.institution || "").trim());
  const projs = projects.filter((p) => (p.title || "").trim());
  const certs = certifications.filter((c) => (c.title || "").trim());
  const skillList = skills.filter((s) => (s.name || "").trim());
  const langList = languages.filter((l) => (l.name || "").trim());
  const interestList = interests.filter((i) => String(i || "").trim());

  const contacts = [
    parseContactItem("email", contactInfo.email),
    parseContactItem("phone", contactInfo.phone),
    parseContactItem("location", contactInfo.location),
    parseContactItem("linkedin", contactInfo.linkedin),
    parseContactItem("github", contactInfo.github),
    parseContactItem("website", contactInfo.website),
  ].filter(Boolean);

  const accentColor = "#2563eb";

  return (
    <div
      ref={resumeRef}
      className="a4-wrapper bg-white text-slate-800"
      style={{
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        width: "100%",
        maxWidth: containerWidth > 0 ? `${baseWidth}px` : "100%",
        transform: containerWidth > 0 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        minHeight: "100%",
        display: "flex",
        boxSizing: "border-box",
      }}
    >
      {/* Left Sidebar (33%) */}
      <aside
        className="w-[33%] p-5 sm:p-6 border-r flex flex-col gap-5 shrink-0"
        style={{ backgroundColor: "#f0f7ff", borderColor: "#dbeafe" }}
      >
        {/* Avatar + Name */}
        <div className="flex flex-col items-center text-center">
          <Avatar
            url={avatarUrl}
            name={profileInfo.fullName}
            size={76}
            borderColor={accentColor}
            className="mb-2.5"
          />
          <h2 className="text-sm font-bold text-slate-900 mt-1">{profileInfo.fullName || "Your Name"}</h2>
          <p className="text-[11px] font-medium text-blue-600 mt-0.5">{profileInfo.designation}</p>
        </div>

        {/* Contact Information */}
        {contacts.length > 0 && (
          <div className="resume-section">
            <h3
              className="text-[11px] font-bold uppercase tracking-wider mb-2.5 pb-1 border-b"
              style={{ color: accentColor, borderColor: "#bfdbfe" }}
            >
              Contact
            </h3>
            <ul className="space-y-2 text-[11px]">
              {contacts.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-600">
                  <span className="mt-0.5 shrink-0" style={{ color: accentColor }}>{getContactIcon(c.type, 13)}</span>
                  {c.href ? (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline break-all leading-normal text-[11px]"
                      style={{ color: "#1e293b" }}
                    >
                      {c.label}
                    </a>
                  ) : (
                    <span className="break-all leading-normal text-[11px]">{c.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {skillList.length > 0 && (
          <div className="resume-section">
            <h3
              className="text-[11px] font-bold uppercase tracking-wider mb-2.5 pb-1 border-b"
              style={{ color: accentColor, borderColor: "#bfdbfe" }}
            >
              Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skillList.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-900 border border-blue-200"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {langList.length > 0 && (
          <div className="resume-section">
            <h3
              className="text-[11px] font-bold uppercase tracking-wider mb-2.5 pb-1 border-b"
              style={{ color: accentColor, borderColor: "#bfdbfe" }}
            >
              Languages
            </h3>
            <div className="space-y-1.5 text-[11px]">
              {langList.map((l, i) => (
                <div key={i} className="flex justify-between items-center text-slate-700">
                  <span>{l.name}</span>
                  {l.progress ? (
                    <span className="text-[10px] text-slate-400">{l.progress}%</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certs.length > 0 && (
          <div className="resume-section">
            <h3
              className="text-[11px] font-bold uppercase tracking-wider mb-2.5 pb-1 border-b"
              style={{ color: accentColor, borderColor: "#bfdbfe" }}
            >
              Certifications
            </h3>
            <div className="space-y-2 text-[11px]">
              {certs.map((c, i) => (
                <div key={i}>
                  <p className="font-semibold text-slate-800 leading-snug">{c.title}</p>
                  {(c.issuer || c.year) && (
                    <p className="text-[10px] text-slate-500">
                      {[c.issuer, c.year].filter(Boolean).join(" • ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {interestList.length > 0 && (
          <div className="resume-section">
            <h3
              className="text-[11px] font-bold uppercase tracking-wider mb-2.5 pb-1 border-b"
              style={{ color: accentColor, borderColor: "#bfdbfe" }}
            >
              Interests
            </h3>
            <div className="flex flex-wrap gap-1 text-[10px] text-slate-600">
              {interestList.map((interest, i) => (
                <span key={i} className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Right Content (67%) */}
      <main className="w-[67%] p-8 flex flex-col gap-6">
        {/* Header Name & Title */}
        <header className="border-b pb-4" style={{ borderColor: "#e2e8f0" }}>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {profileInfo.fullName || "Your Name"}
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: accentColor }}>
            {profileInfo.designation || ""}
          </p>
          {profileInfo.summary && (
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              {profileInfo.summary}
            </p>
          )}
        </header>

        {/* Work Experience with Timeline */}
        {jobs.length > 0 && (
          <section className="resume-section">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase size={15} style={{ color: accentColor }} />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Experience
              </h2>
            </div>
            <div className="relative pl-4 space-y-5 border-l-2" style={{ borderColor: "#dbeafe" }}>
              {jobs.map((job, idx) => {
                const bullets = parseBullets(job.description);
                const dates = formatDates(job.startDate, job.endDate);
                return (
                  <div key={idx} className="relative">
                    {/* Timeline Node */}
                    <div
                      className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: accentColor }}
                    />
                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                      <h3 className="text-xs font-bold text-slate-900">{job.role}</h3>
                      {dates && <span className="text-[10px] font-medium text-slate-400">{dates}</span>}
                    </div>
                    <div className="text-[11px] font-medium text-blue-600 mb-1.5">
                      {job.company} {job.location ? `• ${job.location}` : ""}
                    </div>
                    {bullets.length > 0 && (
                      <BulletList items={bullets} bulletColor={accentColor} className="space-y-1 text-[11px] text-slate-600 leading-relaxed mt-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Projects */}
        {projs.length > 0 && (
          <section className="resume-section">
            <div className="flex items-center gap-2 mb-3">
              <FolderGit2 size={15} style={{ color: accentColor }} />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Projects
              </h2>
            </div>
            <div className="space-y-3.5">
              {projs.map((p, idx) => (
                <div key={idx} className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900">{p.title}</h3>
                    <div className="flex gap-2 text-[10px]">
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-600 flex items-center gap-0.5">
                          GitHub <ExternalLink size={9} />
                        </a>
                      )}
                      {p.liveDemo && (
                        <a href={p.liveDemo} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-0.5">
                          Demo <ExternalLink size={9} />
                        </a>
                      )}
                    </div>
                  </div>
                  {p.description && (
                    <BulletList text={p.description} bulletColor={accentColor} className="mt-1 space-y-1 text-[11px] text-slate-600 leading-snug" />
                  )}
                  {p.technologies && p.technologies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.technologies.map((t, tIdx) => (
                        <span key={tIdx} className="text-[9px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {edus.length > 0 && (
          <section className="resume-section">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap size={15} style={{ color: accentColor }} />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Education
              </h2>
            </div>
            <div className="space-y-3">
              {edus.map((edu, idx) => {
                const dates = formatDates(edu.startDate, edu.endDate || edu.graduationYear);
                return (
                  <div key={idx} className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">
                        {edu.degree} {edu.major ? `in ${edu.major}` : ""}
                      </h3>
                      <p className="text-[11px] text-slate-600">
                        {edu.institution} {edu.location ? `• ${edu.location}` : ""}
                      </p>
                    </div>
                    {dates && <span className="text-[10px] font-medium text-slate-400">{dates}</span>}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default TemplateAzurill;
