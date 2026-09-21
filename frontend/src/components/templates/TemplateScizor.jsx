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
import { ExternalLink, Flame } from "lucide-react";

export const TemplateScizor = ({ resumeData = {}, containerWidth }) => {
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

  const accentColor = "#dc2626"; // Crimson 600

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
      {/* Main Left Column (67%): Header, Summary, Experience, Projects */}
      <main className="w-[67%] p-7 flex flex-col gap-6">
        <header className="pb-4 border-b-2 border-red-600">
          <div className="flex items-center gap-1.5 text-red-600 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Flame size={14} className="fill-red-500" />
            <span>High-Impact Resume</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {profileInfo.fullName || "Your Name"}
          </h1>
          <p className="text-sm font-bold text-red-700 mt-0.5 uppercase tracking-wide">
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
            <div className="flex items-center gap-2 mb-3 pb-1 border-b border-red-200">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-sm inline-block" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Work Experience
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
                      {dates && <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">{dates}</span>}
                    </div>
                    <p className="text-[11px] font-semibold text-slate-700">
                      {job.company} {job.location ? `• ${job.location}` : ""}
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
            <div className="flex items-center gap-2 mb-3 pb-1 border-b border-red-200">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-sm inline-block" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Key Projects
              </h2>
            </div>
            <div className="space-y-3">
              {projs.map((p, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-red-50/20 border border-red-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-900">{p.title}</h3>
                    <div className="flex gap-2 text-[10px]">
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noreferrer" className="text-red-700 hover:underline flex items-center gap-0.5">
                          Code <ExternalLink size={9} />
                        </a>
                      )}
                      {p.liveDemo && (
                        <a href={p.liveDemo} target="_blank" rel="noreferrer" className="text-red-600 hover:underline flex items-center gap-0.5">
                          Demo <ExternalLink size={9} />
                        </a>
                      )}
                    </div>
                  </div>
                  {p.description && <BulletList text={p.description} bulletColor={accentColor} className="space-y-1 text-[11px] text-slate-600 mt-1" />}
                  {p.technologies && p.technologies.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {p.technologies.map((t, tIdx) => (
                        <span key={tIdx} className="text-[9px] bg-white px-2 py-0.5 rounded border border-red-200 text-red-800 font-bold">
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

      {/* Right Sidebar (33%): Avatar, Contact, Skills, Education */}
      <aside className="w-[33%] bg-red-50/40 p-6 flex flex-col gap-5 border-l border-red-100">
        <div className="flex flex-col items-center text-center">
          <Avatar
            url={avatarUrl}
            name={profileInfo.fullName}
            size={84}
            borderColor={accentColor}
            className="mb-3 ring-2 ring-red-200"
          />
          <h2 className="text-xs font-bold uppercase tracking-wider text-red-800">
            {profileInfo.designation || ""}
          </h2>
        </div>

        {contacts.length > 0 && (
          <div className="resume-section">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-red-200">
              Contact
            </h3>
            <div className="space-y-2 text-[11px]">
              {contacts.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-700">
                  <span className="text-red-600">{getContactIcon(c.type, 12)}</span>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noreferrer" className="hover:underline break-all leading-normal text-slate-900 font-medium">
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
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-red-200">
              Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skillList.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-red-900 border border-red-200 shadow-xs"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {edus.length > 0 && (
          <div className="resume-section">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-red-200">
              Education
            </h3>
            <div className="space-y-2.5 text-[11px]">
              {edus.map((edu, idx) => (
                <div key={idx}>
                  <p className="font-bold text-slate-900">{edu.degree}</p>
                  <p className="text-slate-700 font-medium">{edu.institution}</p>
                  <p className="text-[10px] text-red-700">
                    {formatDates(edu.startDate, edu.endDate || edu.graduationYear)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {certs.length > 0 && (
          <div className="resume-section">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-red-200">
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
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-red-200">
              Languages
            </h3>
            <div className="space-y-1 text-[11px] text-slate-700">
              {langList.map((l, i) => (
                <div key={i} className="flex justify-between">
                  <span>{l.name}</span>
                  {l.progress ? <span className="text-[10px] text-red-600 font-bold">{l.progress}%</span> : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {interestList.length > 0 && (
          <div className="resume-section">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-red-200">
              Interests
            </h3>
            <div className="flex flex-wrap gap-1 text-[10px] text-slate-600">
              {interestList.map((interest, i) => (
                <span key={i} className="bg-white px-2 py-0.5 rounded border border-red-100 text-red-900">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default TemplateScizor;
