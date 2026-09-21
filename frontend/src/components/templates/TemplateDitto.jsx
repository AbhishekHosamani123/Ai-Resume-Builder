import React from "react";
import {
  useResumeScale,
  parseContactItem,
  formatDates,
  parseBullets,
  BulletList,
} from "./TemplateHelpers";

export const TemplateDitto = ({ resumeData = {}, containerWidth }) => {
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

  const accentColor = "#db2777"; // Pink 600
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

  const sep = <span className="text-slate-300 mx-1.5">•</span>;

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
      {/* Header: Centered Minimalist */}
      <header className="text-center pb-3 border-b border-slate-300">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
          {profileInfo.fullName || "Your Name"}
        </h1>
        {profileInfo.designation && (
          <p className="text-xs font-semibold text-slate-600 mt-0.5">
            {profileInfo.designation}
          </p>
        )}

        {/* Contacts */}
        {contacts.length > 0 && (
          <div className="flex flex-wrap justify-center items-center mt-2 text-[11px] text-slate-600">
            {contacts.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && sep}
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noreferrer" className="text-slate-700 hover:underline">
                    {c.label}
                  </a>
                ) : (
                  <span>{c.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </header>

      {/* Summary */}
      {profileInfo.summary && (
        <section className="resume-section">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-300 mb-2">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            {profileInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {jobs.length > 0 && (
        <section className="resume-section">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-300 mb-2.5">
            Experience
          </h2>
          <div className="space-y-3.5">
            {jobs.map((job, idx) => {
              const bullets = parseBullets(job.description);
              const dates = formatDates(job.startDate, job.endDate);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold text-slate-900">{job.role}</h3>
                    {dates && <span className="text-[11px] text-slate-500 italic">{dates}</span>}
                  </div>
                  <div className="flex justify-between items-baseline text-[11px] text-slate-700 font-medium">
                    <span>{job.company}</span>
                    {job.location && <span className="text-slate-500">{job.location}</span>}
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

      {/* Education */}
      {edus.length > 0 && (
        <section className="resume-section">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-300 mb-2">
            Education
          </h2>
          <div className="space-y-2.5">
            {edus.map((edu, idx) => {
              const dates = formatDates(edu.startDate, edu.endDate || edu.graduationYear);
              return (
                <div key={idx} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      {edu.degree} {edu.major ? `— ${edu.major}` : ""}
                    </h3>
                    <p className="text-[11px] text-slate-600">
                      {edu.institution} {edu.location ? `| ${edu.location}` : ""}
                    </p>
                  </div>
                  {dates && <span className="text-[11px] text-slate-500 italic">{dates}</span>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Projects */}
      {projs.length > 0 && (
        <section className="resume-section">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-300 mb-2">
            Projects
          </h2>
          <div className="space-y-2.5">
            {projs.map((p, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900">{p.title}</h3>
                  <div className="flex gap-2 text-[10px] text-slate-500">
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noreferrer" className="hover:underline">
                        Repository
                      </a>
                    )}
                    {p.liveDemo && (
                      <a href={p.liveDemo} target="_blank" rel="noreferrer" className="hover:underline">
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
                {p.description && <BulletList text={p.description} bulletColor={accentColor} className="space-y-1 text-[11px] text-slate-600 mt-1" />}
                {p.technologies && p.technologies.length > 0 && (
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    <span className="font-semibold text-slate-700">Technologies:</span> {p.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillList.length > 0 && (
        <section className="resume-section">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-300 mb-1.5">
            Technical Skills
          </h2>
          <p className="text-[11px] text-slate-700 leading-relaxed">
            {skillList.map((s) => s.name).join(" • ")}
          </p>
        </section>
      )}

      {/* Certifications & Languages */}
      {(certs.length > 0 || langList.length > 0 || interestList.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {certs.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-300 mb-1.5">
                Certifications
              </h2>
              <ul className="text-[11px] text-slate-700 space-y-1">
                {certs.map((c, i) => (
                  <li key={i}>
                    <span className="font-semibold">{c.title}</span>
                    {(c.issuer || c.year) && (
                      <span className="text-slate-500"> — {[c.issuer, c.year].filter(Boolean).join(", ")}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {langList.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-300 mb-1.5">
                Languages
              </h2>
              <p className="text-[11px] text-slate-700">
                {langList.map((l) => l.name).join(" • ")}
              </p>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateDitto;
