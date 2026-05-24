// Small shared controls for the Permissions page.
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { AccessLevel, LEVELS } from "@/data/permissions/permissions-mock";
import { alpha, c, F, lvlC } from "./permissions-utils";

export function Drop({
  value,
  onChange,
}: {
  value: AccessLevel;
  onChange: (v: AccessLevel) => void;
}) {
  const [open, setOpen] = useState(false);
  const col = lvlC(value);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        style={{
          background: "transparent",
          border: `1px solid ${c.border}`,
          color: col,
          padding: "0 24px 0 10px",
          fontSize: 10,
          fontWeight: 600,
          fontFamily: F,
          cursor: "pointer",
          minWidth: 120,
          textAlign: "left",
          height: 26,
        }}
      >
        {value}
        <span
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <ChevronDown size={8} color={c.textDim} />
        </span>
      </button>
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 999 }}
          />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 2px)",
              right: 0,
              zIndex: 1000,
              background: c.bg2,
              border: `1px solid ${c.border}`,
              minWidth: 155,
              boxShadow: c.dropShadow,
            }}
          >
            {LEVELS.map((l) => {
              const a = value === l;
              return (
                <div
                  key={l}
                  onClick={() => {
                    onChange(l);
                    setOpen(false);
                  }}
                  style={{
                    padding: "7px 12px",
                    fontSize: 10,
                    fontWeight: a ? 700 : 500,
                    fontFamily: F,
                    color: a ? c.text : lvlC(l),
                    background: a ? alpha(lvlC(l), 9) : "transparent",
                    cursor: "pointer",
                    borderLeft: a
                      ? `2px solid ${lvlC(l)}`
                      : "2px solid transparent",
                  }}
                >
                  {l}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function Toggle({
  on,
  onToggle,
  label,
}: {
  on: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        cursor: "pointer",
        padding: "8px 0",
      }}
    >
      <div
        style={{
          width: 32,
          height: 16,
          background: on ? c.green : c.border,
          position: "relative",
          transition: "background 0.2s",
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            background: on ? "#fff" : c.textDim,
            position: "absolute",
            top: 2,
            left: on ? 18 : 2,
            transition: "left 0.2s",
          }}
        />
      </div>
      <span style={{ fontSize: 11, color: c.text, fontFamily: F }}>{label}</span>
    </div>
  );
}

export function Chk({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      style={{
        width: 16,
        height: 16,
        border: `1px solid ${checked ? c.goldHi : c.border}`,
        background: checked ? alpha(c.gold, 8) : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      {checked && <Check size={10} color={c.goldHi} />}
    </div>
  );
}
