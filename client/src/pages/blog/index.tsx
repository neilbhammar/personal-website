import React from 'react';
import { useRoute } from "wouter";
import { projects } from "@/data/projects";
import NotFound from "@/pages/not-found";

// Import all blog posts
const blogPosts = {
  'internal-tools-at-busright': () => import('./internal-tools-at-busright'),
  'early-employees-guide-to-equity': () => import('./early-employees-guide-to-equity'),
  // Add new blog posts here
};

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  
  // Find matching project
  const project = projects.find(p => p.links.article?.replace('/blog/', '') === slug);
  
  if (!project || !slug || !blogPosts[slug as keyof typeof blogPosts]) {
    return <NotFound />;
  }

  // Dynamically import the blog post component
  const BlogPostComponent = React.lazy(() => blogPosts[slug as keyof typeof blogPosts]());

  return (
    <React.Suspense fallback={<div className="min-h-screen">Loading...</div>}>
      <BlogPostComponent project={project} />
    </React.Suspense>
  );
} 