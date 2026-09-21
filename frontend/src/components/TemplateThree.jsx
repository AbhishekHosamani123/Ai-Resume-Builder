import React, { useEffect, useRef, useState } from "react";
import { formatYearMonth } from "../utils/helper";
import { parseBullets } from "./templates/TemplateHelpers";

const DEFAULT_THEME = ["#ffffff", "#0b282e", "#1e7280", "#2563eb"];

const TemplateThree = ({ resumeData = {}, colorPalette, containerWidth }) => {
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
    workExperience = [],
    projects = [],
    skills = [],
    certifications = [],
    interests = [],
  } = resumeData;

  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(794);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (resumeRef.current) {
      const actualBaseWidth = resumeRef.current.offsetWidth;
      setBaseWidth(actualBaseWidth);
      if (containerWidth > 0) {
        setScale(containerWidth / actualBaseWidth);
      }
    }
  }, [containerWidth]);

  // Group skills by category
  const groupedSkills = {
    "Automation & Test tools": [],
    "Product Management": [],
    Languages: [],
    "Other Skills": []
  };

  skills.forEach(skill => {
    if (["Selenium/Webdriver", "TestNG", "Jenkins"].includes(skill.name)) {
      groupedSkills["Automation & Test tools"].push(skill.name);
    } else if (["Agile", "Scrum", "JIRA", "Microsoft TFS"].includes(skill.name)) {
      groupedSkills["Product Management"].push(skill.name);
    } else if (["Python", "Java", "Javascript", "Databases (MySQL)"].includes(skill.name)) {
      groupedSkills.Languages.push(skill.name);
    } else {
      groupedSkills["Other Skills"].push(skill.name);
    }
  });

  return (
    <div
      ref={resumeRef}
      className="bg-white a4-wrapper text-black max-w-screen-lg mx-auto"
      style={{
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "top left",
        width: "100%",
        maxWidth: containerWidth > 0 ? `${baseWidth}px` : "100%",
        boxSizing: "border-box",
        height: "auto",
      }}
    >
      {/* Header Section */}
      <header className="px-8 pt-8 pb-4 mb-2" data-section="profile-info">
        <div className="text-center">
          <h1 className="text-3xl font-bold uppercase mb-3" style={{ color: primaryHeadingColor }}>{profileInfo.fullName}</h1>

          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            {profileInfo.designation}
          </h2>

        </div>

        <p className="text-sm text-gray-700 leading-tight mb-4">
          {profileInfo.summary}
        </p>
      </header>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-12 gap-4 px-8 pb-8">
        {/* LEFT SIDEBAR - 5 columns */}
        <aside className="col-span-5 space-y-5 pr-4 border-r border-gray-300">
          {/* Contact */}
          <section data-section="contact-info">
            <h2
              className="text-sm font-bold uppercase mb-2 tracking-wider pb-1"
              style={{ color: primaryHeadingColor, borderBottom: `1.5px solid ${accentBorderColor}66` }}
            >
              CONTACT
            </h2>
            <ul className="text-xs text-gray-700 space-y-2 pb-2">
              <li className="flex items-start">
                <span className="font-semibold min-w-[65px]">Location:</span>
                {contactInfo.location}
              </li>
              <li className="flex items-start">
                <span className="font-semibold min-w-[65px]">Phone:</span>
                {contactInfo.phone}
              </li>
              <li className="flex items-start">
                <span className="font-semibold min-w-[65px]">Email:</span>
                <a href={`mailto:${contactInfo.email}`}
                  className="text-blue-600 hover:underline break-all leading-normal">
                  {contactInfo.email}
                </a>
              </li>
              {contactInfo.linkedin && (
                <li className="flex items-start">
                  <span className="font-semibold min-w-[65px]">LinkedIn:</span>
                  <a href={contactInfo.linkedin}
                    className="text-blue-600 hover:underline break-all leading-normal pb-1"
                    title={contactInfo.linkedin}>
                    linkedin.com/in/{contactInfo.linkedin.split('/').pop()}
                  </a>
                </li>
              )}
              {contactInfo.github && (
                <li className="flex items-start">
                  <span className="font-semibold min-w-[65px]">GitHub:</span>
                  <a href={contactInfo.github}
                    className="text-blue-600 hover:underline pb-2 break-all leading-normal"
                    title={contactInfo.github}>
                    github.com/{contactInfo.github.split('/').pop()}
                  </a>
                </li>
              )}
              {contactInfo.website && (
                <li className="flex items-start">
                  <span className="font-semibold min-w-[65px]">Portfolio:</span>
                  <a href={contactInfo.website}
                    className="text-blue-600 hover:underline pb-2 break-all leading-normal"
                    title={contactInfo.website}>
                    {contactInfo.website.replace(/(^\w+:|^)\/\//, '')}
                  </a>
                </li>
              )}
            </ul>
          </section>

          {/* Skills */}
          <section data-section="skills">
            <h2
              className="text-sm font-bold uppercase mb-2 tracking-wider pb-1"
              style={{ color: primaryHeadingColor, borderBottom: `1.5px solid ${accentBorderColor}66` }}
            >
              SKILLS
            </h2>
            {Object.entries(groupedSkills).map(([category, skillsList]) => (
              skillsList.length > 0 && (
                <div key={category} className="mb-2">
                  {category !== "Other Skills" && (
                    <h3 className="text-xs font-semibold italic mb-1">{category}:</h3>
                  )}
                  <ul className="text-xs text-gray-700">
                    {skillsList.map((skill, idx) => (
                      <li key={idx} className="mb-1">{skill}</li>
                    ))}
                  </ul>
                </div>
              )
            ))}
          </section>

          {/* Education */}
          {education.length > 0 && (
            <section data-section="education-info">
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 tracking-wider">EDUCATION</h2>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="text-xs">
                    <h3 className="font-bold pb-2">{edu.institution}</h3>
                    <p className=" pb-2 ">{edu.degree}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section data-section="certifications">
              <h2
                className="text-sm font-bold uppercase mb-2 tracking-wider pb-1"
                style={{ color: primaryHeadingColor, borderBottom: `1.5px solid ${accentBorderColor}66` }}
              >
                CERTIFICATIONS
              </h2>
              <ul className="text-xs text-gray-700 space-y-1">
                {certifications.map((cert, idx) => (
                  <li key={idx}>{cert.title} ({cert.year})</li>
                ))}
              </ul>
            </section>
          )}

          {/* Interests */}
          {interests.length > 0 && (
            <section data-section="additionalInfo">
              <h2
                className="text-sm font-bold uppercase mb-2 tracking-wider pb-1"
                style={{ color: primaryHeadingColor, borderBottom: `1.5px solid ${accentBorderColor}66` }}
              >
                INTERESTS
              </h2>
              <ul className="text-xs text-gray-700 space-y-1">
                {interests.map((interest, idx) => (
                  <li key={idx}>• {interest}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* MAIN CONTENT - 7 columns */}
        <main className="col-span-7 space-y-5 pl-4">
          {/* Work Experience */}
          {workExperience.length > 0 && (
            <section data-section="work-experience">
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 tracking-wider border-b border-gray-400 pb-1">WORK EXPERIENCE</h2>
              <div className="space-y-5">
                {workExperience.map((exp, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold pb-2">{exp.role}</h3>
                        <p className="italic">{exp.company}{exp.location && `, ${exp.location}`}</p>
                      </div>
                      {exp.startDate && exp.endDate && (
                        <div className="text-right italic">
                          {formatYearMonth(exp.startDate)} – {formatYearMonth(exp.endDate)}
                        </div>
                      )}
                    </div>
                    {parseBullets(exp.description).length > 0 ? (
                      <div className="space-y-1 mt-1 pl-1 text-gray-700">
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
                      <p className="mt-1 text-gray-700">{exp.description}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {projects.length > 0 && (
            <section data-section="projects">
              <h2
                className="text-sm font-bold uppercase mb-3 tracking-wider pb-1"
                style={{ color: primaryHeadingColor, borderBottom: `1px solid ${accentBorderColor}70` }}
              >
                PROJECTS
              </h2>
              <div className="space-y-4">
                {projects.map((proj, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold">{proj.title}</h3>
                      {proj.startDate && proj.endDate && (
                        <div className="text-right italic">
                          {formatYearMonth(proj.startDate)} – {formatYearMonth(proj.endDate)}
                        </div>
                      )}
                    </div>

                    {parseBullets(proj.description).length > 0 ? (
                      <div className="space-y-1 mt-1 mb-1 pl-1 text-gray-700">
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
                      <p className="mt-1 mb-1 text-gray-700">{proj.description}</p>
                    ) : null}

                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      {proj.github && (
                        <a href={proj.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline inline-flex items-center gap-1 text-xs whitespace-nowrap"
                          style={{ color: linkColor }}>
                          <span>GitHub</span>
                        </a>
                      )}
                      {proj.liveDemo && (
                        <a href={proj.liveDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline inline-flex items-center gap-1 text-xs whitespace-nowrap"
                          style={{ color: linkColor }}>
                          <span>Live Demo</span>
                        </a>
                      )}
                      {proj.technologies && (
                        <span className="text-gray-600">
                          <strong>Tech:</strong> {Array.isArray(proj.technologies) ? proj.technologies.join(", ") : proj.technologies}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default TemplateThree;