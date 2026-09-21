import React, { useEffect, useRef, useState } from "react";
import { formatYearMonth } from "../utils/helper";
import { parseBullets } from "./templates/TemplateHelpers";

// TemplateATS — classic single-column ATS resume, adapted from a LaTeX
// layout: centered uppercase header, ruled section headings, tight bullets,
// right-aligned italic dates. Renders at a natural 800px width and scales
// to the container, like the other templates.

const DEFAULT_THEME = ["#ffffff", "#1f1f1f", "#444444", "#0563c1"]; // bg, heading, line, link

const linkColor = (palette) => palette[3] || DEFAULT_THEME[3];
const headingColor = (palette) => palette[1] || DEFAULT_THEME[1];
const lineColor = (palette) => palette[2] || DEFAULT_THEME[2];

const SectionTitle = ({ text, palette }) => (
  <div style={{ margin: "14px 0 6px 0" }}>
    <div
      style={{
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        color: headingColor(palette),
        paddingBottom: 2,
      }}
    >
      {text}
    </div>
    <div style={{ height: "1px", backgroundColor: lineColor(palette), width: "100%" }} />
  </div>
);

const Dates = ({ start, end }) => {
  const s = formatYearMonth(start)
  const e = formatYearMonth(end)
  const text = [s, e].filter(Boolean).join(" – ")
  if (!text) return null
  return <span style={{ fontSize: 12, color: "#555555", fontStyle: "italic" }}>{text}</span>
}

const Bullets = ({ text, color = "#444444" }) => {
  const items = parseBullets(text);
  if (!items.length) return null;
  return (
    <div style={{ margin: "4px 0 2px 0", paddingLeft: "6px" }}>
      {items.map((b, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "3px" }}>
          <span
            style={{
              display: "inline-block",
              width: "4.5px",
              height: "4.5px",
              borderRadius: "50%",
              backgroundColor: color,
              marginTop: "6px",
              flexShrink: 0,
            }}
          />
          <span style={{ flex: 1, fontSize: 12.5, lineHeight: 1.35, color: "#222222" }}>{b}</span>
        </div>
      ))}
    </div>
  );
};

