export type ProjectScreenshot = { file: string; caption: string; portrait?: boolean };
export type PortfolioProject = {
  id: string; name: string; subtitle: string; category: string; description: string;
  features: string[]; tags: string; screenshots: ProjectScreenshot[];
  live?: string; repo?: string; privateRepo?: boolean;
  download?: { file: string; label: string; size: string; url?: string };
};
export const projects: PortfolioProject[] = [
  {
    id: "math-agent",
    name: "Math Agent",
    subtitle: "AI Mathematics Solver",
    category: "Web · AI Education",
    description: "A mathematics assistant that routes questions by difficulty, explains each step, and asks a second model to review the answer. The public text demo runs in the browser; the repository also contains the original Python workflow for image and audio input, PDF generation, and optional Google delivery.",
    features: [
      "Live text solving with difficulty-based model routing",
      "Step-by-step answers with a separate AI review",
      "Responsive demo with browser PDF export and limited public requests"
    ],
    tags: "Next.js · TypeScript · Python · FastAPI · LangGraph · AI",
    screenshots: [
      { file: "math-agent-home.png", caption: "Live demo — enter a math problem or choose a sample." },
      { file: "math-agent-solution.png", caption: "Worked result — inspect the reasoning, final answer, and AI review." },
      { file: "math-agent-mobile.png", caption: "Mobile view — the solver adapts to a narrow screen.", portrait: true }
    ],
    live: "https://math-agent-demo.vercel.app",
    repo: "https://github.com/eng-Islam-Mohamed/math-agent"
  },
  {
    "id": "ai-opportunity-hunter",
    "name": "AI Opportunity Hunter",
    "subtitle": "Evidence-Based B2B Opportunity Intelligence",
    "category": "Web · AI",
    "description": "A private research workspace that helps service providers turn a target market and an offer into a ranked shortlist of potential business opportunities. The public interactive demo illustrates how evidence, a detected problem, and a practical proposed service come together in a clear opportunity brief.",
    "features": [
      "Market and service focused opportunity discovery",
      "Ranked shortlists with evidence, scores, and recommended offers",
      "Opportunity dossiers that explain the reasoning behind each lead"
    ],
    "tags": "Next.js · B2B intelligence · AI · Research workflow",
    "screenshots": [
      {
        "file": "opportunity-hunter/home.png",
        "caption": "Landing page — introduce the evidence-first approach to B2B opportunity research."
      },
      {
        "file": "opportunity-hunter/demo.png",
        "caption": "Interactive demo — an illustrative ranked shortlist with detected problems, recommended offers, and scores."
      }
    ],
    "live": "https://ai-opportunity-hunter-gules.vercel.app/"
  },
  {
    "id": "worldlens",
    "name": "WorldLens",
    "subtitle": "Multilingual Country Explorer",
    "category": "Web · AI",
    "description": "Explore countries in any language. WorldLens uses Gemini to resolve native names, abbreviations, and imperfect spelling, then presents trusted geographic facts in a clear editorial atlas.",
    "features": [
      "Multilingual country search and typo interpretation",
      "Structured country profiles from local reference data",
      "Interactive maps with Leaflet"
    ],
    "tags": "Next.js · TypeScript · Gemini · OpenRouter · Leaflet",
    "screenshots": [
      {
        "file": "worldlens.png",
        "caption": "Editorial landing experience — a clear, multilingual gateway to country discovery."
      },
      {
        "file": "worldlens-features.png",
        "caption": "Core experience — natural-language search, structured facts, and geographic context."
      },
      {
        "file": "worldlens-workflow.png",
        "caption": "AI country finder — search with native scripts, local names, abbreviations, or imperfect spelling."
      }
    ],
    "live": "https://world-between-your-hands.vercel.app",
    "repo": "https://github.com/eng-Islam-Mohamed/Worldlens"
  },
  {
    "id": "chronolivre",
    "name": "ChronoLivre",
    "subtitle": "AI History Research Library",
    "category": "Web · AI",
    "description": "A history research workspace that turns questions into organized historical dossiers with timelines, context, and connected topics.",
    "features": [
      "Structured historical dossiers and timelines",
      "Connected people, events, and subjects",
      "Comparison views and a personal research library"
    ],
    "tags": "Next.js · TypeScript · React · AI",
    "screenshots": [
      {
        "file": "chronolivre.png",
        "caption": "Home — explore people, civilizations, and turning points."
      },
      {
        "file": "chronolivre-search.png",
        "caption": "Search workspace — natural-language questions and suggested research paths."
      },
      {
        "file": "chronolivre-detail.png",
        "caption": "Historical dossier — an existing capture of the research view."
      },
      {
        "file": "chronolivre-compare.png",
        "caption": "Compare workspace — organize two topics side by side."
      }
    ],
    "live": "https://chronolivre-ai.vercel.app",
    "repo": "https://github.com/eng-Islam-Mohamed/History"
  },
  {
    "id": "sanad",
    "name": "Sanad",
    "subtitle": "Hadith Verification App",
    "category": "Android · Research",
    "description": "An Arabic Android application for checking ahadith nabawiya before sharing them. Enter a hadith or part of it to look up its grading, source, and explanation in a clear interface.",
    "features": [
      "Hadith lookup with source and grading information",
      "Text, voice, and image OCR entry options",
      "Guest access and saved favorites with account sign-in"
    ],
    "tags": "Android · Arabic UI · Hadith research · OCR",
    "screenshots": [
      {
        "file": "sanad/welcome.png",
        "caption": "Welcome — sign in, create an account, or continue as a guest.",
        "portrait": true
      },
      {
        "file": "sanad/verification.png",
        "caption": "Verification home — text, voice, and image entry options.",
        "portrait": true
      }
    ],
    "download": {
      "file": "sanad.apk",
      "label": "Download Sanad for Android",
      "size": "59.2 MB",
      "url": "https://github.com/eng-Islam-Mohamed/Portfolio/releases/download/portfolio-apps-v1/sanad.apk"
    }
  },
  {
    "id": "wasslago",
    "name": "Wasslago",
    "subtitle": "Client & Translator Platform",
    "category": "Web · Marketplace",
    "description": "A translation services platform connecting clients with professional translators. Clients can explore translator profiles and prepare document translation requests in a guided workflow.",
    "features": [
      "Professional translator profiles and language information",
      "Document requests with source and target languages",
      "Translation workflows, messaging, and request management"
    ],
    "tags": "Next.js · TypeScript · Translation workflows",
    "screenshots": [
      {
        "file": "wasslago/home.png",
        "caption": "Official website — connect directly with certified translators and choose a language pair."
      },
      {
        "file": "wasslago/services.png",
        "caption": "Translation services — practical use cases for work, study, immigration, and official documents."
      },
      {
        "file": "wasslago/solutions.png",
        "caption": "Platform values — direct communication, secure payments, flexible access, and digital or physical delivery."
      },
      {
        "file": "wasslago/clients.png",
        "caption": "Client experience — immediate access to independent certified translators."
      },
      {
        "file": "wasslago/trust.png",
        "caption": "Customer trust — verified reviews and service-quality highlights."
      },
      {
        "file": "wasslago-request.jpg",
        "caption": "Client workspace — guided translation request with language and service choices."
      },
      {
        "file": "wasslago-profile.jpg",
        "caption": "Translator profile — languages, availability, and service information."
      },
      {
        "file": "wasslago-mobile.jpg",
        "caption": "Responsive client workflow — translation requests remain clear and usable on mobile.",
        "portrait": true
      }
    ],
    "live": "https://www.wasslago.com/ar/",
    "repo": "https://github.com/eng-Islam-Mohamed/wasslago-app",
    "privateRepo": true
  },
  {
    "id": "leadagent",
    "name": "LeadAgent",
    "subtitle": "AI Dental Lead Follow-Up System",
    "category": "Web · AI Automation",
    "description": "An AI lead follow-up system for dental clinics, pairing a patient-facing appointment request website with automated lead qualification, replies, and follow-up workflows.",
    "features": [
      "Patient-facing clinic and appointment request interface",
      "AI lead qualification and customer reply workflows",
      "Scheduled follow-ups, lead status tracking, and owner notifications"
    ],
    "tags": "Next.js · TypeScript · n8n · AI automation",
    "screenshots": [
      {
        "file": "leadagent-home.png",
        "caption": "Patient website — Bright Smile dental clinic consultation page."
      },
      {
        "file": "leadagent-request.png",
        "caption": "Appointment request — the patient entry point for the follow-up system."
      }
    ],
    "live": "https://leadpagent-patient.vercel.app/clinics/bright-smile"
  },
  {
    "id": "quantum-tutor",
    "name": "Quantum Tutor",
    "subtitle": "AI Quantum Mechanics Tutor",
    "category": "Web · AI Education",
    "description": "An AI tutoring interface for quantum mechanics, designed for derivations, conceptual explanations, and equation walkthroughs. Session context and formula-rich reports support continued learning.",
    "features": [
      "Conversational questions and step-by-step explanations",
      "Session memory and multilingual responses",
      "LaTeX formula rendering and optional emailed reports"
    ],
    "tags": "JavaScript · HTML · CSS · MathJax · AI agent",
    "screenshots": [
      {
        "file": "quantum-home.png",
        "caption": "Local app preview — animated quantum waves and tutor introduction."
      },
      {
        "file": "quantum-assistant.png",
        "caption": "Local app preview — the tutor workspace and suggested questions."
      }
    ],
    "repo": "https://github.com/eng-Islam-Mohamed/Quantum-Tutor",
    "privateRepo": true
  },
  {
    "id": "outsider",
    "name": "The Outsider Game",
    "subtitle": "Arabic Social Deduction Party Game",
    "category": "Android · Game",
    "description": "A Flutter party game based on برا السالفة. Players share clues, vote, and uncover the outsider, with Arabic-first play, multilingual interfaces, and multiplayer room support.",
    "features": [
      "Local party rounds with private role cards and voting",
      "Multilingual interface and topic translation",
      "Online multiplayer rooms and customizable themes"
    ],
    "tags": "Flutter · Dart · Android · Multiplayer",
    "screenshots": [
      {
        "file": "outsider/home.png",
        "caption": "Home — start a party round, choose a mode, or join an online room.",
        "portrait": true
      },
      {
        "file": "outsider/voting.png",
        "caption": "Voting phase — players choose who they suspect is the outsider.",
        "portrait": true
      },
      {
        "file": "outsider/results.png",
        "caption": "Results — reveal the outcome of the round.",
        "portrait": true
      }
    ],
    "repo": "https://github.com/eng-Islam-Mohamed/The-Impostor",
    "download": {
      "file": "the-outsider.apk",
      "label": "Download The Outsider for Android",
      "size": "69.1 MB",
      "url": "https://github.com/eng-Islam-Mohamed/Portfolio/releases/download/portfolio-apps-v1/the-outsider.apk"
    }
  },
  {
    "id": "vault",
    "name": "My Vault",
    "subtitle": "AI Personal Knowledge Vault",
    "category": "Web & Mobile · RAG",
    "description": "A personal knowledge vault for images, files, and notes, available on web and mobile. Its AI assistant uses retrieval-augmented generation (RAG) to help answer questions about stored content.",
    "features": [
      "Organized storage for images, documents, and notes",
      "Categories, tags, search, and saved content",
      "AI questions grounded in vault content through RAG"
    ],
    "tags": "Flutter · Dart · Web & Mobile · AI · RAG",
    "screenshots": [
      {
        "file": "vault/home-demo.png",
        "caption": "Isolated local demo — vault home with sample content."
      },
      {
        "file": "vault/mobile.png",
        "caption": "Isolated local demo — responsive layout on a mobile screen.",
        "portrait": true
      }
    ],
    "repo": "https://github.com/eng-Islam-Mohamed/vault",
    "privateRepo": true
  }
];
