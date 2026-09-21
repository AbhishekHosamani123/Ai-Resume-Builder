/* eslint-disable react-refresh/only-export-components */
import React, { useRef, useEffect, useState } from "react";
import { formatYearMonth } from "../../utils/helper";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
} from "lucide-react";

// Auto-scaling hook used across all resume templates
export const useResumeScale = (containerWidth) => {
  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(794);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (resumeRef.current && containerWidth > 0) {
      const actualWidth = resumeRef.current.offsetWidth || 794;
      setBaseWidth(actualWidth);
      setScale(containerWidth / actualWidth);
    }
  }, [containerWidth]);

  return { resumeRef, baseWidth, scale };
};

// URL / Contact link parser
export const parseContactItem = (type, value) => {
  const v = String(value || "").trim();
  if (!v) return null;

  switch (type) {
    case "email":
      return {
        label: v.replace(/^mailto:/i, ""),
        href: `mailto:${v.replace(/^mailto:/i, "")}`,
        type: "email",
      };
    case "phone":
      return {
        label: v,
        href: `tel:${v.replace(/\s+/g, "")}`,
        type: "phone",
      };
    case "location":
      return {
        label: v,
        href: null,
        type: "location",
      };
    case "linkedin": {
      const clean = v.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\/?/i, "").replace(/\/$/, "");
      return {
        label: clean ? `linkedin/${clean}` : "LinkedIn",
        href: v.startsWith("http") ? v : `https://${v}`,
        type: "linkedin",
      };
    }
    case "github": {
      const clean = v.replace(/^https?:\/\/(www\.)?github\.com\/?/i, "").replace(/\/$/, "");
      return {
        label: clean ? `github/${clean}` : "GitHub",
        href: v.startsWith("http") ? v : `https://${v}`,
        type: "github",
      };
    }
    case "website": {
      const clean = v.replace(/^https?:\/\//i, "").replace(/\/$/, "");
      return {
        label: clean || "Website",
        href: v.startsWith("http") ? v : `https://${v}`,
        type: "website",
      };
    }
    default:
      return { label: v, href: null, type: "generic" };
  }
};

export const getContactIcon = (type, size = 13, className = "") => {
  switch (type) {
    case "email":
      return <Mail size={size} className={className} />;
    case "phone":
      return <Phone size={size} className={className} />;
    case "location":
      return <MapPin size={size} className={className} />;
    case "linkedin":
      return <Linkedin size={size} className={className} />;
    case "github":
      return <Github size={size} className={className} />;
    case "website":
      return <Globe size={size} className={className} />;
    default:
      return null;
  }
};

// Date range formatter
export const formatDates = (start, end) => {
  const s = formatYearMonth(start);
  const e = formatYearMonth(end);
  return [s, e].filter(Boolean).join(" – ");
};

// Robust bullet point parser handling newlines, inline bullets, and clean punctuation
export const parseBullets = (description) => {
  if (!description) return [];
  if (Array.isArray(description)) {
    return description
      .map((item) => (typeof item === "string" ? item : item?.text || ""))
      .map((s) => s.trim().replace(/^[-*•▪▫–—]\s*/, ""))
      .filter((s) => s.length > 0);
  }

  const raw = String(description).trim();
  if (!raw) return [];

  // 1. If text has multiple lines, split by line break
  const newlineItems = raw
    .split(/\r?\n+/)
    .map((l) => l.trim().replace(/^[-*•▪▫–—]\s*/, "").trim())
    .filter((l) => l.length > 0);

  if (newlineItems.length > 1) {
    return newlineItems;
  }

  // 2. Check for inline bullets: "• ... • ...", "* ... * ...", "- ... - ..."
  const inlineBullets = raw
    .split(/(?:^|\s+)[•*▪▫–—]\s*/)
    .map((s) => s.trim().replace(/^[-*•▪▫–—]\s*/, "").trim())
    .filter((s) => s.length > 0);

  if (inlineBullets.length > 1) {
    return inlineBullets;
  }

  // 3. Semicolon separated lists
  const semicolonItems = raw
    .split(/;\s+/)
    .map((s) => s.trim().replace(/^[-*•▪▫–—]\s*/, "").replace(/\.$/, "").trim())
    .filter((s) => s.length > 0);

  if (semicolonItems.length > 1) {
    return semicolonItems;
  }

  // 4. Single paragraph or sentence
  const clean = raw.replace(/^[-*•▪▫–—]\s*/, "").trim();
  return clean ? [clean] : [];
};

// Avatar component
export const Avatar = ({ url, name, size = 72, className = "", borderColor = "#e2e8f0" }) => {
  const initials = String(name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("") || "CV";

  if (url) {
    return (
      <img
        src={url}
        alt={name || "Profile"}
        className={`object-cover rounded-full shrink-0 shadow-sm ${className}`}
        style={{
          width: size,
          height: size,
          border: `2px solid ${borderColor}`,
        }}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 font-bold tracking-wider text-slate-600 bg-slate-100 shadow-sm ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.35),
        border: `2px solid ${borderColor}`,
      }}
    >
      {initials}
    </div>
  );
};

// BulletList component that renders consistent round bullet dots without html2canvas asterisk glitch
export const BulletList = ({
  items,
  text,
  className = "space-y-1 text-xs text-gray-700 mt-1",
  bulletColor = "#475569",
}) => {
  const list = items ? (Array.isArray(items) ? items : [items]) : parseBullets(text);
  if (!list || !list.length) return null;
  return (
    <div className={className}>
      {list.map((b, i) => (
        <div key={i} className="flex items-start gap-2">
          <span
            className="shrink-0 mt-1.5"
            style={{
              display: "inline-block",
              width: "4.5px",
              height: "4.5px",
              borderRadius: "50%",
              backgroundColor: bulletColor,
            }}
          />
          <span className="flex-1 leading-relaxed">{b}</span>
        </div>
      ))}
    </div>
  );
};
