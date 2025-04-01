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
    description: "WORK IN PROGRESS: A quick build for my own use. I neglected my personal inbox for a solid 5+ years, it felt unsalvagable. Trying to make a really simple, super secure, client-side only tool to help me reclaim control of my inbox.",
    types: ["SaaS" as ProjectType],
    date: new Date("2025-03-15"),
    image: "/images/projects/mailmop.png",
    links: {
    },
    tags: ["Cursor", "Email", "Productivity"]
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