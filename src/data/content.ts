// ─── Portfolio Content Data ───
// Single source of truth for all portfolio copy.

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

export const experiences: Experience[] = [
  {
    company: "PromptArmor (YC W24)",
    title: "Founding Engineer",
    dates: "Oct 2025 -- Present",
    emoji: "\u{1F6E1}\uFE0F",
    bullets: [
      "Engineered an internal shareable alerts system enabling customers to route security risk alerts to business owners; adopted by 31 organizations",
      "Refined internal platform for publishing reports and monitoring vendors in 2 weeks, cutting weekly rate of reports requiring manual intervention from 70% to 0%",
      "Shipped end-to-end vendor tagging using Python's OpenAI SDK, labeling 20,000 vendors with security metadata and building an internal control panel to manage tags",
      "Developed an LLM-powered pipeline to extract AI security settings/configurations, increasing actionable findings on reports and reducing customer AI risk",
    ],
  },
  {
    company: "Tesla",
    title: "Software Engineer",
    dates: "Jan 2024 -- Oct 2025",
    emoji: "\u{26A1}",
    bullets: [
      "Integrated automated screenshot capture into automated test reports, reclaiming 16 team-hours weekly for 4 engineers by streamlining debugging processes",
      "Developed and rapidly iterated on 12 REST API endpoints using Golang in collaboration with CATL, integrating Tesla's employee data with CATL's user management system",
      "Implemented an AI Test Automation agent using Python and the Agno library to reduce time spent writing boilerplate end-to-end test code by 1.5 hours per week",
      "Automated test environment deployment in CI/CD pipeline by developing a custom tool in Go, eliminating 3 hours weekly of manual release regression setup",
    ],
  },
  {
    company: "Cue Health",
    title: "Software Development Intern",
    dates: "Jun 2023 -- Aug 2023",
    emoji: "\u{1FA7A}",
    bullets: [
      "Reduced the time to treatment recommendation for customers by 21.7% by implementing multi-select widget answers in the health chatbot using OpenAI API and Java",
      "Enhanced chatbot recommendation capabilities by researching, comparing, and integrating the best of 3 vector databases for suggesting relevant blog posts to end users",
    ],
  },
  {
    company: "Oregon State University",
    title: "B.S. Computer Science",
    dates: "Sep 2019 -- Sep 2023",
    emoji: "\u{1F393}",
    bullets: [
      "Dean's List/Honor Roll (all terms); Summa Cum Laude; GPA: 3.98/4.00",
    ],
  },
];

// ─── Skills ───

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    emoji: "\u{1F4DD}",
    skills: ["Python", "JavaScript", "TypeScript", "SQL", "HTML", "CSS", "Golang", "C", "C++"],
  },
  {
    name: "Frameworks",
    emoji: "\u{2699}\uFE0F",
    skills: ["React", "Next.js", "FastAPI", "Node.js", "Express.js", "Flask"],
  },
  {
    name: "Technologies",
    emoji: "\u2601\uFE0F",
    skills: ["Git", "Docker", "PostgreSQL", "REST APIs", "Claude Code", "AWS", "Kubernetes", "Redis"],
  },
];

// ─── Projects ───

export const projects: Project[] = [
  {
    emoji: "\u{1F3AF}",
    title: "WTCS Map Ban",
    description:
      "A real-time map-ban voting web app used by 127 members of the official War Thunder eSports team for tournament matches.",
    tags: ["React", "TypeScript", "Convex", "Netlify", "Tailwind"],
    headerColor: "#8a6474",
    github: "https://github.com/Esk3tit/wtcs-map-ban",
    problem:
      "War Thunder eSports teams needed a way to coordinate map bans during tournament matches -- no existing tool handled real-time voting with fraud prevention.",
    approach:
      "Built a real-time voting app with Convex for live data sync, rate limiting, observability, and voting fraud prevention measures.",
    highlights: [
      "Real-time map-ban voting with live sync across 127 team members",
      "Productionized with rate limiting, telemetry, and fraud prevention",
      "300+ unit tests and 12+ end-to-end tests running in GitHub Actions",
    ],
  },
  {
    emoji: "\u{1F916}",
    title: "Akula Bot",
    description:
      "A Twitch stream notification Discord bot used by ~250 users across 3 servers. Because missing a stream is a war crime.",
    tags: ["Python", "discord.py", "PostgreSQL", "pytest", "Fly.io"],
    headerColor: "#7a5ea6",
    github: "https://github.com/Esk3tit/akula-bot",
    problem:
      "Discord users kept missing Twitch streams from their favorite creators -- existing bots were unreliable or bloated with features nobody asked for.",
    approach:
      "Built a focused notification bot with PostgreSQL persistence and a CI/CD pipeline with 30 pytest tests running on a development server environment.",
    highlights: [
      "Stream notifications serving ~250 users across 3 Discord servers",
      "CI/CD pipeline with 30 pytest unit and integration tests",
      "Deployed on Fly.io with PostgreSQL for reliable uptime",
    ],
  },
];

// ─── Contact ───

export const contactLinks: ContactLink[] = [
  {
    name: "Email",
    emoji: "\u{1F4E7}",
    href: "mailto:khaiphn41@gmail.com",
    label: "khaiphn41@gmail.com",
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
