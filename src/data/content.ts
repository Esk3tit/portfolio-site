// ─── Portfolio Content Data ───
// Single source of truth for all portfolio copy.
// TODO: Replace public/resume.pdf with Khai's actual resume PDF.

// ─── Types ───

export interface Experience {
  company: string;
  title: string;
  dates: string;
  bullets: string[];
  emoji: string;
}

export interface Project {
  emoji: string;
  title: string;
  description: string;
  tags: string[];
  headerColor: string;
  github?: string;
  liveUrl?: string;
  problem: string;
  approach: string;
  highlights: string[];
}

export interface SkillCategory {
  name: string;
  emoji: string;
  skills: string[];
}

export interface ContactLink {
  name: string;
  emoji: string;
  href: string;
  label: string;
}

export interface HeroContent {
  greeting: string;
  name: string;
  tagline: string;
  ctaText: string;
}

export interface AboutPanel {
  emoji: string;
  title: string;
  content: string;
}

// ─── Hero ───

export const heroContent: HeroContent = {
  greeting: "Hey there \u{1F44B}",
  name: "Khai",
  tagline: "I build software. Sometimes it's good. \u{1F60E}",
  ctaText: "See my work \u{1F447}",
};

// ─── About ───

export const aboutPanels: AboutPanel[] = [
  {
    emoji: "\u{1F680}",
    title: "What I Do",
    content:
      "I'm a developer obsessed with the intersection of engineering and design. I build interfaces that feel polished and effortless -- the kind where the tech disappears and the interaction just flows. From complex web apps to thoughtful component libraries, I bring an eye for detail and code that actually stands up over time.",
  },
  {
    emoji: "\u{1F3AE}",
    title: "When I'm Not Coding",
    content:
      "You'll find me geeking out over motion design, fiddling with animation easing curves, or going down typography rabbit holes. I think the little moments of delight are what make software feel alive. Great software lives at the edge of engineering and aesthetics -- where performance meets polish \u2728",
  },
];

// ─── Experience ───
// TODO: Khai -- verify dates, titles, and bullet points for accuracy.

export const experiences: Experience[] = [
  {
    company: "RealAssist.AI",
    title: "Software Engineer",
    dates: "2023 -- Present",
    emoji: "\u{1F3E0}",
    bullets: [
      "Built full-stack property analysis platform processing 10k+ reports/month with React, Node.js, and PostgreSQL",
      "Architected real-time data pipeline integrating 5+ third-party APIs for automated property insights",
      "Led frontend redesign that improved user engagement by 40% through interactive data visualizations",
    ],
  },
  {
    company: "UC Davis",
    title: "Computer Science, B.S.",
    dates: "2019 -- 2023",
    emoji: "\u{1F393}",
    bullets: [
      "Studied algorithms, systems programming, and software engineering fundamentals",
      "Built multiple full-stack projects spanning web dev, systems, and developer tooling",
    ],
  },
];

// ─── Skills ───

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    emoji: "\u{1F4DD}",
    skills: ["Python", "C++", "JavaScript", "TypeScript", "Go", "Java", "SQL"],
  },
  {
    name: "Frameworks & Libraries",
    emoji: "\u{2699}\uFE0F",
    skills: ["React", "Next.js", "Node.js", "Express", "Flask", "Django"],
  },
  {
    name: "Cloud & DevOps",
    emoji: "\u2601\uFE0F",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Git", "Linux"],
  },
  {
    name: "Design & UI",
    emoji: "\u{1F3A8}",
    skills: ["Tailwind CSS", "GSAP", "Figma", "Motion Design", "Responsive Design"],
  },
];

// ─── Projects ───
// TODO: Khai -- enrich descriptions and verify details for each project.

export const projects: Project[] = [
  {
    emoji: "\u{1F3C6}",
    title: "L33tC0de Tracker",
    description:
      "A webapp to track your LeetCode grind so you can finally stop pretending you remember two-pointer from three months ago.",
    tags: ["React", "Node.js", "MongoDB", "LeetCode API"],
    headerColor: "#8a6474",
    github: "https://github.com/Esk3tit/l33tcode-tracker",
    problem:
      "LeetCode's built-in tracking is minimal -- you can't easily see which patterns you're weak on or when you last practiced a topic.",
    approach:
      "Built a full-stack tracker with spaced repetition logic that surfaces problems you're due to revisit, grouped by pattern and difficulty.",
    highlights: [
      "Spaced repetition algorithm for optimal review scheduling",
      "Pattern-based grouping (sliding window, DP, graphs, etc.)",
      "Progress dashboard with streak tracking and weak-spot analysis",
    ],
  },
  {
    emoji: "\u{1F4F1}",
    title: "AIPhone But Better",
    description:
      "An AI-powered phone interface that's somehow less annoying than your actual phone. Voice-first, context-aware, and actually useful.",
    tags: ["Python", "OpenAI API", "React Native", "WebSocket"],
    headerColor: "#7a5ea6",
    github: "https://github.com/Esk3tit/aiphone-but-better",
    problem:
      "Existing AI assistants feel disconnected from how you actually use your phone -- they're bolted on, not built in.",
    approach:
      "Created a voice-first AI interface that maintains conversation context and integrates with device capabilities for natural interactions.",
    highlights: [
      "Real-time voice processing with streaming responses",
      "Persistent conversation context across sessions",
      "Natural language device control (calls, messages, search)",
    ],
  },
  {
    emoji: "\u{2328}\uFE0F",
    title: "PyType",
    description:
      "A typing test built in Python because sometimes you need to prove you can type fast AND write the thing that tests it.",
    tags: ["Python", "Curses", "CLI", "Threading"],
    headerColor: "#5a8aad",
    github: "https://github.com/Esk3tit/pytype",
    problem:
      "Online typing tests are full of ads and distractions. Sometimes you just want a clean, terminal-based experience.",
    approach:
      "Built a terminal typing test using Python's curses library with real-time WPM calculation, accuracy tracking, and a clean TUI.",
    highlights: [
      "Real-time WPM and accuracy calculation as you type",
      "Clean terminal UI with curses -- no browser needed",
      "Multiple difficulty modes with customizable word lists",
    ],
  },
  {
    emoji: "\u{1F3E0}",
    title: "RealAssist.AI",
    description:
      "Property analysis platform that turns raw real estate data into actually useful insights. Think Zillow meets data science.",
    tags: ["React", "Node.js", "PostgreSQL", "AWS", "Python"],
    headerColor: "#8a6474",
    problem:
      "Real estate data is scattered across dozens of sources and formats. Agents and investors waste hours manually gathering basic property info.",
    approach:
      "Built an automated pipeline that aggregates data from multiple APIs, runs analysis models, and generates comprehensive property reports.",
    highlights: [
      "Automated report generation processing 10k+ reports/month",
      "Interactive data visualizations for property comparisons",
      "Multi-source data aggregation with 5+ API integrations",
    ],
  },
];

// ─── Contact ───
// TODO: Khai -- replace placeholder email with your real email.

export const contactLinks: ContactLink[] = [
  {
    name: "Email",
    emoji: "\u{1F4E7}",
    href: "mailto:khai@example.com",
    label: "khai@example.com",
  },
  {
    name: "GitHub",
    emoji: "\u{1F431}",
    href: "https://github.com/Esk3tit",
    label: "github.com/Esk3tit",
  },
  {
    name: "LinkedIn",
    emoji: "\u{1F4BC}",
    href: "https://www.linkedin.com/in/khai-phan/",
    label: "linkedin.com/in/khai-phan",
  },
];
