import React, { useState, useEffect, useRef } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

const MYTHS = [
  { id: 1, myth: "PKV ist nur für Reiche.", reality: "Stimmt so nicht. Angestellte brauchen ein Einkommen oberhalb der Jahresarbeitsentgeltgrenze, Selbstständige und Beamte können unabhängig davon in die PKV." },
  { id: 2, myth: "Im Alter wird PKV unbezahlbar.", reality: "Mit Altersrückstellungen und richtiger Tarifwahl bleibt die Prämie stabil. Das verschweigt der Markt." },
  { id: 3, myth: "Kinder in der PKV kosten extra.", reality: "Klingt schlimm, ist aber nur die halbe Wahrheit. Ja, in der PKV braucht jedes Kind einen eigenen Beitrag. In der GKV sind Kinder zwar oft kostenlos mitversichert, aber eben nicht immer. Sobald ein Elternteil privat versichert ist und mehr verdient als der gesetzlich versicherte Partner, entfällt die kostenlose Familienversicherung." },
  { id: 4, myth: "Zurück in die GKV ist einfach.", reality: "Ein Wechsel zurück ist möglich, aber an bestimmte Voraussetzungen geknüpft. Deshalb sollte die Entscheidung für die PKV gut geplant sein, insbesondere mit Blick auf Einkommen, Lebensplanung und Alter. Wer sich richtig aufstellt, trifft eine Entscheidung, die langfristig passt." },
];

const STATS = [
  { value: "11.3 Mio", label: "Privatversicherte in Deutschland" },
  { value: "73%", label: "unterschätzen Tarifunterschiede" },
  { value: "€ 847", label: "Ø monatliche Ersparnis vs. GKV möglich" },
  { value: "1 von 3", label: "wechselt in den falschen Tarif" },
];

const FAQS = [
  {
    q: "Wann lohnt sich PKV wirklich?",
    a: "Für Angestellte mit Einkommen über der Beitragsbemessungsgrenze, Beamte und Selbstständige fast immer. Entscheidend ist der Zeitpunkt: Je jünger, desto günstiger der Einstieg.",
  },
  {
    q: "Was passiert, wenn ich krank werde und nicht zahlen kann?",
    a: "Es gibt einen gesetzlich geregelten Notlagentarif. Niemand verliert in Deutschland seinen Versicherungsschutz. Dieser Mythos ist einer der gefährlichsten.",
  },
  {
    q: "Sind alle PKV-Tarife gleich gut?",
    a: "Nein. Die Unterschiede sind enorm: in Leistung, Stabilität und Beitragsentwicklung. Genau hier liegt das größte Risiko für Wechselwillige.",
  },
  {
    q: "Wie läuft eine Beratung bei Mythos PKV ab?",
    a: "Erst Aufklärung, dann Analyse, dann Empfehlung, niemals umgekehrt. Deine Situation steht im Mittelpunkt, nicht das Produkt.",
  },
];

