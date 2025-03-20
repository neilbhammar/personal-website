import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Type for our thought entries
interface Thought {
  thought: string;
  date: string;
}

// Update the URL to use the visualization API with JSONP format to avoid CORS issues
const SHEET_URL = "https://docs.google.com/spreadsheets/d/1eAkCKWwGWcpAGHXxxRKUi-e_bsb73S3NmL5YVyXRqAs/gviz/tq?tqx=out:json";

// Add this helper function at the top of the file
function linkifyText(text: string): string {
  // Regex for detecting URLs (supports http, https, www)
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+\.[^\s]+)/g;
  
  return text.replace(urlRegex, (url) => {
    // Add https if the URL starts with www
    const href = url.startsWith('www.') ? `https://${url}` : url;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${url}</a>`;
  });
}

export default function UnbakedThoughts() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchThoughts() {
      try {
        console.log('Fetching from URL:', `${SHEET_URL}&_=${new Date().getTime()}`);
        const response = await fetch(`${SHEET_URL}&_=${new Date().getTime()}`, {
          method: 'GET',
          mode: 'cors', // Try explicit CORS mode
          headers: {
            'Accept': 'application/json',
          }
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', JSON.stringify(Array.from(response.headers.entries())));
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response not ok:', errorText);
          throw new Error(`Failed to fetch thoughts: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('Raw response text (first 200 chars):', text.substring(0, 200));
        
        // Handle the JSONP-style response
        try {
          // Remove the /*O_o*/ prefix and callback wrapper
          const jsonText = text
            .replace(/\/\*O_o\*\/\s*/, '') // Remove the /*O_o*/ prefix
            .replace(/google\.visualization\.Query\.setResponse\((.*)\);?$/, '$1');
          
          console.log('Processed JSON text (first 200 chars):', jsonText.substring(0, 200));
          
          const data = JSON.parse(jsonText);
          console.log('Parsed data table:', data.table);
          
          if (!data.table || !data.table.rows) {
            console.error('Invalid data format:', data);
            throw new Error('Invalid data format from Google Sheets');
          }
          
          // Parse the response
          const thoughtsData = data.table.rows
            .map((row: any, index: number) => {
              // Add debug logging
              console.log(`Processing row ${index}:`, row);
              
              // Check if we have cell data
              if (!row.c || !Array.isArray(row.c)) {
                console.log(`Skipping row ${index}: No cell data`);
                return null;
              }
              
              // Get thought and date from cells
              const thoughtCell = row.c[0];
              const dateCell = row.c[1];

              // Skip if no thought
              if (!thoughtCell) {
                console.log(`Skipping row ${index}: No thought cell`);
                return null;
              }

              console.log('Thought cell data:', JSON.stringify(thoughtCell, null, 2));

              // Get the thought value and handle any formatting
              let thought = '';
              if (thoughtCell.p) {
                // p property might contain rich text formatting
                console.log('Found rich text:', thoughtCell.p);
                thought = thoughtCell.p.map((part: any) => {
                  if (part.v && part.l) {
                    // This is a hyperlink
                    return `<a href="${part.l}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${part.v}</a>`;
                  }
                  return part.v || '';
                }).join('');
              } else {
                thought = linkifyText(thoughtCell.f || thoughtCell.v || '');
              }

              console.log(`Processed thought cell:`, thoughtCell);

              // Handle date - it might come in different formats
              let date = '';
              if (dateCell) {
                if (dateCell.f) {
                  date = dateCell.f;
                } else if (dateCell.v) {
                  if (typeof dateCell.v === 'string' && dateCell.v.startsWith('Date(')) {
                    const dateParts = dateCell.v.match(/Date\((\d+),(\d+),(\d+)\)/);
                    if (dateParts) {
                      const [_, year, month, day] = dateParts.map(Number);
                      date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    }
                  } else {
                    date = dateCell.v;
                  }
                }
              }

              console.log(`Processed row ${index}:`, { thought, date });

              return {
                thought,
                date
              };
            })
            .filter((entry: Thought | null): entry is Thought => {
              if (!entry) {
                console.log('Filtering out null entry');
                return false;
              }
              return true;
            })
            .sort((a: Thought, b: Thought) => {
              const dateA = a.date ? new Date(a.date).getTime() : 0;
              const dateB = b.date ? new Date(b.date).getTime() : 0;
              
              if (dateA === 0 && dateB === 0) return 0;
              if (dateA === 0) return 1;
              if (dateB === 0) return -1;
              return dateB - dateA;
            });

          console.log('Final parsed thoughts:', thoughtsData);
          setThoughts(thoughtsData);
        } catch (err) {
          console.error('Error processing JSONP response:', err);
          setError(err instanceof Error ? err.message : 'Failed to process JSONP response');
        }
      } catch (err) {
        console.error('Error fetching thoughts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load thoughts');
      } finally {
        setIsLoading(false);
      }
    }

    fetchThoughts();
  }, []);

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
          <h1 className="text-2xl">Unbaked Thoughts</h1>
          <p className="text-muted-foreground">
            A collection of random, half-baked, short thoughts that have popped into my head.
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"/>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-red-500 py-4">
            Error: {error}
          </div>
        )}

        {/* Thoughts List */}
        <div className="space-y-2">
          {thoughts.map((thought, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.05
              }}
              className={cn(
                "py-6 flex justify-between gap-4",
                index !== thoughts.length - 1 && "border-b border-gray-200"
              )}
            >
              <div 
                className="text-foreground flex-1 whitespace-pre-wrap prose prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: thought.thought }}
              />
              <p className="text-sm text-muted-foreground whitespace-nowrap">
                {thought.date ? new Date(thought.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                }) : 'No date'}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
} 