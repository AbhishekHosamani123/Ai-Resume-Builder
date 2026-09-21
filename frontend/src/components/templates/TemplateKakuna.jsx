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

export const TemplateKakuna = ({ resumeData = {}, containerWidth }) => {
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

  const accentColor = "#d97706"; // Amber 600

  return (
    <div
      ref={resumeRef}
      className="a4-wrapper bg-slate-50/50 font-sans text-slate-800 p-7 flex flex-col gap-4"
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
      {/* Header Card */}
      <header className="resume-section bg-white rounded-2xl border border-amber-200/70 p-5 shadow-xs flex items-center justify-between gap-5">
        <div className="flex-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block mb-1.5">
            Curriculum Vitae
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {profileInfo.fullName || "Your Name"}
          </h1>
          <p className="text-xs font-semibold text-slate-600 mt-0.5">
            {profileInfo.designation || ""}
          </p>
          {profileInfo.summary && (
            <p className="mt-2 text-xs text-slate-600 leading-relaxed max-w-2xl">
              {profileInfo.summary}
            </p>
          )}

          {/* Contact Badges */}
          {contacts.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 text-[11px]">
              {contacts.map((c, i) => (
                <div key={i} className="flex items-center gap-1.5 text-slate-600">
                  <span className="text-amber-600">{getContactIcon(c.type, 12)}</span>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noreferrer" className="hover:underline">
                      {c.label}
                    </a>
                  ) : (
                    <span>{c.label}</span>
                  )}
                  {i < contacts.length - 1 && <span className="text-slate-300 ml-1">•</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {avatarUrl && (
          <Avatar
            url={avatarUrl}
            name={profileInfo.fullName}
            size={76}
            borderColor={accentColor}
            className="ring-4 ring-amber-100"
          />
        )}
      </header>

      {/* Main Grid with Modular Cards */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left Column (8 cols): Work Experience + Projects */}
        <div className="col-span-8 flex flex-col gap-4">
          {jobs.length > 0 && (
            <section className="resume-section bg-white rounded-2xl border border-amber-200/70 p-5 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 pb-1 mb-3 border-b border-amber-100">
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
                        {dates && <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">{dates}</span>}
                      </div>
                      <p className="text-[11px] font-semibold text-slate-600">
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
            <section className="resume-section bg-white rounded-2xl border border-amber-200/70 p-5 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 pb-1 mb-3 border-b border-amber-100">
                Key Projects
              </h2>
              <div className="space-y-3">
                {projs.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-amber-50/30 border border-amber-100">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-slate-900">{p.title}</h3>
                      <div className="flex gap-2 text-[10px]">
                        {p.github && (
                          <a href={p.github} target="_blank" rel="noreferrer" className="text-amber-800 hover:underline flex items-center gap-0.5">
                            Code <ExternalLink size={9} />
                          </a>
                        )}
                        {p.liveDemo && (
                          <a href={p.liveDemo} target="_blank" rel="noreferrer" className="text-amber-600 hover:underline flex items-center gap-0.5">
                            Demo <ExternalLink size={9} />
                          </a>
                        )}
                      </div>
                    </div>
                    {p.description && <BulletList text={p.description} bulletColor={accentColor} className="space-y-1 text-[11px] text-slate-600 mt-1" />}
                    {p.technologies && p.technologies.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {p.technologies.map((t, tIdx) => (
                          <span key={tIdx} className="text-[9px] bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-900 font-medium">
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
        <div className="col-span-4 flex flex-col gap-4">
          {skillList.length > 0 && (
            <section className="resume-section bg-white rounded-2xl border border-amber-200/70 p-4 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 pb-1 mb-2.5 border-b border-amber-100">
                Core Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skillList.map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {edus.length > 0 && (
            <section className="resume-section bg-white rounded-2xl border border-amber-200/70 p-4 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 pb-1 mb-2.5 border-b border-amber-100">
                Education
              </h2>
              <div className="space-y-2.5 text-[11px]">
                {edus.map((edu, idx) => (
                  <div key={idx}>
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    <p className="text-slate-700">{edu.institution}</p>
                    <p className="text-[10px] text-amber-700">
                      {formatDates(edu.startDate, edu.endDate || edu.graduationYear)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certs.length > 0 && (
            <section className="resume-section bg-white rounded-2xl border border-amber-200/70 p-4 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 pb-1 mb-2.5 border-b border-amber-100">
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
            <section className="resume-section bg-white rounded-2xl border border-amber-200/70 p-4 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 pb-1 mb-2.5 border-b border-amber-100">
                Languages
              </h2>
              <div className="space-y-1 text-[11px] text-slate-700">
                {langList.map((l, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{l.name}</span>
                    {l.progress ? <span className="text-[10px] text-amber-600 font-semibold">{l.progress}%</span> : null}
                  </div>
                ))}
              </div>
            </section>
          )}

          {interestList.length > 0 && (
            <section className="resume-section bg-white rounded-2xl border border-amber-200/70 p-4 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 pb-1 mb-2.5 border-b border-amber-100">
                Interests
              </h2>
              <div className="flex flex-wrap gap-1 text-[10px] text-slate-600">
                {interestList.map((interest, i) => (
                  <span key={i} className="bg-amber-50 px-2 py-0.5 rounded text-amber-900 border border-amber-200/50">
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

export default TemplateKakuna;
