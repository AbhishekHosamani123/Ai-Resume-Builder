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
import { ExternalLink } from "lucide-react";

export const TemplateGlalie = ({ resumeData = {}, containerWidth }) => {
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
  const accentColor = "#0284c7"; // Sky 600
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

  return (
    <div
      ref={resumeRef}
      className="a4-wrapper bg-white font-sans text-slate-800 flex"
      style={{
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        width: "100%",
        maxWidth: containerWidth > 0 ? `${baseWidth}px` : "100%",
        transform: containerWidth > 0 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        minHeight: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Left Sidebar (33%): Ice Blue Tint */}
      <aside className="w-[33%] bg-sky-50/70 p-6 flex flex-col gap-5 border-r border-sky-100">
        <div className="flex flex-col items-center text-center">
          <Avatar
            url={avatarUrl}
            name={profileInfo.fullName}
            size={84}
            borderColor="#0284c7"
            className="mb-3 ring-2 ring-sky-200"
          />
          <h2 className="text-xs font-bold uppercase tracking-wider text-sky-800">
            {profileInfo.designation || ""}
          </h2>
        </div>

        {contacts.length > 0 && (
          <div className="resume-section">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-sky-200">
              Contact Details
            </h3>
            <div className="space-y-2 text-[11px]">
              {contacts.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-600">
                  <span className="text-sky-600">{getContactIcon(c.type, 12)}</span>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noreferrer" className="hover:underline break-all leading-normal text-slate-800">
                      {c.label}
                    </a>
                  ) : (
                    <span className="break-all leading-normal text-[11px]">{c.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {skillList.length > 0 && (
          <div className="resume-section">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-sky-200">
              Competencies
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skillList.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-sky-900 border border-sky-200 shadow-xs"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {edus.length > 0 && (
          <div className="resume-section">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-sky-200">
              Education
            </h3>
            <div className="space-y-2.5 text-[11px]">
              {edus.map((edu, idx) => (
                <div key={idx}>
                  <p className="font-bold text-slate-900">{edu.degree}</p>
                  <p className="text-slate-700">{edu.institution}</p>
                  <p className="text-[10px] text-sky-700">
                    {formatDates(edu.startDate, edu.endDate || edu.graduationYear)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {certs.length > 0 && (
          <div className="resume-section">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-sky-200">
              Certifications
            </h3>
            <div className="space-y-1.5 text-[11px]">
              {certs.map((c, i) => (
                <div key={i}>
                  <p className="font-semibold text-slate-800">{c.title}</p>
                  <p className="text-[10px] text-slate-500">
                    {[c.issuer, c.year].filter(Boolean).join(" • ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {langList.length > 0 && (
          <div className="resume-section">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-sky-200">
              Languages
            </h3>
            <div className="space-y-1 text-[11px] text-slate-700">
              {langList.map((l, i) => (
                <div key={i} className="flex justify-between">
                  <span>{l.name}</span>
                  {l.progress ? <span className="text-[10px] text-sky-600">{l.progress}%</span> : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {interestList.length > 0 && (
          <div className="resume-section">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-sky-200">
              Interests
            </h3>
            <div className="flex flex-wrap gap-1 text-[10px] text-slate-600">
              {interestList.map((interest, i) => (
                <span key={i} className="bg-sky-100 px-1.5 py-0.5 rounded text-sky-800">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Right (67%) */}
      <main className="w-[67%] p-7 flex flex-col gap-6">
        <header className="pb-4 border-b border-slate-200">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {profileInfo.fullName || "Your Name"}
          </h1>
          <p className="text-sm font-semibold text-sky-700 mt-1 uppercase tracking-wide">
            {profileInfo.designation || ""}
          </p>
          {profileInfo.summary && (
            <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
              {profileInfo.summary}
            </p>
          )}
        </header>

        {jobs.length > 0 && (
          <section className="resume-section">
            <div className="flex items-center gap-2 mb-3 pb-1 border-b border-sky-200">
              <span className="w-2 h-2 rotate-45 bg-sky-600 inline-block" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Experience
              </h2>
            </div>
            <div className="space-y-4">
              {jobs.map((job, idx) => {
                const bullets = parseBullets(job.description);
                const dates = formatDates(job.startDate, job.endDate);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-900">{job.role}</h3>
                      {dates && <span className="text-[10px] font-semibold text-sky-700">{dates}</span>}
                    </div>
                    <p className="text-[11px] font-semibold text-slate-600">
                      {job.company} {job.location ? `| ${job.location}` : ""}
                    </p>
                    {bullets.length > 0 && (
                        <BulletList items={bullets} bulletColor={accentColor} className="space-y-1 text-[11px] text-slate-600 mt-1 leading-snug" />
                      )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {projs.length > 0 && (
          <section className="resume-section">
            <div className="flex items-center gap-2 mb-3 pb-1 border-b border-sky-200">
              <span className="w-2 h-2 rotate-45 bg-sky-600 inline-block" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Projects
              </h2>
            </div>
            <div className="space-y-3">
              {projs.map((p, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-sky-50/30 border border-sky-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-900">{p.title}</h3>
                    <div className="flex gap-2 text-[10px]">
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-sky-600 flex items-center gap-0.5">
                          Code <ExternalLink size={9} />
                        </a>
                      )}
                      {p.liveDemo && (
                        <a href={p.liveDemo} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline flex items-center gap-0.5">
                          Demo <ExternalLink size={9} />
                        </a>
                      )}
                    </div>
                  </div>
                  {p.description && <BulletList text={p.description} bulletColor={accentColor} className="space-y-1 text-[11px] text-slate-600 mt-1" />}
                  {p.technologies && p.technologies.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {p.technologies.map((t, tIdx) => (
                        <span key={tIdx} className="text-[9px] bg-white px-1.5 py-0.2 rounded border border-sky-200 text-sky-800">
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
      </main>
    </div>
  );
};

export default TemplateGlalie;
