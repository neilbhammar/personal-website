export type ProjectType = "SaaS" | "Internal Tool" | "article" | "video" | "other";

export interface Project {
  id: string;
  title: string;
  description: string;
  type: ProjectType;
  image: string;
  date: Date;
  links: {
    live?: string;
    article?: string;
    video?: string;
    code?: string;
  };
  tags: string[];
}

export const projects: Project[] = [
  {
    id: "mailmop",
    title: "MailMop: Clean Your Gmail Inbox (Securely and For Free)",
    description: "After 6 years of neglecting my personal inbox, it felt unsalvagable. I had no clue where to even start with cleaning it up. I built MailMop for myself so that I could easily understand which senders where cluttering my inbox and easily take back control. Built to work entirely client side so that it could be free and secure.",
    type: "SaaS" as ProjectType,
    date: new Date("2025-03-15"),
    image: "/images/projects/mailmop.png",
    links: {
      live: "https://mailmop.neilbhammar.com",
    },
    tags: ["Email", "Productivity"]
  },
  {
    id: "busright-roi-calculator",
    title: "Internal Tools: ROI Calculator, Voice-AI CSP Interaction, and more",
    description: "I loved building internal tools to make teams more effective during my time at BusRight. Always found myself on Zapier and Replit to try and automate or simplify something. Here's a few of my favorite publicly shared internal tools.",
    type: "Internal Tool" as ProjectType,
    date: new Date("2024-12-25"),
    image: "/images/projects/roi-calculator.png",
    links: {
      live: "https://calculator.busright.com",
      article: "https://neilbhammar.com/blog/internal-tools-at-busright",
    },
    tags: ["Replit"]
  }
].sort((a, b) => b.date.getTime() - a.date.getTime()); 