function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.15, ...options });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Fade({ children, delay = 0, style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} style={{
      borderBottom: "1px solid #2a2a2a",
      padding: "1.6rem 0",
      cursor: "pointer",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "#f0ebe0", fontWeight: 600, lineHeight: 1.4 }}>{q}</span>
        <span style={{ color: "#b8933a", fontSize: "1.4rem", flexShrink: 0, transition: "transform 0.3s", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
      </div>
      <div style={{
        overflow: "hidden",
        maxHeight: open ? "300px" : "0",
        transition: "max-height 0.4s ease",
      }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#9a9080", fontSize: "0.95rem", lineHeight: 1.75, marginTop: "1rem", paddingRight: "2rem" }}>{a}</p>
      </div>
    </div>
  );
}

export default function MythosPKV() {
  const isMobile = useIsMobile();
  const [form, setForm] = useState({ vorname: "", nachname: "", telefon: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [showImpressum, setShowImpressum] = useState(false);
  const [showDatenschutz, setShowDatenschutz] = useState(false);
  const updateForm = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const [activeMythIdx, setActiveMythIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveMythIdx(i => (i + 1) % MYTHS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.vorname || !form.nachname) return;
    const params = new URLSearchParams();
    params.append("vorname", form.vorname);
    params.append("nachname", form.nachname);
    params.append("telefon", form.telefon);
    params.append("email", form.email);
    fetch("https://hooks.zapier.com/hooks/catch/2155057/ujvatnv/", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    setSubmitted(true);
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #0a0a0a; color: #f0ebe0; font-family: 'DM Sans', sans-serif; }
    ::selection { background: #b8933a; color: #0a0a0a; }
    input { outline: none; border: none; background: none; }
    button { cursor: pointer; border: none; background: none; }
    @keyframes pulse-border { 0%,100% { opacity:.6 } 50% { opacity:1 } }
    @keyframes slide-in { from { transform: translateX(30px); opacity:0 } to { transform: translateX(0); opacity:1 } }
    @keyframes grain {
      0%,100%{transform:translate(0,0)}
      10%{transform:translate(-2%,-2%)}
      30%{transform:translate(2%,-1%)}
      50%{transform:translate(-1%,2%)}
      70%{transform:translate(1%,-2%)}
      90%{transform:translate(-2%,1%)}
    }
    .grain::after {
      content:'';position:fixed;top:-50%;left:-50%;width:200%;height:200%;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      opacity:.07;pointer-events:none;z-index:999;animation:grain 8s steps(1) infinite;
    }
    .nav-link { color:#9a9080; text-decoration:none; font-size:.88rem; letter-spacing:.08em; text-transform:uppercase; transition:color .2s; }
    .nav-link:hover { color:#b8933a; }
    .myth-card { transition: opacity .4s, transform .4s; }
    .cta-btn { background: linear-gradient(135deg,#b8933a,#d4af60); color:#0a0a0a; font-family:'DM Sans',sans-serif; font-weight:500; font-size:.95rem; letter-spacing:.06em; text-transform:uppercase; padding:.9rem 2.4rem; border-radius:2px; transition: transform .2s, box-shadow .2s; }
    .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(184,147,58,.35); }
    .cta-btn-outline { border: 1px solid #b8933a; color:#b8933a; font-family:'DM Sans',sans-serif; font-weight:500; font-size:.9rem; letter-spacing:.06em; text-transform:uppercase; padding:.8rem 2rem; border-radius:2px; transition: background .2s, color .2s; }
    .cta-btn-outline:hover { background: #b8933a; color:#0a0a0a; }
    @media (max-width: 768px) {
      .nav-desktop { display: none !important; }
      .hero-section { min-height: auto !important; padding: 5rem 1.2rem 2.5rem !important; }
      .hero-buttons { flex-direction: column !important; }
      .hero-buttons button, .hero-buttons a { width: 100% !important; text-align: center !important; box-sizing: border-box; }
      .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 1.2rem !important; padding: 1.8rem 1.2rem !important; }
      .myths-grid { grid-template-columns: 1fr !important; }
      .nutzen-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
      .testimonials-grid { grid-template-columns: 1fr !important; }
      .cta-box { padding: 2.5rem 1.2rem !important; }
      .form-name-row { grid-template-columns: 1fr !important; }
      .footer-inner { flex-direction: column !important; text-align: center !important; gap: 1rem !important; }
      .modal-inner { padding: 1.5rem !important; margin: 1rem !important; max-height: 90vh !important; }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="grain" />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "1.4rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(to bottom,rgba(10,10,10,.95),transparent)", backdropFilter: "blur(12px)" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", fontWeight: 700, letterSpacing: ".04em", color: "#f0ebe0" }}>
          MYTHOS <span style={{ color: "#b8933a" }}>PKV</span>
        </div>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <button onClick={() => document.getElementById("mythen").scrollIntoView({behavior:"smooth"})} className="nav-link" style={{background:"none",border:"none",cursor:"pointer"}}>Mythen</button>
          <button onClick={() => document.getElementById("nutzen").scrollIntoView({behavior:"smooth"})} className="nav-link" style={{background:"none",border:"none",cursor:"pointer"}}>Nutzen</button>
          <button onClick={() => document.getElementById("faq").scrollIntoView({behavior:"smooth"})} className="nav-link" style={{background:"none",border:"none",cursor:"pointer"}}>FAQ</button>
          <button onClick={() => document.getElementById("kontakt").scrollIntoView({behavior:"smooth"})} className="cta-btn-outline" style={{padding:".55rem 1.4rem",fontSize:".82rem"}}>Gespräch anfragen</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: isMobile ? "auto" : "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: isMobile ? "5rem 1.2rem 2.5rem" : "8rem 2rem 5rem", maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
        {/* Background accent */}
        <div style={{ position: "absolute", top: "20%", right: "0", width: "40%", height: "60%", background: "radial-gradient(ellipse at right, rgba(184,147,58,.06), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "10%", left: "-5%", width: "1px", height: "80%", background: "linear-gradient(to bottom,transparent,#b8933a33,transparent)", animation: "pulse-border 3s ease infinite" }} />

        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#b8933a", marginBottom: "2rem", opacity: .9 }}>
          ⬡ PKV verstehen. Richtig entscheiden.
        </div>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(3rem, 7vw, 6.5rem)", fontWeight: 700, lineHeight: 1.02, color: "#f0ebe0", marginBottom: "1.8rem", maxWidth: "860px" }}>
          Was alle über<br />
          <span style={{ fontStyle: "italic", color: "#b8933a" }}>PKV glauben</span>
          <br />stimmt so nicht.
        </h1>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "#9a9080", maxWidth: "520px", lineHeight: 1.8, marginBottom: "2.8rem", fontWeight: 300 }}>
          Wir von Mythos PKV bringen Ordnung in das Thema, das die meisten falsch verstehen. Bevor sie eine Entscheidung treffen, die sie nicht mehr rückgängig machen können.
        </p>

        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "1rem" }}>
          <button onClick={() => document.getElementById("kontakt").scrollIntoView({behavior:"smooth"})} className="cta-btn">Kostenloses Gespräch</button>
          <button onClick={() => document.getElementById("mythen").scrollIntoView({behavior:"smooth"})} className="cta-btn-outline">Die Mythen ansehen</button>
        </div>

        {/* Rotating myth teaser */}
        <div style={{ marginTop: "4rem", borderLeft: "2px solid #b8933a33", paddingLeft: "1.5rem" }}>
          <div style={{ fontSize: ".75rem", letterSpacing: ".15em", textTransform: "uppercase", color: "#b8933a", marginBottom: ".6rem", opacity: .7 }}>Aktueller Mythos</div>
          <div key={activeMythIdx} className="myth-card" style={{ animation: "slide-in .4s ease" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem, 2.2vw, 1.3rem)", color: "#f0ebe0", fontStyle: "italic", marginBottom: ".4rem" }}>„{MYTHS[activeMythIdx].myth}"</p>
            <p style={{ fontSize: ".88rem", color: "#9a9080", fontWeight: 300 }}>{MYTHS[activeMythIdx].reality}</p>
          </div>
          <div style={{ display: "flex", gap: ".4rem", marginTop: "1rem" }}>
            {MYTHS.map((_, i) => (
              <div key={i} onClick={() => setActiveMythIdx(i)} style={{ width: "24px", height: "2px", background: i === activeMythIdx ? "#b8933a" : "#2a2a2a", cursor: "pointer", transition: "background .3s" }} />
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a", background: "#0d0d0d" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: isMobile ? "2rem 1.2rem" : "2.5rem 2rem", display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(180px, 1fr))", gap: isMobile ? "1.2rem" : "2rem" }}>
          {STATS.map((s, i) => (
            <Fade key={i} delay={i * 0.1}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 700, color: "#b8933a", marginBottom: ".3rem" }}>{s.value}</div>
                <div style={{ fontSize: ".8rem", color: "#5a5248", letterSpacing: ".06em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            </Fade>
          ))}
        </div>
      </div>

      {/* MYTHEN SECTION */}
      <section id="mythen" style={{ maxWidth: "1100px", margin: "0 auto", padding: isMobile ? "3rem 1.2rem" : "7rem 2rem" }}>
        <Fade>
          <div style={{ fontFamily: "'DM Sans'", fontSize: ".75rem", letterSpacing: ".18em", textTransform: "uppercase", color: "#b8933a", marginBottom: "1rem" }}>⬡ Die häufigsten Irrtümer</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 700, color: "#f0ebe0", maxWidth: "600px", lineHeight: 1.1, marginBottom: "4rem" }}>
            20 Jahre Halbwissen.<br /><span style={{ fontStyle: "italic", color: "#b8933a" }}>Entkräftet.</span>
          </h2>
        </Fade>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "1px", background: "#1a1a1a" }}>
          {MYTHS.map((m, i) => (
            <Fade key={m.id} delay={i * 0.08}>
              <div style={{ background: "#0a0a0a", padding: "2.5rem", position: "relative", overflow: "hidden", height: "100%", boxSizing: "border-box" }}>
                <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "4rem", fontWeight: 700, color: "#1a1a1a", lineHeight: 1 }}>0{m.id}</div>
                <div style={{ fontSize: ".72rem", letterSpacing: ".15em", textTransform: "uppercase", color: "#5a5248", marginBottom: "1rem" }}>Mythos</div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", color: "#9a9080", fontStyle: "italic", marginBottom: "1.2rem", textDecoration: "none" }}>
                  „{m.myth}"
                </p>
                <div style={{ width: "30px", height: "1px", background: "#b8933a", marginBottom: "1.2rem" }} />
                <p style={{ fontSize: ".9rem", color: "#c0b8a0", lineHeight: 1.7, fontWeight: 300 }}>{m.reality}</p>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* NUTZEN / BENEFITS */}
      <section id="nutzen" style={{ background: "#0d0d0d", borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: isMobile ? "3rem 1.2rem" : "7rem 2rem", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "2rem" : "5rem", alignItems: "start" }}>
          <Fade>
            <div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: ".75rem", letterSpacing: ".18em", textTransform: "uppercase", color: "#b8933a", marginBottom: "1rem" }}>⬡ Warum Mythos PKV</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 700, color: "#f0ebe0", lineHeight: 1.15, marginBottom: "1.8rem" }}>
                Kein Verkauf.<br />Erst <span style={{ fontStyle: "italic", color: "#b8933a" }}>Klarheit</span>.
              </h2>
              <p style={{ color: "#9a9080", lineHeight: 1.8, fontSize: ".95rem", fontWeight: 300, maxWidth: "420px" }}>
                Wir erklären zuerst, was du wirklich verstehen musst, ohne versteckte Agenda. Die meisten Beratungen beginnen mit dem Produkt. Wir beginnen mit Aufklärung.
              </p>
            </div>
          </Fade>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#1a1a1a" }}>
            {[
              { icon: "◈", label: "Mythen-Analyse", desc: "Wir zeigen dir, welche Glaubenssätze deiner Entscheidung im Weg stehen." },
              { icon: "◇", label: "Tarifvergleich ohne Druck", desc: "Deine Situation steht im Mittelpunkt, nicht das Produkt. Niemals umgekehrt." },
              { icon: "◆", label: "Zukunftssicherheit", desc: "Altersrückstellungen, Beitragsentwicklung: die Themen, die alle verschweigen." },
              { icon: "◉", label: "Rückkehrfalle vermeiden", desc: "Wechselwillige treffen oft unumkehrbare Entscheidungen. Wir verhindern das." },
            ].map((b, i) => (
              <Fade key={i} delay={i * 0.1}>
                <div style={{ background: "#0d0d0d", padding: "1.8rem 2rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                  <span style={{ color: "#b8933a", fontSize: "1.3rem", flexShrink: 0, marginTop: ".1rem" }}>{b.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "#f0ebe0", fontWeight: 600, marginBottom: ".4rem" }}>{b.label}</div>
                    <div style={{ fontSize: ".88rem", color: "#9a9080", lineHeight: 1.65, fontWeight: 300 }}>{b.desc}</div>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: isMobile ? "3rem 1.2rem" : "7rem 2rem" }}>
        <Fade>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ fontFamily: "'DM Sans'", fontSize: ".75rem", letterSpacing: ".18em", textTransform: "uppercase", color: "#b8933a", marginBottom: "1rem" }}>⬡ Stimmen aus der Community</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#f0ebe0" }}>
              Die Entscheidung, die sie fast <span style={{ fontStyle: "italic", color: "#b8933a" }}>bereut</span> hätten.
            </h2>
          </div>
        </Fade>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "1px", background: "#1a1a1a" }}>
          {[
            { name: "Markus T.", role: "Selbstständiger Architekt, 38", quote: "Ich dachte, PKV ist für mich zu riskant. Nach dem Gespräch mit Mythos PKV wusste ich, dass es genau das Gegenteil ist. Ich hätte 3 Jahre früher wechseln sollen." },
            { name: "Sarah K.", role: "Ärztin in Weiterbildung, 31", quote: "Endlich jemand, der mir erklärt hat, was Altersrückstellungen wirklich bedeuten. Ohne Druck. Ohne Produkt zuerst. Das hat mich überzeugt." },
            { name: "Felix R.", role: "IT-Unternehmer, 44", quote: "Der Rückkehrmythos hat mich jahrelang in der GKV gehalten. Mythos PKV hat diesen Irrtum in 20 Minuten aufgelöst." },
          ].map((t, i) => (
            <Fade key={i} delay={i * 0.12}>
              <div style={{ background: "#0a0a0a", padding: "2.5rem" }}>
                <div style={{ color: "#b8933a", fontSize: "2rem", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1, marginBottom: "1rem" }}>"</div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "#c0b8a0", lineHeight: 1.7, fontStyle: "italic", marginBottom: "1.5rem" }}>{t.quote}</p>
                <div style={{ width: "24px", height: "1px", background: "#b8933a", marginBottom: "1rem" }} />
                <div style={{ fontSize: ".85rem", color: "#f0ebe0", fontWeight: 500 }}>{t.name}</div>
                <div style={{ fontSize: ".78rem", color: "#5a5248", marginTop: ".2rem" }}>{t.role}</div>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ background: "#0d0d0d", borderTop: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto", padding: isMobile ? "3rem 1.2rem" : "7rem 2rem" }}>
          <Fade>
            <div style={{ fontFamily: "'DM Sans'", fontSize: ".75rem", letterSpacing: ".18em", textTransform: "uppercase", color: "#b8933a", marginBottom: "1rem" }}>⬡ Häufige Fragen</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#f0ebe0", marginBottom: "3rem", lineHeight: 1.15 }}>
              Die Fragen, die sich<br /><span style={{ fontStyle: "italic", color: "#b8933a" }}>fast niemand traut</span> zu stellen.
            </h2>
          </Fade>
          {FAQS.map((f, i) => (
            <Fade key={i} delay={i * 0.07}>
              <FAQItem q={f.q} a={f.a} />
            </Fade>
          ))}
        </div>
      </section>

      {/* CTA / LEAD GEN */}
      <section id="kontakt" style={{ maxWidth: "1100px", margin: "0 auto", padding: isMobile ? "3rem 1.2rem" : "7rem 2rem" }}>
        <div style={{ position: "relative", background: "#0d0d0d", border: "1px solid #1a1a1a", padding: isMobile ? "2.5rem 1.2rem" : "5rem 4rem", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "50%", height: "100%", background: "radial-gradient(ellipse at right top, rgba(184,147,58,.07), transparent 60%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "2rem", left: "2rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "10rem", fontWeight: 700, color: "#111", lineHeight: 1, userSelect: "none" }}>?</div>

          <Fade>
            <div style={{ position: "relative", maxWidth: "560px" }}>
              <div style={{ fontFamily: "'DM Sans'", fontSize: ".75rem", letterSpacing: ".18em", textTransform: "uppercase", color: "#b8933a", marginBottom: "1rem" }}>⬡ Kostenloses Erstgespräch</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 700, color: "#f0ebe0", lineHeight: 1.15, marginBottom: "1.2rem" }}>
                Bereit für die<br /><span style={{ fontStyle: "italic", color: "#b8933a" }}>unbequeme Wahrheit</span>?
              </h2>
              <p style={{ color: "#9a9080", lineHeight: 1.8, fontSize: ".95rem", fontWeight: 300, marginBottom: "2.5rem" }}>
                30 Minuten. Kein Verkaufsgespräch. Nur Klarheit darüber, ob PKV für dich wirklich passt, oder nicht.
              </p>

              {submitted ? (
                <div style={{ border: "1px solid #b8933a33", padding: "1.5rem 2rem", background: "#0a0a0a" }}>
                  <div style={{ color: "#b8933a", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", marginBottom: ".4rem" }}>✓ Anfrage eingegangen.</div>
                  <div style={{ color: "#9a9080", fontSize: ".88rem" }}>Wir melden uns innerhalb von 24 Stunden, ohne Druck.</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1px", maxWidth: "480px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px" }}>
                    <input
                      type="text"
                      placeholder="Vorname"
                      value={form.vorname}
                      onChange={updateForm("vorname")}
                      required
                      style={{ padding: ".9rem 1.2rem", background: "#0a0a0a", border: "1px solid #2a2a2a", borderBottom: "none", color: "#f0ebe0", fontFamily: "'DM Sans', sans-serif", fontSize: ".9rem", borderRadius: "2px 0 0 0" }}
                    />
                    <input
                      type="text"
                      placeholder="Nachname"
                      value={form.nachname}
                      onChange={updateForm("nachname")}
                      required
                      style={{ padding: ".9rem 1.2rem", background: "#0a0a0a", border: "1px solid #2a2a2a", borderLeft: "none", borderBottom: "none", color: "#f0ebe0", fontFamily: "'DM Sans', sans-serif", fontSize: ".9rem", borderRadius: "0 2px 0 0" }}
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Telefonnummer"
                    value={form.telefon}
                    onChange={updateForm("telefon")}
                    style={{ padding: ".9rem 1.2rem", background: "#0a0a0a", border: "1px solid #2a2a2a", borderBottom: "none", color: "#f0ebe0", fontFamily: "'DM Sans', sans-serif", fontSize: ".9rem", borderRadius: "0" }}
                  />
                  <div style={{ display: "flex", gap: "0" }}>
                    <input
                      type="email"
                      placeholder="E-Mail-Adresse"
                      value={form.email}
                      onChange={updateForm("email")}
                      required
                      style={{ flex: 1, padding: ".9rem 1.2rem", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRight: "none", color: "#f0ebe0", fontFamily: "'DM Sans', sans-serif", fontSize: ".9rem", borderRadius: "0 0 0 2px" }}
                    />
                    <button type="submit" className="cta-btn" style={{ borderRadius: "0 0 2px 0", whiteSpace: "nowrap" }}>
                      Gespräch anfragen
                    </button>
                  </div>
                </form>
              )}

              <p style={{ fontSize: ".75rem", color: "#3a3530", marginTop: "1rem" }}>Kein Newsletter. Kein Spam. Nur ein Gespräch, wenn du willst.</p>
            </div>
          </Fade>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #1a1a1a", background: "#080808" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: isMobile ? "1.5rem 1.2rem" : "3rem 2rem", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", textAlign: isMobile ? "center" : "left" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 700, color: "#f0ebe0" }}>
            MYTHOS <span style={{ color: "#b8933a" }}>PKV</span>
          </div>
          <div style={{ display: isMobile ? "none" : "flex", gap: "2rem", flexWrap: "wrap" }}>
            <button onClick={() => setShowImpressum(true)} className="nav-link" style={{ background: "none", border: "none", cursor: "pointer" }}>Impressum</button>
            <button onClick={() => setShowDatenschutz(true)} className="nav-link" style={{ background: "none", border: "none", cursor: "pointer" }}>Datenschutz</button>
          </div>
          <div style={{ fontSize: ".78rem", color: "#3a3530" }}>© 2026 Mythos PKV · Alle Rechte vorbehalten</div>
        </div>
      </footer>

      {/* IMPRESSUM MODAL */}
      {showImpressum && (
        <div onClick={() => setShowImpressum(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", backdropFilter: "blur(8px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#0d0d0d", border: "1px solid #2a2a2a", maxWidth: "700px", width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "3rem", position: "relative", borderRadius: "2px" }}>
            <button onClick={() => setShowImpressum(false)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", color: "#9a9080", fontSize: "1.5rem", cursor: "pointer", lineHeight: 1 }}>✕</button>

            <div style={{ fontFamily: "'DM Sans'", fontSize: ".72rem", letterSpacing: ".18em", textTransform: "uppercase", color: "#b8933a", marginBottom: ".8rem" }}>⬡ Rechtliches</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 700, color: "#f0ebe0", marginBottom: "2rem" }}>Impressum</h2>

            <div style={{ borderBottom: "1px solid #1a1a1a", marginBottom: "1.5rem", paddingBottom: "1.5rem" }}>
              <p style={{ fontSize: ".8rem", color: "#9a9080", marginBottom: ".8rem", lineHeight: 1.7 }}>Mythos PKV ist eine Marke der SalesHub Financial Commerce GmbH</p>
              <p style={{ fontSize: ".75rem", color: "#b8933a", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".6rem" }}>Anbieterkennzeichnung nach § 5 TMG und § 18 Abs. 2 MStV</p>
            </div>

            {[
              { label: "Unternehmen", lines: ["SalesHub Financial Commerce GmbH", "Planegger Straße 9a, 81241 München"] },
              { label: "Kontakt", lines: ["Telefon: 089 / 4522 5696", "E-Mail: inbox@saleshub.finance", "Web: https://saleshub.finance"] },
              { label: "Handelsregister", lines: ["Sitz der Gesellschaft", "Amtsgericht München HRB 287769"] },
              { label: "Geschäftsführung", lines: ["Marcus Börner"] },
              { label: "Steuer", lines: ["USt-IdNr: ist beantragt", "StNr: ist beantragt", "Finanzamt München"] },
              { label: "Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)", lines: ["Marcus Börner"] },
            ].map(({ label, lines }) => (
              <div key={label} style={{ marginBottom: "1.4rem" }}>
                <div style={{ fontSize: ".72rem", color: "#5a5248", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".4rem" }}>{label}</div>
                {lines.map((l, i) => <p key={i} style={{ fontSize: ".88rem", color: "#c0b8a0", lineHeight: 1.7 }}>{l}</p>)}
              </div>
            ))}

            <div style={{ borderTop: "1px solid #1a1a1a", marginTop: "1.5rem", paddingTop: "1.5rem" }}>
              <div style={{ fontSize: ".72rem", color: "#5a5248", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".6rem" }}>Haftungshinweis</div>
              <p style={{ fontSize: ".82rem", color: "#9a9080", lineHeight: 1.75 }}>Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich. Des Weiteren übernehmen wir keine Haftung für die Erreichbarkeit von internen und externen verlinkten Seiten. Wir haften daher nicht für konkrete, mittelbare und unmittelbare Schäden oder Schäden, die durch fehlende Nutzungsmöglichkeiten, Datenverluste oder entgangene Gewinne entstehen können, die im Zusammenhang mit der Nutzung der Online-Informationsseiten entstehen.</p>
            </div>

            <div style={{ borderTop: "1px solid #1a1a1a", marginTop: "1.5rem", paddingTop: "1.5rem" }}>
              <div style={{ fontSize: ".72rem", color: "#5a5248", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".6rem" }}>Google Analytics</div>
              <p style={{ fontSize: ".82rem", color: "#9a9080", lineHeight: 1.75 }}>Diese Website benutzt Google Analytics, einen Webanalysedienst der Google Inc. (Google). Google Analytics verwendet sog. "Cookies", Textdateien, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie ermöglicht. Die durch den Cookie erzeugten Informationen über Ihre Benutzung dieser Website (einschließlich Ihrer IP-Adresse) wird an einen Server von Google in den USA übertragen und dort gespeichert. Google wird diese Informationen benutzen um Ihre Nutzung der Website auszuwerten, um Reports über die Websiteaktivitäten für die Websitebetreiber zusammenzustellen und um weitere mit der Websitenutzung und der Internetnutzung verbundene Dienstleistungen zu erbringen. Auch wird Google diese Informationen gegebenenfalls an Dritte übertragen, sofern dies gesetzlich vorgeschrieben oder soweit Dritte diese Daten im Auftrag von Google verarbeiten. Google wird in keinem Fall Ihre IP-Adresse mit anderen Daten von Google in Verbindung bringen. Sie können die Installation der Cookies durch eine entsprechende Einstellung Ihrer Browser Software verhindern; wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser Website voll umfänglich nutzen können. Durch die Nutzung dieser Website erklären Sie sich mit der Bearbeitung der über Sie erhobenen Daten durch Google in der zuvor beschriebenen Art und Weise und zu dem zuvor benannten Zweck einverstanden.</p>
            </div>

            <button onClick={() => setShowImpressum(false)} className="cta-btn-outline" style={{ marginTop: "2rem", display: "inline-block" }}>Schließen</button>
          </div>
        </div>
      )}
      {/* DATENSCHUTZ MODAL */}
      {showDatenschutz && (
        <div onClick={() => setShowDatenschutz(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", backdropFilter: "blur(8px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#0d0d0d", border: "1px solid #2a2a2a", maxWidth: "700px", width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "3rem", position: "relative", borderRadius: "2px" }}>
            <button onClick={() => setShowDatenschutz(false)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", color: "#9a9080", fontSize: "1.5rem", cursor: "pointer", lineHeight: 1 }}>x</button>

            <div style={{ fontFamily: "'DM Sans'", fontSize: ".72rem", letterSpacing: ".18em", textTransform: "uppercase", color: "#b8933a", marginBottom: ".8rem" }}>o Rechtliches</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 700, color: "#f0ebe0", marginBottom: ".6rem" }}>Datenschutz&shy;erklaerung</h2>
            <p style={{ fontSize: ".78rem", color: "#5a5248", marginBottom: "2rem" }}>Diese Datenschutzerklaerung gilt fuer alle von der SalesHub Financial Commerce GmbH betriebenen Websites.</p>

            {[
              {
                title: "Verantwortlicher",
                text: "SalesHub Financial Commerce GmbH\nPlanegger Strasse 9a, 81241 Muenchen\nTelefon: 089 / 4522 5696\nE-Mail: inbox@saleshub.finance\nWeb: https://saleshub.finance\n\nStand: 29.11.2023"
              },
              {
                title: "Arten der verarbeiteten Daten",
                text: "Bestandsdaten, Kontaktdaten, Inhaltsdaten, Vertragsdaten, Nutzungsdaten sowie Meta- und Kommunikationsdaten."
              },
              {
                title: "Zwecke der Verarbeitung",
                text: "Erbringung vertraglicher Leistungen und Kundenservice, Kontaktanfragen und Kommunikation, Sicherheitsmassnahmen, Direktmarketing, Reichweitenmessung, Buero- und Organisationsverfahren, Konversionsmessung, Verwaltung und Beantwortung von Anfragen, Servermonitoring und Fehlererkennung, Firewall, Feedback, Marketing, Profile mit nutzerbezogenen Informationen sowie Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit."
              },
              {
                title: "Massgebliche Rechtsgrundlagen",
                text: "Einwilligung (Art. 6 Abs. 1 S. 1 lit. a. DSGVO), Vertragserfuellung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b. DSGVO), Rechtliche Verpflichtung (Art. 6 Abs. 1 S. 1 lit. c. DSGVO) sowie Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f. DSGVO). Zusaetzlich gelten nationale Regelungen, insbesondere das Bundesdatenschutzgesetz (BDSG)."
              },
              {
                title: "Sicherheitsmassnahmen",
                text: "Wir treffen nach Massgabe der gesetzlichen Vorgaben geeignete technische und organisatorische Massnahmen, um ein dem Risiko angemessenes Schutzniveau zu gewaehrleisten. Dazu gehoeren SSL-Verschluesselung (https) sowie IP-Masking zur Pseudonymisierung von IP-Adressen."
              },
              {
                title: "Uebermittlung personenbezogener Daten",
                text: "Daten werden nur im Rahmen gesetzlicher Vorgaben an Dritte weitergegeben, z.B. an IT-Dienstleister oder Anbieter eingebundener Dienste. Bei Drittlandtransfers erfolgt dies nur bei anerkanntem Datenschutzniveau oder auf Basis von EU-Standardschutzklauseln (Art. 44-49 DSGVO)."
              },
              {
                title: "Loesch- und Speicherfristen",
                text: "Verarbeitete Daten werden geloescht, sobald deren Zweck entfaellt und keine gesetzlichen Aufbewahrungspflichten bestehen. Vertragsdaten werden grundsaetzlich nach 4 Jahren geloescht, steuerrelevante Daten nach 10 Jahren."
              },
              {
                title: "Cookies",
                text: "Wir setzen Cookies im Einklang mit den gesetzlichen Vorschriften ein und holen, wo erforderlich, vorherige Einwilligungen ein. Temporaere Cookies werden nach Sitzungsende geloescht, permanente Cookies koennen bis zu zwei Jahre gespeichert werden. Nutzer koennen Einwilligungen jederzeit widerrufen und Cookies ueber die Browsereinstellungen ablehnen."
              },
              {
                title: "Geschaeftliche Leistungen",
                text: "Daten von Vertragspartnern werden zur Erfuellung vertraglicher Pflichten, zur Verwaltung sowie auf Basis berechtigter Interessen verarbeitet. Dazu gehoeren Bestandsdaten, Kontaktdaten, Zahlungsdaten und Vertragsdaten."
              },
              {
                title: "Webhosting und Logfiles",
                text: "Zur Bereitstellung unseres Onlineangebots nutzen wir Webhosting-Dienste. Serverlogfiles werden maximal 30 Tage gespeichert. Rechtsgrundlage ist Art. 6 Abs. 1 S. 1 lit. f. DSGVO (Berechtigte Interessen)."
              },
              {
                title: "Kontakt- und Anfragenverwaltung",
                text: "Bei Kontaktaufnahme (z.B. per Formular, E-Mail oder Telefon) werden die Angaben zur Bearbeitung und Beantwortung der Anfrage verarbeitet. Rechtsgrundlagen: Art. 6 Abs. 1 S. 1 lit. b. und f. DSGVO."
              },
              {
                title: "Newsletter",
                text: "Newsletter werden nur mit Einwilligung der Empfaenger versandt (Double-Opt-In). Abmeldung ist jederzeit moeglich. Versanddienstleister: Sendinblue GmbH, Berlin. Die Oeffnungs- und Klickraten werden zur Optimierung ausgewertet."
              },
              {
                title: "Webanalyse und Tracking",
                text: "Wir nutzen Google Analytics und Google Tag Manager zur Reichweitenmessung. IP-Adressen werden dabei pseudonymisiert (IP-Masking). Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 S. 1 lit. a. DSGVO). Opt-Out moeglich unter: https://tools.google.com/dlpage/gaoptout"
              },
              {
                title: "Social Media",
                text: "Wir unterhalten Praesenzseiten bei Facebook, Instagram, LinkedIn, Twitter und Xing. Beim Besuch dieser Seiten koennen Daten der Nutzer durch die jeweiligen Plattformen verarbeitet werden, auch ausserhalb der EU. Weitere Informationen finden Sie in den Datenschutzerklaerungen der jeweiligen Anbieter."
              },
              {
                title: "Plugins und eingebettete Inhalte",
                text: "Wir binden Dienste von Google Fonts, Google Maps, Facebook, LinkedIn, YouTube, Spotify und Xing ein. Beim Laden dieser Inhalte wird Ihre IP-Adresse an die jeweiligen Anbieter uebertragen. Rechtsgrundlage ist Art. 6 Abs. 1 S. 1 lit. a. oder f. DSGVO."
              },
              {
                title: "Ihre Rechte als betroffene Person",
                text: "Sie haben nach DSGVO folgende Rechte: Widerspruchsrecht, Widerrufsrecht, Auskunftsrecht, Recht auf Berichtigung, Recht auf Loesch ung und Einschraenkung der Verarbeitung, Recht auf Datenuebertragbarkeit sowie das Beschwerderecht bei einer Aufsichtsbehoerde (Art. 15-21 DSGVO)."
              },
              {
                title: "Aenderung dieser Erklaerung",
                text: "Wir passen diese Datenschutzerklaerung an, sobald aenderungen der von uns durchgefuehrten Datenverarbeitungen dies erfordern. Wir informieren Sie, sofern eine Mitwirkungshandlung Ihrerseits erforderlich wird."
              },
            ].map(({ title, text }) => (
              <div key={title} style={{ borderBottom: "1px solid #1a1a1a", paddingBottom: "1.2rem", marginBottom: "1.2rem" }}>
                <div style={{ fontSize: ".72rem", color: "#b8933a", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".4rem" }}>{title}</div>
                <p style={{ fontSize: ".83rem", color: "#9a9080", lineHeight: 1.75, whiteSpace: "pre-line" }}>{text}</p>
              </div>
            ))}

            <button onClick={() => setShowDatenschutz(false)} className="cta-btn-outline" style={{ marginTop: "1rem", display: "inline-block" }}>Schliessen</button>
          </div>
        </div>
      )}
    </>
  );
}

