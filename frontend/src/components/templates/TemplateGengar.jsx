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
import { ExternalLink, Terminal } from "lucide-react";

export const TemplateGengar = ({ resumeData = {}, containerWidth }) => {
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

  const accentColor = "#7c3aed"; // Gengar Violet

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
      {/* Top Header */}
      <header className="flex items-center justify-between pb-5 border-b-2 border-purple-500">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded bg-purple-100 text-purple-700">
              <Terminal size={14} />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
              Software Engineer / Developer
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {profileInfo.fullName || "Your Name"}
          </h1>
          <p className="text-sm font-semibold text-purple-800 mt-0.5">
            {profileInfo.designation || ""}
          </p>
          {profileInfo.summary && (
            <p className="mt-2 text-xs text-slate-600 leading-relaxed max-w-2xl">
              {profileInfo.summary}
            </p>
          )}
        </div>
        {avatarUrl && (
          <Avatar
            url={avatarUrl}
            name={profileInfo.fullName}
            size={84}
            borderColor={accentColor}
            className="ring-4 ring-purple-100"
          />
        )}
      </header>

      {/* Contact Pills */}
      {contacts.length > 0 && (
        <div className="flex flex-wrap gap-2 text-[11px]">
          {contacts.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-50/70 border border-purple-200 text-purple-900"
            >
              <span className="text-purple-600">{getContactIcon(c.type, 12)}</span>
              {c.href ? (
                <a href={c.href} target="_blank" rel="noreferrer" className="hover:underline">
                  {c.label}
                </a>
              ) : (
                <span>{c.label}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Body: 2 Columns (65% / 35%) */}
      <div className="grid grid-cols-12 gap-7">
        {/* Left (8 cols): Experience & Projects */}
        <div className="col-span-8 flex flex-col gap-6">
          {jobs.length > 0 && (
            <section className="resume-section">
              <div className="inline-block px-3 py-1 rounded-md bg-purple-900 text-white text-[10px] font-bold uppercase tracking-wider mb-3">
                Experience
              </div>
              <div className="space-y-4">
                {jobs.map((job, idx) => {
                  const bullets = parseBullets(job.description);
                  const dates = formatDates(job.startDate, job.endDate);
                  return (
                    <div key={idx} className="border-l-2 border-purple-200 pl-3 space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-xs font-bold text-slate-900">{job.role}</h3>
                        {dates && (
                          <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                            {dates}
                          </span>
                        )}
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
              <div className="inline-block px-3 py-1 rounded-md bg-purple-900 text-white text-[10px] font-bold uppercase tracking-wider mb-3">
                Projects
              </div>
              <div className="space-y-3">
                {projs.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-purple-100 bg-purple-50/20">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-slate-900">{p.title}</h3>
                      <div className="flex gap-2 text-[10px]">
                        {p.github && (
                          <a href={p.github} target="_blank" rel="noreferrer" className="text-purple-700 hover:underline flex items-center gap-0.5">
                            GitHub <ExternalLink size={9} />
                          </a>
                        )}
                        {p.liveDemo && (
                          <a href={p.liveDemo} target="_blank" rel="noreferrer" className="text-purple-700 hover:underline flex items-center gap-0.5">
                            Demo <ExternalLink size={9} />
                          </a>
                        )}
                      </div>
                    </div>
                    {p.description && <BulletList text={p.description} bulletColor={accentColor} className="space-y-1 text-[11px] text-slate-600 mt-1" />}
                    {p.technologies && p.technologies.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {p.technologies.map((t, tIdx) => (
                          <span key={tIdx} className="text-[9px] bg-white px-2 py-0.5 rounded border border-purple-200 text-purple-800 font-medium">
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

        {/* Right (4 cols): Skills, Education, Certs */}
        <div className="col-span-4 flex flex-col gap-6">
          {skillList.length > 0 && (
            <section className="resume-section">
              <div className="inline-block px-3 py-1 rounded-md bg-purple-900 text-white text-[10px] font-bold uppercase tracking-wider mb-3">
                Tech Stack
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skillList.map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {edus.length > 0 && (
            <section className="resume-section">
              <div className="inline-block px-3 py-1 rounded-md bg-purple-900 text-white text-[10px] font-bold uppercase tracking-wider mb-3">
                Education
              </div>
              <div className="space-y-3 text-[11px]">
                {edus.map((edu, idx) => (
                  <div key={idx} className="border-l-2 border-purple-200 pl-2.5">
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    <p className="text-purple-800 font-medium">{edu.institution}</p>
                    <p className="text-[10px] text-slate-500">
                      {formatDates(edu.startDate, edu.endDate || edu.graduationYear)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certs.length > 0 && (
            <section className="resume-section">
              <div className="inline-block px-3 py-1 rounded-md bg-purple-900 text-white text-[10px] font-bold uppercase tracking-wider mb-3">
                Certifications
              </div>
              <div className="space-y-2 text-[11px]">
                {certs.map((c, i) => (
                  <div key={i} className="border-l-2 border-purple-200 pl-2.5">
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
              <div className="inline-block px-3 py-1 rounded-md bg-purple-900 text-white text-[10px] font-bold uppercase tracking-wider mb-3">
                Languages
              </div>
              <div className="space-y-1 text-[11px] text-slate-700">
                {langList.map((l, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{l.name}</span>
                    {l.progress ? <span className="text-[10px] text-purple-700 font-semibold">{l.progress}%</span> : null}
                  </div>
                ))}
              </div>
            </section>
          )}

          {interestList.length > 0 && (
            <section className="resume-section">
              <div className="inline-block px-3 py-1 rounded-md bg-purple-900 text-white text-[10px] font-bold uppercase tracking-wider mb-3">
                Interests
              </div>
              <div className="flex flex-wrap gap-1 text-[10px] text-slate-600">
                {interestList.map((interest, i) => (
                  <span key={i} className="bg-purple-50 px-2 py-0.5 rounded text-purple-900">
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

export default TemplateGengar;
