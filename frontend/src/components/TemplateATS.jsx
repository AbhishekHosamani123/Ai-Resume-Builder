import React, { useEffect, useRef, useState } from "react";
import { formatYearMonth } from "../utils/helper";

// TemplateATS — classic single-column ATS resume, adapted from a LaTeX
// layout: centered uppercase header, ruled section headings, tight bullets,
// right-aligned italic dates. Renders at a natural 800px width and scales
// to the container, like the other templates.

const DEFAULT_THEME = ["#ffffff", "#1f1f1f", "#444444", "#0563c1"]; // bg, heading, line, link

const linkColor = (palette) => palette[3] || DEFAULT_THEME[3];
const headingColor = (palette) => palette[1] || DEFAULT_THEME[1];
const lineColor = (palette) => palette[2] || DEFAULT_THEME[2];

const SectionTitle = ({ text, palette }) => (
  <h2
    className="uppercase font-bold tracking-wide"
    style={{
      fontSize: 13,
      color: headingColor(palette),
      borderBottom: `1px solid ${lineColor(palette)}`,
      paddingBottom: 3,
      margin: "14px 0 6px 0",
    }}
  >
    {text}
  </h2>
);

const Dates = ({ start, end }) => {
  const s = formatYearMonth(start)
  const e = formatYearMonth(end)
  const text = [s, e].filter(Boolean).join(" – ")
  if (!text) return null
  return <span style={{ fontSize: 12, color: "#555555", fontStyle: "italic" }}>{text}</span>
}

const Bullets = ({ text }) => {
  const items = String(text || "")
    .split(/(?:\. |;\s*)/)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter((s) => s.length > 3)
  if (!items.length) return null
  return (
    <ul style={{ margin: "3px 0 0 0", paddingLeft: 18 }}>
      {items.map((b, i) => (
        <li key={i} style={{ marginBottom: 2 }}>{b}</li>
      ))}
    </ul>
  )
}

const TemplateATS = ({ resumeData = {}, colorPalette, containerWidth }) => {
  const palette = Array.isArray(colorPalette) && colorPalette.length ? colorPalette : DEFAULT_THEME
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
  const [baseWidth, setBaseWidth] = useState(800);
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

  const contactItems = [
    contactInfo.phone,
    contactInfo.email,
    contactInfo.linkedin,
    contactInfo.github,
    contactInfo.location,
  ].filter(Boolean)

  const jobs = workExperience.filter((w) => (w.company || "").trim() || (w.role || "").trim())
  const edus = education.filter((e) => (e.degree || "").trim() || (e.institution || "").trim())
  const projs = projects.filter((pr) => (pr.title || "").trim())
  const certs = certifications.filter((ct) => (ct.title || "").trim())
  const skillNames = skills.map((s) => (s.name || "").trim()).filter(Boolean)
  const languageNames = languages.map((l) => (l.name || "").trim()).filter(Boolean)
  const interestNames = interests.map((i) => (i || "").trim()).filter(Boolean)

  return (
    <div
      ref={resumeRef}
      className="bg-white"
      style={{
        fontFamily: "Calibri, Carlito, 'Segoe UI', Arial, sans-serif",
        color: "#1a1a1a",
        fontSize: 13,
        lineHeight: 1.35,
        padding: "26px 34px",
        transform: containerWidth > 0 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : undefined,
      }}
    >
      {/* ---------- Header ---------- */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 0.5, color: headingColor(palette) }}>
          {(profileInfo.fullName || "YOUR NAME").toUpperCase()}
        </div>
        {profileInfo.designation && (
          <div style={{ fontSize: 13, fontStyle: "italic", color: "#333333", marginTop: 2 }}>
            {profileInfo.designation}
          </div>
        )}
        <div style={{ fontSize: 12, marginTop: 4 }}>
          {contactItems.map((item, i) => (
            <span key={i}>
              {i > 0 && sep}
              <span style={/^https?:|^www\./.test(item) ? linkStyle : undefined}>{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ---------- Professional Summary ---------- */}
      {profileInfo.summary && (
        <>
          <SectionTitle text="Professional Summary" palette={palette} />
          <p style={{ margin: 0 }}>{profileInfo.summary}</p>
        </>
      )}

      {/* ---------- Skills ---------- */}
      {skillNames.length > 0 && (
        <>
          <SectionTitle text="Technical Skills" palette={palette} />
          <p style={{ margin: 0 }}>
            <strong>Skills: </strong>
            {skillNames.join(" • ")}
          </p>
        </>
      )}

      {/* ---------- Experience ---------- */}
      {jobs.length > 0 && (
        <>
          <SectionTitle text="Experience" palette={palette} />
          {jobs.map((w, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <span>
                  <strong>{w.role}</strong>
                  {w.company && <span> • {w.company}</span>}
                </span>
                <Dates start={w.startDate} end={w.endDate} />
              </div>
              <Bullets text={w.description} />
            </div>
          ))}
        </>
      )}

      {/* ---------- Projects ---------- */}
      {projs.length > 0 && (
        <>
          <SectionTitle text="Projects" palette={palette} />
          {projs.map((pr, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <span>
                  <strong>{pr.title}</strong>
                  {pr.github && <span style={{ color: "#666666" }}> | {pr.github}</span>}
                </span>
              </div>
              <Bullets text={pr.description} />
            </div>
          ))}
        </>
      )}

      {/* ---------- Certifications ---------- */}
      {certs.length > 0 && (
        <>
          <SectionTitle text="Certifications" palette={palette} />
          {certs.map((ct, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <span><strong>{ct.title}</strong>{ct.issuer && <span> • {ct.issuer}</span>}</span>
                {ct.year && <span style={{ fontSize: 12, color: "#555555", fontStyle: "italic" }}>{ct.year}</span>}
              </div>
            </div>
          ))}
        </>
      )}

      {/* ---------- Education ---------- */}
      {edus.length > 0 && (
        <>
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
        </>
      )}

      {/* ---------- Languages & Interests ---------- */}
      {(languageNames.length > 0 || interestNames.length > 0) && (
        <>
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
        </>
      )}
    </div>
  );
};

export default TemplateATS;
