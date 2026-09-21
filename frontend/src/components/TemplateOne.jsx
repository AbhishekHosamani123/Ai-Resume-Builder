import React, { useEffect, useRef, useState } from "react";
import { Mail, Phone, Github, Globe, Linkedin } from "lucide-react";
import {
  EducationInfo,
  WorkExperience,
  ProjectInfo,
  CertificationInfo,
} from "./ResumeSection";
import { formatYearMonth } from "../utils/helper";

const DEFAULT_THEME = ["#ffffff", "#0d47a1", "#1e88e5", "#64b5f6", "#bbdefb"];

const Title = ({ text, color = "#0b282e" }) => (
  <div className="relative w-fit mb-2 resume-section-title">
    <h2 className="relative text-base font-bold uppercase tracking-wide pb-2" style={{ color }}>
      {text}
    </h2>
    <div className="w-full h-[2px] mt-1" style={{ backgroundColor: color }} />
  </div>
);

const TemplateOne = ({ resumeData = {}, colorPalette, containerWidth }) => {
  const palette = Array.isArray(colorPalette) && colorPalette.length
    ? colorPalette
    : (resumeData?.template?.colorPalette && resumeData.template.colorPalette.length
      ? resumeData.template.colorPalette
      : DEFAULT_THEME);
  const primaryColor = palette[1] || "#0d47a1";
  const accentColor = palette[2] || "#1e88e5";
  const badgeBg = palette[4] || "#dbeafe";

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

  return (
    <div
      ref={resumeRef}
      className="p-6 bg-white a4-wrapper text-gray-800"
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
      {/* Header */}
      <div className="resume-section flex justify-between items-start mb-6" data-section="profile-info">
        <div>
          <h1 className="text-3xl font-bold pb-2" style={{ color: primaryColor }}>
            {profileInfo.fullName}
          </h1>
          <p className="text-lg font-medium pb-2 text-gray-700">{profileInfo.designation}</p>
          <div className="flex flex-wrap gap-3 text-sm" data-section="contact-info">
            {contactInfo.email && (
              <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Mail className="shrink-0 text-slate-500" size={14} />
                <a href={`mailto:${contactInfo.email}`} className="hover:underline">
                  {contactInfo.email}
                </a>
              </div>
            )}
            {contactInfo.phone && (
              <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Phone className="shrink-0 text-slate-500" size={14} />
                <a href={`tel:${contactInfo.phone}`} className="hover:underline">
                  {contactInfo.phone}
                </a>
              </div>
            )}
            {contactInfo.location && (
              <div className="inline-flex items-center gap-1.5 whitespace-nowrap text-slate-600">
                <span>{contactInfo.location}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end text-sm space-y-1.5" data-section="contact-info">
          {contactInfo.linkedin && (
            <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Linkedin className="shrink-0 text-blue-600" size={14} />
              <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">
                LinkedIn
              </a>
            </div>
          )}
          {contactInfo.github && (
            <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Github className="shrink-0 text-slate-700" size={14} />
              <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                GitHub
              </a>
            </div>
          )}
          {contactInfo.website && (
            <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Globe className="shrink-0 text-slate-700" size={14} />
              <a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Portfolio
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {profileInfo.summary && (
        <div className="resume-section mb-3" data-section="profile-info">
          <Title text="Professional Summary" color={primaryColor} />
          <p className="text-sm leading-relaxed">{profileInfo.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-2 space-y-4">
          {jobs.length > 0 && (
            <div className="resume-section" data-section="work-experience">
              <Title text="Work Experience" color={primaryColor} />
              <div className="space-y-6">
                {jobs.map((exp, i) => (
                  <WorkExperience
                    key={i}
                    company={exp.company}
                    role={exp.role}
                    duration={`${formatYearMonth(exp.startDate)} - ${formatYearMonth(
                      exp.endDate
                    )}`}
                    description={exp.description}
                    durationColor={accentColor}
                  />
                ))}
              </div>
            </div>
          )}

          {projs.length > 0 && (
            <div className="resume-section" data-section="projects">
              <Title text="Projects" color={primaryColor} />
              <div className="space-y-4">
                {projs.map((proj, i) => (
                  <ProjectInfo
                    key={i}
                    title={proj.title}
                    description={proj.description}
                    githubLink={proj.github}
                    liveDemoUrl={proj.liveDemo}
                    bgColor={badgeBg}
                    headingClass="pb-2"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="col-span-1 space-y-6">
          {skillList.length > 0 && (
            <div className="resume-section" data-section="skills">
              <Title text="Skills" color={primaryColor} />
              <div className="flex flex-wrap gap-2">
                {skillList.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-2 py-1 rounded"
                    style={{ backgroundColor: badgeBg }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {edus.length > 0 && (
            <div className="resume-section" data-section="education-info">
              <Title text="Education" color={primaryColor} />
              <div className="space-y-4 pb-2">
                {edus.map((edu, i) => (
                  <EducationInfo
                    key={i}
                    degree={edu.degree}
                    institution={edu.institution}
                    duration={`${formatYearMonth(edu.startDate)} - ${formatYearMonth(
                      edu.endDate
                    )}`}
                  />
                ))}
              </div>
            </div>
          )}

          {certs.length > 0 && (
            <div className="resume-section" data-section="certifications">
              <Title text="Certifications" color={primaryColor} />
              <div className="space-y-2">
                {certs.map((cert, i) => (
                  <CertificationInfo
                    key={i}
                    title={cert.title}
                    issuer={cert.issuer}
                    year={cert.year}
                    bgColor={badgeBg}
                  />
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div className="resume-section" data-section="additionalInfo">
              <Title text="Languages" color={primaryColor} />
              <div className="flex flex-wrap gap-2">
                {languages.map((lang, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-2 py-1 rounded"
                    style={{ backgroundColor: badgeBg }}
                  >
                    {lang.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {interests.length > 0 && interests.some((i) => i) && (
            <div className="resume-section" data-section="additionalInfo">
              <Title text="Interests" color={primaryColor} />
              <div className="flex flex-wrap gap-2">
                {interests.map((int, i) =>
                  int ? (
                    <span
                      key={i}
                      className="text-xs font-medium px-2 py-1 rounded"
                      style={{ backgroundColor: badgeBg }}
                    >
                      {int}
                    </span>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateOne;