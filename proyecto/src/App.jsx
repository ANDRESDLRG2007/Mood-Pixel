import { useState } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────
const MOODS = [
  { id: "radiant",  label: "Radiante",   emoji: "✨", color: "#FFD166", text: "#7A5C00" },
  { id: "happy",    label: "Feliz",      emoji: "😊", color: "#06D6A0", text: "#004D38" },
  { id: "calm",     label: "Tranquilo",  emoji: "🌊", color: "#118AB2", text: "#FFFFFF" },
  { id: "meh",      label: "Normal",     emoji: "😐", color: "#8ECAE6", text: "#1A3A4A" },
  { id: "tired",    label: "Cansado",    emoji: "😴", color: "#B5B5B5", text: "#333333" },
  { id: "anxious",  label: "Ansioso",    emoji: "😬", color: "#FF9F1C", text: "#4A2600" },
  { id: "sad",      label: "Triste",     emoji: "🌧", color: "#6A7FDB", text: "#FFFFFF" },
  { id: "angry",    label: "Enojado",    emoji: "🔥", color: "#EF476F", text: "#FFFFFF" },
];

// Seed de datos de ejemplo para que el mosaico no esté vacío al inicio
const seedData = () => {
  const today = new Date();
  const entries = {};
  for (let i = 30; i >= 1; i--) {
    if (Math.random() > 0.35) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const mood = MOODS[Math.floor(Math.random() * MOODS.length)];
      entries[key] = { mood, note: "" };
    }
  }
  return entries;
};

const formatDate = (dateStr) => {
  const [y, m, d] = dateStr.split("-");
  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
};

const todayKey = () => new Date().toISOString().split("T")[0];

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function MoodPicker({ selected, onSelect }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
      {MOODS.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m)}
          style={{
            background: selected?.id === m.id ? m.color : "#1E1E2E",
            border: selected?.id === m.id ? `3px solid ${m.color}` : "2px solid #2E2E42",
            borderRadius: "16px",
            padding: "14px 6px 10px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            transform: selected?.id === m.id ? "scale(1.08)" : "scale(1)",
            boxShadow: selected?.id === m.id ? `0 0 18px ${m.color}66` : "none",
          }}
        >
          <div style={{ fontSize: "26px", lineHeight: 1 }}>{m.emoji}</div>
          <div
            style={{
              fontSize: "11px",
              marginTop: "6px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              color: selected?.id === m.id ? m.text : "#888",
              letterSpacing: "0.02em",
            }}
          >
            {m.label}
          </div>
        </button>
      ))}
    </div>
  );
}

