import React, { useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import FlashlightEffect from './FlashlightEffect';
import BusAnimation from './BusAnimation';

const HandwritingAnimation: React.FC = () => {
  const [text, setText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [flashlightActive, setFlashlightActive] = useState(false);
  const [busActive, setBusActive] = useState(false);
  
  // Animation state machine
  const stateRef = useRef<'typing' | 'paused' | 'complete'>('typing');
  const textIndexRef = useRef(0);
  const typeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Full text content with segments for pauses
  const textSegments = [
    "Hi, I'm Neil",
    ".\n\nStill a work in progress ",
    "(both me and this site, I guess!)",
    ".\n\nI spent the last 5.5 yrs building and scaling ",
    "BusRight",
    " as employee #1. Before that was supporting and investing in founders @ ",
    "DormRoomFund",
    " and Northeastern. Now I'm a little ",
    "lost",
    " - figuring out what comes next",
    ".\n\nIf you want to connect, shoot me an email or connect w/me on socials:"
  ];
  
  // Join all segments to get the full text
  const fullText = textSegments.join('');
  
  // Segment end positions for pausing
  const pausePositions = (() => {
    const positions = [];
    let charCount = 0;
    
    for (let i = 0; i < textSegments.length - 1; i++) {
      charCount += textSegments[i].length;
      positions.push(charCount - 1);
    }
    
    return positions;
  })();
  
  // Typing speeds - much more realistic now
  const typingSpeed = 40; // ms per character
  const pauseDuration = 1200; // ms for pause at segments
  
  // For cursor spring animation
  const cursorSpring = useSpring({
    opacity: cursorVisible ? 1 : 0,
    config: { duration: 400 }
  });
  
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
          
          // Check if we need to pause
          if (pausePositions.includes(textIndexRef.current - 1)) {
            stateRef.current = 'paused';
            typeIntervalRef.current = setTimeout(() => {
              stateRef.current = 'typing';
              startTyping();
            }, pauseDuration);
            return;
          }
          
          // Natural typing speed variations based on characters
          let variance = Math.random() * 30 - 15; // Basic variance
          
          // Slow down for punctuation
          const currentChar = fullText[textIndexRef.current - 1];
          if (['.', ',', '!', '?'].includes(currentChar)) {
            variance += 100; // Longer pause after punctuation
          } else if (currentChar === ' ') {
            variance += 30; // Slight pause after spaces
          }
          
          // Occasional "thinking" pauses (randomly)
          if (Math.random() < 0.05) { // 5% chance of a thinking pause
            variance += 300;
          }
          
          typeIntervalRef.current = setTimeout(startTyping, typingSpeed + variance);
        } else {
          stateRef.current = 'complete';
        }
      }
    };
    
    // Start typing after a delay
    typeIntervalRef.current = setTimeout(startTyping, 800);
    
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
  
  // Process the typed text with interactive elements
  const processText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i, arr) => {
      // Process interactive elements in the line
      const formattedLine = line.split(' ').map((word, wordIndex, wordArr) => {
        // Handle BusRight with hover effect - fancy animation
        if (word === 'BusRight') {
          return (
            <React.Fragment key={`word-${wordIndex}`}>
              <a 
                href="https://www.busright.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary relative highlight-word"
                onMouseEnter={() => setBusActive(true)}
                onMouseLeave={() => setBusActive(false)}
              >
                {word}
              </a>
              {wordIndex < wordArr.length - 1 ? ' ' : ''}
            </React.Fragment>
          );
        }
        
        // Handle DormRoomFund with hover effect
        if (word === 'DormRoomFund') {
          return (
            <React.Fragment key={`word-${wordIndex}`}>
              <a 
                href="https://dormroomfund.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary relative highlight-word"
              >
                {word}
              </a>
              {wordIndex < wordArr.length - 1 ? ' ' : ''}
            </React.Fragment>
          );
        }
        
        // Handle "lost" with flashlight effect
        if (word === 'lost') {
          return (
            <React.Fragment key={`word-${wordIndex}`}>
              <span 
                className="relative cursor-pointer font-bold highlight-word"
                onMouseEnter={() => setFlashlightActive(true)}
                onMouseLeave={() => setFlashlightActive(false)}
              >
                {word}
              </span>
              {wordIndex < wordArr.length - 1 ? ' ' : ''}
            </React.Fragment>
          );
        }
        
        // Regular word with occasional hover effects for fun
        const isSpecialWord = ['figuring', 'email', 'connect', 'socials'].includes(word);
        return (
          <React.Fragment key={`word-${wordIndex}`}>
            <span className={isSpecialWord ? 'highlight-word' : ''}>
              {word}
            </span>
            {wordIndex < wordArr.length - 1 ? ' ' : ''}
          </React.Fragment>
        );
      });
      
      return (
        <React.Fragment key={`line-${i}`}>
          {formattedLine}
          {i < arr.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };
  
  return (
    <FlashlightEffect isActive={flashlightActive}>
      <div className="handwriting-area font-handwriting text-xl md:text-2xl text-muted-foreground mb-12 text-left max-w-2xl mx-auto leading-relaxed">
        <div className="inline-block relative">
          <span id="typed-text">{processText(text)}</span>
          <animated.span 
            className="typing-cursor" 
            style={{
              display: 'inline-block',
              width: '3px',
              height: '1.2em',
              backgroundColor: 'currentColor',
              marginLeft: '2px',
              verticalAlign: 'middle',
              opacity: cursorSpring.opacity
            }}
          />
        </div>
      </div>
      <BusAnimation isActive={busActive} />
    </FlashlightEffect>
  );
};

export default HandwritingAnimation;
