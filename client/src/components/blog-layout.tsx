'use client';

import { motion } from "framer-motion";
import { Project } from "@/data/projects";
import { format } from "date-fns";
import { TableOfContents } from "./table-of-contents";
import { useRef } from "react";

interface BlogLayoutProps {
  project: Project;
  children: React.ReactNode;
}

export function BlogLayout({ project, children }: BlogLayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-10 px-8 md:py-16 md:px-16 min-h-screen relative"
    >
      <article className="max-w-4xl mx-auto space-y-8">
        {/* Back button */}
        <a 
          href="/projects" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to projects
        </a>

        {/* Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground">
              {project.type}
            </span>
            {project.tags.map(tag => (
              <span key={tag} className="text-xs text-muted-foreground">
                • {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-medium">{project.title}</h1>
          <time className="block text-sm text-muted-foreground">
            {format(project.date, 'MMMM d, yyyy')}
          </time>
        </header>

        {/* Blog content with Table of Contents */}
        <div className="relative">
          <TableOfContents contentRef={contentRef} />
          <div ref={contentRef} className="prose prose-neutral dark:prose-invert max-w-none">
            {children}
          </div>
        </div>
      </article>
    </motion.main>
  );
} 