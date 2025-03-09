import React, { useEffect, useRef, useState } from 'react';

const HandwritingAnimation: React.FC = () => {
  const [text, setText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  
  // Animation state machine
  const stateRef = useRef<'typing' | 'complete'>('typing');
  const textIndexRef = useRef(0);
  const typeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Full text content
  const fullText = "Hi I'm Neil.\n\nStill a work in progress (both me and the website, I guess!).\n\nI spent the last 5.5 yrs building and scaling BusRight as employee #1. Before that was supporting and investing in founders @ DormRoomFund and Northeastern. Now I'm a little lost - figuring out what comes next.\n\nIf you want to connect, shoot me an email or connect w/me on socials:";
  
  // Typing speeds
  const typingSpeed = 50; // ms per character
  
  useEffect(() => {
    // Clear any existing interval first
    if (typeIntervalRef.current) {
      clearTimeout(typeIntervalRef.current);
    }
    
    const startTyping = () => {
      if (stateRef.current === 'typing') {
        // Type the text character by character
        if (textIndexRef.current < fullText.length) {
          setText(fullText.substring(0, textIndexRef.current + 1));
          textIndexRef.current++;
          
          // Vary typing speed slightly for a more natural effect
          const variance = Math.random() * 30 - 15; // -15 to +15 ms
          typeIntervalRef.current = setTimeout(startTyping, typingSpeed + variance);
        } else {
          stateRef.current = 'complete';
        }
      }
    };
    
    // Start typing after a delay
    typeIntervalRef.current = setTimeout(startTyping, 500);
    
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
  
  // Replace newlines with <br> tags for proper HTML display
  const formattedText = text.split('\n').map((line, i, arr) => (
    <React.Fragment key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </React.Fragment>
  ));
  
  return (
    <div className="handwriting-area font-handwriting text-xl md:text-2xl text-muted-foreground mb-12 text-left max-w-2xl mx-auto">
      <div className="inline-block relative">
        <span id="typed-text">{formattedText}</span>
        <span className={`typing-cursor ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}></span>
      </div>
    </div>
  );
};

export default HandwritingAnimation;
