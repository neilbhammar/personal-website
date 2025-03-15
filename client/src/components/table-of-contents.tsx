'use client';

import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TableOfContentsProps {
  contentRef: React.RefObject<HTMLElement>;
}

interface HeadingItem {
  id: string;
  text: string;
  level: number;
  index: number;
}

export function TableOfContents({ contentRef }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  // Extract headings from content
  useEffect(() => {
    if (!contentRef.current) return;

    const elements = contentRef.current.querySelectorAll('h2, h3, h4');
    const seenHeaders = new Map<string, number>();

    const items: HeadingItem[] = Array.from(elements).map((element, index) => {
      const text = element.textContent || '';
      const baseId = text.toLowerCase().replace(/\s+/g, '-');
      
      const count = seenHeaders.get(baseId) || 0;
      seenHeaders.set(baseId, count + 1);
      const id = count === 0 ? baseId : `${baseId}-${count}`;
      
      element.id = id;
      
      return {
        id,
        text,
        level: Number(element.tagName.charAt(1)),
        index
      };
    });

    setHeadings(items);
  }, [contentRef]);

  useEffect(() => {
    if (!contentRef.current) return;

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const options = {
      rootMargin: '0px 0px -80% 0px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(callback, options);

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings, contentRef]);

  const handleMouseEnter = useCallback(() => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    setIsVisible(true);
  }, [hideTimeout]);

  const handleMouseLeave = useCallback(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 350);
    setHideTimeout(timeout);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ 
      top: document.documentElement.scrollHeight,
      behavior: 'smooth' 
    });
  };

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav 
      className="fixed top-24 right-4 z-50 hidden xl:block h-[calc(100vh-8rem)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Notion-style TOC lines */}
      <div 
        className={cn(
          "absolute right-0 top-0 h-full transition-all duration-200 flex flex-col items-end",
          isVisible ? "opacity-0" : "opacity-100"
        )}
      >
        {headings.map((heading) => (
          <div
            key={heading.id}
            className={cn(
              "my-[3px] h-[3px] bg-muted-foreground/20 rounded-full transition-all duration-200",
              activeId === heading.id 
                ? "w-6 bg-muted-foreground/40" 
                : "w-3"
            )}
          />
        ))}
      </div>

      {/* TOC Panel */}
      <div 
        className={cn(
          "absolute right-0 w-64 transition-all duration-200 ease-in-out",
          isVisible 
            ? "opacity-100 translate-x-0 pointer-events-auto" 
            : "opacity-0 translate-x-2 pointer-events-none"
        )}
      >
        <div className="p-3 rounded-lg bg-background/40 backdrop-blur-sm border shadow-sm">
          {/* Top Navigation */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-full px-2 py-1"
          >
            <ChevronUp className="w-3 h-3" />
            <span>Top</span>
          </button>

          {/* Headings */}
          <div className="my-2 space-y-[2px] max-h-[60vh] overflow-y-auto">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => handleClick(heading.id)}
                className={cn(
                  'block text-xs w-full text-left px-2 py-1 rounded transition-colors duration-200',
                  'hover:bg-muted/50',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  heading.level === 2 ? 'text-muted-foreground' : 'pl-4 text-muted-foreground/80',
                  activeId === heading.id 
                    ? 'text-foreground bg-muted/20' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {heading.text}
              </button>
            ))}
          </div>

          {/* Bottom Navigation */}
          <button
            onClick={scrollToBottom}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-full px-2 py-1"
          >
            <ChevronDown className="w-3 h-3" />
            <span>Bottom</span>
          </button>
        </div>
      </div>
    </nav>
  );
} 