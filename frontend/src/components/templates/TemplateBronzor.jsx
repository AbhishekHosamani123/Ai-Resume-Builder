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

export const TemplateBronzor = ({ resumeData = {}, containerWidth }) => {
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

  const accentColor = "#b45309"; // Bronze / Warm Ochre

  return (
    <div
      ref={resumeRef}
      className="a4-wrapper bg-white font-sans text-slate-800 p-8 flex flex-col"
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
      {/* Top Header Banner */}
      <header className="flex items-center justify-between pb-5 border-b-2" style={{ borderColor: accentColor }}>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {profileInfo.fullName || "Your Name"}
          </h1>
          <p className="text-sm font-semibold tracking-wide uppercase mt-1" style={{ color: accentColor }}>
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

      {/* Horizontal Contact Strip */}
      {contacts.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 py-2.5 px-3 bg-amber-50/50 border-b border-amber-200/60 text-[11px] text-slate-700 my-4 rounded-md">
          {contacts.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span style={{ color: accentColor }}>{getContactIcon(c.type, 13)}</span>
              {c.href ? (
                <a href={c.href} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: "#292524" }}>
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
        <p className="text-xs text-slate-600 leading-relaxed mb-5 pb-3 border-b border-slate-200">
          {profileInfo.summary}
        </p>
      )}

      {/* Two-Column Body: 64% Left, 36% Right */}
      <div className="flex gap-7">
        {/* Left Column (Work Experience + Projects) */}
        <div className="w-[64%] flex flex-col gap-6">
          {jobs.length > 0 && (
            <section className="resume-section">
              <h2
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b"
                style={{ color: accentColor, borderColor: "#fed7aa" }}
              >
                Work Experience
              </h2>
              <div className="space-y-4">
                {jobs.map((job, idx) => {
                  const bullets = parseBullets(job.description);
                  const dates = formatDates(job.startDate, job.endDate);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-xs font-bold text-slate-900">{job.role}</h3>
                        {dates && <span className="text-[10px] font-semibold text-amber-900">{dates}</span>}
                      </div>
                      <p className="text-[11px] font-medium text-slate-600">
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
              <h2
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b"
                style={{ color: accentColor, borderColor: "#fed7aa" }}
              >
                Key Projects
              </h2>
              <div className="space-y-3">
                {projs.map((p, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-slate-900">{p.title}</h3>
                      <div className="flex gap-2 text-[10px]">
                        {p.github && (
                          <a href={p.github} target="_blank" rel="noreferrer" className="text-slate-500 hover:underline flex items-center gap-0.5">
                            Code <ExternalLink size={9} />
                          </a>
                        )}
                        {p.liveDemo && (
                          <a href={p.liveDemo} target="_blank" rel="noreferrer" className="text-amber-700 hover:underline flex items-center gap-0.5">
                            Live <ExternalLink size={9} />
                          </a>
                        )}
                      </div>
                    </div>
                    {p.description && <BulletList text={p.description} bulletColor={accentColor} className="space-y-1 text-[11px] text-slate-600 mt-1" />}
                    {p.technologies && p.technologies.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {p.technologies.map((t, tIdx) => (
                          <span key={tIdx} className="text-[9px] bg-white px-1.5 py-0.2 rounded border border-slate-200 text-slate-700">
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

        {/* Right Column (Education, Skills, Certs, Languages) */}
        <div className="w-[36%] flex flex-col gap-6">
          {edus.length > 0 && (
            <section className="resume-section">
              <h2
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b"
                style={{ color: accentColor, borderColor: "#fed7aa" }}
              >
                Education
              </h2>
              <div className="space-y-3 text-[11px]">
                {edus.map((edu, idx) => (
                  <div key={idx}>
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    <p className="text-slate-700">{edu.institution}</p>
                    <p className="text-[10px] text-slate-400">
                      {formatDates(edu.startDate, edu.endDate || edu.graduationYear)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skillList.length > 0 && (
            <section className="resume-section">
              <h2
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b"
                style={{ color: accentColor, borderColor: "#fed7aa" }}
              >
                Skills & Tools
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skillList.map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {certs.length > 0 && (
            <section className="resume-section">
              <h2
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b"
                style={{ color: accentColor, borderColor: "#fed7aa" }}
              >
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
              <h2
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b"
                style={{ color: accentColor, borderColor: "#fed7aa" }}
              >
                Languages
              </h2>
              <div className="space-y-1 text-[11px] text-slate-700">
                {langList.map((l, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{l.name}</span>
                    {l.progress ? <span className="text-[10px] text-slate-400">{l.progress}%</span> : null}
                  </div>
                ))}
              </div>
            </section>
          )}

          {interestList.length > 0 && (
            <section className="resume-section">
              <h2
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b"
                style={{ color: accentColor, borderColor: "#fed7aa" }}
              >
                Interests
              </h2>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {interestList.join(", ")}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateBronzor;
