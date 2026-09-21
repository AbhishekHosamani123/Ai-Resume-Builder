import React from "react";
import {
  useResumeScale,
  parseContactItem,
  formatDates,
  parseBullets,
  BulletList,
  Avatar,
} from "./TemplateHelpers";
import { ExternalLink } from "lucide-react";

export const TemplateOnyx = ({ resumeData = {}, containerWidth }) => {
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
  const accentColor = "#0f172a"; // Slate 900
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
      className="a4-wrapper bg-white font-sans text-slate-900 p-8 flex flex-col gap-4"
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
      {/* Executive Onyx Header */}
      <header className="flex justify-between items-end pb-3 border-b-2 border-slate-900">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">
            {profileInfo.fullName || "Your Name"}
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-700 mt-0.5">
            {profileInfo.designation || ""}
          </p>
        </div>
        {avatarUrl && (
          <Avatar
            url={avatarUrl}
            name={profileInfo.fullName}
            size={76}
            borderColor="#0f172a"
          />
        )}
      </header>

      {/* Contacts Bar */}
      {contacts.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-700 pb-2 border-b border-slate-300">
          {contacts.map((c, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="font-semibold text-slate-900">{c.type.toUpperCase()}:</span>
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

      {/* Summary */}
      {profileInfo.summary && (
        <section className="resume-section">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-900 mb-1.5">
            Executive Summary
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed">
            {profileInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {jobs.length > 0 && (
        <section className="resume-section">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-900 mb-2.5">
            Professional Experience
          </h2>
          <div className="space-y-3.5">
            {jobs.map((job, idx) => {
              const bullets = parseBullets(job.description);
              const dates = formatDates(job.startDate, job.endDate);
              return (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-baseline font-bold">
                    <h3 className="text-xs text-slate-900">{job.role}</h3>
                    {dates && <span className="text-[11px] text-slate-600 font-normal">{dates}</span>}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-700">
                    {job.company} {job.location ? `— ${job.location}` : ""}
                  </div>
                  {bullets.length > 0 && (
                        <BulletList items={bullets} bulletColor={accentColor} className="space-y-1 text-[11px] text-slate-600 mt-1 leading-snug" />
                      )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Education & Projects in 2 Columns */}
      <div className="grid grid-cols-2 gap-6">
        {edus.length > 0 && (
          <section className="resume-section">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-900 mb-2">
              Education
            </h2>
            <div className="space-y-2.5 text-[11px]">
              {edus.map((edu, idx) => (
                <div key={idx}>
                  <p className="font-bold text-slate-900">{edu.degree}</p>
                  <p className="text-slate-700">{edu.institution}</p>
                  <p className="text-[10px] text-slate-500">
                    {formatDates(edu.startDate, edu.endDate || edu.graduationYear)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {projs.length > 0 && (
          <section className="resume-section">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-900 mb-2">
              Projects
            </h2>
            <div className="space-y-2 text-[11px]">
              {projs.map((p, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-slate-900">{p.title}</p>
                    <div className="flex gap-2 text-[10px]">
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noreferrer" className="hover:underline text-slate-600">
                          Code
                        </a>
                      )}
                      {p.liveDemo && (
                        <a href={p.liveDemo} target="_blank" rel="noreferrer" className="hover:underline text-slate-900 font-bold">
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                  {p.description && <BulletList text={p.description} bulletColor={accentColor} className="space-y-1 text-[11px] text-slate-600 mt-1" />}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Skills */}
      {skillList.length > 0 && (
        <section className="resume-section">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-900 mb-1.5">
            Technical Proficiencies
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skillList.map((s, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-900 border border-slate-300"
              >
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Languages */}
      {(certs.length > 0 || langList.length > 0 || interestList.length > 0) && (
        <div className="grid grid-cols-2 gap-6 text-[11px]">
          {certs.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-900 mb-1.5">
                Certifications
              </h2>
              <div className="space-y-1">
                {certs.map((c, i) => (
                  <p key={i}>
                    <span className="font-bold">{c.title}</span>
                    {(c.issuer || c.year) && <span className="text-slate-600"> — {[c.issuer, c.year].filter(Boolean).join(", ")}</span>}
                  </p>
                ))}
              </div>
            </section>
          )}

          {langList.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-900 mb-1.5">
                Languages
              </h2>
              <p className="text-slate-700">{langList.map((l) => l.name).join(" • ")}</p>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateOnyx;
