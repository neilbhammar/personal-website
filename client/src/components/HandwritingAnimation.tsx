import React, { useEffect, useRef, useState } from 'react';

const HandwritingAnimation: React.FC = () => {
  const [text, setText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  
  // Animation state machine
  const stateRef = useRef<'typing-initial' | 'erasing-typo' | 'typing-correction' | 'complete'>('typing-initial');
  const textIndexRef = useRef(0);
  const typeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Text with and without typo
  const completeText = "I'm still a work in progress (both me and this website, I guess)";
  const typoText = "I'm still a work in progres (both me and this website, I guess)";
  
  // Typing speeds
  const typingSpeed = 100; // ms per character
  const eraseSpeed = 50; // ms per character when erasing
  
  useEffect(() => {
    // Clear any existing interval first
    if (typeIntervalRef.current) {
      clearTimeout(typeIntervalRef.current);
    }
    
    const startTyping = () => {
      if (stateRef.current === 'typing-initial') {
        // Initial typing with typo
        if (textIndexRef.current < typoText.length) {
          setText(prev => prev + typoText.charAt(textIndexRef.current));
          textIndexRef.current++;
          typeIntervalRef.current = setTimeout(startTyping, typingSpeed);
        } else {
          // Pause before erasing the typo
          typeIntervalRef.current = setTimeout(() => {
            stateRef.current = 'erasing-typo';
            startTyping();
          }, 800);
        }
      } else if (stateRef.current === 'erasing-typo') {
        // Erase the typo (just the last few characters)
        if (textIndexRef.current > typoText.length - 3) {
          setText(prev => prev.substring(0, prev.length - 1));
          textIndexRef.current--;
          typeIntervalRef.current = setTimeout(startTyping, eraseSpeed);
        } else {
          // Start typing the correction
          stateRef.current = 'typing-correction';
          startTyping();
        }
      } else if (stateRef.current === 'typing-correction') {
        // Type the corrected text
        if (textIndexRef.current < completeText.length) {
          setText(completeText.substring(0, textIndexRef.current));
          textIndexRef.current++;
          typeIntervalRef.current = setTimeout(startTyping, typingSpeed);
        } else {
          stateRef.current = 'complete';
          // Keep cursor blinking
        }
      }
    };
    
    // Start typing after a delay
    typeIntervalRef.current = setTimeout(startTyping, 1000);
    
    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    return () => {
      if (typeIntervalRef.current) {
        clearTimeout(typeIntervalRef.current);
      }
      clearInterval(cursorInterval);
    };
  }, []);
  
  return (
    <div className="handwriting-area font-handwriting text-2xl md:text-3xl text-muted-foreground mb-12">
      <div className="inline-block relative">
        <span id="typed-text">{text}</span>
        <span className={`typing-cursor ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}></span>
      </div>
    </div>
  );
};

export default HandwritingAnimation;
