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

// ─── SYSTEM PROMPTS ───────────────────────────────────────────────────────────

const SYSTEM_P0 = `Tu es un jury de BTS Communication pour l'épreuve orale E6 Bloc 2.
Le candidat vient de faire sa présentation personnelle de 5 minutes (monologue sans interruption).

RÈGLE ABSOLUE : Tu n'interviens PAS pendant le monologue. Zéro question. Zéro commentaire.
Le feedback est donné UNIQUEMENT sur "BILAN".

Sur "BILAN" — analyse pédagogique de la présentation personnelle :
Évalue chacun des 5 points obligatoires de la présentation personnelle BTS Com :

POINT_1_NIVEAU: [Très insuffisant / Insuffisant / Satisfaisant / Très satisfaisant]
POINT_1_BIEN: [ce qui a été bien dit sur "Qui suis-je ? — personnalité, traits, passions, appétence créative"]
POINT_1_MANQUE: [ce qui manquait concrètement]
POINT_1_EXEMPLE: [exemple de formulation idéale : 2-3 adjectifs illustrés + lien avec la communication]

POINT_2_NIVEAU: [niveau]
POINT_2_BIEN: [ce qui a été bien dit sur "Pourquoi le BTS Communication ?"]
POINT_2_MANQUE: [ce qui manquait : projet réfléchi, cohérence, ce qui a séduit dans la formation]
POINT_2_EXEMPLE: [exemple de formulation idéale]

POINT_3_NIVEAU: [niveau]
POINT_3_BIEN: [ce qui a été bien dit sur "Mon projet après le BTS"]
POINT_3_MANQUE: [ce qui manquait : formations envisagées, noms concrets, cohérence du projet]
POINT_3_EXEMPLE: [exemple de formulation idéale]

POINT_4_NIVEAU: [niveau]
POINT_4_BIEN: [ce qui a été bien dit sur "Le BTS a-t-il modifié mon projet ?"]
POINT_4_MANQUE: [ce qui manquait : transformation, expérience marquante, évolution]
POINT_4_EXEMPLE: [exemple de formulation idéale]

POINT_5_NIVEAU: [niveau]
POINT_5_BIEN: [ce qui a été bien dit sur "Mon poste et mes missions en entreprise"]
POINT_5_MANQUE: [ce qui manquait : nom entreprise, secteur, intitulé de poste, 3-5 missions précises, niveau d'autonomie]
POINT_5_EXEMPLE: [exemple de formulation idéale]

EXPRESSION_ORALE: [niveau] | [commentaire détaillé : tics de langage ("euh", "du coup", "en fait"...), niveau de vocabulaire professionnel, débit, clarté, structure, posture]
RECOMMANDATIONS: [3-5 axes prioritaires séparés par des points-virgules]
PAS de note chiffrée pour la présentation personnelle.`;

const makeSystemP1 = (ciblé=null, sévère=false, isSimulation=false) => `Tu es un jury de BTS Communication — Partie 1 : Parcours de professionnalisation (15 min).
Grille officielle BTS Com E6 Bloc 2 — Partie 1 (note /10) :
- C1 : Pertinence, efficacité et diversité des productions réalisées
- C2 : Capacité à expliciter les productions, leurs contextes et leurs enjeux
- C3 : Capacité à justifier les choix créatifs effectués
- C4 : Capacité à expliciter le parcours de professionnalisation
- C5 : Regard réflexif sur les compétences acquises et capacité de transfert

RÈGLES ABSOLUES :
- Tu poses UNIQUEMENT des questions. Une seule à la fois. Courte. Directe.
- INTERDIT : *je note*, *je me penche*, *je souris*, ou toute action narrative.
- INTERDIT : conseils ou encouragements pendant la session.
- Demande systématiquement les annexes : "Avez-vous une annexe sur ce point ? Décrivez-la moi."
- Feedback et conseils UNIQUEMENT sur "BILAN".

${ciblé ? `MODE CIBLÉ : concentre-toi UNIQUEMENT sur "${ciblé}". Pose 4-5 questions approfondies.` : `Explore les 5 critères C1 à C5.`}
${sévère ? `MODE SÉVÈRE : Relance sur chaque réponse vague. "Soyez plus précis.", "Donnez un exemple concret.", "Qu'est-ce qui vous permet de dire ça ?"` : ""}

Commence directement par ta première question, sans introduction.
IMPORTANT : commence par un critère choisi aléatoirement parmi C1 à C5 — ne commence JAMAIS par C1 systématiquement. Varie l'ordre à chaque session.

Sur "BILAN" :
${isSimulation ? `MODE SIMULATION — Note officielle /10 :
Utilise la grille officielle : Très insuffisant / Insuffisant / Satisfaisant / Très satisfaisant pour chaque critère C1 à C5.
BARÈME PLAFOND OBLIGATOIRE — applique-le strictement :
- Candidat sans annexes ET réponses vagues/très courtes → note entre 0 et 3/10
- Candidat avec peu ou pas d'annexes ET réponses bancales → note entre 3 et 6/10
- Candidat avec annexes décrites ET réponses professionnelles et détaillées → note entre 6 et 10/10
Indique clairement le palier appliqué et pourquoi.
Format de réponse STRICT (pour parsing automatique) :
NOTE_P1: X/10
C1: [niveau] | [justification courte]
C2: [niveau] | [justification courte]
C3: [niveau] | [justification courte]
C4: [niveau] | [justification courte]
C5: [niveau] | [justification courte]
EXPRESSION_ORALE: [niveau] | [commentaire]
PALIER: [0-3 / 3-6 / 6-10] | [raison]
POINTS_FORTS: [liste]
POINTS_FAIBLES: [liste]
RECOMMANDATIONS: [liste]` : `MODE ENTRAÎNEMENT — Rôle pédagogique, pas de note chiffrée.
Pour chaque critère évalué durant la session, rédige une fiche pédagogique complète.
Format STRICT — utilise exactement ces balises :

APPRECIATION_GLOBALE: [Très insuffisant / Insuffisant / Satisfaisant / Très satisfaisant]

