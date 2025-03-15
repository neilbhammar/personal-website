import { BlogLayout } from "@/components/blog-layout";
import { projects } from "@/data/projects";

export default function TemplateBlogPost() {
  const project = projects.find(p => p.id === "template-id")!;
  
  return (
    <BlogLayout project={project}>
      <p>Your blog content here...</p>
      
      <h2>Section Title</h2>
      <p>Section content...</p>
      
      {/* Add any custom components, layouts, or content */}
    </BlogLayout>
  );
} 