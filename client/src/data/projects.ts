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
    id: "equity-guide",
    title: "An Early Employee's Guide to Equity: How to Save Millions in Taxes",
    description: "The most comprehensive, interactive guide to equity compensation on the internet. Covers QSBS, 83B elections, early exercise strategies, and real-world examples that can save you millions. Written for both founders and employees.",
    types: ["Writing" as ProjectType],
    date: new Date("2025-07-10"),
    image: "/images/projects/equity-guide.svg",
    links: {
      article: "/blog/early-employees-guide-to-equity",
    },
    tags: ["Equity", "Startups", "Finance"]
  },
  {
    id: "mailmop",
    title: "MailMop: Clean Your Gmail Inbox (Securely and For Free)",
    description: "I needed a way to clean my Gmail inbox without compromising my privacy, so I built one. MailMop runs entirely in your browser (your emails never leave your device) to help you reclaim your digital space. My first real production-ready project - was super fun and took about 88 hours total",
    types: ["SaaS" as ProjectType],
    date: new Date("2025-07-08"),
    image: "/images/projects/mailmop.png",
    links: {
      live: "https://www.mailmop.com",
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