const TemplateATS = ({ resumeData = {}, colorPalette, containerWidth }) => {
  const palette = Array.isArray(colorPalette) && colorPalette.length
    ? colorPalette
    : (resumeData?.template?.colorPalette && resumeData.template.colorPalette.length
      ? resumeData.template.colorPalette
      : DEFAULT_THEME)
  const {
    profileInfo = {},
    contactInfo = {},
    workExperience = [],
    education = [],
    projects = [],
    skills = [],
    certifications = [],
    languages = [],
    interests = [],
  } = resumeData

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

  const linkStyle = { color: linkColor(palette), textDecoration: "none" };
  const sep = <span style={{ color: "#666666", margin: "0 5px" }}>|</span>;

  // Contact row, LaTeX \href style: URLs render as friendly link text
  const contactLink = (value) => {
    const v = String(value || "").trim()
    if (!v) return null
    if (/^mailto:/i.test(v)) return { text: v.replace(/^mailto:/i, ""), href: v }
    if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(v)) return { text: v, href: `mailto:${v}` }
    if (/linkedin\.com/i.test(v)) return { text: "LinkedIn", href: v.startsWith("http") ? v : `https://${v}` }
    if (/github\.com/i.test(v)) return { text: "GitHub", href: v.startsWith("http") ? v : `https://${v}` }
    if (/^https?:\/\/(?!linkedin|github)/i.test(v)) return { text: v.replace(/^https?:\/\//i, "").replace(/\/$/, ""), href: v }
    return { text: v, href: null }
  }

  const contactItems = [
    contactInfo.phone,
    contactInfo.email,
    contactInfo.linkedin,
    contactInfo.github,
    contactInfo.location,
  ]
    .map(contactLink)
    .filter(Boolean)

  const jobs = workExperience.filter((w) => (w.company || "").trim() || (w.role || "").trim())
  const edus = education.filter((e) => (e.degree || "").trim() || (e.institution || "").trim())
  const projs = projects.filter((pr) => (pr.title || "").trim())
  const certs = certifications.filter((ct) => (ct.title || "").trim())
  const skillNames = skills.map((s) => (s.name || "").trim()).filter(Boolean)
  const languageNames = languages.map((l) => (l.name || "").trim()).filter(Boolean)
  const interestNames = interests.map((i) => (i || "").trim()).filter(Boolean)

  // LaTeX-style grouped skills: an entry typed as "Group: item, item" renders
  // as a bold-labeled line; plain entries join into a single line.
  const skillGroups = []
  const plainSkills = []
  for (const name of skillNames) {
    const m = name.match(/^([^:]{2,40}):\s*(.+)$/)
    if (m) skillGroups.push([m[1].trim(), m[2].split(/\s*,\s*/).filter(Boolean)])
    else plainSkills.push(name)
  }

  return (
    <div
      ref={resumeRef}
      className="bg-white a4-wrapper"
      style={{
        fontFamily: "'Carlito', Calibri, 'Segoe UI', Arial, sans-serif",
        color: "#1a1a1a",
        fontSize: 13,
        lineHeight: 1.35,
        padding: "26px 34px",
        transform: containerWidth > 0 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        width: "100%",
        maxWidth: containerWidth > 0 ? `${baseWidth}px` : "100%",
        boxSizing: "border-box",
        minHeight: "100%",
      }}
    >
      {/* ---------- Header ---------- */}
      <div style={{ textAlign: "center" }} data-section="profile-info">
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 0.5, color: headingColor(palette) }}>
          {(profileInfo.fullName || "YOUR NAME").toUpperCase()}
        </div>
        {profileInfo.designation && (
          <div style={{ fontSize: 13, fontStyle: "italic", color: "#333333", marginTop: 2 }}>
            {profileInfo.designation}
          </div>
        )}
        <div style={{ fontSize: 12, marginTop: 4 }} data-section="contact-info">
          {contactItems.map((item, i) => (
            <span key={i}>
              {i > 0 && sep}
              {item.href ? (
                <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={linkStyle}>
                  {item.text}
                </a>
              ) : (
                <span>{item.text}</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* ---------- Professional Summary ---------- */}
      {profileInfo.summary && (
        <div data-section="profile-info">
          <SectionTitle text="Professional Summary" palette={palette} />
          <p style={{ margin: 0 }}>{profileInfo.summary}</p>
        </div>
      )}

      {/* ---------- Skills (supports LaTeX-style "Group: item, item" entries) ---------- */}
      {skillNames.length > 0 && (
        <div data-section="skills">
          <SectionTitle text="Technical Skills" palette={palette} />
          {skillGroups.length > 0 ? (
            <div style={{ margin: 0 }}>
              {skillGroups.map(([grp, items], i) => (
                <div key={i} style={{ margin: "2px 0" }}>
                  <strong>{grp}:</strong> {items.join(", ")}
                </div>
              ))}
              {plainSkills.length > 0 && (
                <div style={{ margin: "2px 0" }}>
                  <strong>Other:</strong> {plainSkills.join(" • ")}
                </div>
              )}
            </div>
          ) : (
            <p style={{ margin: 0 }}>{plainSkills.join(" • ")}</p>
          )}
        </div>
      )}

      {/* ---------- Experience ---------- */}
      {jobs.length > 0 && (
        <div data-section="work-experience">
          <SectionTitle text="Experience" palette={palette} />
          {jobs.map((w, i) => (
            <div key={i} style={{ marginBottom: 9 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <span>
                  <strong>{w.role}</strong>
                  {w.company && <span> • {w.company}</span>}
                </span>
                <Dates start={w.startDate} end={w.endDate} />
              </div>
              <Bullets text={w.description} color={lineColor(palette)} />
            </div>
          ))}
        </div>
      )}

      {/* ---------- Projects ---------- */}
      {projs.length > 0 && (
        <div data-section="projects">
          <SectionTitle text="Projects" palette={palette} />
          {projs.map((pr, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <span>
                  <strong>{pr.title}</strong>
                  {pr.github && <span style={{ color: "#666666" }}> | {pr.github}</span>}
                </span>
              </div>
              <Bullets text={pr.description} color={lineColor(palette)} />
            </div>
          ))}
        </div>
      )}

      {/* ---------- Certifications ---------- */}
      {certs.length > 0 && (
        <div data-section="certifications">
          <SectionTitle text="Certifications & Achievements" palette={palette} />
          {certs.map((ct, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <span><strong>{ct.title}</strong>{ct.issuer && <span> • {ct.issuer}</span>}</span>
                {ct.year && <span style={{ fontSize: 12, color: "#555555", fontStyle: "italic" }}>{ct.year}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------- Education ---------- */}
      {edus.length > 0 && (
        <div data-section="education-info">
          <SectionTitle text="Education" palette={palette} />
          {edus.map((e, i) => (
            <div key={i} style={{ marginBottom: 5 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <span>
                  <strong>{e.degree}</strong>
                  {e.institution && <span> • {e.institution}</span>}
                </span>
                <Dates start={e.startDate} end={e.endDate} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------- Languages & Interests ---------- */}
      {(languageNames.length > 0 || interestNames.length > 0) && (
        <div data-section="additionalInfo">
          <SectionTitle text="Languages & Interests" palette={palette} />
          {languageNames.length > 0 && (
            <p style={{ margin: "0 0 3px 0" }}>
              <strong>Languages: </strong>{languageNames.join(" • ")}
            </p>
          )}
          {interestNames.length > 0 && (
            <p style={{ margin: 0 }}>
              <strong>Interests: </strong>{interestNames.join(" • ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateATS;
