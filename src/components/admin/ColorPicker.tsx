"use client";

const PRESETS = [
  { label: "Alap (fekete)", v: "#0a0a0a" },
  { label: "Fehér", v: "#ffffff" },
  { label: "Halvány szürke", v: "#e5e0d7" },
  { label: "Krém / bone", v: "#F5F1EA" },
  { label: "Homok", v: "#D4C5A9" },
  { label: "Szürke", v: "#8b8b8b" },
  { label: "Bordó", v: "#6b1f23" },
  { label: "Indigo", v: "#223a5e" },
];

export default function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (v: string | undefined) => void;
}) {
  return (
    <div>
      <div className="text-[10px] tracking-widest-2 uppercase text-muted mb-2">{label}</div>
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="color"
          value={value || "#0a0a0a"}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 border border-line rounded cursor-pointer"
        />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value || undefined)}
          placeholder="#0a0a0a (üres = automatikus)"
          className="flex-1 min-w-[180px] border-b border-line focus:border-ink py-2 text-sm outline-none bg-transparent font-mono"
        />
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="text-[10px] tracking-widest-2 uppercase text-muted hover:text-ink px-2 py-1 border border-line"
          title="Stílus visszaállítása alapértelmezettre"
        >
          Reset
        </button>
      </div>
      <div className="flex gap-2 mt-2 flex-wrap">
        {PRESETS.map((p) => (
          <button
            key={p.v}
            type="button"
            onClick={() => onChange(p.v)}
            className="flex items-center gap-1 text-[10px] text-muted hover:text-ink border border-line px-2 py-1"
            title={p.label}
          >
            <span
              className="w-3 h-3 rounded-full border border-ink/10"
              style={{ background: p.v }}
            />
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
