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

export const TemplateDitgar = ({ resumeData = {}, containerWidth }) => {
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
  const accentColor = "#6366f1"; // Indigo 500
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
      className="a4-wrapper bg-white font-sans text-slate-800 flex flex-col"
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
      {/* Dark Hero Header Banner */}
      <header className="bg-slate-900 text-white p-7 flex items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-black tracking-tight text-white">
            {profileInfo.fullName || "Your Name"}
          </h1>
          <p className="text-sm font-semibold tracking-wide text-indigo-400 mt-1 uppercase">
            {profileInfo.designation || ""}
          </p>
          {profileInfo.summary && (
            <p className="mt-2.5 text-xs text-slate-300 leading-relaxed max-w-2xl">
              {profileInfo.summary}
            </p>
          )}

          {/* Contact Bar */}
          {contacts.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 text-[11px]">
              {contacts.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/90 border border-slate-700 text-slate-300"
                >
                  <span className="text-indigo-400">{getContactIcon(c.type, 12)}</span>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noreferrer" className="hover:text-white break-all leading-normal">
                      {c.label}
                    </a>
                  ) : (
                    <span className="break-all leading-normal text-[11px]">{c.label}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {avatarUrl && (
          <Avatar
            url={avatarUrl}
            name={profileInfo.fullName}
            size={84}
            borderColor="#818cf8"
            className="ring-4 ring-slate-800"
          />
        )}
      </header>

      {/* Body: 2 Columns */}
      <div className="p-7 grid grid-cols-12 gap-6">
        {/* Left Column (8 cols): Work Experience & Projects */}
        <div className="col-span-8 flex flex-col gap-6">
          {jobs.length > 0 && (
            <section className="resume-section">
              <div className="flex items-center gap-2 mb-3 pb-1 border-b-2 border-indigo-500">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Professional Experience
                </h2>
              </div>
              <div className="space-y-4">
                {jobs.map((job, idx) => {
                  const bullets = parseBullets(job.description);
                  const dates = formatDates(job.startDate, job.endDate);
                  return (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-xs font-bold text-slate-900">{job.role}</h3>
                        {dates && <span className="text-[10px] font-semibold text-indigo-600">{dates}</span>}
                      </div>
                      <p className="text-[11px] font-semibold text-slate-700 mb-1">
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
              <div className="flex items-center gap-2 mb-3 pb-1 border-b-2 border-indigo-500">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Featured Projects
                </h2>
              </div>
              <div className="space-y-3">
                {projs.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-slate-900">{p.title}</h3>
                      <div className="flex gap-2 text-[10px]">
                        {p.github && (
                          <a href={p.github} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-indigo-600 flex items-center gap-0.5">
                            Code <ExternalLink size={9} />
                          </a>
                        )}
                        {p.liveDemo && (
                          <a href={p.liveDemo} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-0.5">
                            Demo <ExternalLink size={9} />
                          </a>
                        )}
                      </div>
                    </div>
                    {p.description && <BulletList text={p.description} bulletColor={accentColor} className="space-y-1 text-[11px] text-slate-600 mt-1" />}
                    {p.technologies && p.technologies.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {p.technologies.map((t, tIdx) => (
                          <span key={tIdx} className="text-[9px] bg-white px-2 py-0.5 rounded border border-indigo-200 text-indigo-800 font-medium">
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

        {/* Right Column (4 cols): Skills, Education, Certs */}
        <div className="col-span-4 flex flex-col gap-6">
          {skillList.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b-2 border-indigo-500">
                Core Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skillList.map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-900 border border-indigo-200/80"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {edus.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b-2 border-indigo-500">
                Education
              </h2>
              <div className="space-y-3 text-[11px]">
                {edus.map((edu, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    <p className="text-slate-700 font-medium">{edu.institution}</p>
                    <p className="text-[10px] text-indigo-600 mt-0.5">
                      {formatDates(edu.startDate, edu.endDate || edu.graduationYear)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certs.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b-2 border-indigo-500">
                Certifications
              </h2>
              <div className="space-y-2 text-[11px]">
                {certs.map((c, i) => (
                  <div key={i} className="p-2 rounded bg-slate-50 border border-slate-200">
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b-2 border-indigo-500">
                Languages
              </h2>
              <div className="space-y-1 text-[11px] text-slate-700">
                {langList.map((l, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{l.name}</span>
                    {l.progress ? <span className="text-[10px] text-indigo-600 font-semibold">{l.progress}%</span> : null}
                  </div>
                ))}
              </div>
            </section>
          )}

          {interestList.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b-2 border-indigo-500">
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

export default TemplateDitgar;
