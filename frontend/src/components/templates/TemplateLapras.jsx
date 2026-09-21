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

export const TemplateLapras = ({ resumeData = {}, containerWidth }) => {
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

  const accentColor = "#1e3a8a"; // Navy 900 / Maritime

  return (
    <div
      ref={resumeRef}
      className="a4-wrapper bg-white font-serif text-slate-800 p-8 flex flex-col gap-5"
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
      {/* Executive Header */}
      <header className="flex justify-between items-end pb-4 border-b-2 border-slate-900 font-sans">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 uppercase font-serif">
            {profileInfo.fullName || "Your Name"}
          </h1>
          <p className="text-xs font-bold tracking-widest text-blue-900 uppercase mt-1">
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

      {/* Contact Line */}
      {contacts.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 py-1.5 border-b border-slate-200 text-[11px] font-sans text-slate-600">
          {contacts.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-blue-900">{getContactIcon(c.type, 12)}</span>
              {c.href ? (
                <a href={c.href} target="_blank" rel="noreferrer" className="hover:underline text-slate-900">
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
        <p className="text-xs font-sans text-slate-700 leading-relaxed italic border-l-2 border-blue-900 pl-3 py-0.5">
          {profileInfo.summary}
        </p>
      )}

      {/* Two Column Layout: 65% / 35% */}
      <div className="grid grid-cols-12 gap-7">
        {/* Left Column (8 cols): Work Experience & Projects */}
        <div className="col-span-8 flex flex-col gap-6">
          {jobs.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 font-sans pb-1 mb-3 border-b-2 border-blue-900">
                Professional Experience
              </h2>
              <div className="space-y-4 font-sans">
                {jobs.map((job, idx) => {
                  const bullets = parseBullets(job.description);
                  const dates = formatDates(job.startDate, job.endDate);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-xs font-bold text-slate-950 font-serif">{job.role}</h3>
                        {dates && <span className="text-[10px] font-semibold text-slate-500">{dates}</span>}
                      </div>
                      <p className="text-[11px] font-semibold text-blue-900">
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 font-sans pb-1 mb-3 border-b-2 border-blue-900">
                Key Initiatives & Projects
              </h2>
              <div className="space-y-3 font-sans">
                {projs.map((p, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-slate-900 font-serif">{p.title}</h3>
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
                    {p.technologies && p.technologies.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {p.technologies.map((t, tIdx) => (
                          <span key={tIdx} className="text-[9px] bg-white px-1.5 py-0.5 rounded border border-slate-300 text-slate-700">
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

        {/* Right Column (4 cols): Education, Skills, Certs */}
        <div className="col-span-4 flex flex-col gap-6 font-sans">
          {edus.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 pb-1 mb-3 border-b-2 border-blue-900">
                Education
              </h2>
              <div className="space-y-3 text-[11px]">
                {edus.map((edu, idx) => (
                  <div key={idx}>
                    <p className="font-bold text-slate-950 font-serif">{edu.degree}</p>
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 pb-1 mb-3 border-b-2 border-blue-900">
                Core Competencies
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

          {certs.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 pb-1 mb-3 border-b-2 border-blue-900">
                Credentials
              </h2>
              <div className="space-y-2 text-[11px]">
                {certs.map((c, i) => (
                  <div key={i}>
                    <p className="font-semibold text-slate-900">{c.title}</p>
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 pb-1 mb-3 border-b-2 border-blue-900">
                Languages
              </h2>
              <div className="space-y-1 text-[11px] text-slate-700">
                {langList.map((l, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{l.name}</span>
                    {l.progress ? <span className="text-[10px] text-blue-800 font-semibold">{l.progress}%</span> : null}
                  </div>
                ))}
              </div>
            </section>
          )}

          {interestList.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 pb-1 mb-3 border-b-2 border-blue-900">
                Interests
              </h2>
              <div className="flex flex-wrap gap-1 text-[10px] text-slate-600">
                {interestList.map((interest, i) => (
                  <span key={i} className="bg-slate-100 px-2 py-0.5 rounded text-slate-800">
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

export default TemplateLapras;
