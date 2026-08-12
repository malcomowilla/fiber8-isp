import { useState, useRef, useCallback, useEffect } from "react";

const FONTS = ["Inter", "Playfair Display", "Oswald", "Pacifico", "Montserrat", "Space Grotesk", "Bebas Neue"];
const BG_PRESETS = [
  { label: "Ocean", value: "linear-gradient(135deg,#0ea5e9,#0369a1)" },
  { label: "Sunset", value: "linear-gradient(135deg,#f97316,#ec4899)" },
  { label: "Forest", value: "linear-gradient(135deg,#16a34a,#0d9488)" },
  { label: "Midnight", value: "linear-gradient(135deg,#1e1b4b,#312e81)" },
  { label: "Gold", value: "linear-gradient(135deg,#f59e0b,#b45309)" },
  { label: "Rose", value: "linear-gradient(135deg,#f43f5e,#be185d)" },
  { label: "Slate", value: "linear-gradient(135deg,#334155,#0f172a)" },
  { label: "White", value: "#ffffff" },
];

const CANVAS_PRESETS = [
  { label: "Hotspot Ad", w: 320, h: 280 },
  { label: "Square", w: 320, h: 320 },
  { label: "Story 9:16", w: 270, h: 480 },
  { label: "Banner", w: 468, h: 180 },
  { label: "Leaderboard", w: 480, h: 120 },
  { label: "Wide", w: 480, h: 270 },
];

const LINK_TYPES = [
  { id: "whatsapp", label: "WhatsApp", icon: "💬", prefix: "https://wa.me/" },
  { id: "website", label: "Website", icon: "🌐", prefix: "https://" },
  { id: "phone", label: "Phone Call", icon: "📞", prefix: "tel:" },
  { id: "maps", label: "Google Maps", icon: "📍", prefix: "https://maps.google.com/?q=" },
  { id: "email", label: "Email", icon: "✉️", prefix: "mailto:" },
];

const SHAPES = [
  { id: "rectangle", label: "Box", icon: "▭" },
  { id: "circle", label: "Circle", icon: "○" },
  { id: "badge", label: "Badge", icon: "⬡" },
];

