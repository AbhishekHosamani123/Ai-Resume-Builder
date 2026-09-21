import React, { useEffect, useRef, useState } from "react";
import { LuExternalLink, LuGithub } from "react-icons/lu";
import { formatYearMonth } from "../utils/helper";
import { parseBullets } from "./templates/TemplateHelpers";

const DEFAULT_THEME = ["#ffffff", "#0b282e", "#1e7280", "#2563eb"];

const TemplateTwo = ({ resumeData = {}, colorPalette, containerWidth }) => {
  const palette = Array.isArray(colorPalette) && colorPalette.length
    ? colorPalette
    : (resumeData?.template?.colorPalette && resumeData.template.colorPalette.length
      ? resumeData.template.colorPalette
      : DEFAULT_THEME);
  const primaryHeadingColor = palette[1] || "#0b282e";
  const accentBorderColor = palette[2] || "#1e7280";
  const linkColor = palette[3] || "#2563eb";

  const {
    profileInfo = {},
    contactInfo = {},
    education = [],
    languages = [],
    workExperience = [],
    projects = [],
    skills = [],
    certifications = [],
    interests = [],
  } = resumeData;

  const jobs = workExperience.filter((w) => (w.company || "").trim() || (w.role || "").trim());
  const projs = projects.filter((pr) => (pr.title || "").trim());
  const certs = certifications.filter((ct) => (ct.title || "").trim());
  const edus = education.filter((e) => (e.degree || "").trim() || (e.institution || "").trim());
  const skillList = skills.filter((s) => (s.name || "").trim());

  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(794);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (resumeRef.current && containerWidth > 0) {
      const actualWidth = resumeRef.current.offsetWidth;
      setBaseWidth(actualWidth);
      setScale(containerWidth / actualWidth);
    }
  }, [containerWidth]);

  const SectionTitle = ({ text }) => (
    <h2
      className="text-base font-bold uppercase tracking-wide mb-1 pb-1"
      style={{
        color: primaryHeadingColor,
        borderBottom: `2px solid ${accentBorderColor}70`,
      }}
    >
      {text}
    </h2>
  );

  return (
    <div
      ref={resumeRef}
      className="resume-section a4-wrapper p-5 bg-white text-black max-w-4xl mx-auto"
      style={{
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        transform: containerWidth > 0 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        width: "100%",
        maxWidth: containerWidth > 0 ? `${baseWidth}px` : "100%",
        boxSizing: "border-box",
        minHeight: "100%",
      }}
    >
      {/* Header Section */}
      <div className="text-center mb-2" data-section="profile-info">
        <h1 className="text-2xl font-bold tracking-tight mb-1 text-slate-900">{profileInfo.fullName}</h1>
        <p className="text-sm text-gray-600 font-medium mb-2">{profileInfo.designation}</p>
        <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-[11px] text-gray-700" data-section="contact-info">
          {contactInfo.phone && <span className="whitespace-nowrap">{contactInfo.phone}</span>}
          {contactInfo.phone && contactInfo.email && <span className="text-gray-400">•</span>}
          {contactInfo.email && (
            <a href={`mailto:${contactInfo.email}`} className="hover:underline whitespace-nowrap" style={{ color: linkColor }}>
              {contactInfo.email}
            </a>
          )}
          {(contactInfo.phone || contactInfo.email) && contactInfo.linkedin && <span className="text-gray-400">•</span>}
          {contactInfo.linkedin && (
            <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline whitespace-nowrap inline-flex items-center gap-1" style={{ color: linkColor }}>
              LinkedIn
            </a>
          )}
          {contactInfo.github && <span className="text-gray-400">•</span>}
          {contactInfo.github && (
            <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline whitespace-nowrap inline-flex items-center gap-1" style={{ color: linkColor }}>
              GitHub
            </a>
          )}
          {contactInfo.website && <span className="text-gray-400">•</span>}
          {contactInfo.website && (
            <a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline whitespace-nowrap inline-flex items-center gap-1" style={{ color: linkColor }}>
              Portfolio
            </a>
          )}
        </div>
      </div>

      <hr className="border-gray-200 mb-2" />

      {/* Summary */}
      {profileInfo.summary && (
        <section className="mb-2" data-section="profile-info">
          <SectionTitle text="Summary" />
          <p className="text-[11px] text-gray-800 leading-tight">{profileInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {jobs.length > 0 && (
        <section className="mb-2" data-section="work-experience">
          <SectionTitle text="Experience" />
          <div className="space-y-2">
            {jobs.map((exp, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-[12px] text-gray-800">{exp.role}</h3>
                    <p className="italic text-[11px] text-gray-600">{exp.company}</p>
                  </div>
                  <div className="text-[11px] text-right text-gray-600">
                    <p className="italic">
                      {formatYearMonth(exp.startDate)} - {formatYearMonth(exp.endDate)}
                    </p>
                    {exp.location && <p className="text-[11px]">{exp.location}</p>}
                  </div>
                </div>
                {exp.technologies && (
                  <p className="bg-gray-100 text-[10px] font-mono px-1.5 py-0.5 rounded inline-block">
                    {exp.technologies}
                  </p>
                )}
                {parseBullets(exp.description).length > 0 ? (
                  <div className="mt-1 space-y-1 pl-1 text-[12px] text-gray-700">
                    {parseBullets(exp.description).map((line, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span
                          className="shrink-0 mt-1.5"
                          style={{
                            display: "inline-block",
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            backgroundColor: accentBorderColor,
                          }}
                        />
                        <span className="flex-1 leading-relaxed">{line}</span>
                      </div>
                    ))}
                  </div>
                ) : exp.description ? (
                  <p className="mt-0.5 text-[12px] text-gray-700">{exp.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projs.length > 0 && (
        <section className="mb-2" data-section="projects">
          <SectionTitle text="Projects" />
          <div className="space-y-2">
            {projs.map((proj, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-[12px] text-gray-800">{proj.title}</h3>
                  {proj.link && (
                    <a href={proj.link} className="text-[11px] hover:underline" style={{ color: linkColor }}>
                      {proj.linkType || "Link"}
                    </a>
                  )}
                </div>
                {proj.technologies && (
                  <p className="bg-gray-100 pb-2 text-[10px] font-mono px-1.5 py-0.5 rounded inline-block">
                    {proj.technologies}
                  </p>
                )}
                {parseBullets(proj.description).length > 0 ? (
                  <div className="mt-1 space-y-1 pl-1 text-[11px] text-gray-700">
                    {parseBullets(proj.description).map((line, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span
                          className="shrink-0 mt-1.5"
                          style={{
                            display: "inline-block",
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            backgroundColor: accentBorderColor,
                          }}
                        />
                        <span className="flex-1 leading-relaxed">{line}</span>
                      </div>
                    ))}
                  </div>
                ) : proj.description ? (
                  <p className="text-[11px] text-gray-700">{proj.description}</p>
                ) : null}
                <div className="flex gap-3 mt-1 text-[11px]">
                  {proj.github && (
                    <a href={proj.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline whitespace-nowrap" style={{ color: linkColor }}>
                      <LuGithub size={12} className="shrink-0" /> GitHub
                    </a>
                  )}
                  {proj.liveDemo && (
                    <a href={proj.liveDemo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline whitespace-nowrap" style={{ color: linkColor }}>
                      <LuExternalLink size={12} className="shrink-0" /> Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {edus.length > 0 && (
        <section className="mb-2" data-section="education-info">
          <SectionTitle text="Education" />
          <div className="space-y-1">
            {edus.map((edu, idx) => (
              <div key={idx} className="space-y-0.25">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-[12px] text-gray-800">{edu.degree}</h3>
                  <p className="italic text-[11px] text-gray-600">
                    {formatYearMonth(edu.startDate)} - {formatYearMonth(edu.endDate)}
                  </p>
                </div>
                <p className="italic text-[11px] text-gray-700">{edu.institution}</p>
                {edu.courses && (
                  <p className="text-[11px]">
                    <strong>Courses:</strong> {edu.courses}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillList.length > 0 && (
        <section className="mb-2" data-section="skills">
          <SectionTitle text="Skills" />
          <ul className="text-[11px] text-gray-800 flex flex-wrap gap-1">
            {skillList.map((skill, idx) => (
              <li key={idx} className="w-fit">{skill.name}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Certifications */}
      {certs.length > 0 && (
        <section className="mb-2" data-section="certifications">
          <SectionTitle text="Certifications" />
          <div className="space-y-1 pl-1 text-[11px] text-gray-700">
            {certs.map((cert, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span
                  className="shrink-0 mt-1.5"
                  style={{
                    display: "inline-block",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    backgroundColor: accentBorderColor,
                  }}
                />
                <span className="flex-1 leading-tight">
                  {cert.title} — {cert.issuer} {cert.year ? `(${cert.year})` : ""}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages & Interests */}
      {(languages.length > 0 || interests.length > 0) && (
        <section className="mb-0" data-section="additionalInfo">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {languages.length > 0 && (
              <div>
                <SectionTitle text="Languages" />
                <ul className="flex flex-wrap gap-1 text-[11px] text-gray-700">
                  {languages.map((lang, idx) => (
                    <li key={idx} className="bg-gray-100 px-1.5 py-0.5 rounded-full">
                      {lang.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {interests.length > 0 && interests.some(Boolean) && (
              <div>
                <SectionTitle text="Interests" />
                <ul className="flex flex-wrap gap-1 text-[11px] text-gray-700">
                  {interests.filter(Boolean).map((int, idx) => (
                    <li key={idx} className="bg-gray-100 px-1.5 py-0.5 rounded-full">
                      {int}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default TemplateTwo;

