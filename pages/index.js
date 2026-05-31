import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  purple:"#7C3AED",purpleLight:"#EDE9FE",purpleDark:"#4C1D95",
  pink:"#DB2777",pinkLight:"#FCE7F3",
  grad:"linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)",
  gradSoft:"linear-gradient(135deg, #EDE9FE 0%, #FCE7F3 100%)",
  warn:"#D97706",warnLight:"#FEF3C7",
  danger:"#DC2626",dangerLight:"#FEE2E2",
  success:"#059669",successLight:"#D1FAE5",
  text:"#1a1a1a",textSub:"#6b7280",
  bg:"#ffffff",bg2:"#f9fafb",
  border:"#e5e7eb",
};

function fmt(s){return`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;}

const FICHES = {
  p1: [
    { id:"C1", label:"Pertinence et diversité des productions", color:"#7C3AED", bg:"#EDE9FE",
      quoi:"Le jury vérifie que tu as réalisé des productions variées (print, digital, vidéo…), efficaces et pertinentes par rapport aux objectifs.",
      comment:["Nomme chaque production : support, commanditaire, objectif","Montre la diversité : au moins 2-3 types de supports différents","Parle d'efficacité : est-ce que ça a atteint son but ? Comment tu le sais ?","Évite de lister sans expliquer — chaque prod doit être justifiée"],
      pieges:["Parler de technique sans parler d'impact","Confondre quantité et diversité","Oublier de citer le commanditaire"],
      exemple:"Pour la campagne de recrutement de [entreprise], j'ai réalisé une affiche A3 et un post Instagram. L'objectif était d'attirer des candidats juniors. On a reçu 40 candidatures en 2 semaines, ce qui était au-delà de l'objectif fixé."
    },
    { id:"C2", label:"Expliciter contextes et enjeux", color:"#2563EB", bg:"#DBEAFE",
      quoi:"Le jury vérifie que tu comprends le contexte dans lequel tu as travaillé : qui est le commanditaire, quelle est la cible, quels sont les enjeux.",
      comment:["Structure : Qui ? → Pour qui ? → Pourquoi ? → Quoi ?","Montre que tu as analysé la situation avant d'agir","Parle des contraintes réelles : budget, délai, charte graphique"],
      pieges:["Décrire l'entreprise en long sans parler du projet","Oublier la cible ou la décrire vaguement","Confondre le brief et le contexte"],
      exemple:"Le commanditaire était une association culturelle locale. La cible : les 18-30 ans. L'enjeu était de rajeunir l'image. Le brief demandait une campagne digitale sur 1 mois avec un budget de 0€."
    },
    { id:"C3", label:"Justifier les choix créatifs", color:"#DB2777", bg:"#FCE7F3",
      quoi:"Le jury vérifie que tes choix créatifs sont réfléchis et argumentés, pas juste esthétiques.",
      comment:["Pour chaque choix, réponds : pourquoi ce choix plutôt qu'un autre ?","Relie tes choix à la cible, à l'identité de la marque, au message","Mentionne les pistes abandonnées et pourquoi","Appuie-toi sur des références concrètes"],
      pieges:["Dire 'j'ai choisi ce bleu parce que je le trouvais joli'","Ne pas mentionner les contraintes","Oublier les allers-retours avec le commanditaire"],
      exemple:"J'ai opté pour un ton décalé car la cible 18-30 ans est sensible à l'authenticité. J'avais d'abord envisagé un style institutionnel, mais les retours m'ont orienté vers quelque chose de plus proche des codes Instagram."
    },
    { id:"C4", label:"Expliciter le parcours professionnel", color:"#059669", bg:"#D1FAE5",
      quoi:"Le jury vérifie que tu as une vision claire de ton évolution : ce que tu as appris, comment tu as progressé.",
      comment:["Identifie 2-3 moments charnières de ta progression","Montre la complémentarité formation / entreprise","Parle des difficultés surmontées","Projette-toi : en quoi ce parcours construit ton profil ?"],
      pieges:["Réciter un CV chronologique sans analyse","Ne parler que de l'entreprise","Manquer de recul sur ta propre évolution"],
      exemple:"Au début je ne savais pas utiliser InDesign. En entreprise, on m'a confié la mise en page du magazine interne. Cette contrainte m'a obligé à progresser vite. Aujourd'hui c'est l'outil que je maîtrise le mieux."
    },
    { id:"C5", label:"Regard réflexif et transfert", color:"#D97706", bg:"#FEF3C7",
      quoi:"Le jury vérifie ta capacité à prendre du recul sur ton propre travail.",
      comment:["Sois honnête : cite une vraie compétence à développer","Montre que tu évalues ton travail avec des critères précis","Explique comment une compétence est transférable","Évite les formules vagues du type 'j'ai beaucoup appris'"],
      pieges:["Être trop autocritique ou trop autosatisfait","Citer des compétences sans les illustrer","Confondre 'ce que j'ai fait' et 'ce que j'ai appris'"],
      exemple:"Je maîtrise bien la conception visuelle, mais je dois encore progresser sur la prise de brief : j'ai tendance à démarrer trop vite. Je l'ai réalisé quand j'ai dû tout refaire après une réunion de validation."
    },
  ],
  p2: [
    { id:"C1", label:"Veille créative et technologique", color:"#7C3AED", bg:"#EDE9FE",
      quoi:"Le jury vérifie que tu as mis en place une vraie veille, que tu sais la restituer et qu'elle a réellement influencé tes choix.",
      comment:["Cite tes sources concrètes : Pinterest, Behance, newsletters…","Explique comment tu as organisé ta veille","Montre le lien entre veille et décision créative","Distingue veille créative et veille technologique"],
      pieges:["Lister des sources sans dire ce qu'on en a fait","Faire une veille 'pour cocher la case'","Confondre veille concurrentielle et veille créative"],
      exemple:"Pour ce projet, j'ai réalisé une veille hebdomadaire sur Behance. J'ai repéré une tendance sur les visuels minimalistes. J'ai décidé d'appliquer ce principe à nos stories Instagram, ce qui a amélioré le taux d'engagement de 30%."
    },
    { id:"C2", label:"Création de contenus et supports", color:"#2563EB", bg:"#DBEAFE",
      quoi:"Le jury vérifie ta maîtrise technique et créative : organisation, cohérence, rigueur, enjeux juridiques.",
      comment:["Décris ton organisation de travail : planning, outils, méthode","Justifie tes choix rédactionnels ET iconographiques","Mentionne les contraintes juridiques (droits d'auteur, RGPD)","Montre la cohérence de l'ensemble"],
      pieges:["Oublier les aspects juridiques","Parler de créativité sans parler de méthode","Ne pas mentionner les allers-retours"],
      exemple:"J'ai utilisé Canva Pro pour les réseaux et InDesign pour le print. Toutes les images sont libres de droits. J'ai vérifié le respect de la charte à chaque étape avec une grille de contrôle."
    },
    { id:"C3", label:"Production et diffusion", color:"#DB2777", bg:"#FCE7F3",
      quoi:"Le jury vérifie ta rigueur dans la production finale : contraintes techniques, planning, budget, logique éditoriale.",
      comment:["Parle des contraintes techniques réelles : formats, résolutions","Décris ta logique éditoriale pour les contenus digitaux","Montre que tu as respecté planning et budget","Mentionne les contraintes environnementales si pertinent"],
      pieges:["Oublier de parler des fichiers de livraison","Ne pas mentionner le budget","Confondre création et diffusion"],
      exemple:"J'ai livré les visuels print en PDF/X-4 CMJN, et les visuels web en PNG 72dpi. La diffusion suivait un calendrier éditorial sur 4 semaines avec 3 posts par semaine, planifiés sur Later."
    },
    { id:"C4", label:"Achat de prestations", color:"#059669", bg:"#D1FAE5",
      quoi:"Le jury vérifie que tu maîtrises le processus d'achat professionnel : cahier des charges, sélection, suivi, réception.",
      comment:["Décris le processus complet : brief → devis → sélection → suivi","Explique tes critères de sélection (pas que le prix !)","Montre que tu as formalisé ta demande","Parle du suivi et de la vérification de conformité"],
      pieges:["Sélectionner uniquement sur le prix","Oublier les documents contractuels","Ne pas avoir de prestataire à présenter"],
      exemple:"Pour la vidéo, j'ai rédigé un cahier des charges de 3 pages. J'ai comparé 3 devis. J'ai choisi un vidéaste indépendant et signé un bon de commande. J'ai organisé deux points d'étape avant la livraison."
    },
    { id:"C5", label:"Contrôle et évaluation des solutions", color:"#D97706", bg:"#FEF3C7",
      quoi:"Le jury vérifie que tu as évalué l'efficacité de tes actions avec des indicateurs pertinents.",
      comment:["Cite des indicateurs précis et alignés sur les objectifs","Distingue résultats quantitatifs et qualitatifs","Montre ce que tu as ajusté en cours de route","Conclus sur ce que tu ferais différemment"],
      pieges:["N'avoir aucun indicateur d'évaluation","Confondre indicateur de moyen et de résultat","Présenter de bons résultats sans analyse critique"],
      exemple:"L'objectif était d'augmenter les inscriptions newsletter de 20%. On a atteint +34% en 6 semaines. J'ai vu que les posts minimalistes généraient 2x plus de clics et j'ai ajusté la ligne éditoriale dès la 3ème semaine."
    },
  ]
};

const SYSTEM_P0 = `Tu es un jury bienveillant de BTS Communication pour l'épreuve orale E6 Bloc 2.
Le candidat vient de faire sa présentation personnelle de 5 minutes.
Ce monologue doit couvrir : qui il est, pourquoi le BTS Com, son projet après le BTS, si le BTS a modifié son projet, son poste et ses missions.
Donne un feedback oral naturel et bienveillant en 5-6 phrases. Ne montre pas la grille.`;

const makeSystemP1 = (ciblé=null, sévère=false) => `Tu es un jury de BTS Communication — Partie 1 : Parcours de professionnalisation (15 min).
${ciblé ? `MODE CIBLÉ : concentre-toi UNIQUEMENT sur "${ciblé}". Pose 4-5 questions approfondies.` : `Critères : C1 Productions, C2 Contextes, C3 Choix créatifs, C4 Parcours, C5 Regard réflexif.`}
${sévère ? `MODE SÉVÈRE : Ne te satisfais jamais d'une réponse vague. Relance systématiquement : "Soyez plus précis", "Donnez un exemple concret", "Qu'est-ce qui vous permet de dire ça ?". Tu attends des faits, des chiffres, des noms de projets.` : ""}
Pose UNE question à la fois. Le candidat choisit librement quel projet illustre sa réponse. Si annexe mentionnée, demande de la présenter oralement. Ne montre jamais la grille. Commence directement par ta première question.
Sur "BILAN" : évalue par critère (Très insatisfaisant/Insatisfaisant/Satisfaisant/Très satisfaisant) avec justification basée sur les vraies réponses.`;

const makeSystemP2 = (ciblé=null, sévère=false) => `Tu es un jury de BTS Communication — Partie 2 : Dossier projets (20 min).
${ciblé ? `MODE CIBLÉ : concentre-toi UNIQUEMENT sur "${ciblé}". Pose 4-5 questions approfondies.` : `Compétences : C1 Veille, C2 Création, C3 Production/diffusion, C4 Achats, C5 Évaluation.`}
${sévère ? `MODE SÉVÈRE : Relance systématiquement sur chaque réponse vague. Demande des preuves concrètes, des chiffres, des documents.` : ""}
Pose UNE question à la fois. Si annexe mentionnée, demande : "Pouvez-vous me présenter cette annexe ?". Ne montre jamais la grille. Commence directement.
Sur "BILAN" : évalue par compétence avec niveau et justification basée sur les vraies réponses.`;

const PHASES = [
  { id:"p0", label:"Présentation personnelle", duration:5*60, icon:"🎤", intro:"Chrono lancé. Présente-toi pendant 5 minutes sans interruption, puis appuie sur Terminer." },
  { id:"p1", label:"Parcours de professionnalisation", duration:15*60, icon:"📁", intro:"Le jury va te poser des questions sur ton parcours. Choisis librement les projets qui illustrent tes réponses." },
  { id:"p2", label:"Dossier projets", duration:20*60, icon:"🗂️", intro:"Le jury va te questionner sur tes projets pro. Si tu mentionnes une annexe, sois prêt à la présenter oralement." },
];

async function loadHistory() {
  try {
    const raw = localStorage.getItem("bts_sessions");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

async function saveSession(session) {
  try {
    const h = await loadHistory();
    h.unshift(session);
    localStorage.setItem("bts_sessions", JSON.stringify(h.slice(0, 30)));
  } catch {}
}

async function clearHistory() {
  try { localStorage.removeItem("bts_sessions"); } catch {}
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [tab, setTab] = useState("modes");
  const [ficheOpen, setFicheOpen] = useState(null);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [mode, setMode] = useState(null);
  const [ciblé, setCiblé] = useState(null);
  const [juryMode, setJuryMode] = useState("classique");
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [history, setHistory] = useState([]);
  const [histLoading, setHistLoading] = useState(true);
  const recognitionRef = useRef(null);
  const intervalRef = useRef(null);
  const bottomRef = useRef(null);
  const phase = PHASES[phaseIdx];

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSpeechSupported(false); setShowTextInput(true); }
    loadHistory().then(h => { setHistory(h); setHistLoading(false); });
  }, []);

  useEffect(() => {
    if (running && timer > 0) { intervalRef.current = setInterval(() => setTimer(t => t - 1), 1000); }
    else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [running, timer]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const refreshHistory = async () => { const h = await loadHistory(); setHistory(h); };

  const getSystem = (p, c = null) => {
    const sev = juryMode === "sévère";
    if (p.id === "p0") return SYSTEM_P0;
    if (p.id === "p1") return makeSystemP1(c?.label || null, sev);
    return makeSystemP2(c?.label || null, sev);
  };

  const callAI = async (msgs, system) => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs.map(m => ({ role: m.role, content: m.content })), system })
      });
      const data = await res.json();
      return data.content?.map(b => b.text || "").join("") || "…";
    } catch { return "Une erreur s'est produite."; }
    finally { setLoading(false); }
  };

  const startPhase = async (pIdx, modeType, cib = null) => {
    const p = PHASES[pIdx];
    setPhaseIdx(pIdx); setMode(modeType); setCiblé(cib);
    setMessages([]); setTranscript(""); setTimer(p.duration); setScreen("session");
    if (p.id !== "p0") {
      const sys = getSystem(p, cib);
      const first = await callAI([{ role: "user", content: "Commence l'entretien." }], sys);
      setMessages([{ role: "assistant", content: first }]);
      setRunning(true);
    } else setRunning(true);
  };

  const startFull = () => startPhase(0, "full");

  const startRecording = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "fr-FR"; rec.continuous = true; rec.interimResults = true;
    let final = "";
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
        else interim = e.results[i][0].transcript;
      }
      setTranscript(final + interim);
    };
    rec.onerror = () => { setRecording(false); setShowTextInput(true); };
    rec.onend = () => setRecording(false);
    recognitionRef.current = rec; rec.start(); setRecording(true); setTranscript("");
  };

  const stopAndSend = async () => {
    recognitionRef.current?.stop(); setRecording(false);
    if (!transcript.trim()) return;
    await sendMessage(transcript.trim()); setTranscript("");
  };

  const sendMessage = async (text) => {
    const newMsgs = [...messages, { role: "user", content: text }];
    setMessages(newMsgs);
    const sys = getSystem(phase, ciblé);
    const reply = await callAI(newMsgs, sys);
    setMessages([...newMsgs, { role: "assistant", content: reply }]);
  };

  const sendText = async () => {
    if (!textInput.trim()) return;
    const t = textInput.trim(); setTextInput("");
    await sendMessage(t);
  };

  const endPhase = async () => {
    setRunning(false);
    let feedbackMsgs;
    if (phase.id === "p0") {
      const mono = messages.filter(m => m.role === "user").map(m => m.content).join(" ");
      feedbackMsgs = [{ role: "user", content: `Voici ma présentation : "${mono}". Donne-moi ton feedback.` }];
    } else {
      feedbackMsgs = [...messages, { role: "user", content: "BILAN" }];
    }
    const sys = getSystem(phase, ciblé);
    const bilan = await callAI(feedbackMsgs, sys);
    setMessages(prev => [...prev, { role: "assistant", content: bilan }]);
    const session = { date: new Date().toLocaleDateString("fr-FR"), phase: phase.label, ciblé: ciblé?.label || null, juryMode, bilan };
    await saveSession(session);
    await refreshHistory();
    setScreen("feedback");
  };

  const goNextPhase = () => {
    const next = phaseIdx + 1;
    if (next < PHASES.length) startPhase(next, "full");
    else reset();
  };

  const reset = () => {
    setScreen("home"); setMessages([]); setTranscript(""); setRunning(false);
    setTimer(0); setLoading(false); setShowTextInput(false); setTextInput(""); setCiblé(null); setTab("modes");
  };

  const timerWarn = timer < 120;
  const timerColor = timerWarn ? "#FFD6D6" : timer < (phase?.duration / 4) ? "#FFEAB6" : "#fff";

  const FicheDetail = ({ fiche, onClose }) => (
    <div style={{ background: C.bg, borderRadius: 20, border: `1.5px solid ${fiche.bg}`, padding: "1.5rem", marginBottom: "1rem" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ background: fiche.color, color: "#fff", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{fiche.id}</span>
        <span style={{ fontSize: 16, fontWeight: 600, color: C.text, flex: 1 }}>{fiche.label}</span>
        <button onClick={onClose} style={{ background: C.bg2, border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 16, color: C.textSub, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
      </div>
      <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.7, marginBottom: "1rem", background: C.bg2, borderRadius: 12, padding: "12px 14px" }}>{fiche.quoi}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>Comment répondre</div>
      {fiche.comment.map((c, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
          <span style={{ background: C.grad, color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
          <span style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{c}</span>
        </div>
      ))}
      <div style={{ fontSize: 13, fontWeight: 700, color: C.danger, marginTop: "1rem", marginBottom: 8 }}>Pièges à éviter</div>
      {fiche.pieges.map((p, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
          <span style={{ color: C.danger, fontWeight: 700, fontSize: 14, marginTop: 1 }}>✕</span>
          <span style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{p}</span>
        </div>
      ))}
      <div style={{ fontSize: 13, fontWeight: 700, color: C.success, marginTop: "1rem", marginBottom: 8 }}>Exemple de réponse</div>
      <div style={{ fontSize: 13, fontStyle: "italic", color: C.text, background: C.successLight, borderRadius: 12, padding: "12px 14px", lineHeight: 1.7 }}>"{fiche.exemple}"</div>
      <button onClick={onClose} style={{ width: "100%", marginTop: "1.25rem", padding: "12px", borderRadius: 14, border: "none", background: C.grad, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Fermer</button>
    </div>
  );

  const openFiche = ficheOpen ? (ficheOpen.part === "p1" ? FICHES.p1[ficheOpen.idx] : FICHES.p2[ficheOpen.idx]) : null;

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: C.text, minHeight: "100vh", background: C.bg }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(219,39,119,0.4)} 50%{transform:scale(1.06);box-shadow:0 0 0 12px rgba(219,39,119,0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .msg-jury { background:#f3f4f6; border-radius:16px 16px 16px 4px; padding:12px 16px; margin-bottom:12px; font-size:14px; line-height:1.7; max-width:90%; }
        .msg-cand { background:#EDE9FE; border-radius:16px 16px 4px 16px; padding:12px 16px; margin-bottom:12px; font-size:14px; line-height:1.7; max-width:90%; margin-left:auto; color:#4C1D95; }
        textarea:focus, input:focus { outline: 2px solid #7C3AED; }
      `}</style>

      {screen === "home" && (
        <div style={{ maxWidth: 480, margin: "0 auto", paddingBottom: "2rem" }}>
          <div style={{ background: C.grad, padding: "2rem 1.5rem 1.75rem", borderRadius: "0 0 28px 28px", marginBottom: 0, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -50, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
            <div style={{ position: "absolute", bottom: -30, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>BTS Communication · E6 Bloc 2</div>
              <h1 style={{ fontSize: 30, fontWeight: 700, color: "#fff", margin: "0 0 8px", lineHeight: 1.15 }}>Prêt pour ton oral ?</h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", margin: "0 0 1.25rem", lineHeight: 1.6 }}>Parle, le jury IA t'écoute et t'évalue comme à l'examen.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["40 min", "10 critères", "Feedback IA", "Vocal"].map(t => (
                  <span key={t} style={{ background: "rgba(255,255,255,0.18)", color: "#fff", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", background: C.bg2, padding: "8px", gap: 4 }}>
            {[["modes", "🎯 S'entraîner"], ["conseils", "📚 Conseils"], ["historique", "🕐 Historique"]].map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 6px", borderRadius: 10, border: "none", background: tab === t ? C.bg : "transparent", color: tab === t ? C.purple : C.textSub, fontWeight: tab === t ? 600 : 400, fontSize: 13, cursor: "pointer" }}>{label}</button>
            ))}
          </div>

          <div style={{ padding: "1.25rem" }}>
            {tab === "modes" && (
              <>
                <div style={{ background: juryMode === "sévère" ? C.dangerLight : C.bg2, borderRadius: 16, padding: "12px 16px", marginBottom: "1.25rem", border: juryMode === "sévère" ? `2px solid ${C.danger}` : `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: juryMode === "sévère" ? C.danger : C.text }}>{juryMode === "sévère" ? "🔥 Mode jury sévère activé" : "😤 Mode jury sévère"}</div>
                      <div style={{ fontSize: 12, color: juryMode === "sévère" ? C.danger : C.textSub, marginTop: 2 }}>{juryMode === "sévère" ? "Le jury ne lâche rien" : "Relances sur chaque réponse vague"}</div>
                    </div>
                    <button onClick={() => setJuryMode(j => j === "classique" ? "sévère" : "classique")} style={{ width: 48, height: 28, borderRadius: 14, border: "none", background: juryMode === "sévère" ? C.danger : "#ccc", cursor: "pointer", position: "relative", flexShrink: 0 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: juryMode === "sévère" ? 22 : 3, transition: "left 0.2s" }} />
                    </button>
                  </div>
                </div>

                <button onClick={startFull} style={{ width: "100%", padding: "16px", borderRadius: 18, border: `2px solid ${C.purple}`, background: C.purpleLight, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14, marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: 28 }}>🚀</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: C.purpleDark, display: "flex", alignItems: "center", gap: 8 }}>
                      Simulation complète
                      <span style={{ fontSize: 10, fontWeight: 700, background: C.grad, color: "#fff", borderRadius: 20, padding: "3px 10px" }}>Recommandé</span>
                    </div>
                    <div style={{ fontSize: 12, color: C.purple, marginTop: 2 }}>40 min · Les 3 parties enchaînées</div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.purple }}>40 min</span>
                </button>

                <div style={{ fontSize: 12, color: C.textSub, textAlign: "center", marginBottom: "1rem", fontWeight: 500 }}>— ou s'entraîner sur une partie —</div>
                {PHASES.map((p, i) => (
                  <button key={p.id} onClick={() => startPhase(i, "single")} style={{ width: "100%", padding: "14px 16px", borderRadius: 16, border: `1px solid ${C.border}`, background: C.bg, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                    <span style={{ fontSize: 22, minWidth: 28, textAlign: "center" }}>{p.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>{p.label}</div>
                      <div style={{ fontSize: 12, color: C.textSub, marginTop: 1 }}>{p.id === "p0" ? "Monologue guidé" : p.id === "p1" ? "5 critères — portfolio" : "5 compétences métier"}</div>
                    </div>
                    <span style={{ fontSize: 12, color: C.textSub }}>{p.id === "p0" ? "5 min" : p.id === "p1" ? "15 min" : "20 min"}</span>
                  </button>
                ))}

                <div style={{ fontSize: 12, color: C.textSub, textAlign: "center", margin: "1rem 0", fontWeight: 500 }}>— ou cibler un critère précis —</div>
                <div style={{ background: C.bg2, borderRadius: 16, padding: "12px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>📁 Partie 1 — Parcours</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "1rem" }}>
                    {FICHES.p1.map((f) => (
                      <button key={f.id} onClick={() => startPhase(1, "ciblé", { part: "p1", label: f.label })} style={{ padding: "10px 12px", borderRadius: 12, border: `1px solid ${f.bg}`, background: f.bg, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: f.color, minWidth: 22 }}>{f.id}</span>
                        <span style={{ fontSize: 13, color: C.text, flex: 1 }}>{f.label}</span>
                        <span style={{ fontSize: 11, color: f.color }}>→</span>
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>🗂️ Partie 2 — Dossier</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {FICHES.p2.map((f) => (
                      <button key={f.id} onClick={() => startPhase(2, "ciblé", { part: "p2", label: f.label })} style={{ padding: "10px 12px", borderRadius: 12, border: `1px solid ${f.bg}`, background: f.bg, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: f.color, minWidth: 22 }}>{f.id}</span>
                        <span style={{ fontSize: 13, color: C.text, flex: 1 }}>{f.label}</span>
                        <span style={{ fontSize: 11, color: f.color }}>→</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {tab === "conseils" && (
              <>
                {openFiche ? (
                  <FicheDetail fiche={openFiche} onClose={() => setFicheOpen(null)} />
                ) : (
                  <>
                    <div style={{ fontSize: 13, color: C.textSub, marginBottom: "1rem", lineHeight: 1.6 }}>Appuie sur un critère pour voir ce qui est attendu, comment répondre et les pièges à éviter.</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>📁 Partie 1 — Parcours</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1.5rem" }}>
                      {FICHES.p1.map((f, i) => (
                        <button key={f.id} onClick={() => setFicheOpen({ part: "p1", idx: i })} style={{ padding: "12px 14px", borderRadius: 14, border: `1.5px solid ${f.bg}`, background: f.bg, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ background: f.color, color: "#fff", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{f.id}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{f.label}</div>
                            <div style={{ fontSize: 12, color: C.textSub, marginTop: 1 }}>Conseils · Pièges · Exemple</div>
                          </div>
                          <span style={{ fontSize: 16, color: f.color }}>›</span>
                        </button>
                      ))}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>🗂️ Partie 2 — Dossier</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {FICHES.p2.map((f, i) => (
                        <button key={f.id} onClick={() => setFicheOpen({ part: "p2", idx: i })} style={{ padding: "12px 14px", borderRadius: 14, border: `1.5px solid ${f.bg}`, background: f.bg, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ background: f.color, color: "#fff", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{f.id}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{f.label}</div>
                            <div style={{ fontSize: 12, color: C.textSub, marginTop: 1 }}>Conseils · Pièges · Exemple</div>
                          </div>
                          <span style={{ fontSize: 16, color: f.color }}>›</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {tab === "historique" && (
              <>
                {histLoading ? (
                  <div style={{ textAlign: "center", padding: "2rem 0", color: C.textSub }}>
                    <div style={{ width: 24, height: 24, border: `2px solid ${C.purple}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
                    Chargement…
                  </div>
                ) : history.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem 0", color: C.textSub }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                    <div style={{ fontSize: 14 }}>Aucune session encore.<br />Lance ton premier entraînement !</div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 13, color: C.textSub }}>{history.length} session{history.length > 1 ? "s" : ""}</span>
                      <button onClick={async () => { await clearHistory(); await refreshHistory(); }} style={{ background: "none", border: "none", fontSize: 12, color: C.danger, cursor: "pointer", textDecoration: "underline" }}>Tout effacer</button>
                    </div>
                    {history.map((s, i) => (
                      <div key={i} style={{ background: C.bg2, borderRadius: 14, padding: "14px 16px", marginBottom: 12, borderLeft: `3px solid ${s.juryMode === "sévère" ? C.danger : C.purple}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, gap: 8 }}>
                          <div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.phase}{s.ciblé ? ` · ${s.ciblé}` : ""}</span>
                            {s.juryMode === "sévère" && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: C.danger, background: C.dangerLight, borderRadius: 20, padding: "2px 8px" }}>🔥 Sévère</span>}
                          </div>
                          <span style={{ fontSize: 12, color: C.textSub, flexShrink: 0 }}>{s.date}</span>
                        </div>
                        <div style={{ fontSize: 12, color: C.textSub, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{s.bilan?.slice(0, 220)}{s.bilan?.length > 220 ? "…" : ""}</div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {screen === "session" && (
        <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", flexDirection: "column", height: "100vh" }}>
          <div style={{ background: C.grad, padding: "1rem 1.25rem", borderRadius: "0 0 20px 20px", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>{ciblé ? `Entraînement ciblé — ${ciblé.label}` : phase.label}</div>
                {mode === "full" && (
                  <div style={{ display: "flex", gap: 4 }}>
                    {PHASES.map((p, i) => (
                      <span key={p.id} style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: i === phaseIdx ? "rgba(255,255,255,0.3)" : i < phaseIdx ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)", color: "#fff" }}>{p.icon}</span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, color: timerColor, fontVariantNumeric: "tabular-nums" }}>{fmt(timer)}</div>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.2)", borderRadius: 2 }}>
              <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.8)", width: `${(1 - timer / phase.duration) * 100}%`, transition: "width 1s linear" }} />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem" }}>
            <div style={{ background: C.purpleLight, borderRadius: 12, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: C.purpleDark, lineHeight: 1.6 }}>{phase.intro}</div>
            {messages.map((m, i) => (
              <div key={i} className={m.role === "assistant" ? "msg-jury" : "msg-cand"} style={{ whiteSpace: "pre-wrap" }}>
                {m.role === "assistant" && <div style={{ fontSize: 11, fontWeight: 700, color: C.purple, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Jury</div>}
                {m.content}
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "10px 0", color: C.textSub, fontSize: 13 }}>
                <div style={{ width: 16, height: 16, border: `2px solid ${C.purple}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                Le jury réfléchit…
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: "1rem 1.25rem", borderTop: `1px solid ${C.border}`, background: C.bg, flexShrink: 0 }}>
            {!showTextInput ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                {transcript && <div style={{ width: "100%", background: C.purpleLight, borderRadius: 12, padding: "10px 14px", fontSize: 13, color: C.purpleDark, lineHeight: 1.6, maxHeight: 80, overflowY: "auto" }}>{transcript}</div>}
                <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "center", width: "100%" }}>
                  {!recording ? (
                    <>
                      <button onClick={startRecording} disabled={loading} style={{ width: 64, height: 64, borderRadius: "50%", border: `3px solid ${C.purple}`, background: C.purpleLight, cursor: loading ? "not-allowed" : "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, opacity: loading ? 0.5 : 1 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="2" strokeLinecap="round"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0014 0" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="8" y1="22" x2="16" y2="22" /></svg>
                        <span style={{ fontSize: 9, fontWeight: 700, color: C.purple }}>PARLER</span>
                      </button>
                      {phase.id === "p0" && <button onClick={endPhase} disabled={loading} style={{ padding: "12px 20px", borderRadius: 12, border: "none", background: C.grad, color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", opacity: loading ? 0.5 : 1 }}>Terminer →</button>}
                    </>
                  ) : (
                    <button onClick={stopAndSend} style={{ width: 64, height: 64, borderRadius: "50%", border: `3px solid ${C.pink}`, background: C.pinkLight, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, animation: "pulse 1.2s infinite" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill={C.pink}><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                      <span style={{ fontSize: 9, fontWeight: 700, color: C.pink }}>ENVOYER</span>
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <button onClick={() => setShowTextInput(true)} style={{ background: "none", border: "none", fontSize: 12, color: C.textSub, cursor: "pointer", textDecoration: "underline" }}>Écrire</button>
                  {phase.id !== "p0" && !loading && messages.length > 2 && <button onClick={endPhase} style={{ background: "none", border: "none", fontSize: 12, color: C.purple, cursor: "pointer", textDecoration: "underline" }}>Terminer et voir le bilan</button>}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", gap: 8 }}>
                  <textarea value={textInput} onChange={e => setTextInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendText(); } }} placeholder="Tapez votre réponse…" rows={3} style={{ flex: 1, padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, resize: "none", fontFamily: "inherit" }} />
                  <button onClick={sendText} disabled={!textInput.trim() || loading} style={{ padding: "10px 16px", borderRadius: 12, border: "none", background: textInput.trim() && !loading ? C.grad : C.bg2, color: textInput.trim() && !loading ? "#fff" : C.textSub, fontWeight: 600, cursor: "pointer", fontSize: 14, alignSelf: "flex-end" }}>→</button>
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                  {speechSupported && <button onClick={() => setShowTextInput(false)} style={{ background: "none", border: "none", fontSize: 12, color: C.textSub, cursor: "pointer", textDecoration: "underline" }}>Micro</button>}
                  {phase.id !== "p0" && !loading && messages.length > 2 && <button onClick={endPhase} style={{ background: "none", border: "none", fontSize: 12, color: C.purple, cursor: "pointer", textDecoration: "underline" }}>Terminer et voir le bilan</button>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {screen === "feedback" && (
        <div style={{ maxWidth: 520, margin: "0 auto", paddingBottom: "2rem" }}>
          <div style={{ background: C.grad, padding: "1.5rem", borderRadius: "0 0 24px 24px", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>Retour du jury</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>{ciblé ? `Entraînement — ${ciblé.label}` : phase.label}</h2>
          </div>
          <div style={{ padding: "0 1.25rem" }}>
            <div style={{ background: C.bg2, borderRadius: 16, padding: "16px", fontSize: 14, lineHeight: 1.8, marginBottom: "1.5rem", whiteSpace: "pre-wrap", borderLeft: `4px solid ${C.purple}` }}>
              {messages.filter(m => m.role === "assistant").slice(-1)[0]?.content}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Échanges de la session</div>
            <div style={{ background: C.bg2, borderRadius: 16, padding: "12px 16px", marginBottom: "1.5rem", maxHeight: 240, overflowY: "auto" }}>
              {messages.slice(0, -1).map((m, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: m.role === "assistant" ? C.purple : C.pink, marginBottom: 3, textTransform: "uppercase" }}>{m.role === "assistant" ? "Jury" : "Toi"}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.6, color: C.text, whiteSpace: "pre-wrap" }}>{m.content}</div>
                </div>
              ))}
            </div>
            {mode === "full" && phaseIdx < PHASES.length - 1 && (
              <button onClick={goNextPhase} style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: C.grad, color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer", marginBottom: 10 }}>
                Partie suivante → {PHASES[phaseIdx + 1].icon}
              </button>
            )}
            <button onClick={reset} style={{ width: "100%", padding: "14px", borderRadius: 14, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontWeight: 500, fontSize: 15, cursor: "pointer" }}>
              Retour à l'accueil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