const DEFAULT_ELEMENTS = [
  { id: 1, type: "text", content: "FREE WiFi Access!", x: 24, y: 30, fontSize: 28, fontFamily: "Oswald", color: "#ffffff", fontWeight: "bold", fontStyle: "normal", textDecoration: "none", align: "center", width: 272 },
  { id: 2, type: "text", content: "Visit us for the best deal in town!", x: 24, y: 80, fontSize: 14, fontFamily: "Inter", color: "#e2e8f0", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", align: "center", width: 272 },
  { id: 3, type: "button", content: "Learn More →", x: 80, y: 150, fontSize: 14, fontFamily: "Inter", color: "#0f172a", bg: "#facc15", radius: 20, width: 160, height: 40 },
  { id: 4, type: "badge", content: "LIMITED OFFER", x: 24, y: 200, fontSize: 11, fontFamily: "Inter", color: "#fef3c7", bg: "#b45309", radius: 4, width: 120, height: 26 },
  { id: 5, type: "text", content: "📍 Nairobi CBD  •  📞 0712 345 678", x: 24, y: 240, fontSize: 11, fontFamily: "Inter", color: "#94a3b8", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", align: "center", width: 272 },
];

function DraggableElement({ el, selected, onSelect, onMove, canvasRef }) {
  const dragRef = useRef(null);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    onSelect(el.id);
    const startX = e.clientX - el.x;
    const startY = e.clientY - el.y;
    const onMove_ = (me) => {
      const canvas = canvasRef.current?.getBoundingClientRect();
      if (!canvas) return;
      const nx = Math.max(0, Math.min(me.clientX - startX, canvas.width - 40));
      const ny = Math.max(0, Math.min(me.clientY - startY, canvas.height - 20));
      onMove(el.id, nx, ny);
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove_);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove_);
    window.addEventListener("mouseup", onUp);
  };

  const style = {
    position: "absolute",
    left: el.x,
    top: el.y,
    cursor: "move",
    userSelect: "none",
    outline: selected ? "2px dashed rgba(255,255,255,0.8)" : "none",
    outlineOffset: "2px",
    borderRadius: "3px",
  };

  if (el.type === "text") {
    return (
      <div style={{ ...style, width: el.width, fontFamily: el.fontFamily, fontSize: el.fontSize, color: el.color, fontWeight: el.fontWeight, fontStyle: el.fontStyle, textDecoration: el.textDecoration, textAlign: el.align, lineHeight: 1.3 }} onMouseDown={handleMouseDown}>
        {el.content}
      </div>
    );
  }

  if (el.type === "button" || el.type === "badge") {
    return (
      <div style={{ ...style, width: el.width, height: el.height, background: el.bg, borderRadius: el.radius, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: el.fontFamily, fontSize: el.fontSize, color: el.color, fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", padding: "0 12px" }} onMouseDown={handleMouseDown}>
        {el.content}
      </div>
    );
  }

  if (el.type === "shape") {
    const shapeStyle = el.shape === "circle"
      ? { borderRadius: "50%", width: el.size, height: el.size }
      : { width: el.size, height: el.size * 0.6, borderRadius: el.shape === "badge" ? "50px" : "6px" };
    return (
      <div style={{ ...style, ...shapeStyle, background: el.bg, opacity: el.opacity }} onMouseDown={handleMouseDown} />
    );
  }

  if (el.type === "image" && el.src) {
    return (
      <div style={{ ...style, width: el.width, height: el.height, overflow: "hidden", borderRadius: 8 }} onMouseDown={handleMouseDown}>
        <img src={el.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }

  return null;
}

// NOTE: now accepts `initialConfig` (to restore an existing design when editing)
// and `onChange` (called live, any time the design changes) instead of the
// unused `onSave` prop. A "Save Design" button is kept too, calling the same
// onChange, so the flow works whether the parent listens live or waits for a click.
export default function HotspotAdBuilder({ initialConfig, onChange }) {
  const [elements, setElements] = useState(
    initialConfig?.elements?.length ? initialConfig.elements : DEFAULT_ELEMENTS
  );
  const [selectedId, setSelectedId] = useState(null);
  const [bg, setBg] = useState(initialConfig?.background || "linear-gradient(135deg,#0ea5e9,#0369a1)");
  const [bgType, setBgType] = useState("gradient");
  const [customBg, setCustomBg] = useState("#0ea5e9");
  const [linkType, setLinkType] = useState("whatsapp"); // just the default *type* shown in the UI picker
const [linkValue, setLinkValue] = useState(""); // empty by default — no link is set unless the person types one
  const [ctaTarget, setCtaTarget] = useState(3);
  const [tab, setTab] = useState("design");

  const [canvasW, setCanvasW] = useState(initialConfig?.canvasW || 320);
  const [canvasH, setCanvasH] = useState(initialConfig?.canvasH || 280);

  const [previewMode, setPreviewMode] = useState(false);
  const canvasRef = useRef(null);
  const imgInputRef = useRef(null);

  const selected = elements.find((e) => e.id === selectedId);

  const moveEl = useCallback((id, x, y) => {
    setElements((prev) => prev.map((e) => (e.id === id ? { ...e, x, y } : e)));
  }, []);

  const updateEl = (id, patch) => {
    setElements((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const deleteEl = (id) => {
    setElements((prev) => prev.filter((e) => e.id !== id));
    setSelectedId(null);
  };

  const addText = () => {
    const id = Date.now();
    setElements((prev) => [...prev, { id, type: "text", content: "New text", x: 40, y: 100, fontSize: 16, fontFamily: "Inter", color: "#ffffff", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", align: "left", width: 200 }]);
    setSelectedId(id);
  };

  const addButton = () => {
    const id = Date.now();
    setElements((prev) => [...prev, { id, type: "button", content: "Tap Here", x: 80, y: 120, fontSize: 14, fontFamily: "Inter", color: "#0f172a", bg: "#facc15", radius: 20, width: 160, height: 40 }]);
    setSelectedId(id);
  };

  const addShape = (shape) => {
    const id = Date.now();
    setElements((prev) => [...prev, { id, type: "shape", shape, x: 60, y: 80, size: 80, bg: "rgba(255,255,255,0.2)", opacity: 0.8 }]);
    setSelectedId(id);
  };

  const addImage = (file) => {
    const url = URL.createObjectURL(file);
    const id = Date.now();
    setElements((prev) => [...prev, { id, type: "image", src: url, x: 40, y: 60, width: 100, height: 80 }]);
    setSelectedId(id);
  };

  // const getLinkUrl = () => {
  //   const lt = LINK_TYPES.find((l) => l.id === linkType);
  //   if (!lt) return "";
  //   if (linkType === "whatsapp") return `https://wa.me/${linkValue.replace(/\D/g, "")}`;
  //   return lt.prefix + linkValue;
  // };



const getLinkUrl = () => {
  // No link value entered = no link at all, regardless of which type is selected.
  if (!linkValue.trim()) return "";
  const lt = LINK_TYPES.find((l) => l.id === linkType);
  if (!lt) return "";
  if (linkType === "whatsapp") return `https://wa.me/${linkValue.replace(/\D/g, "")}`;
  return lt.prefix + linkValue;
};




  const getAdConfig = () => ({
    elements,
    background: bg,
    link: getLinkUrl(),
    linkType,
    canvasW,
    canvasH,
  });

  // Report the current design up to the parent every time anything about it
  // changes. This is what was missing before — the parent's designConfig
  // state was never being populated, so validation always thought there was
  // no design.
  useEffect(() => {
    onChange?.(getAdConfig());
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, bg, linkType, linkValue, canvasW, canvasH]);

  const resolved = selected;

  return (
    <div style={{ display: "flex", gap: 0, minHeight: 520, 
    background: "var(--color-background-primary)", borderRadius: 
    12, border: "0.5px solid var(--color-border-tertiary)", overflow: "hidden", fontFamily: "var(--font-sans)" }}>

      {/* Left panel */}
      <div style={{ width: 220, borderRight: "0.5px solid var(--color-border-tertiary)", display: "flex", flexDirection: "column", flexShrink: 0 }}>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          {["design", "elements", "link"].map((t) => (
            <button className="dark:text-white text-sm text-black" key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 4px", 
             fontWeight: tab === t ? 500 : 400, 
             border: "none", borderBottom: tab === t ? "2px solid var(--color-text-primary)" : "2px solid transparent", 
             cursor: "pointer", textTransform: "capitalize" }}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px" }}>

          {/* DESIGN TAB */}
          {tab === "design" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="dark:text-white text-black"  style={{  display: "block", marginBottom: 6 }}>BACKGROUND</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 8 }}>
                  {BG_PRESETS.map((p) => (
                    <button className="text-lg" key={p.label} onClick={() => { setBg(p.value); setBgType("gradient"); }}
                     style={{ padding: "5px 4px", 
                     background: p.value === "#ffffff" ? "#f8fafc" : p.value, color: p.value === "#ffffff" ? "#0f172a" : "#fff", border: bg === p.value ? "2px solid var(--color-text-primary)" : "0.5px solid transparent", borderRadius: 6, cursor: "pointer", fontWeight: 500 }}>
                      {p.label}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input type="color" value={customBg} onChange={(e) => { setCustomBg(e.target.value); setBg(e.target.value); }}
                   style={{ width: 28, height: 28, border: "none", padding: 0, cursor: "pointer", borderRadius: 4 }} />
                  <span className="dark:text-white text-black" style={{ fontSize: 11,  }}>Custom color</span>
                </div>
              </div>

              <div>
                <label className="dark:text-white text-black" style={{ fontSize: 11, display: "block", marginBottom: 6 }}>ADD ELEMENTS</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <button className="dark:text-white text-sm text-black" onClick={addText} style={{ padding: "7px 10px", 
                     background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", 
                     borderRadius: 6, cursor: "pointer",  textAlign: "left" }}>
                    + Text
                  </button>
                  <button className="dark:text-white text-sm text-black"  onClick={addButton} style={{ padding: "7px 10px", 
                  
                     background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", 
                     borderRadius: 6, cursor: "pointer",  textAlign: "left" }}>
                    + Button
                  </button>
                  {SHAPES.map((s) => (
                    <button key={s.id}  className="dark:text-white text-sm text-black" onClick={() => addShape(s.id)} style={{ padding: "7px 10px", 
                    background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", 
                    borderRadius: 6, cursor: "pointer",  textAlign: "left" }}>
                      {s.icon} Shape ({s.label})
                    </button>
                  ))}
                  <button onClick={() => imgInputRef.current?.click()} className="dark:text-white text-sm text-black"  style={{ padding: "7px 10px", 
                    background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)",
                     borderRadius: 6, cursor: "pointer",  textAlign: "left" }}>
                    + Image / Logo
                  </button>
                  <input ref={imgInputRef} type="file" accept="image/*" style={{ display: "none" }}
                   onChange={(e) => e.target.files[0] && addImage(e.target.files[0])} />
                </div>
              </div>

              <div>
                <label className="dark:text-white text-black" style={{ fontSize: 11, display: "block", marginBottom: 6 }}>
                  CANVAS SIZE
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 8 }}>
                  {CANVAS_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      className="dark:text-white text-sm text-black"
                      onClick={() => { setCanvasW(p.w); setCanvasH(p.h); }}
                      style={{
                        padding: "5px 4px",
                        background: "var(--color-background-secondary)",
                        border: canvasW === p.w && canvasH === p.h
                          ? "2px solid var(--color-text-primary)"
                          : "0.5px solid var(--color-border-tertiary)",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 11,
                        lineHeight: 1.4,
                      }}
                    >
                      <div>{p.label}</div>
                      <div style={{ color: "var(--color-text-secondary)", fontSize: 10 }}>{p.w}×{p.h}</div>
                    </button>
                  ))}
                </div>

                {/* Custom size inputs */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="number"
                    value={canvasW}
                    min={160}
                    max={600}
                    onChange={(e) => setCanvasW(Math.min(600, Math.max(160, +e.target.value)))}
                    style={{
                      width: 64, padding: "4px 6px", fontSize: 12,
                      borderRadius: 6, border: "0.5px solid var(--color-border-tertiary)",
                      background: "var(--color-background-primary)",
                      color: "var(--color-text-primary)",
                    }}
                  />
                  <span className="dark:text-white text-black" style={{ fontSize: 11 }}>×</span>
                  <input
                    type="number"
                    value={canvasH}
                    min={100}
                    max={600}
                    onChange={(e) => setCanvasH(Math.min(600, Math.max(100, +e.target.value)))}
                    style={{
                      width: 64, padding: "4px 6px", fontSize: 12,
                      borderRadius: 6, border: "0.5px solid var(--color-border-tertiary)",
                      background: "var(--color-background-primary)",
                      color: "var(--color-text-primary)",
                    }}
                  />
                  <span className="dark:text-white text-black" style={{ fontSize: 10 }}>px</span>
                </div>
              </div>

              <div>
                <label
               className="dark:text-white text-sm text-black"
                style={{  display: "block", marginBottom: 6 }}>LAYERS</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {[...elements].reverse().map((el) => (
                    <div className="dark:text-white text-sm text-black"  key={el.id} onClick={() => setSelectedId(el.id)} 
                    style={{ padding: "5px 8px", background: selectedId === el.id ? "var(--color-background-info)" : "var(--color-background-secondary)",
                     borderRadius: 5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", border: "0.5px solid var(--color-border-tertiary)" }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 130 }}>
                        {el.type === "text" ? "T " : el.type === "button" ? "⬜ " : el.type === "shape" ? "◆ " : "🖼 "}{el.content || el.type}
                      </span>
                      <span className="dark:text-white text-sm text-black"  onClick={(e) => { e.stopPropagation(); deleteEl(el.id); }}
                       style={{ cursor: "pointer", }}>✕</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ELEMENTS TAB — properties of selected */}
          {tab === "elements" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {!resolved ? (
                <p className="dark:text-white text-sm text-black"  style={{  textAlign: "center", marginTop: 20 }}>
                    Click an element on the canvas to edit it</p>
              ) : (
                <>
                  <div>
                    <label  className="dark:text-white text-sm text-black"  style={{  display: "block", marginBottom: 4 }}>CONTENT</label>
                    {(resolved.type === "text" || resolved.type === "button" || resolved.type === "badge") && (
                      <textarea value={resolved.content} onChange={(e) => updateEl(resolved.id, { content: e.target.value })} 
                      rows={3} style={{ width: "100%", fontSize: 12, borderRadius: 6, border: "0.5px solid var(--color-border-tertiary)", 
                        padding: "6px 8px", color: "var(--color-text-primary)", background: "var(--color-background-primary)", 
                        resize: "vertical", boxSizing: "border-box" }} />
                    )}
                  </div>

                  {resolved.type === "text" && (
                    <>
                      <div>
                        <label className="dark:text-white text-sm text-black"  style={{  display: "block", marginBottom: 4 }}>FONT</label>
                        <select value={resolved.fontFamily} onChange={(e) => updateEl(resolved.id, { fontFamily: e.target.value })} style={{ width: "100%", fontSize: 12, padding: "5px", borderRadius: 6, border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)" }}>
                          {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="dark:text-white text-sm text-black"  style={{  display: "block", marginBottom: 4 }}>SIZE: {resolved.fontSize}px</label>
                        <input type="range" min={10} max={60} value={resolved.fontSize} onChange={(e) => updateEl(resolved.id, { fontSize: +e.target.value })} style={{ width: "100%" }} />
                      </div>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={() => updateEl(resolved.id, { fontWeight: resolved.fontWeight === "bold" ? "normal" : "bold" })} style={{ flex: 1, padding: "5px", fontWeight: "bold", background: resolved.fontWeight === "bold" ? "var(--color-background-info)" : "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 5, cursor: "pointer", color: resolved.fontWeight === "bold" ? "var(--color-text-info)" : "var(--color-text-primary)", fontSize: 12 }}>B</button>
                        <button onClick={() => updateEl(resolved.id, { fontStyle: resolved.fontStyle === "italic" ? "normal" : "italic" })} style={{ flex: 1, padding: "5px", fontStyle: "italic", background: resolved.fontStyle === "italic" ? "var(--color-background-info)" : "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 5, cursor: "pointer", color: resolved.fontStyle === "italic" ? "var(--color-text-info)" : "var(--color-text-primary)", fontSize: 12 }}>I</button>
                        <button onClick={() => updateEl(resolved.id, { textDecoration: resolved.textDecoration === "underline" ? "none" : "underline" })} style={{ flex: 1, padding: "5px", textDecoration: "underline", background: resolved.textDecoration === "underline" ? "var(--color-background-info)" : "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 5, cursor: "pointer", color: resolved.textDecoration === "underline" ? "var(--color-text-info)" : "var(--color-text-primary)", fontSize: 12 }}>U</button>
                      </div>
                      <div>
                        <label   className="dark:text-white text-sm text-black"style={{  display: "block", marginBottom: 4 }}>ALIGN</label>
                        <div style={{ display: "flex", gap: 4 }}>
                          {["left", "center", "right"].map((a) => (
                            <button key={a} onClick={() => updateEl(resolved.id, { align: a })} style={{ flex: 1, padding: "5px", fontSize: 11,
                             background: resolved.align === a ? "var(--color-background-info)" : "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 5, cursor: "pointer", color: resolved.align === a ? "var(--color-text-info)" : "var(--color-text-primary)" }}>
                              {a === "left" ? "≡" : a === "center" ? "≡" : "≡"}
                              {a[0].toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <label   className="dark:text-white text-sm text-black" style={{  }}>COLOR</label>
                        <input type="color" value={resolved.color} onChange={(e) => updateEl(resolved.id,
                             { color: e.target.value })}
                              style={{ width: 32, height: 28, border: "none", cursor: "pointer", borderRadius: 4, padding: 0 }} />
                      </div>
                      <div>
                        <label
                         className="dark:text-white text-sm text-black"
                        style={{  display: "block", marginBottom: 4 }}>WIDTH: {resolved.width}px</label>
                        <input type="range" min={80} max={310} value={resolved.width} onChange={(e) => updateEl(resolved.id, { width: +e.target.value })} style={{ width: "100%" }} />
                      </div>
                    </>
                  )}

                  {(resolved.type === "button" || resolved.type === "badge") && (
                    <>
                      <div style={{ display: "flex", gap: 8 }}>
                        <div>
                          <label 
                           className="dark:text-white text-sm text-black"
                          style={{ display: "block", marginBottom: 4 }}>TEXT</label>
                          <input type="color" value={resolved.color} onChange={(e) => updateEl(resolved.id, { color: e.target.value })} style={{ width: 36, height: 28, border: "none", cursor: "pointer", borderRadius: 4, padding: 0 }} />
                        </div>
                        <div>
                          <label 
                           className="dark:text-white text-sm text-black"
                          style={{  display: "block", marginBottom: 4 }}>FILL</label>
                          <input type="color" value={resolved.bg?.startsWith("rgba") ? "#ffffff" : resolved.bg} onChange={(e) => updateEl(resolved.id, { bg: e.target.value })} style={{ width: 36, height: 28, border: "none", cursor: "pointer", borderRadius: 4, padding: 0 }} />
                        </div>
                      </div>
                      <div>
                        <label
                         className="dark:text-white text-sm text-black"
                        style={{  display: "block", marginBottom: 4 }}>CORNER RADIUS: {resolved.radius}px</label>
                        <input type="range" min={0} max={24} value={resolved.radius} onChange={(e) => updateEl(resolved.id, { radius: +e.target.value })} style={{ width: "100%" }} />
                      </div>
                      <div>
                        <label
                         className="dark:text-white text-sm text-black"
                        style={{  display: "block", marginBottom: 4 }}>WIDTH: {resolved.width}px</label>
                        <input type="range" min={60} max={300} value={resolved.width} onChange={(e) => updateEl(resolved.id, { width: +e.target.value })} style={{ width: "100%" }} />
                      </div>
                      <div>
                        <label 
                         className="dark:text-white text-sm text-black"
                        style={{  display: "block", marginBottom: 4 }}>HEIGHT: {resolved.height}px</label>
                        <input type="range" min={24} max={70} value={resolved.height} onChange={(e) => updateEl(resolved.id, { height: +e.target.value })} style={{ width: "100%" }} />
                      </div>
                      {resolved.type === "button" && (
                        <div>
                          <label
                           className="dark:text-white text-sm text-black"
                          style={{  display: "block", marginBottom: 4 }}>FONT SIZE: {resolved.fontSize}px</label>
                          <input type="range" min={10} max={22} value={resolved.fontSize} onChange={(e) => updateEl(resolved.id, { fontSize: +e.target.value })} style={{ width: "100%" }} />
                        </div>
                      )}
                      {resolved.type === "button" && (
                        <div>
                          <label
                           className="dark:text-white text-sm text-black"
                          style={{  display: "block", marginBottom: 4 }}>LINKS TO</label>
                          <select value={ctaTarget} onChange={(e) => setCtaTarget(+e.target.value)} style={{ width: "100%", fontSize: 12, padding: "5px", borderRadius: 6, border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)" }}>
                            <option value={resolved.id}>This button (configured in Link tab)</option>
                          </select>
                        </div>
                      )}
                    </>
                  )}

                  {resolved.type === "shape" && (
                    <>
                      <div>
                        <label 
                         className="dark:text-white text-sm text-black"
                        style={{  display: "block", marginBottom: 4 }}>FILL COLOR</label>
                        <input type="color" value={resolved.bg?.startsWith("rgba") ? "#ffffff" : resolved.bg} onChange={(e) => updateEl(resolved.id, { bg: e.target.value })} style={{ width: 36, height: 28, border: "none", cursor: "pointer", borderRadius: 4, padding: 0 }} />
                      </div>
                      <div>
                        <label 
                         className="dark:text-white text-sm text-black"
                        style={{  display: "block", marginBottom: 4 }}>SIZE: {resolved.size}px</label>
                        <input type="range" min={20} max={200} value={resolved.size} onChange={(e) => updateEl(resolved.id, { size: +e.target.value })} style={{ width: "100%" }} />
                      </div>
                      <div>
                        <label  className="dark:text-white text-sm text-black" style={{ 
                            
                            display: "block", marginBottom: 4 }}>OPACITY: {Math.round(resolved.opacity * 100)}%</label>
                        <input type="range" min={10} max={100} value={Math.round(resolved.opacity * 100)} onChange={(e) => updateEl(resolved.id, { opacity: +e.target.value / 100 })} style={{ width: "100%" }} />
                      </div>
                    </>
                  )}

                  {resolved.type === "image" && (
                    <>
                      <div>
                        <label
                         className="dark:text-white text-sm text-black"
                        style={{  display: "block", marginBottom: 4 }}>WIDTH: {resolved.width}px</label>
                        <input type="range" min={40} max={300} value={resolved.width} onChange={(e) => updateEl(resolved.id, { width: +e.target.value })} style={{ width: "100%" }} />
                      </div>
                      <div>
                        <label
                         className="dark:text-white text-sm text-black"
                        style={{  display: "block", marginBottom: 4 }}>HEIGHT: {resolved.height}px</label>
                        <input type="range" min={30} max={250} value={resolved.height} onChange={(e) => updateEl(resolved.id, { height: +e.target.value })} style={{ width: "100%" }} />
                      </div>
                    </>
                  )}

                  <button onClick={() => deleteEl(resolved.id)} style={{ padding: "7px", fontSize: 12,
                     background: "var(--color-background-danger)", color: "var(--color-text-danger)",
                      border: "0.5px solid var(--color-border-danger)", borderRadius: 6, cursor: "pointer" }}>
                    Delete element
                  </button>
                </>
              )}
            </div>
          )}

          {/* LINK TAB */}
          {tab === "link" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label className="dark:text-white text-sm text-black"  style={{  display: "block", marginBottom: 6 }}>ACTION TYPE</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {LINK_TYPES.map((lt) => (
                    <button className="dark:text-white text-sm text-black "  key={lt.id} onClick={() => setLinkType(lt.id)} style={{ padding: "8px 10px", 
                     background: linkType === lt.id ? "var(--color-background-info)" : "var(--color-background-secondary)",
                      border: linkType === lt.id ? "1px solid var(--color-border-info)" : "0.5px solid var(--color-border-tertiary)", borderRadius: 7,
                       cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 8 }}>
                      <span>{lt.icon}</span>
                      <span>{lt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="dark:text-white text-xs text-black " style={{  display: "block", marginBottom: 4 }}>
                  {linkType === "whatsapp" && "WhatsApp number (e.g. 254712345678)"}
                  {linkType === "website" && "Website URL (e.g. example.com)"}
                  {linkType === "phone" && "Phone number"}
                  {linkType === "maps" && "Location name or address"}
                  {linkType === "email" && "Email address"}
                </label>
                <input type="text" value={linkValue} onChange={(e) => setLinkValue(e.target.value)}
                className="dark:text-white text-sm text-black"
                 placeholder={linkType === "whatsapp" ? "254712345678" : linkType === "maps" ? "Westlands, Nairobi" : ""} 
                 style={{ width: "100%",  padding: "7px 10px", borderRadius: 6, border: "0.5px solid var(--color-border-tertiary)",
                  background: "var(--color-background-primary)",  boxSizing: "border-box" }} />
              </div>

              {linkValue && (
                <div  className="dark:text-white text-sm text-black" style={{ padding: "8px 10px", background: "var(--color-background-secondary)",
                 borderRadius: 6,  wordBreak: "break-all" }}>
                  <span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>Link: </span>{getLinkUrl()}
                </div>
              )}

              <div style={{ paddingTop: 8, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
                <label  className="dark:text-white text-sm text-black" style={{  display: "block", marginBottom: 6 }}>QUICK TEMPLATES</label>
                {[
                  { label: "WhatsApp promo", type: "whatsapp", value: "254712345678" },
                  { label: "Google Maps", type: "maps", value: "Westlands+Nairobi+Kenya" },
                  { label: "Business website", type: "website", value: "www.yourbusiness.co.ke" },
                ].map((t) => (
                  <button className="dark:text-white text-sm text-black " key={t.label} 
                  onClick={() => { setLinkType(t.type); setLinkValue(t.value); }}
                   style={{ display: "block", width: "100%", marginBottom: 4, padding: "6px 8px", 
                   background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", 
                   borderRadius: 5, cursor: "pointer",  textAlign: "left" }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Canvas area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", 
        padding: "16px 12px", background: "var(--color-background-tertiary)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
            {canvasW} × {canvasH}px
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            <button  className="dark:text-white text-sm text-black" onClick={() => setPreviewMode(!previewMode)} style={{ padding: "5px 12px", 
                 borderRadius: 6, border: "0.5px solid var(--color-border-tertiary)", 
                background: previewMode ? "var(--color-background-info)" : "var(--color-background-primary)", 
                cursor: "pointer" }}>
              {previewMode ? "✏️ Edit" : "👁 Preview"}
            </button>

            {/* <button className="dark:text-white text-sm text-black" onClick={() => onChange?.(getAdConfig())}
             style={{ padding: "5px 14px",  borderRadius: 6, border: "none",
              background: "#0ea5e9", color: "#fff", cursor: "pointer", fontWeight: 500 }}>
              Save Design
            </button> */}
          </div>
        </div>

        {/* The canvas */}
        <div
          ref={canvasRef}
          onClick={() => !previewMode && setSelectedId(null)}
          style={{ position: "relative", width: canvasW, height: canvasH, background: bg, borderRadius: 10,
             overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.18)", flexShrink: 0, cursor: "default" }}
        >
          {elements.map((el) => (
            <DraggableElement
              key={el.id}
              el={el}
              selected={!previewMode && selectedId === el.id}
              onSelect={previewMode ? () => {} : setSelectedId}
              onMove={moveEl}
              canvasRef={canvasRef}
            />
          ))}

          {/* Preview CTA overlay */}
          {previewMode && (
            <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.55)", borderRadius: 6,
             padding: "4px 8px", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 10, color: "#94a3b8" }}>Tap →</span>
              <span style={{ fontSize: 10, color: "#38bdf8" }}>{LINK_TYPES.find((l) => l.id === linkType)?.icon} 
                {LINK_TYPES.find((l) => l.id === linkType)?.label}</span>
            </div>
          )}
        </div>

        {/* Info bar */}
        <div style={{ marginTop: 10, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          {selected && !previewMode && (
            <div className="dark:text-white text-sm text-black" style={{  background: "var(--color-background-primary)", 
            padding: "3px 10px", borderRadius: 20, border: "0.5px solid var(--color-border-tertiary)" }}>
              x:{Math.round(selected.x)} y:{Math.round(selected.y)}
            </div>
          )}
          <div className="dark:text-white text-sm text-black" style={{  background: "var(--color-background-primary)", padding: "3px 10px", borderRadius: 20, border: "0.5px solid var(--color-border-tertiary)" }}>
            {elements.length} elements
          </div>
          <div className="dark:text-white text-sm text-black" style={{  background: "var(--color-background-primary)", padding: "3px 10px", borderRadius: 20, border: "0.5px solid var(--color-border-tertiary)" }}>
            {LINK_TYPES.find((l) => l.id === linkType)?.icon} {LINK_TYPES.find((l) => l.id === linkType)?.label}
          </div>
        </div>

        {/* Quick tip */}
        {!previewMode && !selectedId && (
          <p className="dark:text-white text-sm text-black" style={{  marginTop: 12, textAlign: "center" }}>
            Click any element on the canvas to select and edit it. Drag to reposition.
          </p>
        )}
      </div>
    </div>
  );
}