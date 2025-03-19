export type ProjectType = "SaaS" | "Internal Tool" | "Writing" | "Video" | "Other";

export interface Project {
  id: string;
  title: string;
  description: string;
  types: ProjectType[];
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
    description: "WORK IN PROGRESS (started on March 19th, 2025): After 5 years of neglecting my personal inbox, it felt unsalvagable. I had no clue where to even start with cleaning it up. I'm building MailMop as a small project to help me (and others) reclaim control of our inboxes..",
    types: ["SaaS" as ProjectType],
    date: new Date("2025-03-15"),
    image: "/images/projects/mailmop.png",
    links: {
    },
    tags: ["Work In Progress", "Email", "Productivity"]
  },
  {
    id: "busright-roi-calculator",
    title: "Internal Tools: ROI Calculator, Voice-AI CSP Interaction, and more",
    description: "I loved building internal tools to make teams more effective during my time at BusRight. Always found myself on Zapier and Replit to try and automate or simplify something. Here's a few of my favorite publicly shared internal tools.",
    types: ["Internal Tool" as ProjectType, "Writing" as ProjectType],
    date: new Date("2024-12-25"),
    image: "/images/projects/roi-calculator.png",
    links: {
      live: "https://calculator.busright.com",
      article: "/blog/internal-tools-at-busright",
    },
    tags: ["Replit"]
  }
].sort((a, b) => b.date.getTime() - a.date.getTime()); 