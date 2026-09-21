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

export const TemplateRhyhorn = ({ resumeData = {}, containerWidth }) => {
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
  const accentColor = "#475569"; // Slate 600
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
      className="a4-wrapper bg-white font-sans text-slate-800 p-8 flex flex-col gap-4"
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
      {/* Heavy Header */}
      <header className="flex justify-between items-start pb-4 border-b-4 border-slate-700">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wider text-slate-900">
            {profileInfo.fullName || "Your Name"}
          </h1>
          <p className="text-xs font-black uppercase tracking-widest text-slate-600 mt-1">
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
            size={76}
            borderColor="#334155"
            className="rounded-lg"
          />
        )}
      </header>

      {/* Contacts Strip */}
      {contacts.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 py-1.5 px-3 bg-slate-100 rounded text-[11px] text-slate-700 font-medium">
          {contacts.map((c, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-slate-600">{getContactIcon(c.type, 12)}</span>
              {c.href ? (
                <a href={c.href} target="_blank" rel="noreferrer" className="hover:underline text-slate-900 font-bold">
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
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column (8 cols): Experience & Projects */}
        <div className="col-span-8 flex flex-col gap-5">
          {jobs.length > 0 && (
            <section className="resume-section">
              <div className="bg-slate-100 border-l-4 border-slate-700 px-3 py-1 mb-3">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
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
                        {dates && <span className="text-[10px] font-bold text-slate-500">{dates}</span>}
                      </div>
                      <p className="text-[11px] font-bold text-slate-700">
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
              <div className="bg-slate-100 border-l-4 border-slate-700 px-3 py-1 mb-3">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Projects
                </h2>
              </div>
              <div className="space-y-3">
                {projs.map((p, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-slate-900">{p.title}</h3>
                      <div className="flex gap-2 text-[10px]">
                        {p.github && (
                          <a href={p.github} target="_blank" rel="noreferrer" className="text-slate-700 hover:underline flex items-center gap-0.5">
                            Code <ExternalLink size={9} />
                          </a>
                        )}
                        {p.liveDemo && (
                          <a href={p.liveDemo} target="_blank" rel="noreferrer" className="text-slate-900 font-bold hover:underline flex items-center gap-0.5">
                            Demo <ExternalLink size={9} />
                          </a>
                        )}
                      </div>
                    </div>
                    {p.description && <BulletList text={p.description} bulletColor={accentColor} className="space-y-1 text-[11px] text-slate-600 mt-1" />}
                    {p.technologies && p.technologies.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {p.technologies.map((t, tIdx) => (
                          <span key={tIdx} className="text-[9px] bg-white px-1.5 py-0.5 rounded border border-slate-300 text-slate-800 font-semibold">
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
        <div className="col-span-4 flex flex-col gap-5">
          {skillList.length > 0 && (
            <section className="resume-section">
              <div className="bg-slate-100 border-l-4 border-slate-700 px-3 py-1 mb-2.5">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Skills
                </h2>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skillList.map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-900 border border-slate-300"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {edus.length > 0 && (
            <section className="resume-section">
              <div className="bg-slate-100 border-l-4 border-slate-700 px-3 py-1 mb-2.5">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Education
                </h2>
              </div>
              <div className="space-y-2.5 text-[11px]">
                {edus.map((edu, idx) => (
                  <div key={idx}>
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    <p className="text-slate-700 font-semibold">{edu.institution}</p>
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
              <div className="bg-slate-100 border-l-4 border-slate-700 px-3 py-1 mb-2.5">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Certifications
                </h2>
              </div>
              <div className="space-y-1.5 text-[11px]">
                {certs.map((c, i) => (
                  <div key={i}>
                    <p className="font-bold text-slate-900">{c.title}</p>
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
              <div className="bg-slate-100 border-l-4 border-slate-700 px-3 py-1 mb-2.5">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Languages
                </h2>
              </div>
              <div className="space-y-1 text-[11px] text-slate-700">
                {langList.map((l, i) => (
                  <div key={i} className="flex justify-between font-medium">
                    <span>{l.name}</span>
                    {l.progress ? <span className="text-[10px] text-slate-500 font-bold">{l.progress}%</span> : null}
                  </div>
                ))}
              </div>
            </section>
          )}

          {interestList.length > 0 && (
            <section className="resume-section">
              <div className="bg-slate-100 border-l-4 border-slate-700 px-3 py-1 mb-2.5">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Interests
                </h2>
              </div>
              <p className="text-[11px] text-slate-700 font-medium">
                {interestList.join(", ")}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateRhyhorn;
