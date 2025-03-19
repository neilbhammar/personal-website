import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// This is a duplicate of UnbakedThoughts with a different path
export default function TestPage() {
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
          <h1 className="text-2xl">Test Page</h1>
          <p className="text-muted-foreground">
            This is a test page to see if the routing issue is specific to the "unbaked-thoughts" path.
          </p>
        </div>

        <div className="py-6">
          <p>If you can see this page, the routing is working properly for this path.</p>
          <p className="mt-4">This suggests that there might be something specific about the "unbaked-thoughts" path that's causing issues.</p>
        </div>
      </div>
    </main>
  );
} 