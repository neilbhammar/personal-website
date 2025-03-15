import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Project, ProjectType, projects } from "@/data/projects";

export default function Projects() {
  const [selectedType, setSelectedType] = useState<ProjectType | "all">("all");

  // Get unique types from all projects' type arrays
  const availableTypes = useMemo(() => {
    const types = new Set(projects.flatMap(project => project.types));
    return ["all", ...Array.from(types)] as (ProjectType | "all")[];
  }, []);

  // Update filter to check if project has the selected type
  const filteredProjects = selectedType === "all" 
    ? projects
    : projects.filter(project => project.types.includes(selectedType));

  return (
    <main className="py-10 px-8 md:py-16 md:px-16 relative min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Return home link */}
        <a 
          href="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back home
        </a>

        {/* Header with subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl">Recent Projects</h1>
          <p className="text-muted-foreground">
            A collection of things I've built, written about, or created. <br/><br/>I'm not an engineer, but I've been fascinated by learning good engineering principles and putting them to use with AI Code Generation Tools. I'm also creating space to indulge my curiousities more often,
          </p>
        </div>

        {/* Subtle filter bar - only showing available types */}
        <div className="flex gap-6 text-sm text-muted-foreground">
          {availableTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "hover:text-foreground transition-colors duration-200",
                selectedType === type && "text-foreground font-medium"
              )}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Projects List */}
        <motion.div 
          layout
          className="space-y-16"
        >
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      </div>
    </main>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="group grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
    >
      {/* Project Image with Skeleton */}
      <div className="aspect-[16/9] overflow-hidden rounded-lg bg-muted/5 relative">
        {/* Skeleton loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted/10 animate-pulse" />
        )}
        
        <img
          src={project.image}
          alt={project.title}
          loading="lazy" // Add native lazy loading
          className={cn(
            "w-full h-full object-cover transition-all duration-300",
            "group-hover:scale-[1.02]",
            !imageLoaded && "opacity-0", // Hide image until loaded
            imageLoaded && "opacity-100" // Show image when loaded
          )}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            console.error(`Failed to load image: ${project.image}`);
            setImageLoaded(true); // Remove skeleton even if image fails
          }}
        />
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div className="space-y-2">
          {/* Tags and Date */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Types displayed as text with dots */}
            <div className="flex flex-wrap text-xs text-muted-foreground">
              {project.types.map((type, index) => (
                <span key={type}>
                  {type}{index < project.types.length - 1 ? '\u00A0\u00A0•\u00A0\u00A0' : ''}
                </span>
              ))}
            </div>
            
            {/* Tags with pill styling */}
            <div className="flex gap-2 flex-wrap">
              {project.tags.map(tag => (
                <span 
                  key={tag} 
                  className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Date stays the same */}
            <span className="text-xs text-muted-foreground ml-auto">
              {project.date.toLocaleDateString('en-US', { 
                month: 'short',
                day: 'numeric', 
                year: 'numeric'
              })}
            </span>
          </div>
          
          <h3 className="text-lg font-medium">{project.title}</h3>
          <p className="text-muted-foreground text-sm">
            {project.description}
          </p>
        </div>

        {/* Minimal action buttons */}
        <div className="flex items-center gap-4 pt-2">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
            >
              Check it out →
            </a>
          )}
          {project.links.article && (
            <a
              href={project.links.article}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Read About It →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
} 