C1_NIVEAU: [Très insuffisant / Insuffisant / Satisfaisant / Très satisfaisant]
C1_BIEN: [ce que le candidat a bien dit — cite ses propres mots si possible]
C1_MANQUE: [ce qui manquait concrètement — sois précis et factuel]
C1_EXEMPLE: [formule un exemple concret de ce qu'il aurait fallu dire]

C2_NIVEAU: [niveau]
C2_BIEN: [points positifs]
C2_MANQUE: [manques concrets]
C2_EXEMPLE: [exemple de bonne réponse]

C3_NIVEAU: [niveau]
C3_BIEN: [points positifs]
C3_MANQUE: [manques concrets]
C3_EXEMPLE: [exemple de bonne réponse]

C4_NIVEAU: [niveau]
C4_BIEN: [points positifs]
C4_MANQUE: [manques concrets]
C4_EXEMPLE: [exemple de bonne réponse]

C5_NIVEAU: [niveau]
C5_BIEN: [points positifs]
C5_MANQUE: [manques concrets]
C5_EXEMPLE: [exemple de bonne réponse]

EXPRESSION_ORALE: [niveau] | [commentaire sur syntaxe, niveau de langue, clarté]
RECOMMANDATIONS: [3-5 axes prioritaires d'amélioration séparés par des points-virgules]`}`;

const makeSystemP2 = (ciblé=null, sévère=false, isSimulation=false) => `Tu es un jury de BTS Communication — Partie 2 : Dossier projets (20 min).
Grille officielle BTS Com E6 Bloc 2 — Partie 2 (note /10) :
- C1 : Mettre en œuvre une veille créative et technologique
- C2 : Créer des contenus et des solutions de communication
- C3 : Produire et diffuser des solutions de communication
- C4 : Acheter des prestations
- C5 : Contrôler et évaluer les solutions de communication

RÈGLES ABSOLUES :
- Tu poses UNIQUEMENT des questions. Une seule à la fois. Courte. Directe.
- INTERDIT : *je note*, *je me penche*, ou toute action narrative.
- INTERDIT : conseils ou encouragements pendant la session.
- Demande systématiquement les annexes : "Avez-vous une annexe sur ce point ? Décrivez-la moi."
- Feedback et conseils UNIQUEMENT sur "BILAN".

${ciblé ? `MODE CIBLÉ : concentre-toi UNIQUEMENT sur "${ciblé}". Pose 4-5 questions approfondies.` : `Explore les 5 compétences C1 à C5.`}
${sévère ? `MODE SÉVÈRE : Relance sur chaque réponse vague. Demande des preuves, des chiffres, des documents.` : ""}

Commence directement par ta première question, sans introduction.
IMPORTANT : commence par un critère choisi aléatoirement parmi C1 à C5 — ne commence JAMAIS par C1 systématiquement. Varie l'ordre à chaque session.

Sur "BILAN" :
${isSimulation ? `MODE SIMULATION — Note officielle /10 :
Utilise la grille officielle : Très insuffisant / Insuffisant / Satisfaisant / Très satisfaisant pour chaque critère C1 à C5.
BARÈME PLAFOND OBLIGATOIRE — applique-le strictement :
- Candidat sans annexes ET réponses vagues/très courtes → note entre 0 et 3/10
- Candidat avec peu ou pas d'annexes ET réponses bancales → note entre 3 et 6/10
- Candidat avec annexes décrites ET réponses professionnelles et détaillées → note entre 6 et 10/10
Indique clairement le palier appliqué et pourquoi.
Format de réponse STRICT (pour parsing automatique) :
NOTE_P2: X/10
C1: [niveau] | [justification courte]
C2: [niveau] | [justification courte]
C3: [niveau] | [justification courte]
C4: [niveau] | [justification courte]
C5: [niveau] | [justification courte]
EXPRESSION_ORALE: [niveau] | [commentaire]
PALIER: [0-3 / 3-6 / 6-10] | [raison]
POINTS_FORTS: [liste]
POINTS_FAIBLES: [liste]
RECOMMANDATIONS: [liste]` : `MODE ENTRAÎNEMENT — Rôle pédagogique, pas de note chiffrée.
Pour chaque critère évalué durant la session, rédige une fiche pédagogique complète.
Format STRICT — utilise exactement ces balises :

APPRECIATION_GLOBALE: [Très insuffisant / Insuffisant / Satisfaisant / Très satisfaisant]

C1_NIVEAU: [Très insuffisant / Insuffisant / Satisfaisant / Très satisfaisant]
C1_BIEN: [ce que le candidat a bien dit — cite ses propres mots si possible]
C1_MANQUE: [ce qui manquait concrètement — sois précis et factuel]
C1_EXEMPLE: [formule un exemple concret de ce qu'il aurait fallu dire]

C2_NIVEAU: [niveau]
C2_BIEN: [points positifs]
C2_MANQUE: [manques concrets]
C2_EXEMPLE: [exemple de bonne réponse]

C3_NIVEAU: [niveau]
C3_BIEN: [points positifs]
C3_MANQUE: [manques concrets]
C3_EXEMPLE: [exemple de bonne réponse]

C4_NIVEAU: [niveau]
C4_BIEN: [points positifs]
C4_MANQUE: [manques concrets]
C4_EXEMPLE: [exemple de bonne réponse]

C5_NIVEAU: [niveau]
C5_BIEN: [points positifs]
C5_MANQUE: [manques concrets]
C5_EXEMPLE: [exemple de bonne réponse]

EXPRESSION_ORALE: [niveau] | [commentaire sur syntaxe, niveau de langue, clarté]
RECOMMANDATIONS: [3-5 axes prioritaires d'amélioration séparés par des points-virgules]`}`;

const PHASES = [
  { id:"p0", label:"Présentation personnelle", duration:5*60, icon:"🎤", intro:"Chrono lancé. Présente-toi pendant 5 minutes sans interruption, puis appuie sur Terminer." },
  { id:"p1", label:"Parcours de professionnalisation", duration:15*60, icon:"📁", intro:"Le jury va te poser des questions sur ton parcours. Choisis librement les projets qui illustrent tes réponses." },
  { id:"p2", label:"Dossier projets", duration:20*60, icon:"🗂️", intro:"Le jury va te questionner sur tes projets pro. Si tu mentionnes une annexe, sois prêt à la présenter oralement." },
];

// ─── STORAGE ──────────────────────────────────────────────────────────────────

async function loadHistory() {
  try { const raw = localStorage.getItem("bts_sessions"); return raw ? JSON.parse(raw) : []; }
  catch { return []; }
}
async function saveSession(session) {
  try { const h = await loadHistory(); h.unshift(session); localStorage.setItem("bts_sessions", JSON.stringify(h.slice(0, 30))); }
  catch {}
}
async function clearHistory() {
  try { localStorage.removeItem("bts_sessions"); } catch {}
}

// ─── TTS HOOK ─────────────────────────────────────────────────────────────────

// Sélectionne la meilleure voix française disponible
function getBestFrVoice(synth) {
  const voices = synth.getVoices();
  // Priorité : voix premium/enhanced, puis voix locale FR, puis toute voix fr
  const priority = [
    v => v.lang === "fr-FR" && (v.name.includes("Enhanced") || v.name.includes("Premium")),
    v => v.lang === "fr-FR" && v.localService,
    v => v.lang === "fr-FR",
    v => v.lang.startsWith("fr") && v.localService,
    v => v.lang.startsWith("fr"),
  ];
  for (const test of priority) {
    const found = voices.find(test);
    if (found) return found;
  }
  return null;
}

// Découpe un texte en phrases naturelles
function splitSentences(text) {
  return text
    .replace(/\*[^*]+\*/g, "")
    .replace(/\[[^\]]+\]/g, "")
    .replace(/#{1,3} /g, "")
    .trim()
    .split(/(?<=[.!?:])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function useTTS(muted) {
  const synthRef = useRef(null);
  const queueRef = useRef([]);
  const playingRef = useRef(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    synthRef.current = window.speechSynthesis;
    // Warm-up iOS : débloquer l'API audio au premier geste utilisateur
    const warmup = () => {
      if (!synthRef.current) return;
      const utt = new SpeechSynthesisUtterance("");
      utt.volume = 0;
      synthRef.current.speak(utt);
      document.removeEventListener("touchstart", warmup);
      document.removeEventListener("click", warmup);
    };
    document.addEventListener("touchstart", warmup, { once: true });
    document.addEventListener("click", warmup, { once: true });
    return () => synthRef.current?.cancel();
  }, []);

  // Joue la prochaine phrase de la queue
  const playNext = useCallback(() => {
    if (!synthRef.current || queueRef.current.length === 0) {
      playingRef.current = false;
      setSpeaking(false);
      return;
    }
    const sentence = queueRef.current.shift();
    const utt = new SpeechSynthesisUtterance(sentence);
    utt.lang = "fr-FR";
    utt.rate = 0.9;   // Un peu plus lent = plus naturel
    utt.pitch = 0.95;
    utt.volume = 1;
    const voice = getBestFrVoice(synthRef.current);
    if (voice) utt.voice = voice;
    utt.onstart = () => { playingRef.current = true; setSpeaking(true); };
    utt.onend = () => playNext();
    utt.onerror = () => playNext();
    synthRef.current.speak(utt);
  }, []);

  const speak = useCallback((text) => {
    if (!synthRef.current || muted) return;
    synthRef.current.cancel();
    queueRef.current = splitSentences(text);
    playingRef.current = false;
    setSpeaking(false);
    // Petit délai pour laisser le cancel se propager (surtout iOS)
    setTimeout(() => playNext(), 120);
  }, [muted, playNext]);

  const stop = useCallback(() => {
    synthRef.current?.cancel();
    queueRef.current = [];
    playingRef.current = false;
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking };
}

// ─── PARSING DU BILAN ─────────────────────────────────────────────────────────

const LEVELS_OFFICIAL = ["Très insuffisant", "Insuffisant", "Satisfaisant", "Très satisfaisant"];
const LEVEL_COLORS = {
  "Très insuffisant": C.danger,
  "Insuffisant": "#F97316",
  "Satisfaisant": "#2563EB",
  "Très satisfaisant": C.success,
};
const LEVEL_BG = {
  "Très insuffisant": C.dangerLight,
  "Insuffisant": "#FEF3C7",
  "Satisfaisant": "#DBEAFE",
  "Très satisfaisant": C.successLight,
};

const CRITERIA_LABELS_P1 = {
  C1: "Pertinence, efficacité et diversité des productions",
  C2: "Expliciter les productions, contextes et enjeux",
  C3: "Justifier les choix créatifs",
  C4: "Expliciter le parcours de professionnalisation",
  C5: "Regard réflexif et capacité de transfert",
};
const CRITERIA_LABELS_P2 = {
  C1: "Veille créative et technologique",
  C2: "Créer des contenus et solutions de communication",
  C3: "Produire et diffuser des solutions",
  C4: "Acheter des prestations",
  C5: "Contrôler et évaluer les solutions",
};

function getLevelColor(level) { return LEVEL_COLORS[level] || C.purple; }
function getLevelBg(level) { return LEVEL_BG[level] || C.purpleLight; }
// Filtre les "bien" vides ou négatifs générés par l'IA
function hasBien(text) {
  if (!text || text.length < 5) return false;
  const negatives = ["aucun", "rien", "néant", "pas de", "pas d'", "nothing", "none", "aucune", "n'a pas", "n'a rien", "absent", "manque"];
  const lower = text.toLowerCase();
  return !negatives.some(n => lower.startsWith(n) || lower.includes(n + " ") );
}

function parseBilan(text, phaseId, isSimulation) {
  if (!text) return null;
  const lines = text.split("\n");

  // Nettoie le markdown : **gras**, *italique*, ## titres
  const cleanMd = (s) => s ? s.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").replace(/^#+\s*/, "").trim() : null;

  // Extraire une valeur après un label "KEY:" — supporte "## KEY:", "**KEY:**", multilignes
  const extract = (key) => {
    const idx = lines.findIndex(l => {
      // Nettoie ##, ** avant de comparer
      const clean = l.replace(/^#+\s*/, "").replace(/\*\*/g, "").trim();
      return clean.startsWith(key + ":") || clean === key + ":";
    });
    if (idx === -1) return null;
    const line = lines[idx];
    // Nettoie la ligne entière puis extrait après la clé
    const cleanedLine = line.replace(/\*\*/g, "").replace(/^#+\s*/, "");
    const colonPos = cleanedLine.indexOf(key + ":");
    const afterColon = colonPos >= 0 ? cleanedLine.substring(colonPos + key.length + 1).trim() : "";
    if (afterColon && afterColon.length > 0) return cleanMd(afterColon);
    // Multilignes : concatène jusqu'à la prochaine balise connue
    let val = "";
    for (let i = idx + 1; i < lines.length; i++) {
      const next = lines[i].replace(/^#+\s*/, "").replace(/\*\*/g, "").trim();
      if (next.match(/^C[1-5]_|^APPRECIATION|^EXPRESSION|^RECOMMANDATIONS|^NOTE_|^PALIER|^POINTS/)) break;
      if (next === "---" || next === "***") break;
      if (next.length > 0) val += (val ? "\n" : "") + next;
    }
    return cleanMd(val) || null;
  };

  // Extraire le niveau depuis une ligne "Cx: [niveau] | ..."
  const extractCriteria = (key) => {
    const line = lines.find(l => {
      const clean = l.replace(/^#+\s*/, "").replace(/\*\*/g, "").trim();
      return clean.startsWith(key + ":") && !clean.startsWith(key + "_");
    });
    if (!line) return null;
    const cleanedLine = line.replace(/\*\*/g, "").replace(/^#+\s*/, "");
    const colonPos = cleanedLine.indexOf(key + ":");
    const val = colonPos >= 0 ? cleanMd(cleanedLine.substring(colonPos + key.length + 1).trim()) : "";
    const parts = val ? val.split("|") : [];
    const level = LEVELS_OFFICIAL.find(l => (parts[0] || "").includes(l)) || null;
    const comment = parts[1] ? parts[1].trim() : "";
    return { level, comment };
  };

  // Extraire une liste après un label
  const extractList = (key) => {
    const val = extract(key);
    if (!val) return [];
    return val.split(/[;,•]/).map(s => s.replace(/^[-–]\s*/, "").trim()).filter(s => s.length > 3);
  };

  const criteriaLabels = phaseId === "p1" ? CRITERIA_LABELS_P1 : CRITERIA_LABELS_P2;

  // Cas spécial P0 : feedback présentation personnelle
  if (phaseId === "p0") {
    const POINTS_P0 = [
      { key: "POINT_1", label: "Qui suis-je ? — Personnalité et passions" },
      { key: "POINT_2", label: "Pourquoi le BTS Communication ?" },
      { key: "POINT_3", label: "Mon projet après le BTS" },
      { key: "POINT_4", label: "Le BTS a-t-il modifié mon projet ?" },
      { key: "POINT_5", label: "Mon poste et mes missions en entreprise" },
    ];
    const appreciation = extract("APPRECIATION_GLOBALE") ||
      (LEVELS_OFFICIAL.find(l => lines.slice(0,5).join(" ").includes(l)) || null);
    const criteria = POINTS_P0.map(p => {
      const niveau = extract(p.key + "_NIVEAU");
      const bien = extract(p.key + "_BIEN");
      const manque = extract(p.key + "_MANQUE");
      const exemple = extract(p.key + "_EXEMPLE");
      const level = niveau ? (LEVELS_OFFICIAL.find(l => niveau.includes(l)) || null) : null;
      return { key: p.key, label: p.label, level, bien: bien || null, manque: manque || null, exemple: exemple || null, color: getLevelColor(level), bg: getLevelBg(level) };
    }).filter(c => c.level || c.bien || c.manque);
    const oral = extractCriteria("EXPRESSION_ORALE");
    const reco = extract("RECOMMANDATIONS")
      ? extract("RECOMMANDATIONS").split(/[;]/).map(s => s.trim()).filter(s => s.length > 3)
      : extractList("RECOMMANDATIONS");
    return { type: "p0", appreciation, criteria, oral, recommandations: reco, raw: text };
  }

  if (isSimulation) {
    const noteKey = phaseId === "p1" ? "NOTE_P1" : "NOTE_P2";
    const noteStr = extract(noteKey);
    const note = noteStr ? parseInt(noteStr) : null;
    const criteria = ["C1","C2","C3","C4","C5"].map(k => {
      const c = extractCriteria(k);
      return {
        key: k,
        label: criteriaLabels[k] || k,
        level: c?.level || null,
        comment: c?.comment || "",
        color: getLevelColor(c?.level),
        bg: getLevelBg(c?.level),
      };
    });
    const oral = extractCriteria("EXPRESSION_ORALE");
    const palier = extract("PALIER");
    const pointsForts = extractList("POINTS_FORTS");
    const pointsFaibles = extractList("POINTS_FAIBLES");
    const reco = extractList("RECOMMANDATIONS");
    return { type: "simulation", note, criteria, oral, palier, pointsForts, pointsFaibles, recommandations: reco, raw: text };
  } else {
    const appreciation = extract("APPRECIATION_GLOBALE");
    const criteria = ["C1","C2","C3","C4","C5"].map(k => {
      const niveau = extract(k + "_NIVEAU");
      const bien = extract(k + "_BIEN");
      const manque = extract(k + "_MANQUE");
      const exemple = extract(k + "_EXEMPLE");
      // Fallback ancien format
      const fallback = extractCriteria(k);
      const level = niveau ? (LEVELS_OFFICIAL.find(l => niveau.includes(l)) || null) : fallback?.level || null;
      return {
        key: k,
        label: criteriaLabels[k] || k,
        level,
        bien: bien || null,
        manque: manque || fallback?.comment || null,
        exemple: exemple || null,
        color: getLevelColor(level),
        bg: getLevelBg(level),
      };
    }).filter(c => c.level || c.bien || c.manque); // N'affiche que les critères évalués
    const oral = extractCriteria("EXPRESSION_ORALE");
    const reco = extract("RECOMMANDATIONS")
      ? extract("RECOMMANDATIONS").split(/[;]/).map(s => s.trim()).filter(s => s.length > 3)
      : extractList("RECOMMANDATIONS");
    return { type: "entrainement", appreciation, criteria, oral, recommandations: reco, raw: text };
  }
}

// ─── COMPOSANTS ───────────────────────────────────────────────────────────────

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

// ─── SCORE CARD ───────────────────────────────────────────────────────────────

const CritereCard = ({ label, level, comment, color, bg }) => (
  <div style={{ background: bg || C.purpleLight, borderRadius: 14, padding: "12px 14px", marginBottom: 8, border: `1.5px solid ${color || C.purple}` }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: comment ? 6 : 0 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: C.text, flex: 1 }}>{label}</span>
      {level && (
        <span style={{ fontSize: 11, fontWeight: 700, color, background: "#fff", borderRadius: 20, padding: "3px 10px", border: `1px solid ${color}`, flexShrink: 0, whiteSpace: "nowrap" }}>{level}</span>
      )}
    </div>
    {comment && <div style={{ fontSize: 12, color: C.textSub, lineHeight: 1.5 }}>{comment}</div>}
  </div>
);

const NoteBar = ({ note, max = 10, color }) => {
  const pct = (note / max) * 100;
  return (
    <div style={{ height: 6, background: "rgba(0,0,0,0.08)", borderRadius: 3, marginTop: 6 }}>
      <div style={{ height: 6, borderRadius: 3, background: color, width: `${pct}%`, transition: "width 0.8s ease" }} />
    </div>
  );
};

const AppreciationBadge = ({ level }) => {
  const color = getLevelColor(level);
  const bg = getLevelBg(level);
  const icons = { "Très insuffisant": "🔴", "Insuffisant": "🟠", "Satisfaisant": "🔵", "Très satisfaisant": "🟢" };
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: bg, border: `2px solid ${color}`, borderRadius: 14, padding: "8px 16px" }}>
      <span style={{ fontSize: 18 }}>{icons[level] || "⚪"}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color }}>{level || "—"}</span>
    </div>
  );
};

// ─── HISTORY DETAIL ──────────────────────────────────────────────────────────

const HistoryDetail = ({ session, onClose, getLevelColor, getLevelBg, C }) => {
  // Re-parser le bilan brut si parsedBilan absent (anciennes sessions)
  const pb = session.parsedBilan || (session.bilan ? parseBilan(session.bilan, session.phaseId || "p1", session.mode === "full") : null);
  const isSimFeedback = pb?.type === "simulation";
  const msgs = session.messages || [];

  return (
    <div>
      {/* Bouton retour */}
      <button onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", fontSize: 13, color: C.purple, cursor: "pointer", fontWeight: 600, marginBottom: 14, padding: 0 }}>
        ← Retour à l'historique
      </button>

      {/* Hero mini */}
      <div style={{ background: "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)", borderRadius: 16, padding: "16px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {isSimFeedback ? "Simulation" : "Entraînement"} · {session.date}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
          {session.phase}{session.ciblé ? ` · ${session.ciblé}` : ""}
        </div>
        {pb?.note != null && (
          <div style={{ display: "inline-flex", alignItems: "baseline", gap: 4, background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "4px 12px" }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{pb.note}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>/10</span>
          </div>
        )}
        {pb?.appreciation && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "4px 12px" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{pb.appreciation}</span>
          </div>
        )}
      </div>

      {/* Critères */}
      {pb?.criteria?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {pb.criteria.map((c, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, border: `1.5px solid ${c.color}`, marginBottom: 10, overflow: "hidden" }}>
              <div style={{ background: c.bg, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ background: c.color, color: "#fff", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{c.key}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text, flex: 1 }}>{c.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: c.color, background: "#fff", borderRadius: 20, padding: "2px 10px", border: `1px solid ${c.color}`, flexShrink: 0, whiteSpace: "nowrap" }}>{c.level || "—"}</span>
              </div>
              <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                {hasBien(c.bien) && (
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.success, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>✓ Ce qui était bien</div>
                    <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6, background: C.successLight, borderRadius: 8, padding: "8px 10px" }}>{c.bien}</div>
                  </div>
                )}
                {c.manque && c.manque.length > 5 && (
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.danger, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>✕ Ce qui manquait</div>
                    <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6, background: C.dangerLight, borderRadius: 8, padding: "8px 10px" }}>{c.manque}</div>
                  </div>
                )}
                {c.exemple && c.exemple.length > 5 && (
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.purple, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>💡 Ce qu'il fallait dire</div>
                    <div style={{ fontSize: 12, fontStyle: "italic", color: C.purpleDark, lineHeight: 1.6, background: C.purpleLight, borderRadius: 8, padding: "8px 10px" }}>"{c.exemple}"</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Expression orale */}
      {pb?.oral && (
        <div style={{ background: "#fff", borderRadius: 14, border: `1.5px solid ${getLevelColor(pb.oral.level)}`, marginBottom: 16, overflow: "hidden" }}>
          <div style={{ background: getLevelBg(pb.oral.level), padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16 }}>🗣️</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.text, flex: 1 }}>Expression orale</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: getLevelColor(pb.oral.level), background: "#fff", borderRadius: 20, padding: "2px 10px", border: `1px solid ${getLevelColor(pb.oral.level)}`, flexShrink: 0 }}>{pb.oral.level || "—"}</span>
          </div>
          {pb.oral.comment && <div style={{ padding: "10px 14px", fontSize: 12, color: C.text, lineHeight: 1.6 }}>{pb.oral.comment}</div>}
        </div>
      )}

      {/* Recommandations */}
      {pb?.recommandations?.length > 0 && (
        <div style={{ background: C.purpleLight, borderRadius: 14, padding: "14px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Recommandations</div>
          {pb.recommandations.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <span style={{ background: "linear-gradient(135deg,#7C3AED,#DB2777)", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i+1}</span>
              <span style={{ fontSize: 13, color: C.purpleDark, lineHeight: 1.5 }}>{r}</span>
            </div>
          ))}
        </div>
      )}

      {/* Fallback texte brut */}
      {(!pb || (!pb.criteria?.length && !pb.appreciation)) && session.bilan && (
        <div style={{ background: C.bg2, borderRadius: 14, padding: "14px", fontSize: 13, lineHeight: 1.8, color: C.text, whiteSpace: "pre-wrap", borderLeft: `4px solid ${C.purple}`, marginBottom: 16 }}>
          {session.bilan}
        </div>
      )}

      <button onClick={onClose} style={{ width: "100%", padding: "12px", borderRadius: 12, border: `1px solid ${C.border}`, background: "#fff", color: C.text, fontWeight: 500, fontSize: 14, cursor: "pointer" }}>
        ← Retour à l'historique
      </button>
    </div>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────

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
  const [muted, setMuted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [parsedBilan, setParsedBilan] = useState(null);
  const [openSession, setOpenSession] = useState(null); // session historique ouverte
  const [pdfLoading, setPdfLoading] = useState(false);

  const bilanRef = useRef(null);

  const recognitionRef = useRef(null);
  const monoRef = useRef(""); // Accumule le monologue P0 hors state React
  const intervalRef = useRef(null);
  const bottomRef = useRef(null);
  const phase = PHASES[phaseIdx];

  const { speak, stop: stopTTS, speaking } = useTTS(muted);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSpeechSupported(false); setShowTextInput(true); }
    loadHistory().then(h => { setHistory(h); setHistLoading(false); });
    // Précharger les voix
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  useEffect(() => {
    if (running && timer > 0) { intervalRef.current = setInterval(() => setTimer(t => t - 1), 1000); }
    else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [running, timer]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const refreshHistory = async () => { const h = await loadHistory(); setHistory(h); };

  const getSystem = (p, c = null, isSim = false) => {
    const sev = juryMode === "sévère";
    if (p.id === "p0") return SYSTEM_P0;
    if (p.id === "p1") return makeSystemP1(c?.label || null, sev, isSim);
    return makeSystemP2(c?.label || null, sev, isSim);
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
    setMessages([]); setTranscript(""); monoRef.current = ""; setTimer(p.duration); setScreen("session");
    setParsedBilan(null); setShowExitConfirm(false);
    if (p.id !== "p0") {
      const sys = getSystem(p, cib);
      const first = await callAI([{ role: "user", content: "Commence l'entretien. Varie l'ordre des critères — ne commence pas toujours par C1, choisis un point d'entrée différent à chaque session." }], sys);
      setMessages([{ role: "assistant", content: first }]);
      speak(first);
    }
    setRunning(true);
  };

  const startFull = () => startPhase(0, "full");

  const startRecording = () => {
    stopTTS();
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "fr-FR"; rec.continuous = true; rec.interimResults = true;
    let final = "";
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          final += e.results[i][0].transcript + " ";
          // En P0, accumuler immédiatement dans le ref (fiable hors closure)
          monoRef.current += e.results[i][0].transcript + " ";
        } else interim = e.results[i][0].transcript;
      }
      setTranscript(final + interim);
    };
    rec.onerror = () => { setRecording(false); setShowTextInput(true); };
    rec.onend = () => setRecording(false);
    recognitionRef.current = rec; rec.start(); setRecording(true); setTranscript(""); final = "";
  };

  const stopAndSend = async () => {
    recognitionRef.current?.stop(); setRecording(false);
    if (phase.id === "p0") {
      // En P0 : monoRef accumule déjà, on affiche juste le transcript
      setTranscript("");
      return;
    }
    if (!transcript.trim()) return;
    await sendMessage(transcript.trim()); setTranscript("");
  };

  const sendMessage = async (text) => {
    const newMsgs = [...messages, { role: "user", content: text }];
    setMessages(newMsgs);
    const sys = getSystem(phase, ciblé);
    const reply = await callAI(newMsgs, sys);
    setMessages([...newMsgs, { role: "assistant", content: reply }]);
    speak(reply);
  };

  const sendText = async () => {
    if (!textInput.trim()) return;
    const t = textInput.trim(); setTextInput("");
    await sendMessage(t);
  };

  const endPhase = async () => {
    setRunning(false); stopTTS();
    recognitionRef.current?.stop(); setRecording(false);
    setTranscript("");

    let feedbackMsgs;
    let isSimulation = mode === "full";

    if (phase.id === "p0") {
      const mono = monoRef.current.trim();
      if (!mono) { setScreen("feedback"); return; }
      feedbackMsgs = [{ role: "user", content: "Voici la présentation personnelle du candidat à l'oral du BTS Communication E6 Bloc 2 : \"" + mono + "\". BILAN" }];
    } else {
      feedbackMsgs = [...messages, { role: "user", content: "BILAN" }];
    }

    const sys = phase.id === "p0" ? SYSTEM_P0 : getSystem(phase, ciblé, isSimulation);
    const bilan = await callAI(feedbackMsgs, sys);
    const allMsgs = phase.id === "p0"
      ? [{ role: "assistant", content: bilan }]
      : [...messages, { role: "assistant", content: bilan }];
    setMessages(allMsgs);
    const parsed = parseBilan(bilan, phase.id, isSimulation);
    setParsedBilan(parsed);
    const session = {
      date: new Date().toLocaleDateString("fr-FR"),
      phase: phase.label,
      phaseId: phase.id,
      ciblé: ciblé?.label || null,
      juryMode,
      bilan,
      mode,
      parsedBilan: parsed,
      messages: allMsgs,
    };
    await saveSession(session);
    await refreshHistory();
    setScreen("feedback");
  };

  const confirmExit = () => {
    stopTTS();
    recognitionRef.current?.stop();
    setRunning(false);
    setShowExitConfirm(false);
    reset();
  };

  const goNextPhase = () => {
    const next = phaseIdx + 1;
    if (next < PHASES.length) startPhase(next, "full");
    else reset();
  };

  const reset = () => {
    stopTTS();
    setScreen("home"); setMessages([]); setTranscript(""); setRunning(false);
    setTimer(0); setLoading(false); setShowTextInput(false); setTextInput("");
    setCiblé(null); setTab("modes"); setParsedBilan(null); setShowExitConfirm(false);
    setOpenSession(null);
  };

  const loadScript = (src) => new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });

  const generatePDF = async () => {
    if (!bilanRef.current) return;
    setPdfLoading(true);
    try {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
      const html2canvas = window.html2canvas;
      const { jsPDF } = window.jspdf;

      const element = bilanRef.current;
      // Scale 2 pour qualité, largeur fixée à 800px pour cohérence
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 800,
        windowWidth: 800,
      });

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();   // 210mm
      const pageH = pdf.internal.pageSize.getHeight();  // 297mm
      const marginTop = 18;
      const marginBottom = 14;
      const marginSide = 12;
      const headerH = 12;
      const footerH = 8;
      const contentW = pageW - marginSide * 2;
      const usableH = pageH - marginTop - marginBottom - headerH - footerH;

      const imgW = contentW;
      const imgH = (canvas.height * imgW) / canvas.width;
      const date = new Date().toLocaleDateString("fr-FR");
      const phaseName = phase.label;
      const totalPages = Math.ceil(imgH / usableH);

      for (let p = 0; p < totalPages; p++) {
        if (p > 0) pdf.addPage();

        // ── Header ──
        pdf.setFillColor(124, 58, 237);
        pdf.rect(0, 0, pageW, headerH, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "bold");
        pdf.text("BTS Communication · E6 Bloc 2", marginSide, 5);
        pdf.setFont("helvetica", "normal");
        pdf.text(phaseName + " · " + date, marginSide, 9.5);
        const modeLabel = mode === "full" ? "Simulation complète" : "Entraînement";
        pdf.text(modeLabel, pageW - marginSide, 7, { align: "right" });

        // ── Contenu découpé ──
        const srcY = p * usableH;
        const sliceH = Math.min(usableH, imgH - srcY);
        const srcYPx = (srcY / imgH) * canvas.height;
        const sliceHPx = (sliceH / imgH) * canvas.height;

        // Créer un canvas de la tranche
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceHPx;
        const ctx = sliceCanvas.getContext("2d");
        ctx.drawImage(canvas, 0, srcYPx, canvas.width, sliceHPx, 0, 0, canvas.width, sliceHPx);
        const sliceImg = sliceCanvas.toDataURL("image/png");
        pdf.addImage(sliceImg, "PNG", marginSide, marginTop + headerH, imgW, sliceH);

        // ── Footer ──
        const footerY = pageH - footerH + 2;
        pdf.setDrawColor(229, 231, 235);
        pdf.setLineWidth(0.3);
        pdf.line(marginSide, pageH - footerH, pageW - marginSide, pageH - footerH);
        pdf.setTextColor(107, 114, 128);
        pdf.setFontSize(6.5);
        pdf.setFont("helvetica", "normal");
        pdf.text("entrainement-oral-bts-com.vercel.app", marginSide, footerY + 3);
        pdf.text("Page " + (p + 1) + " / " + totalPages, pageW - marginSide, footerY + 3, { align: "right" });
      }

      const fileName = "BTS_Com_Bilan_" + phaseName.replace(/ /g, "_") + "_" + date.replace(/\//g, "-") + ".pdf";
      pdf.save(fileName);
    } catch (e) {
      console.error("PDF error:", e);
      alert("Erreur lors de la génération du PDF. Essayez depuis un navigateur.");
    } finally {
      setPdfLoading(false);
    }
  };



  const timerWarn = timer < 120;
  const timerColor = timerWarn ? "#FFD6D6" : timer < (phase?.duration / 4) ? "#FFEAB6" : "#fff";

  const openFiche = ficheOpen ? (ficheOpen.part === "p1" ? FICHES.p1[ficheOpen.idx] : FICHES.p2[ficheOpen.idx]) : null;

  // ─── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: C.text, minHeight: "100vh", background: C.bg }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; }
        @keyframes pulse { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(219,39,119,0.4)} 50%{transform:scale(1.06);box-shadow:0 0 0 12px rgba(219,39,119,0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes speakPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

        /* Messages */
        .msg-jury { background:#f3f4f6; border-radius:16px 16px 16px 4px; padding:12px 16px; margin-bottom:12px; font-size:14px; line-height:1.7; max-width:92%; animation:fadeIn 0.3s ease; word-break:break-word; }
        .msg-cand { background:#EDE9FE; border-radius:16px 16px 4px 16px; padding:12px 16px; margin-bottom:12px; font-size:14px; line-height:1.7; max-width:92%; margin-left:auto; color:#4C1D95; animation:fadeIn 0.3s ease; word-break:break-word; }

        /* Buttons */
        textarea:focus, input:focus { outline: 2px solid #7C3AED; }
        .tab-btn { flex:1; padding:10px 4px; border-radius:10px; border:none; cursor:pointer; font-size:12px; transition:all 0.2s; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .btn-primary { border:none; background:linear-gradient(135deg,#7C3AED 0%,#DB2777 100%); color:#fff; font-weight:700; cursor:pointer; border-radius:14px; transition:opacity 0.2s; }
        .btn-primary:active { opacity:0.85; }
        .btn-secondary { border:1px solid #e5e7eb; background:#fff; color:#1a1a1a; font-weight:500; cursor:pointer; border-radius:14px; transition:all 0.2s; }
        .btn-secondary:active { background:#f9fafb; }

        /* Layout containers */
        .page-container { width:100%; max-width:520px; margin:0 auto; padding:0 0 2rem; }
        .session-container { width:100%; max-width:560px; margin:0 auto; display:flex; flex-direction:column; height:100dvh; }

        /* ── MOBILE (défaut, <600px) ── */
        .home-hero { padding:1.5rem 1rem 1.25rem; }
        .home-hero h1 { font-size:24px; }
        .home-tabs { padding:6px; }
        .home-content { padding:1rem; }
        .session-header { padding:0.75rem 1rem; }
        .timer-display { font-size:26px; }
        .msg-area { padding:0.875rem 1rem; }
        .controls-area { padding:0.75rem 1rem 0.875rem; }
        .feedback-hero { padding:1.25rem 1rem; }
        .feedback-content { padding:0 1rem; }
        .mic-btn { width:68px; height:68px; }
        .mic-btn svg { width:24px; height:24px; }

        /* ── TABLETTE (≥600px) ── */
        @media (min-width: 600px) {
          .home-hero { padding:2rem 1.5rem 1.75rem; }
          .home-hero h1 { font-size:28px; }
          .home-tabs { padding:8px; }
          .home-content { padding:1.25rem; }
          .session-header { padding:1rem 1.25rem; }
          .timer-display { font-size:30px; }
          .msg-area { padding:1rem 1.25rem; }
          .controls-area { padding:0.875rem 1.25rem 1rem; }
          .feedback-hero { padding:1.5rem; }
          .feedback-content { padding:0 1.25rem; }
          .mic-btn { width:72px; height:72px; }
          .mic-btn svg { width:26px; height:26px; }
        }

        /* ── TABLETTE large (≥768px) ── */
        @media (min-width: 768px) {
          .page-container { max-width: 680px; }
          .home-hero { padding:2.5rem 2.5rem 2rem; }
          .home-hero h1 { font-size:30px; }
          .home-content { padding:1.5rem 2.5rem; }
          .feedback-hero { padding:2rem 2.5rem; }
          .feedback-content { padding:0 2.5rem; }
        }
        /* ── DESKTOP (≥1024px) ── */
        @media (min-width: 1024px) {
          .page-container { max-width: 100%; padding: 0; }
          .session-container { max-width: 100%; }

          /* ── HOME uniquement ── */
          .home-hero { padding: 4rem 8vw 3.5rem !important; }
          .home-hero h1 { font-size: 52px !important; line-height: 1.1; }
          .home-hero p { font-size: 20px !important; line-height: 1.6; }
          .home-hero > div > div:last-child span { font-size: 15px !important; padding: 6px 18px !important; }
          .home-tabs { padding: 10px 8vw !important; }
          .tab-btn { font-size: 17px !important; padding: 14px 8px !important; }
          .home-content { padding: 2.5rem 8vw 3rem !important; }

          /* Texte des éléments home */
          .home-content > div { font-size: 16px; }
          .home-content button > div > div:first-child { font-size: 16px !important; }
          .home-content button > div > div:last-child { font-size: 14px !important; }

          /* Simulation complète */
          .sim-btn { padding: 26px 28px !important; }
          .sim-btn > span:first-child { font-size: 38px !important; }

          /* Grille 3 colonnes pour les 3 parties */
          .phases-grid { display:grid !important; grid-template-columns:repeat(3,1fr); gap:20px; }
          .phases-grid > button { flex-direction:column !important; align-items:flex-start !important; padding:28px !important; margin-bottom:0 !important; }
          .phases-grid > button > span:first-child { font-size:36px !important; margin-bottom:14px; }
          .phases-grid .phase-label { font-size:18px !important; }
          .phases-grid .phase-sub { font-size:15px !important; margin-top: 4px !important; }
          .phases-grid .phase-time { font-size:15px !important; align-self:flex-end; margin-top:16px; }

          /* Grille 2 colonnes pour les critères */
          .criteria-grid { display:grid !important; grid-template-columns:1fr 1fr; gap:12px; }
          .criteria-grid > * { margin-bottom:0 !important; padding: 14px 16px !important; }
          .criteria-grid > * span:last-child { font-size:14px !important; }

          /* Feedback */
          .feedback-hero { padding: 3rem 8vw !important; }
          .feedback-content { padding: 0 8vw 2rem !important; }
        }

        /* Utilitaires responsive */
        .text-clamp { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .flex-wrap-gap { display:flex; flex-wrap:wrap; gap:8px; }
        img, svg { max-width:100%; }
      `}</style>

      {/* ── HOME ─────────────────────────────────────────────────────────────── */}
      {screen === "home" && (
        <div className="page-container">
          <div className="home-hero" style={{ background: C.grad, borderRadius: "0 0 28px 28px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -50, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
            <div style={{ position: "absolute", bottom: -30, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>BTS Communication · E6 Bloc 2</div>
              <h1 style={{ fontSize: 30, fontWeight: 700, color: "#fff", margin: "0 0 8px", lineHeight: 1.15 }}>Prêt pour ton oral ?</h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", margin: "0 0 1.25rem", lineHeight: 1.6 }}>Parle, le jury IA t'écoute et t'évalue comme à l'examen.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["40 min", "10 critères", "Notes /20", "Vocal 🔊"].map(t => (
                  <span key={t} style={{ background: "rgba(255,255,255,0.18)", color: "#fff", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="home-tabs" style={{ display: "flex", background: C.bg2, gap: 4 }}>
            {[["modes", "🎯 S'entraîner"], ["conseils", "📚 Conseils"], ["historique", "🕐 Historique"]].map(([t, label]) => (
              <button key={t} className="tab-btn" onClick={() => setTab(t)} style={{ background: tab === t ? C.bg : "transparent", color: tab === t ? C.purple : C.textSub, fontWeight: tab === t ? 600 : 400 }}>{label}</button>
            ))}
          </div>

          <div className="home-content">
            {tab === "modes" && (
              <>
                <div style={{ background: juryMode === "sévère" ? C.dangerLight : C.bg2, borderRadius: 16, padding: "12px 16px", marginBottom: "1.25rem", border: juryMode === "sévère" ? `2px solid ${C.danger}` : `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1, paddingRight: 12 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: juryMode === "sévère" ? C.danger : C.text }}>{juryMode === "sévère" ? "🔥 Mode jury sévère activé" : "😤 Mode jury sévère"}</div>
                      <div style={{ fontSize: 12, color: juryMode === "sévère" ? C.danger : C.textSub, marginTop: 2 }}>{juryMode === "sévère" ? "Le jury ne lâche rien" : "Relances sur chaque réponse vague"}</div>
                    </div>
                    <button onClick={() => setJuryMode(j => j === "classique" ? "sévère" : "classique")} style={{ width: 48, height: 28, borderRadius: 14, border: "none", background: juryMode === "sévère" ? C.danger : "#ccc", cursor: "pointer", position: "relative", flexShrink: 0 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: juryMode === "sévère" ? 22 : 3, transition: "left 0.2s" }} />
                    </button>
                  </div>
                </div>

                <button onClick={startFull} className="sim-btn" style={{ width: "100%", padding: "16px", borderRadius: 18, border: `2px solid ${C.purple}`, background: C.purpleLight, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14, marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: 28 }}>🚀</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: C.purpleDark, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      Simulation complète
                      <span style={{ fontSize: 10, fontWeight: 700, background: C.grad, color: "#fff", borderRadius: 20, padding: "3px 10px" }}>Recommandé</span>
                    </div>
                    <div style={{ fontSize: 12, color: C.purple, marginTop: 2 }}>40 min · Les 3 parties enchaînées</div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.purple, flexShrink: 0 }}>40 min</span>
                </button>

                <div style={{ fontSize: 12, color: C.textSub, textAlign: "center", marginBottom: "1rem", fontWeight: 500 }}>— ou s'entraîner sur une partie —</div>
                <div className="phases-grid" style={{ display:"flex", flexDirection:"column" }}>
                {PHASES.map((p, i) => (
                  <button key={p.id} onClick={() => startPhase(i, "single")} style={{ width: "100%", padding: "14px 16px", borderRadius: 16, border: `1px solid ${C.border}`, background: C.bg, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                    <span style={{ fontSize: 22, minWidth: 28, textAlign: "center" }}>{p.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="phase-label" style={{ fontWeight: 500, fontSize: 14 }}>{p.label}</div>
                      <div className="phase-sub" style={{ fontSize: 12, color: C.textSub, marginTop: 1 }}>{p.id === "p0" ? "Monologue guidé" : p.id === "p1" ? "5 critères — portfolio" : "5 compétences métier"}</div>
                    </div>
                    <span className="phase-time" style={{ fontSize: 12, color: C.textSub, flexShrink: 0 }}>{p.id === "p0" ? "5 min" : p.id === "p1" ? "15 min" : "20 min"}</span>
                  </button>
                ))}
                </div>

                <div style={{ fontSize: 12, color: C.textSub, textAlign: "center", margin: "1rem 0", fontWeight: 500 }}>— ou cibler un critère précis —</div>
                <div style={{ background: C.bg2, borderRadius: 16, padding: "12px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>📁 Partie 1 — Parcours</div>
                  <div className="criteria-grid" style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "1rem" }}>
                    {FICHES.p1.map((f) => (
                      <button key={f.id} onClick={() => startPhase(1, "ciblé", { part: "p1", label: f.label })} style={{ padding: "10px 12px", borderRadius: 12, border: `1px solid ${f.bg}`, background: f.bg, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: f.color, minWidth: 22, flexShrink: 0 }}>{f.id}</span>
                        <span style={{ fontSize: 13, color: C.text, flex: 1 }}>{f.label}</span>
                        <span style={{ fontSize: 11, color: f.color, flexShrink: 0 }}>→</span>
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>🗂️ Partie 2 — Dossier</div>
                  <div className="criteria-grid" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {FICHES.p2.map((f) => (
                      <button key={f.id} onClick={() => startPhase(2, "ciblé", { part: "p2", label: f.label })} style={{ padding: "10px 12px", borderRadius: 12, border: `1px solid ${f.bg}`, background: f.bg, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: f.color, minWidth: 22, flexShrink: 0 }}>{f.id}</span>
                        <span style={{ fontSize: 13, color: C.text, flex: 1 }}>{f.label}</span>
                        <span style={{ fontSize: 11, color: f.color, flexShrink: 0 }}>→</span>
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
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{f.label}</div>
                            <div style={{ fontSize: 12, color: C.textSub, marginTop: 1 }}>Conseils · Pièges · Exemple</div>
                          </div>
                          <span style={{ fontSize: 16, color: f.color, flexShrink: 0 }}>›</span>
                        </button>
                      ))}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>🗂️ Partie 2 — Dossier</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {FICHES.p2.map((f, i) => (
                        <button key={f.id} onClick={() => setFicheOpen({ part: "p2", idx: i })} style={{ padding: "12px 14px", borderRadius: 14, border: `1.5px solid ${f.bg}`, background: f.bg, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ background: f.color, color: "#fff", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{f.id}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{f.label}</div>
                            <div style={{ fontSize: 12, color: C.textSub, marginTop: 1 }}>Conseils · Pièges · Exemple</div>
                          </div>
                          <span style={{ fontSize: 16, color: f.color, flexShrink: 0 }}>›</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {tab === "historique" && (
              <>
                {openSession ? (
                  // ── Vue détail session historique ──
                  <HistoryDetail
                    session={openSession}
                    onClose={() => setOpenSession(null)}
                    getLevelColor={getLevelColor}
                    getLevelBg={getLevelBg}
                    C={C}
                  />
                ) : histLoading ? (
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
                    {history.map((s, i) => {
                      const pb = s.parsedBilan;
                      const appLevel = pb?.appreciation || pb?.globalNote != null ? null : null;
                      const noteVal = pb?.note != null ? pb.note : null;
                      const appVal = pb?.appreciation || null;
                      const levelColor = appVal ? getLevelColor(appVal) : noteVal != null ? (noteVal >= 7 ? C.success : noteVal >= 5 ? "#2563EB" : noteVal >= 3 ? C.warn : C.danger) : C.purple;
                      const levelBg = appVal ? getLevelBg(appVal) : C.bg2;
                      const levelLabel = appVal || (noteVal != null ? `${noteVal}/10` : null);
                      return (
                        <button key={i} onClick={() => setOpenSession(s)} style={{ width: "100%", background: C.bg, borderRadius: 16, padding: "14px 16px", marginBottom: 10, border: `1.5px solid ${C.border}`, cursor: "pointer", textAlign: "left", display: "block" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2 }}>
                                {s.phase}{s.ciblé ? ` · ${s.ciblé}` : ""}
                              </div>
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                                <span style={{ fontSize: 11, color: C.textSub }}>{s.date}</span>
                                {s.juryMode === "sévère" && <span style={{ fontSize: 10, fontWeight: 700, color: C.danger, background: C.dangerLight, borderRadius: 20, padding: "2px 8px" }}>🔥 Sévère</span>}
                                {s.mode === "full" && <span style={{ fontSize: 10, fontWeight: 600, color: C.purple, background: C.purpleLight, borderRadius: 20, padding: "2px 8px" }}>Simulation</span>}
                              </div>
                            </div>
                            {/* Badge niveau / note */}
                            {levelLabel && (
                              <div style={{ background: levelBg, border: `1.5px solid ${levelColor}`, borderRadius: 12, padding: "6px 12px", textAlign: "center", flexShrink: 0 }}>
                                <div style={{ fontSize: 15, fontWeight: 800, color: levelColor, lineHeight: 1 }}>{noteVal != null ? noteVal : ""}</div>
                                <div style={{ fontSize: 10, fontWeight: 600, color: levelColor, whiteSpace: "nowrap" }}>{appVal || "/10"}</div>
                              </div>
                            )}
                          </div>
                          {/* Mini barre de progression critères */}
                          {pb?.criteria?.length > 0 && (
                            <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                              {pb.criteria.map((c, ci) => (
                                <div key={ci} title={`${c.key}: ${c.level}`} style={{ flex: 1, height: 4, borderRadius: 2, background: c.color || C.border }} />
                              ))}
                            </div>
                          )}
                          <div style={{ fontSize: 11, color: C.purple, marginTop: 8, fontWeight: 500 }}>Voir le bilan complet →</div>
                        </button>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── SESSION ──────────────────────────────────────────────────────────── */}
      {screen === "session" && (
        <div className="session-container">

          {/* Modale de confirmation de sortie */}
          {showExitConfirm && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "0 1.5rem" }}>
              <div style={{ background: C.bg, borderRadius: 20, padding: "1.5rem", maxWidth: 320, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
                <div style={{ fontSize: 32, textAlign: "center", marginBottom: 12 }}>⚠️</div>
                <div style={{ fontSize: 16, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Arrêter la simulation ?</div>
                <div style={{ fontSize: 13, color: C.textSub, textAlign: "center", marginBottom: "1.5rem", lineHeight: 1.6 }}>Ta progression ne sera pas sauvegardée. Tu retourneras à l'accueil.</div>
                <button onClick={confirmExit} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: C.danger, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 8 }}>Oui, arrêter</button>
                <button onClick={() => setShowExitConfirm(false)} style={{ width: "100%", padding: 14, borderRadius: 12, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontWeight: 500, fontSize: 14, cursor: "pointer" }}>Continuer la simulation</button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="session-header" style={{ background: C.grad, borderRadius: "0 0 20px 20px", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {/* Bouton retour */}
                  <button onClick={() => setShowExitConfirm(true)} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
                  </button>
                  <div style={{ overflow: "hidden" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ciblé ? `Ciblé — ${ciblé.label}` : phase.label}</div>
                    {mode === "full" && (
                      <div style={{ display: "flex", gap: 4 }}>
                        {PHASES.map((p, i) => (
                          <span key={p.id} style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: i === phaseIdx ? "rgba(255,255,255,0.3)" : i < phaseIdx ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)", color: "#fff" }}>{p.icon}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                {/* Bouton sourdine */}
                <button onClick={() => { setMuted(m => !m); if (!muted) stopTTS(); }} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title={muted ? "Activer le son" : "Couper le son"}>
                  {muted ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={speaking ? "#fbbf24" : "#fff"} strokeWidth="2" strokeLinecap="round" style={{ animation: speaking ? "speakPulse 1s infinite" : "none" }}>
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                    </svg>
                  )}
                </button>
                <div className="timer-display" style={{ fontWeight: 700, color: timerColor, fontVariantNumeric: "tabular-nums" }}>{fmt(timer)}</div>
              </div>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.2)", borderRadius: 2 }}>
              <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.8)", width: `${(1 - timer / phase.duration) * 100}%`, transition: "width 1s linear" }} />
            </div>
          </div>

          {/* Messages */}
          <div className="msg-area" style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
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

          {/* Contrôles */}
          <div className="controls-area" style={{ borderTop: `1px solid ${C.border}`, background: C.bg, flexShrink: 0 }}>
            {phase.id === "p0" ? (
              /* ── Contrôles P0 : micro simple + bouton valider ── */
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                {/* Transcript en cours */}
                {transcript && (
                  <div style={{ width: "100%", background: C.purpleLight, borderRadius: 12, padding: "10px 14px", fontSize: 13, color: C.purpleDark, lineHeight: 1.6, maxHeight: 80, overflowY: "auto" }}>{transcript}</div>
                )}
                {/* Résumé du monologue accumulé */}
                {monoRef.current && !transcript && (
                  <div style={{ width: "100%", background: C.bg2, borderRadius: 10, padding: "8px 12px", fontSize: 12, color: C.textSub }}>
                    {monoRef.current.split(" ").length} mots enregistrés
                  </div>
                )}
                {/* Bouton micro */}
                <div style={{ display: "flex", gap: 14, alignItems: "center", justifyContent: "center" }}>
                  {!recording ? (
                    <button onClick={startRecording} disabled={loading} className="mic-btn" style={{ borderRadius: "50%", border: `3px solid ${C.purple}`, background: C.purpleLight, cursor: loading ? "not-allowed" : "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, opacity: loading ? 0.5 : 1 }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="2" strokeLinecap="round"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0014 0" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="8" y1="22" x2="16" y2="22" /></svg>
                      <span style={{ fontSize: 9, fontWeight: 700, color: C.purple }}>PARLER</span>
                    </button>
                  ) : (
                    <button onClick={stopAndSend} className="mic-btn" style={{ borderRadius: "50%", border: `3px solid ${C.pink}`, background: C.pinkLight, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, animation: "pulse 1.2s infinite" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill={C.pink}><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                      <span style={{ fontSize: 9, fontWeight: 700, color: C.pink }}>PAUSE</span>
                    </button>
                  )}
                </div>
                {/* Bouton valider — toujours visible */}
                <button
                  onClick={endPhase}
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: "100%", padding: "15px", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}
                >
                  {loading
                    ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Analyse en cours…</>
                    : "✅ Valider ma présentation"
                  }
                </button>
                <button onClick={() => setShowTextInput(v => !v)} style={{ background: "none", border: "none", fontSize: 13, color: C.textSub, cursor: "pointer", textDecoration: "underline" }}>
                  {showTextInput ? "🎤 Micro" : "✏️ Dicter par écrit"}
                </button>
                {showTextInput && (
                  <div style={{ width: "100%", display: "flex", gap: 8 }}>
                    <textarea value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="Écris ta présentation ici…" rows={3} style={{ flex: 1, padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 13, resize: "none", fontFamily: "inherit" }} />
                    <button onClick={() => { if (textInput.trim()) { monoRef.current += " " + textInput.trim(); setTextInput(""); } }} disabled={!textInput.trim()} style={{ padding: "10px 14px", borderRadius: 12, border: "none", background: textInput.trim() ? C.grad : C.bg2, color: textInput.trim() ? "#fff" : C.textSub, fontWeight: 600, cursor: "pointer", alignSelf: "flex-end" }}>+</button>
                  </div>
                )}
              </div>
            ) : (
              /* ── Contrôles P1/P2 ── */
              !showTextInput ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                {transcript && (
                  <div style={{ width: "100%", background: C.purpleLight, borderRadius: 12, padding: "10px 14px", fontSize: 13, color: C.purpleDark, lineHeight: 1.6, maxHeight: 100, overflowY: "auto" }}>{transcript}</div>
                )}
                <div style={{ display: "flex", gap: 14, alignItems: "center", justifyContent: "center", width: "100%" }}>
                  {!recording ? (
                    <button onClick={startRecording} disabled={loading} className="mic-btn" style={{ borderRadius: "50%", border: `3px solid ${C.purple}`, background: C.purpleLight, cursor: loading ? "not-allowed" : "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, opacity: loading ? 0.5 : 1, flexShrink: 0 }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="2" strokeLinecap="round"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0014 0" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="8" y1="22" x2="16" y2="22" /></svg>
                      <span style={{ fontSize: 9, fontWeight: 700, color: C.purple }}>PARLER</span>
                    </button>
                  ) : (
                    <button onClick={stopAndSend} className="mic-btn" style={{ borderRadius: "50%", border: `3px solid ${C.pink}`, background: C.pinkLight, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, animation: "pulse 1.2s infinite", flexShrink: 0 }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill={C.pink}><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                      <span style={{ fontSize: 9, fontWeight: 700, color: C.pink }}>ENVOYER</span>
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", gap: 20 }}>
                  <button onClick={() => setShowTextInput(true)} style={{ background: "none", border: "none", fontSize: 13, color: C.textSub, cursor: "pointer", textDecoration: "underline" }}>✏️ Écrire</button>
                  {!loading && messages.length > 2 && (
                    <button onClick={endPhase} style={{ background: "none", border: "none", fontSize: 13, color: C.purple, cursor: "pointer", textDecoration: "underline" }}>📊 Voir le bilan</button>
                  )}
                </div>
              </div>
              ) : (
              <div>
                <div style={{ display: "flex", gap: 8 }}>
                  <textarea value={textInput} onChange={e => setTextInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendText(); } }} placeholder="Tapez votre réponse…" rows={3} style={{ flex: 1, padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, resize: "none", fontFamily: "inherit" }} />
                  <button onClick={sendText} disabled={!textInput.trim() || loading} style={{ padding: "10px 16px", borderRadius: 12, border: "none", background: textInput.trim() && !loading ? C.grad : C.bg2, color: textInput.trim() && !loading ? "#fff" : C.textSub, fontWeight: 600, cursor: "pointer", fontSize: 14, alignSelf: "flex-end" }}>→</button>
                </div>
                <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
                  {speechSupported && <button onClick={() => setShowTextInput(false)} style={{ background: "none", border: "none", fontSize: 13, color: C.textSub, cursor: "pointer", textDecoration: "underline" }}>🎤 Micro</button>}
                  {!loading && messages.length > 2 && (
                    <button onClick={endPhase} style={{ background: "none", border: "none", fontSize: 13, color: C.purple, cursor: "pointer", textDecoration: "underline" }}>📊 Voir le bilan</button>
                  )}
                </div>
              </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ── FEEDBACK ─────────────────────────────────────────────────────────── */}
      {screen === "feedback" && (() => {
        const pb = parsedBilan;
        const isSimFeedback = pb?.type === "simulation";
        const isP0Feedback = pb?.type === "p0";
        const noteColor = pb?.note >= 6 ? (pb?.note >= 8 ? C.success : "#2563EB") : C.danger;
        return (
        <div className="page-container">
          {/* Hero */}
          <div className="feedback-hero" style={{ background: C.grad, borderRadius: "0 0 24px 24px", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {isSimFeedback ? "Simulation — Résultat officiel" : "Retour du jury"}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>
              {ciblé ? ciblé.label : phase.label}
            </h2>
            {isSimFeedback && pb?.note != null ? (
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, background: "rgba(255,255,255,0.2)", borderRadius: 14, padding: "8px 16px", width: "fit-content" }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: "#fff" }}>{pb.note}</span>
                <span style={{ fontSize: 16, color: "rgba(255,255,255,0.8)" }}>/10</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginLeft: 4 }}>
                  {phase.id === "p1" ? "Partie 1" : "Partie 2"}
                </span>
              </div>
            ) : pb?.appreciation ? (
              <AppreciationBadge level={pb.appreciation} />

            ) : null}
          </div>

          <div className="feedback-content">

            <div ref={bilanRef} style={{ background: "#ffffff", paddingBottom: 8 }}>

            {/* ─ P0 : présentation personnelle ─ */}
            {isP0Feedback && pb?.criteria?.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Les 5 points obligatoires</div>
                {pb.criteria.map((c, i) => (
                  <div key={i} style={{ background: C.bg, borderRadius: 16, border: `1.5px solid ${c.color}`, marginBottom: 14, overflow: "hidden" }}>
                    <div style={{ background: c.bg, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ background: c.color, color: "#fff", borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i+1}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.text, flex: 1 }}>{c.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: c.color, background: "#fff", borderRadius: 20, padding: "2px 10px", border: `1px solid ${c.color}`, flexShrink: 0, whiteSpace: "nowrap" }}>{c.level || "—"}</span>
                    </div>
                    <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                      {hasBien(c.bien) && (
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: C.success, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>✓ Ce qui était bien</div>
                          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6, background: C.successLight, borderRadius: 10, padding: "8px 12px" }}>{c.bien}</div>
                        </div>
                      )}
                      {c.manque && c.manque.length > 5 && (
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: C.danger, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>✕ Ce qui manquait</div>
                          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6, background: C.dangerLight, borderRadius: 10, padding: "8px 12px" }}>{c.manque}</div>
                        </div>
                      )}
                      {c.exemple && c.exemple.length > 5 && (
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: C.purple, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>💡 Ce qu'il fallait dire</div>
                          <div style={{ fontSize: 13, fontStyle: "italic", color: C.purpleDark, lineHeight: 1.6, background: C.purpleLight, borderRadius: 10, padding: "8px 12px" }}>"{c.exemple}"</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {pb.oral && (
                  <div style={{ background: C.bg, borderRadius: 16, border: `1.5px solid ${getLevelColor(pb.oral.level)}`, overflow: "hidden", marginBottom: 14 }}>
                    <div style={{ background: getLevelBg(pb.oral.level), padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 16 }}>🗣️</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.text, flex: 1 }}>Expression orale</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: getLevelColor(pb.oral.level), background: "#fff", borderRadius: 20, padding: "2px 10px", border: `1px solid ${getLevelColor(pb.oral.level)}`, flexShrink: 0 }}>{pb.oral.level || "—"}</span>
                    </div>
                    {pb.oral.comment && <div style={{ padding: "12px 14px", fontSize: 13, color: C.text, lineHeight: 1.6 }}>{pb.oral.comment}</div>}
                  </div>
                )}
                {pb?.recommandations?.length > 0 && (
                  <div style={{ background: C.purpleLight, borderRadius: 14, padding: "14px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Recommandations prioritaires</div>
                    {pb.recommandations.map((r, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                        <span style={{ background: C.grad, color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i+1}</span>
                        <span style={{ fontSize: 13, color: C.purpleDark, lineHeight: 1.5 }}>{r}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─ SIMULATION : grille officielle ─ */}
            {isSimFeedback && pb?.criteria && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Grille officielle</div>
                {pb.criteria.map((c, i) => <CritereCard key={i} {...c} />)}
                {pb.oral && (
                  <CritereCard label="Expression orale" level={pb.oral.level} comment={pb.oral.comment} color={getLevelColor(pb.oral.level)} bg={getLevelBg(pb.oral.level)} />
                )}
                {pb.palier && (
                  <div style={{ background: C.warnLight, borderRadius: 12, padding: "10px 14px", marginTop: 8, fontSize: 13, color: C.warn, borderLeft: `3px solid ${C.warn}` }}>
                    <strong>Palier appliqué :</strong> {pb.palier}
                  </div>
                )}
                {pb.note != null && (
                  <div style={{ background: C.bg2, borderRadius: 14, padding: "14px 16px", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Note {phase.id === "p1" ? "Partie 1" : "Partie 2"}</span>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 28, fontWeight: 800, color: noteColor }}>{pb.note}</span>
                      <span style={{ fontSize: 14, color: C.textSub }}>/10</span>
                      <NoteBar note={pb.note} max={10} color={noteColor} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─ ENTRAÎNEMENT : fiches pédagogiques par critère ─ */}
            {!isSimFeedback && pb?.criteria?.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Analyse par critère</div>
                {pb.criteria.map((c, i) => (
                  <div key={i} style={{ background: C.bg, borderRadius: 16, border: `1.5px solid ${c.color}`, marginBottom: 14, overflow: "hidden" }}>
                    {/* En-tête critère */}
                    <div style={{ background: c.bg, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ background: c.color, color: "#fff", borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{c.key}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.text, flex: 1 }}>{c.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: c.color, background: "#fff", borderRadius: 20, padding: "3px 10px", border: `1px solid ${c.color}`, flexShrink: 0, whiteSpace: "nowrap" }}>{c.level || "—"}</span>
                    </div>
                    <div style={{ padding: "12px 14px" }}>
                      {/* Points positifs */}
                      {hasBien(c.bien) && (
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.success, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>✓ Ce qui était bien</div>
                          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6, background: C.successLight, borderRadius: 10, padding: "8px 12px" }}>{c.bien}</div>
                        </div>
                      )}
                      {/* Ce qui manquait */}
                      {c.manque && c.manque.length > 5 && (
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.danger, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>✕ Ce qui manquait</div>
                          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6, background: C.dangerLight, borderRadius: 10, padding: "8px 12px" }}>{c.manque}</div>
                        </div>
                      )}
                      {/* Exemple de bonne réponse */}
                      {c.exemple && c.exemple.length > 5 && (
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.purple, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>💡 Ce qu'il fallait dire</div>
                          <div style={{ fontSize: 13, fontStyle: "italic", color: C.purpleDark, lineHeight: 1.6, background: C.purpleLight, borderRadius: 10, padding: "8px 12px" }}>"{c.exemple}"</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {/* Expression orale */}
                {pb.oral && (
                  <div style={{ background: C.bg, borderRadius: 16, border: `1.5px solid ${getLevelColor(pb.oral.level)}`, overflow: "hidden" }}>
                    <div style={{ background: getLevelBg(pb.oral.level), padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 16 }}>🗣️</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.text, flex: 1 }}>Expression orale</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: getLevelColor(pb.oral.level), background: "#fff", borderRadius: 20, padding: "3px 10px", border: `1px solid ${getLevelColor(pb.oral.level)}`, flexShrink: 0 }}>{pb.oral.level || "—"}</span>
                    </div>
                    {pb.oral.comment && (
                      <div style={{ padding: "12px 14px", fontSize: 13, color: C.text, lineHeight: 1.6 }}>{pb.oral.comment}</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Points forts (simulation) */}
            {isSimFeedback && pb?.pointsForts?.length > 0 && (
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Points forts</div>
                <div style={{ background: C.successLight, borderRadius: 14, padding: "12px 14px" }}>
                  {pb.pointsForts.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                      <span style={{ color: C.success, fontWeight: 700, flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Points faibles (simulation) */}
            {isSimFeedback && pb?.pointsFaibles?.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Points à améliorer</div>
                <div style={{ background: C.dangerLight, borderRadius: 14, padding: "12px 14px" }}>
                  {pb.pointsFaibles.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                      <span style={{ color: C.danger, fontWeight: 700, flexShrink: 0 }}>✕</span>
                      <span style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommandations */}
            {pb?.recommandations?.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Recommandations</div>
                <div style={{ background: C.purpleLight, borderRadius: 14, padding: "12px 14px" }}>
                  {pb.recommandations.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                      <span style={{ background: C.grad, color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i+1}</span>
                      <span style={{ fontSize: 13, color: C.purpleDark, lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback brut si parsing insuffisant */}
            {(!pb || (!pb.criteria?.length && !pb.appreciation)) && (
              <>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Feedback du jury</div>
                <div style={{ background: C.bg2, borderRadius: 16, padding: "16px", fontSize: 14, lineHeight: 1.8, marginBottom: "1.5rem", whiteSpace: "pre-wrap", borderLeft: `4px solid ${C.purple}` }}>
                  {messages.filter(m => m.role === "assistant").slice(-1)[0]?.content}
                </div>
              </>
            )}

            {/* Échanges */}
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Échanges de la session</div>
            <div style={{ background: C.bg2, borderRadius: 16, padding: "12px 16px", marginBottom: "1.5rem", maxHeight: 260, overflowY: "auto" }}>
              {messages.slice(0, -1).map((m, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: m.role === "assistant" ? C.purple : C.pink, marginBottom: 3, textTransform: "uppercase" }}>{m.role === "assistant" ? "Jury" : "Toi"}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.6, color: C.text, whiteSpace: "pre-wrap" }}>{m.content}</div>
                </div>
              ))}
            </div>

            </div>{/* fin bilanRef */}

            {/* Actions */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "1.25rem", marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: 10 }}>

              {/* Bouton PDF */}
              <button onClick={generatePDF} disabled={pdfLoading} className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: pdfLoading ? 0.7 : 1 }}>
                {pdfLoading ? (
                  <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Génération en cours…</>
                ) : (
                  <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg> Télécharger le PDF</>
                )}
              </button>


              {mode === "full" && phaseIdx < PHASES.length - 1 && (
                <button onClick={goNextPhase} className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: 15 }}>
                  Partie suivante → {PHASES[phaseIdx + 1].icon}
                </button>
              )}

              <button onClick={reset} className="btn-secondary" style={{ width: "100%", padding: "14px", fontSize: 15 }}>
                ← Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}
