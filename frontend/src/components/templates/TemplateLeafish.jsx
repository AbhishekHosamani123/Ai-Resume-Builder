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
import { ExternalLink, Sparkles } from "lucide-react";

export const TemplateLeafish = ({ resumeData = {}, containerWidth }) => {
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

  const accentColor = "#16a34a"; // Green 600

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
      {/* Organic Header */}
      <header className="flex justify-between items-start pb-4 border-b border-green-200">
        <div className="flex-1">
          <div className="flex items-center gap-1 text-green-700 text-[11px] font-bold uppercase tracking-widest mb-1">
            <Sparkles size={12} />
            <span>Profile Summary</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {profileInfo.fullName || "Your Name"}
          </h1>
          <p className="text-sm font-semibold text-green-800 mt-0.5">
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
            size={80}
            borderColor={accentColor}
            className="ring-4 ring-green-50"
          />
        )}
      </header>

      {/* Contact Bar */}
      {contacts.length > 0 && (
        <div className="flex flex-wrap gap-2 text-[11px]">
          {contacts.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50/60 border border-green-200 text-green-950 font-medium"
            >
              <span className="text-green-700">{getContactIcon(c.type, 12)}</span>
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

      {/* Main Grid: 7 cols left, 5 cols right */}
      <div className="grid grid-cols-12 gap-7">
        {/* Left (8 cols): Experience with leaf dots + Projects */}
        <div className="col-span-8 flex flex-col gap-6">
          {jobs.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3.5 border-b-2 border-green-600">
                Experience
              </h2>
              <div className="space-y-4">
                {jobs.map((job, idx) => {
                  const bullets = parseBullets(job.description);
                  const dates = formatDates(job.startDate, job.endDate);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-xs font-bold text-slate-900">{job.role}</h3>
                        {dates && <span className="text-[10px] font-semibold text-green-800">{dates}</span>}
                      </div>
                      <p className="text-[11px] font-semibold text-green-800">
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3.5 border-b-2 border-green-600">
                Projects
              </h2>
              <div className="space-y-3">
                {projs.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-green-50/20 border border-green-100">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-slate-900">{p.title}</h3>
                      <div className="flex gap-2 text-[10px]">
                        {p.github && (
                          <a href={p.github} target="_blank" rel="noreferrer" className="text-green-800 hover:underline flex items-center gap-0.5">
                            Code <ExternalLink size={9} />
                          </a>
                        )}
                        {p.liveDemo && (
                          <a href={p.liveDemo} target="_blank" rel="noreferrer" className="text-green-700 hover:underline flex items-center gap-0.5">
                            Live <ExternalLink size={9} />
                          </a>
                        )}
                      </div>
                    </div>
                    {p.description && <BulletList text={p.description} bulletColor={accentColor} className="space-y-1 text-[11px] text-slate-600 mt-1" />}
                    {p.technologies && p.technologies.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {p.technologies.map((t, tIdx) => (
                          <span key={tIdx} className="text-[9px] bg-white px-2 py-0.5 rounded-full border border-green-200 text-green-800 font-medium">
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

        {/* Right (4 cols): Skills, Education, Certifications */}
        <div className="col-span-4 flex flex-col gap-6">
          {skillList.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b-2 border-green-600">
                Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skillList.map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-50 text-green-900 border border-green-200"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {edus.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b-2 border-green-600">
                Education
              </h2>
              <div className="space-y-3 text-[11px]">
                {edus.map((edu, idx) => (
                  <div key={idx}>
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    <p className="text-green-800 font-medium">{edu.institution}</p>
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b-2 border-green-600">
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b-2 border-green-600">
                Languages
              </h2>
              <div className="space-y-1 text-[11px] text-slate-700">
                {langList.map((l, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{l.name}</span>
                    {l.progress ? <span className="text-[10px] text-green-700 font-semibold">{l.progress}%</span> : null}
                  </div>
                ))}
              </div>
            </section>
          )}

          {interestList.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b-2 border-green-600">
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

export default TemplateLeafish;
