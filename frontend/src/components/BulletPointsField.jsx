import React, { useState, useEffect, useRef } from "react";
import { List, AlignLeft, Plus, Trash2, Sparkles, Check, Lightbulb } from "lucide-react";

/**
 * BulletPointsField
 * Provides an interactive option to enter Experience & Project descriptions
 * as bullet points or as a narrative paragraph, with two-way synchronization,
 * keyboard navigation (Enter/Backspace), action verb helpers, and AI enhance.
 */
export const BulletPointsField = ({
  label = "Description",
  value = "",
  onChange,
  onEnhance,
  placeholder = "e.g. Led end-to-end development of web platform, improving performance by 40%...",
  category = "experience", // "experience" | "project"
}) => {
  // Determine initial mode based on whether content has bullets or newlines
  const detectInitialMode = (val) => {
    if (!val || !val.trim()) return "bullets";
    const raw = String(val).trim();
    if (raw.includes("\n") || /^[-*•▪▫–—]/.test(raw) || /(?:^|\s+)[•*▪▫–—]/.test(raw)) {
      return "bullets";
    }
    return "paragraph";
  };

  const parseToBullets = (val) => {
    if (!val) return [""];
    const raw = String(val).trim();
    if (!raw) return [""];

    const lines = raw
      .split(/\r?\n+/)
      .map((l) => l.trim().replace(/^[-*•▪▫–—]\s*/, "").trim())
      .filter(Boolean);

    if (lines.length > 0) return lines;
    return [raw];
  };

  const [mode, setMode] = useState(() => detectInitialMode(value));
  const [bullets, setBullets] = useState(() => parseToBullets(value));
  const inputRefs = useRef([]);

  // Sync internal state when external value changes meaningfully
  useEffect(() => {
    const parsed = parseToBullets(value);
    const joinedCurrent = bullets.map((b) => b.trim()).filter(Boolean).join("||");
    const joinedNew = parsed.filter(Boolean).join("||");

    if (joinedCurrent !== joinedNew) {
      setBullets(parsed.length > 0 ? parsed : [""]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const emitBullets = (newBullets) => {
    const valid = newBullets.map((b) => b.trim()).filter(Boolean);
    if (valid.length === 0) {
      onChange("");
    } else {
      onChange(valid.map((b) => `• ${b}`).join("\n"));
    }
  };

  const handleBulletChange = (index, text) => {
    const updated = [...bullets];
    updated[index] = text;
    setBullets(updated);
    emitBullets(updated);
  };

  const addBulletAt = (index) => {
    const updated = [...bullets];
    updated.splice(index, 0, "");
    setBullets(updated);
    emitBullets(updated);
    setTimeout(() => {
      inputRefs.current[index]?.focus();
    }, 40);
  };

  const removeBullet = (index) => {
    if (bullets.length <= 1) {
      setBullets([""]);
      onChange("");
      return;
    }
    const updated = bullets.filter((_, i) => i !== index);
    setBullets(updated);
    emitBullets(updated);
    const focusIndex = Math.max(0, index - 1);
    setTimeout(() => {
      inputRefs.current[focusIndex]?.focus();
    }, 40);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addBulletAt(index + 1);
    } else if (e.key === "Backspace" && !bullets[index] && bullets.length > 1) {
      e.preventDefault();
      removeBullet(index);
    }
  };

  const switchToBullets = () => {
    setMode("bullets");
    const parsed = parseToBullets(value);
    const initialList = parsed.length > 0 && parsed[0] !== "" ? parsed : [""];
    setBullets(initialList);
    emitBullets(initialList);
  };

  const switchToParagraph = () => {
    setMode("paragraph");
    const text = bullets.map((b) => b.trim()).filter(Boolean).join(" ");
    onChange(text);
  };

  const insertActionVerb = (verb) => {
    // Insert into the last bullet or create a new one
    const updated = [...bullets];
    const lastIdx = updated.length - 1;
    if (lastIdx >= 0 && !updated[lastIdx].trim()) {
      updated[lastIdx] = `${verb} `;
      setBullets(updated);
      emitBullets(updated);
      setTimeout(() => inputRefs.current[lastIdx]?.focus(), 40);
    } else {
      updated.push(`${verb} `);
      setBullets(updated);
      emitBullets(updated);
      setTimeout(() => inputRefs.current[updated.length - 1]?.focus(), 40);
    }
  };

  const actionVerbs =
    category === "project"
      ? ["Built", "Architected", "Developed", "Designed", "Integrated", "Optimized"]
      : ["Led", "Spearheaded", "Improved", "Engineered", "Automated", "Delivered"];

  const getBulletPlaceholder = (idx) => {
    if (category === "project") {
      if (idx === 0) return "e.g. Built full-stack responsive web application with React and Node.js...";
      if (idx === 1) return "e.g. Integrated authentication, payment processing, and REST APIs...";
      return "e.g. Optimized database queries, reducing response times by 35%...";
    }
    if (idx === 0) return "e.g. Led end-to-end development of key features, improving user retention by 20%...";
    if (idx === 1) return "e.g. Collaborated with cross-functional teams to ship quarterly roadmap ahead of schedule...";
    return "e.g. Automated CI/CD pipelines, decreasing deployment errors by 45%...";
  };

  return (
    <div className="space-y-3">
      {/* Header with Title, Mode Switcher & AI Enhance */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-2">
          <label className="text-sm font-bold text-slate-700">{label}</label>
          {mode === "bullets" && bullets.filter((b) => b.trim()).length > 0 && (
            <span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full text-[11px] font-bold">
              {bullets.filter((b) => b.trim()).length} bullet{bullets.filter((b) => b.trim()).length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Option Selector: Bullets vs Paragraph */}
          <div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              type="button"
              onClick={switchToBullets}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
                mode === "bullets"
                  ? "bg-white text-violet-700 font-semibold shadow-xs border border-slate-200/60"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <List size={13} className={mode === "bullets" ? "text-violet-600" : "text-slate-400"} />
              <span>Bullets</span>
            </button>

            <button
              type="button"
              onClick={switchToParagraph}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
                mode === "paragraph"
                  ? "bg-white text-violet-700 font-semibold shadow-xs border border-slate-200/60"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <AlignLeft size={13} className={mode === "paragraph" ? "text-violet-600" : "text-slate-400"} />
              <span>Paragraph</span>
            </button>
          </div>

          {/* AI Enhance Button */}
          {typeof onEnhance === "function" && (
            <button
              type="button"
              onClick={onEnhance}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-xs hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <Sparkles size={12} />
              <span>AI Enhance</span>
            </button>
          )}
        </div>
      </div>

      {/* Bullet Points Mode */}
      {mode === "bullets" ? (
        <div className="space-y-2 bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="space-y-2.5">
            {bullets.map((bullet, i) => (
              <div key={i} className="flex items-start gap-2.5 group">
                {/* Bullet Dot */}
                <span className="mt-2.5 w-2 h-2 rounded-full bg-violet-600 shrink-0 group-focus-within:ring-4 group-focus-within:ring-violet-100 transition-all" />

                {/* Bullet Text Input */}
                <div className="flex-1 relative">
                  <textarea
                    ref={(el) => (inputRefs.current[i] = el)}
                    rows={1}
                    value={bullet}
                    onChange={(e) => handleBulletChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    placeholder={getBulletPlaceholder(i)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 leading-relaxed focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none resize-none transition-all shadow-2xs"
                    style={{
                      minHeight: "38px",
                      height: "auto",
                    }}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                  />
                </div>

                {/* Delete Bullet Button */}
                <button
                  type="button"
                  onClick={() => removeBullet(i)}
                  title="Remove this bullet"
                  className="mt-1.5 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Action Bar Below Bullets */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/60 mt-2">
            <button
              type="button"
              onClick={() => addBulletAt(bullets.length)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200/80 rounded-lg transition-colors"
            >
              <Plus size={14} />
              <span>Add Bullet Point</span>
            </button>

            {/* Quick Action Verb Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">Start with:</span>
              {actionVerbs.map((verb) => (
                <button
                  key={verb}
                  type="button"
                  onClick={() => insertActionVerb(verb)}
                  className="px-2 py-0.5 text-[11px] font-medium text-slate-600 bg-white hover:bg-violet-50 hover:text-violet-700 border border-slate-200 rounded-md transition-colors shadow-2xs"
                >
                  +{verb}
                </button>
              ))}
            </div>
          </div>

          {/* ATS Tip */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-violet-50/60 border border-violet-100 rounded-lg text-[11px] text-violet-700">
            <Lightbulb size={13} className="shrink-0 text-violet-500" />
            <span>
              <strong>ATS Tip:</strong> Press <kbd className="px-1 py-0.5 bg-white border border-violet-200 rounded text-[10px] font-mono">Enter</kbd> to add another bullet point. Quantify results (e.g. <em>“increased speed by 40%”</em>) for a top score.
            </span>
          </div>
        </div>
      ) : (
        /* Paragraph Mode */
        <div className="space-y-2">
          <textarea
            rows={4}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none resize-y transition-all shadow-xs"
          />
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Writing as a single narrative paragraph.</span>
            <button
              type="button"
              onClick={switchToBullets}
              className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700 hover:underline"
            >
              <List size={13} />
              <span>Convert to Bullet Points</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulletPointsField;
