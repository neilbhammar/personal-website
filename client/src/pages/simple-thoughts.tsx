import { motion } from "framer-motion";

// A simplified version of UnbakedThoughts without data fetching
export default function SimpleThoughts() {
  // Static thoughts data
  const thoughts = [
    { thought: "This is a static thought to test routing.", date: "2023-03-19" },
    { thought: "If this works, the issue is with data fetching in production.", date: "2023-03-18" },
    { thought: "Sometimes the simplest solution is the best one.", date: "2023-03-17" }
  ];
  
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
          <h1 className="text-2xl">Simple Thoughts</h1>
          <p className="text-muted-foreground">
            A simplified version of unbaked thoughts with static data.
          </p>
        </div>

        {/* Thoughts List */}
        <motion.div 
          layout
          className="space-y-2"
        >
          {thoughts.map((thought, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={index !== thoughts.length - 1 ? "py-6 border-b border-gray-200" : "py-6"}
            >
              <div className="flex justify-between gap-2">
                <div className="text-foreground flex-1 whitespace-pre-wrap">
                  {thought.thought}
                </div>
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(thought.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
} 