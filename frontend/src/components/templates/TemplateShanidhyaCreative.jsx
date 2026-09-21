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

export const TemplateShanidhyaCreative = ({ resumeData = {}, containerWidth }) => {
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
  const accentColor = "#0284c7"; // Sky 600

  return (
    <div
      ref={resumeRef}
      className="a4-wrapper bg-white font-sans text-slate-800 flex"
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
      {/* Dark Sidebar (34%): Avatar, Identity, Skills, Education */}
      <aside className="w-[34%] bg-slate-900 text-white p-6 flex flex-col gap-5">
        <div className="flex flex-col items-center text-center">
          <Avatar
            url={avatarUrl}
            name={profileInfo.fullName}
            size={88}
            borderColor="#38bdf8"
            className="mb-3 ring-4 ring-slate-800"
          />
          <h1 className="text-xl font-black tracking-tight text-white">
            {profileInfo.fullName || "Your Name"}
          </h1>
          <p className="text-xs font-semibold text-sky-400 mt-0.5 uppercase tracking-wider">
            {profileInfo.designation || ""}
          </p>
        </div>

        {/* Contacts */}
        {contacts.length > 0 && (
          <div className="resume-section">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-sky-400 mb-2 pb-1 border-b border-slate-700">
              Contact
            </h3>
            <div className="space-y-2 text-[11px]">
              {contacts.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-300">
                  <span className="text-sky-400">{getContactIcon(c.type, 12)}</span>
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
          </div>
        )}

        {/* Core Skills in Dark Sidebar */}
        {skillList.length > 0 && (
          <div className="resume-section">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-sky-400 mb-2 pb-1 border-b border-slate-700">
              Core Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skillList.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-sky-200 border border-slate-700"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education in Dark Sidebar */}
        {edus.length > 0 && (
          <div className="resume-section">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-sky-400 mb-2 pb-1 border-b border-slate-700">
              Education
            </h3>
            <div className="space-y-2 text-[11px]">
              {edus.map((edu, idx) => (
                <div key={idx}>
                  <p className="font-bold text-white">{edu.degree}</p>
                  <p className="text-slate-300">{edu.institution}</p>
                  <p className="text-[10px] text-sky-400">
                    {formatDates(edu.startDate, edu.endDate || edu.graduationYear)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages in Dark Sidebar */}
        {langList.length > 0 && (
          <div className="resume-section">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-sky-400 mb-2 pb-1 border-b border-slate-700">
              Languages
            </h3>
            <div className="space-y-1 text-[11px] text-slate-300">
              {langList.map((l, i) => (
                <div key={i} className="flex justify-between">
                  <span>{l.name}</span>
                  {l.progress ? <span className="text-[10px] text-sky-400">{l.progress}%</span> : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests in Dark Sidebar */}
        {interestList.length > 0 && (
          <div className="resume-section">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-sky-400 mb-2 pb-1 border-b border-slate-700">
              Interests
            </h3>
            <div className="flex flex-wrap gap-1 text-[10px] text-slate-300">
              {interestList.map((interest, i) => (
                <span key={i} className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 border border-slate-700">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Narrative Column (66%): Summary, Experience, Projects */}
      <main className="w-[66%] p-7 flex flex-col gap-6">
        {/* Summary */}
        {profileInfo.summary && (
          <section className="resume-section pb-4 border-b border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
              Professional Profile
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {profileInfo.summary}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {jobs.length > 0 && (
          <section className="resume-section">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b-2 border-slate-900">
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
                      {dates && <span className="text-[10px] font-semibold text-slate-500">{dates}</span>}
                    </div>
                    <p className="text-[11px] font-semibold text-sky-700">
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

        {/* Projects */}
        {projs.length > 0 && (
          <section className="resume-section">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b-2 border-slate-900">
              Projects
            </h2>
            <div className="space-y-3">
              {projs.map((p, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-900">{p.title}</h3>
                    <div className="flex gap-2 text-[10px]">
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-sky-600 flex items-center gap-0.5">
                          Code <ExternalLink size={9} />
                        </a>
                      )}
                      {p.liveDemo && (
                        <a href={p.liveDemo} target="_blank" rel="noreferrer" className="text-sky-700 hover:underline flex items-center gap-0.5">
                          Demo <ExternalLink size={9} />
                        </a>
                      )}
                    </div>
                  </div>
                  {p.description && <BulletList text={p.description} bulletColor={accentColor} className="space-y-1 text-[11px] text-slate-600 mt-1" />}
                  {p.technologies && p.technologies.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {p.technologies.map((t, tIdx) => (
                        <span key={tIdx} className="text-[9px] bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-700">
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

        {/* Certifications */}
        {certs.length > 0 && (
          <section className="resume-section">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2.5 border-b-2 border-slate-900">
              Certifications
            </h2>
            <div className="space-y-1.5 text-[11px]">
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
      </main>
    </div>
  );
};

export default TemplateShanidhyaCreative;
