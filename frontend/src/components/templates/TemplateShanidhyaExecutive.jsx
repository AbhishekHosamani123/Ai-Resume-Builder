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

export const TemplateShanidhyaExecutive = ({ resumeData = {}, containerWidth }) => {
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

  const accentColor = "#1e3a8a"; // Navy 900

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
      {/* Formal Header */}
      <header className="flex justify-between items-end pb-4 border-b-2 border-slate-900">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 uppercase">
            {profileInfo.fullName || "Your Name"}
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-900 mt-1">
            {profileInfo.designation || ""}
          </p>
        </div>
        {avatarUrl && (
          <Avatar
            url={avatarUrl}
            name={profileInfo.fullName}
            size={76}
            borderColor={accentColor}
          />
        )}
      </header>

      {/* Contacts Bar */}
      {contacts.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 py-1.5 border-b border-slate-200 text-[11px] text-slate-600">
          {contacts.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-blue-900">{getContactIcon(c.type, 12)}</span>
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

      {/* Executive Summary */}
      {profileInfo.summary && (
        <section className="resume-section">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 pb-1 mb-1.5 border-b border-slate-200">
            Executive Profile
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            {profileInfo.summary}
          </p>
        </section>
      )}

      {/* Leadership Track Record / Experience First */}
      {jobs.length > 0 && (
        <section className="resume-section">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 pb-1 mb-3 border-b-2 border-blue-900">
            Professional Experience & Track Record
          </h2>
          <div className="space-y-4">
            {jobs.map((job, idx) => {
              const bullets = parseBullets(job.description);
              const dates = formatDates(job.startDate, job.endDate);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold text-slate-950">{job.role}</h3>
                    {dates && <span className="text-[10px] font-semibold text-slate-500">{dates}</span>}
                  </div>
                  <p className="text-[11px] font-semibold text-blue-900">
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

      {/* Key Projects & Accomplishments */}
      {projs.length > 0 && (
        <section className="resume-section">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 pb-1 mb-3 border-b-2 border-blue-900">
            Strategic Initiatives & Projects
          </h2>
          <div className="space-y-3">
            {projs.map((p, idx) => (
              <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-900">{p.title}</h3>
                  <div className="flex gap-2 text-[10px]">
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noreferrer" className="text-slate-600 hover:underline flex items-center gap-0.5">
                        Code <ExternalLink size={9} />
                      </a>
                    )}
                    {p.liveDemo && (
                      <a href={p.liveDemo} target="_blank" rel="noreferrer" className="text-blue-900 hover:underline flex items-center gap-0.5">
                        Demo <ExternalLink size={9} />
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

      {/* Education & Credentials after Experience */}
      <div className="grid grid-cols-2 gap-6">
        {edus.length > 0 && (
          <section className="resume-section">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 pb-1 mb-2 border-b-2 border-blue-900">
              Education
            </h2>
            <div className="space-y-2 text-[11px]">
              {edus.map((edu, idx) => (
                <div key={idx}>
                  <p className="font-bold text-slate-950">{edu.degree}</p>
                  <p className="text-slate-700">{edu.institution}</p>
                  <p className="text-[10px] text-slate-500">
                    {formatDates(edu.startDate, edu.endDate || edu.graduationYear)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {skillList.length > 0 && (
          <section className="resume-section">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 pb-1 mb-2 border-b-2 border-blue-900">
              Competencies
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skillList.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-950 border border-blue-200"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Certifications & Languages */}
      {(certs.length > 0 || langList.length > 0 || interestList.length > 0) && (
        <div className="grid grid-cols-2 gap-6 text-[11px]">
          {certs.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 pb-1 mb-1.5 border-b border-slate-200">
                Certifications
              </h2>
              <div className="space-y-1">
                {certs.map((c, i) => (
                  <p key={i}>
                    <span className="font-bold text-slate-900">{c.title}</span>
                    {(c.issuer || c.year) && <span className="text-slate-600"> — {[c.issuer, c.year].filter(Boolean).join(", ")}</span>}
                  </p>
                ))}
              </div>
            </section>
          )}

          {langList.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 pb-1 mb-1.5 border-b border-slate-200">
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

export default TemplateShanidhyaExecutive;
