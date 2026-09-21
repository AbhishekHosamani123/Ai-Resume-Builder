import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Sparkles } from "lucide-react";

/**
 * BulletPointsField
 * Minimalistic bullet points & paragraph editor.
 * Clean, lightweight, distraction-free interface matching resume typography.
 */
export const BulletPointsField = ({
  label = "Description",
  value = "",
  onChange,
  onEnhance,
  placeholder = "Add an achievement, responsibility, or project detail...",
  category = "experience",
}) => {
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

  // Auto-grow textarea on mount/update
  useEffect(() => {
    inputRefs.current.forEach((el) => {
      if (el) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
    });
  }, [bullets, mode]);

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

  const defaultPlaceholder =
    category === "project"
      ? "Describe key features, tech stack, and impact..."
      : "Describe your roles, responsibilities, and achievements...";

  return (
    <div className="space-y-2">
      {/* Minimalist Header */}
      <div className="flex items-center justify-between gap-2">
        <label className="block text-sm font-bold text-slate-700">{label}</label>

        <div className="flex items-center gap-2">
          {/* Subtle Mode Switcher */}
          <div className="inline-flex p-0.5 bg-slate-100 rounded-md text-[11px] font-medium text-slate-500">
            <button
              type="button"
              onClick={switchToBullets}
              className={`px-2 py-0.5 rounded transition-colors ${
                mode === "bullets"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Bullets
            </button>
            <button
              type="button"
              onClick={switchToParagraph}
              className={`px-2 py-0.5 rounded transition-colors ${
                mode === "paragraph"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Paragraph
            </button>
          </div>

          {/* Minimal AI Enhance Button */}
          {typeof onEnhance === "function" && (
            <button
              type="button"
              onClick={onEnhance}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200/60 transition-colors"
            >
              <Sparkles size={11} />
              <span>AI Enhance</span>
            </button>
          )}
        </div>
      </div>

      {/* Mode View */}
      {mode === "bullets" ? (
        <div className="space-y-1 pt-1">
          {bullets.map((bullet, i) => (
            <div key={i} className="flex items-start gap-2.5 group py-0.5">
              {/* Clean Subtle Bullet Dot */}
              <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-slate-400 group-focus-within:bg-violet-600 shrink-0 transition-colors" />

              {/* Minimalist Text Input */}
              <div className="flex-1 relative">
                <textarea
                  ref={(el) => (inputRefs.current[i] = el)}
                  rows={1}
                  value={bullet}
                  onChange={(e) => handleBulletChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  placeholder={i === 0 ? defaultPlaceholder : "Add another point..."}
                  className="w-full text-sm text-slate-800 placeholder:text-slate-400 bg-transparent border-b border-slate-100 hover:border-slate-200 focus:border-violet-500 py-1 px-1 outline-none resize-none leading-relaxed transition-colors"
                  style={{
                    minHeight: "28px",
                    height: "auto",
                  }}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                />
              </div>

              {/* Discreet Trash Button (only visible on hover/focus) */}
              <button
                type="button"
                onClick={() => removeBullet(i)}
                title="Remove bullet"
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 mt-1 p-1 text-slate-300 hover:text-rose-500 rounded transition-opacity"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}

          {/* Minimal "+ Add point" Button */}
          <div className="pt-1 pl-4">
            <button
              type="button"
              onClick={() => addBulletAt(bullets.length)}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-violet-600 transition-colors"
            >
              <Plus size={13} />
              <span>Add bullet point</span>
            </button>
          </div>
        </div>
      ) : (
        /* Minimalist Paragraph Mode */
        <div className="space-y-1.5">
          <textarea
            rows={3}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || defaultPlaceholder}
            className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg p-3 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none resize-y transition-all"
          />
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={switchToBullets}
              className="text-[11px] text-slate-400 hover:text-violet-600 transition-colors"
            >
              Switch to bullet points
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulletPointsField;
