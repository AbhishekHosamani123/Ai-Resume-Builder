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

export const TemplateMeowth = ({ resumeData = {}, containerWidth }) => {
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

  const accentColor = "#d97706"; // Warm Gold / Amber

  return (
    <div
      ref={resumeRef}
      className="a4-wrapper bg-white font-sans text-slate-800 p-8 flex flex-col gap-5"
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
      {/* Top Gold Border Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-full" />

      {/* Header */}
      <header className="flex justify-between items-start pb-4 border-b border-amber-200">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {profileInfo.fullName || "Your Name"}
          </h1>
          <p className="text-sm font-semibold tracking-wider text-amber-700 uppercase mt-0.5">
            {profileInfo.designation || ""}
          </p>
          {profileInfo.summary && (
            <p className="mt-2.5 text-xs text-slate-600 leading-relaxed max-w-2xl">
              {profileInfo.summary}
            </p>
          )}
        </div>
        {avatarUrl && (
          <Avatar
            url={avatarUrl}
            name={profileInfo.fullName}
            size={76}
            borderColor={accentColor}
            className="ring-2 ring-amber-200"
          />
        )}
      </header>

      {/* Contact Line */}
      {contacts.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 py-2 px-3 bg-amber-50/40 rounded-lg border border-amber-200/60 text-[11px] text-slate-700">
          {contacts.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-amber-700">{getContactIcon(c.type, 12)}</span>
              {c.href ? (
                <a href={c.href} target="_blank" rel="noreferrer" className="hover:underline text-slate-900 font-medium">
                  {c.label}
                </a>
              ) : (
                <span>{c.label}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 2-Column Grid */}
      <div className="grid grid-cols-12 gap-7">
        {/* Left Column (8 cols) */}
        <div className="col-span-8 flex flex-col gap-6">
          {jobs.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b border-amber-300">
                Professional Experience
              </h2>
              <div className="space-y-4">
                {jobs.map((job, idx) => {
                  const bullets = parseBullets(job.description);
                  const dates = formatDates(job.startDate, job.endDate);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-xs font-bold text-slate-900">{job.role}</h3>
                        {dates && <span className="text-[10px] font-semibold text-amber-800">{dates}</span>}
                      </div>
                      <p className="text-[11px] font-semibold text-amber-800">
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b border-amber-300">
                Key Projects
              </h2>
              <div className="space-y-3">
                {projs.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-amber-50/20 border border-amber-200/60">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-slate-900">{p.title}</h3>
                      <div className="flex gap-2 text-[10px]">
                        {p.github && (
                          <a href={p.github} target="_blank" rel="noreferrer" className="text-amber-800 hover:underline flex items-center gap-0.5">
                            Code <ExternalLink size={9} />
                          </a>
                        )}
                        {p.liveDemo && (
                          <a href={p.liveDemo} target="_blank" rel="noreferrer" className="text-amber-700 hover:underline flex items-center gap-0.5">
                            Demo <ExternalLink size={9} />
                          </a>
                        )}
                      </div>
                    </div>
                    {p.description && <BulletList text={p.description} bulletColor={accentColor} className="space-y-1 text-[11px] text-slate-600 mt-1" />}
                    {p.technologies && p.technologies.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {p.technologies.map((t, tIdx) => (
                          <span key={tIdx} className="text-[9px] bg-white px-1.5 py-0.5 rounded border border-amber-200 text-amber-900 font-medium">
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
        </div>

        {/* Right Column (4 cols) */}
        <div className="col-span-4 flex flex-col gap-6">
          {skillList.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b border-amber-300">
                Expertise
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skillList.map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {edus.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b border-amber-300">
                Education
              </h2>
              <div className="space-y-3 text-[11px]">
                {edus.map((edu, idx) => (
                  <div key={idx}>
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    <p className="text-amber-800 font-medium">{edu.institution}</p>
                    <p className="text-[10px] text-slate-400">
                      {formatDates(edu.startDate, edu.endDate || edu.graduationYear)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certs.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b border-amber-300">
                Certifications
              </h2>
              <div className="space-y-2 text-[11px]">
                {certs.map((c, i) => (
                  <div key={i}>
                    <p className="font-semibold text-slate-800">{c.title}</p>
                    <p className="text-[10px] text-slate-500">
                      {[c.issuer, c.year].filter(Boolean).join(" • ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {langList.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b border-amber-300">
                Languages
              </h2>
              <div className="space-y-1 text-[11px] text-slate-700">
                {langList.map((l, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{l.name}</span>
                    {l.progress ? <span className="text-[10px] text-amber-700 font-semibold">{l.progress}%</span> : null}
                  </div>
                ))}
              </div>
            </section>
          )}

          {interestList.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b border-amber-300">
                Interests
              </h2>
              <div className="flex flex-wrap gap-1 text-[10px] text-slate-600">
                {interestList.map((interest, i) => (
                  <span key={i} className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateMeowth;