function PixelModal({ entry, dateStr, onClose }) {
  if (!entry) return null;
  const { mood, note } = entry;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 100, padding: "24px",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#16162A",
          border: `2px solid ${mood.color}44`,
          borderRadius: "24px",
          padding: "32px 28px",
          width: "100%",
          maxWidth: "360px",
          boxShadow: `0 0 40px ${mood.color}33`,
          animation: "popIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Color swatch grande */}
        <div style={{
          width: "64px", height: "64px", borderRadius: "50%",
          background: mood.color, margin: "0 auto 20px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "28px",
          boxShadow: `0 0 24px ${mood.color}88`,
        }}>
          {mood.emoji}
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: "13px", color: "#666",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.1em", textTransform: "uppercase",
            marginBottom: "4px",
          }}>
            {formatDate(dateStr)}
          </div>
          <div style={{
            fontSize: "22px", fontWeight: 700,
            color: mood.color,
            fontFamily: "'DM Serif Display', serif",
            marginBottom: "20px",
          }}>
            {mood.label}
          </div>
        </div>

        {note ? (
          <div style={{
            background: "#0D0D1A",
            borderRadius: "14px",
            padding: "16px",
            border: "1px solid #2E2E42",
            marginBottom: "24px",
          }}>
            <div style={{ fontSize: "11px", color: "#555", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.08em" }}>NOTA DEL DÍA</div>
            <p style={{
              color: "#CCC", fontSize: "15px", lineHeight: 1.6,
              fontFamily: "'DM Sans', sans-serif", margin: 0,
              fontStyle: "italic",
            }}>
              "{note}"
            </p>
          </div>
        ) : (
          <div style={{
            background: "#0D0D1A",
            borderRadius: "14px",
            padding: "16px",
            border: "1px solid #2E2E42",
            marginBottom: "24px",
            textAlign: "center",
          }}>
            <span style={{ color: "#444", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Sin nota para este día</span>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "14px",
            background: mood.color, color: mood.text,
            border: "none", borderRadius: "14px",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700, fontSize: "15px",
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

function MosaicGrid({ entries, onPixelClick }) {
  const today = todayKey();
  // Generar los últimos 84 días (12 semanas × 7)
  const days = [];
  for (let i = 83; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }

  return (
    <div>
      {/* Etiquetas de días */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "4px" }}>
        {["L","M","X","J","V","S","D"].map((d) => (
          <div key={d} style={{
            textAlign: "center", fontSize: "10px",
            color: "#444", fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, letterSpacing: "0.05em",
          }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
        {days.map((dateStr) => {
          const entry = entries[dateStr];
          const isToday = dateStr === today;
          return (
            <button
              key={dateStr}
              onClick={() => entry && onPixelClick(dateStr)}
              title={dateStr}
              style={{
                aspectRatio: "1",
                borderRadius: "6px",
                background: entry ? entry.mood.color : "#1A1A2E",
                border: isToday
                  ? "2px solid #FFFFFF"
                  : entry
                  ? "2px solid transparent"
                  : "2px solid #2A2A3E",
                cursor: entry ? "pointer" : "default",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                boxShadow: entry ? `0 0 8px ${entry.mood.color}44` : "none",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (entry) {
                  e.currentTarget.style.transform = "scale(1.3)";
                  e.currentTarget.style.zIndex = "10";
                  e.currentTarget.style.boxShadow = `0 0 14px ${entry.mood.color}88`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.zIndex = "1";
                if (entry) e.currentTarget.style.boxShadow = `0 0 8px ${entry.mood.color}44`;
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function StatsBar({ entries }) {
  const counts = {};
  MOODS.forEach((m) => (counts[m.id] = 0));
  Object.values(entries).forEach(({ mood }) => {
    counts[mood.id] = (counts[mood.id] || 0) + 1;
  });
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const top = MOODS.sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0)).slice(0, 3);

  return (
    <div style={{
      background: "#0D0D1A",
      borderRadius: "18px",
      padding: "18px",
      border: "1px solid #2E2E42",
    }}>
      <div style={{
        fontSize: "11px", color: "#555", marginBottom: "14px",
        fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}>
        Top emociones · {total} días registrados
      </div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {top.filter((m) => counts[m.id] > 0).map((m, i) => (
          <div
            key={m.id}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: `${m.color}18`,
              borderRadius: "10px", padding: "8px 12px",
              border: `1px solid ${m.color}44`,
            }}
          >
            <span style={{ fontSize: "16px" }}>{m.emoji}</span>
            <span style={{ fontSize: "13px", color: m.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
              {counts[m.id]}x
            </span>
            <span style={{ fontSize: "12px", color: "#666", fontFamily: "'DM Sans', sans-serif" }}>
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ───────────────────────────────────────────────────────────
export default function App() {
  const [entries, setEntries] = useState(seedData);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [view, setView] = useState("register"); // "register" | "mosaic"
  const [modalData, setModalData] = useState(null); // { dateStr, entry }
  const [saved, setSaved] = useState(false);

  const today = todayKey();
  const alreadySaved = !!entries[today];

  const handleSave = () => {
    if (!selectedMood) return;
    setEntries((prev) => ({
      ...prev,
      [today]: { mood: selectedMood, note: note.trim() },
    }));
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setView("mosaic");
    }, 1200);
  };

  const handlePixelClick = (dateStr) => {
    setModalData({ dateStr, entry: entries[dateStr] });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0A18; }
        textarea:focus { outline: none; }
        button:focus-visible { outline: 2px solid #ffffff44; outline-offset: 2px; }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2E2E42; border-radius: 4px; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#0A0A18",
        display: "flex",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "420px",
          padding: "0 0 40px",
          animation: "fadeUp 0.4s ease",
        }}>

          {/* ── HEADER ── */}
          <div style={{
            padding: "48px 24px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div>
              <h1 style={{
                fontSize: "26px",
                fontFamily: "'DM Serif Display', serif",
                color: "#EFEFFF",
                lineHeight: 1.1,
              }}>
                Mood Pixel
              </h1>
              <p style={{ fontSize: "13px", color: "#555", marginTop: "4px", letterSpacing: "0.04em" }}>
                Tu diario emocional visual
              </p>
            </div>
            <div style={{
              width: "44px", height: "44px",
              borderRadius: "50%",
              background: alreadySaved
                ? `${entries[today]?.mood.color}22`
                : "#1A1A2E",
              border: alreadySaved
                ? `2px solid ${entries[today]?.mood.color}`
                : "2px solid #2E2E42",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px",
            }}>
              {alreadySaved ? entries[today].mood.emoji : "🎨"}
            </div>
          </div>

          {/* ── TABS ── */}
          <div style={{
            display: "flex",
            margin: "0 24px 24px",
            background: "#12122A",
            borderRadius: "14px",
            padding: "4px",
            border: "1px solid #2E2E42",
          }}>
            {[
              { id: "register", label: "✏️  Hoy" },
              { id: "mosaic",   label: "🎞  Mosaico" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                style={{
                  flex: 1, padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: view === tab.id ? "#252540" : "transparent",
                  color: view === tab.id ? "#EFEFFF" : "#555",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600, fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: view === tab.id ? "0 2px 8px #00000044" : "none",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── VISTA: REGISTRAR ── */}
          {view === "register" && (
            <div style={{ padding: "0 24px", animation: "fadeUp 0.3s ease" }}>

              {/* Banner si ya guardó hoy */}
              {alreadySaved && (
                <div style={{
                  background: `${entries[today].mood.color}18`,
                  border: `1px solid ${entries[today].mood.color}44`,
                  borderRadius: "16px",
                  padding: "16px",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}>
                  <span style={{ fontSize: "28px" }}>{entries[today].mood.emoji}</span>
                  <div>
                    <div style={{ color: entries[today].mood.color, fontWeight: 700, fontSize: "15px" }}>
                      Hoy: {entries[today].mood.label}
                    </div>
                    <div style={{ color: "#666", fontSize: "12px", marginTop: "2px" }}>
                      Puedes actualizar tu estado de hoy
                    </div>
                  </div>
                </div>
              )}

              <div style={{
                fontSize: "11px", color: "#555", marginBottom: "14px",
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                ¿Cómo te sientes hoy?
              </div>

              <MoodPicker selected={selectedMood} onSelect={setSelectedMood} />

              {/* Nota */}
              <div style={{ marginTop: "24px" }}>
                <div style={{
                  fontSize: "11px", color: "#555", marginBottom: "10px",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                }}>
                  Nota del día (opcional)
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="¿Qué pasó hoy?…"
                  maxLength={160}
                  rows={3}
                  style={{
                    width: "100%",
                    background: "#12122A",
                    border: "2px solid #2E2E42",
                    borderRadius: "14px",
                    padding: "14px",
                    color: "#EFEFFF",
                    fontSize: "15px",
                    fontFamily: "'DM Sans', sans-serif",
                    resize: "none",
                    lineHeight: 1.6,
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#4444AA")}
                  onBlur={(e) => (e.target.style.borderColor = "#2E2E42")}
                />
                <div style={{ textAlign: "right", fontSize: "11px", color: "#333", marginTop: "4px" }}>
                  {note.length}/160
                </div>
              </div>

              {/* Botón guardar */}
              <button
                onClick={handleSave}
                disabled={!selectedMood}
                style={{
                  width: "100%",
                  marginTop: "20px",
                  padding: "16px",
                  background: selectedMood
                    ? saved
                      ? "#06D6A0"
                      : selectedMood.color
                    : "#1A1A2E",
                  color: selectedMood ? selectedMood.text : "#444",
                  border: "none",
                  borderRadius: "16px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "16px",
                  cursor: selectedMood ? "pointer" : "default",
                  transition: "all 0.3s ease",
                  boxShadow: selectedMood ? `0 4px 20px ${selectedMood.color}55` : "none",
                  transform: saved ? "scale(0.98)" : "scale(1)",
                  letterSpacing: "0.04em",
                }}
              >
                {saved
                  ? "✓  ¡Guardado!"
                  : alreadySaved
                  ? "🔄  Actualizar día"
                  : "💾  Guardar pixel"}
              </button>
            </div>
          )}

          {/* ── VISTA: MOSAICO ── */}
          {view === "mosaic" && (
            <div style={{ padding: "0 24px", animation: "fadeUp 0.3s ease" }}>
              <div style={{ marginBottom: "20px" }}>
                <div style={{
                  fontSize: "11px", color: "#555", marginBottom: "14px",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                }}>
                  Últimas 12 semanas · toca un pixel
                </div>
                <MosaicGrid entries={entries} onPixelClick={handlePixelClick} />
              </div>

              {/* Leyenda */}
              <div style={{
                display: "flex", flexWrap: "wrap", gap: "8px",
                marginBottom: "20px",
              }}>
                {MOODS.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      fontSize: "11px", color: "#666",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    <div style={{
                      width: "10px", height: "10px",
                      borderRadius: "3px",
                      background: m.color,
                    }} />
                    {m.label}
                  </div>
                ))}
              </div>

              <StatsBar entries={entries} />
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL ── */}
      {modalData && (
        <PixelModal
          dateStr={modalData.dateStr}
          entry={modalData.entry}
          onClose={() => setModalData(null)}
        />
      )}
    </>
  );
}