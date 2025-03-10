import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

// Game constants
const GRAVITY = 0.6;
const JUMP_FORCE = -15;
const OBSTACLE_SPEED = 6;
const GROUND_HEIGHT = 20;
const STICKMAN_WIDTH = 30;
const STICKMAN_HEIGHT = 50;

interface Obstacle {
  x: number;
  width: number;
  height: number;
}

interface GameState {
  isPlaying: boolean;
  score: number;
  highScore: number;
  stickmanY: number;
  stickmanVelocity: number;
  obstacles: Obstacle[];
  isJumping: boolean;
  gameOver: boolean;
}

export default function StickmanGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [animationFrameId, setAnimationFrameId] = useState<number | null>(null);
  
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    highScore: 0,
    stickmanY: 0,
    stickmanVelocity: 0,
    obstacles: [],
    isJumping: false,
    gameOver: false
  });
  
  // Initialize the game
  useEffect(() => {
    const canvas = canvasRef.current;
    
    if (canvas) {
      canvas.width = 800;
      canvas.height = 400;
      
      // Reset stickman position
      setGameState(prevState => ({
        ...prevState,
        stickmanY: canvas.height - STICKMAN_HEIGHT - GROUND_HEIGHT
      }));
    }
    
    // Check for stored high score
    const storedHighScore = localStorage.getItem('stickmanHighScore');
    if (storedHighScore) {
      setGameState(prevState => ({
        ...prevState,
        highScore: parseInt(storedHighScore)
      }));
    }
    
    // Set up event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);
  
  // Handle key press for jump
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.code === 'Space' || e.key === 'ArrowUp') && !gameState.isJumping && gameState.isPlaying) {
      jump();
    } else if ((e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'Enter') && !gameState.isPlaying) {
      startGame();
    }
  };
  
  // Handle touch for mobile
  const handleTouchStart = () => {
    if (!gameState.isJumping && gameState.isPlaying) {
      jump();
    } else if (!gameState.isPlaying) {
      startGame();
    }
  };
  
  // Jump function
  const jump = () => {
    setGameState(prevState => ({
      ...prevState,
      stickmanVelocity: JUMP_FORCE,
      isJumping: true
    }));
  };
  
  // Start the game
  const startGame = () => {
    setGameState(prevState => ({
      ...prevState,
      isPlaying: true,
      score: 0,
      obstacles: [],
      gameOver: false
    }));
    
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    
    gameLoop();
  };
  
  // Game loop
  const gameLoop = () => {
    updateGame();
    drawGame();
    const id = requestAnimationFrame(gameLoop);
    setAnimationFrameId(id);
  };
  
  // Update game state
  const updateGame = () => {
    setGameState(prevState => {
      if (!prevState.isPlaying) return prevState;
      
      const canvas = canvasRef.current;
      if (!canvas) return prevState;
      
      // Update stickman position with gravity
      let newStickmanY = prevState.stickmanY;
      let newVelocity = prevState.stickmanVelocity;
      let newIsJumping = prevState.isJumping;
      
      newVelocity += GRAVITY;
      newStickmanY += newVelocity;
      
      // Detect ground collision
      if (newStickmanY > canvas.height - STICKMAN_HEIGHT - GROUND_HEIGHT) {
        newStickmanY = canvas.height - STICKMAN_HEIGHT - GROUND_HEIGHT;
        newVelocity = 0;
        newIsJumping = false;
      }
      
      // Add new obstacles
      let newObstacles = [...prevState.obstacles];
      
      if (Math.random() < 0.02 && newObstacles.length < 3) {
        const height = 30 + Math.random() * 50;
        newObstacles.push({
          x: canvas.width,
          width: 20 + Math.random() * 30,
          height
        });
      }
      
      // Move obstacles
      newObstacles = newObstacles.map(obstacle => ({
        ...obstacle,
        x: obstacle.x - OBSTACLE_SPEED
      }));
      
      // Remove obstacles that are off-screen
      newObstacles = newObstacles.filter(obstacle => obstacle.x > -obstacle.width);
      
      // Detect collisions
      let gameOver = prevState.gameOver;
      const stickmanX = 50; // Fixed stickman X position
      
      for (const obstacle of newObstacles) {
        if (
          stickmanX < obstacle.x + obstacle.width &&
          stickmanX + STICKMAN_WIDTH > obstacle.x &&
          newStickmanY < canvas.height - GROUND_HEIGHT - obstacle.height &&
          newStickmanY + STICKMAN_HEIGHT > canvas.height - GROUND_HEIGHT - obstacle.height
        ) {
          gameOver = true;
        }
      }
      
      if (gameOver) {
        // Update high score
        const newHighScore = Math.max(prevState.score, prevState.highScore);
        localStorage.setItem('stickmanHighScore', newHighScore.toString());
        
        return {
          ...prevState,
          isPlaying: false,
          highScore: newHighScore,
          gameOver: true
        };
      }
      
      // Update score
      const newScore = prevState.score + 1;
      
      return {
        ...prevState,
        stickmanY: newStickmanY,
        stickmanVelocity: newVelocity,
        obstacles: newObstacles,
        isJumping: newIsJumping,
        score: newScore
      };
    });
  };
  
  // Draw the game
  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#87CEEB'; // Sky blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground
    ctx.fillStyle = '#8B4513'; // Saddle brown
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
    
    // Draw stickman
    drawStickman(ctx);
    
    // Draw obstacles
    gameState.obstacles.forEach(obstacle => {
      ctx.fillStyle = '#006400'; // Dark green
      ctx.fillRect(
        obstacle.x,
        canvas.height - GROUND_HEIGHT - obstacle.height,
        obstacle.width,
        obstacle.height
      );
    });
    
    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${gameState.score}`, 20, 30);
    ctx.fillText(`High Score: ${gameState.highScore}`, 20, 60);
    
    // Draw game over message
    if (gameState.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#fff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 40);
      
      ctx.font = '24px Arial';
      ctx.fillText(`Score: ${gameState.score}`, canvas.width / 2, canvas.height / 2 + 10);
      ctx.fillText('Press Space or Tap to Play Again', canvas.width / 2, canvas.height / 2 + 50);
      
      ctx.textAlign = 'left';
    } else if (!gameState.isPlaying && !gameState.gameOver) {
      // Draw start message
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#fff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Stickman Jump', canvas.width / 2, canvas.height / 2 - 40);
      
      ctx.font = '24px Arial';
      ctx.fillText('Press Space or Tap to Start', canvas.width / 2, canvas.height / 2 + 20);
      
      ctx.textAlign = 'left';
    }
  };
  
  // Draw the stickman
  const drawStickman = (ctx: CanvasRenderingContext2D) => {
    const x = 50; // Fixed stickman X position
    const y = gameState.stickmanY;
    
    // Head
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x + STICKMAN_WIDTH / 2, y + 10, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Body
    ctx.beginPath();
    ctx.moveTo(x + STICKMAN_WIDTH / 2, y + 20);
    ctx.lineTo(x + STICKMAN_WIDTH / 2, y + 35);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Arms
    ctx.beginPath();
    ctx.moveTo(x + STICKMAN_WIDTH / 2, y + 25);
    
    // Animate arms while jumping
    if (gameState.isJumping) {
      ctx.lineTo(x + STICKMAN_WIDTH / 2 - 15, y + 15); // Left arm up
      ctx.moveTo(x + STICKMAN_WIDTH / 2, y + 25);
      ctx.lineTo(x + STICKMAN_WIDTH / 2 + 15, y + 15); // Right arm up
    } else {
      ctx.lineTo(x + STICKMAN_WIDTH / 2 - 15, y + 30); // Left arm down
      ctx.moveTo(x + STICKMAN_WIDTH / 2, y + 25);
      ctx.lineTo(x + STICKMAN_WIDTH / 2 + 15, y + 30); // Right arm down
    }
    
    ctx.stroke();
    
    // Legs
    ctx.beginPath();
    ctx.moveTo(x + STICKMAN_WIDTH / 2, y + 35);
    
    // Animate legs while jumping
    if (gameState.isJumping) {
      ctx.lineTo(x + STICKMAN_WIDTH / 2 - 10, y + 50); // Left leg back
      ctx.moveTo(x + STICKMAN_WIDTH / 2, y + 35);
      ctx.lineTo(x + STICKMAN_WIDTH / 2 + 10, y + 45); // Right leg forward
    } else {
      ctx.lineTo(x + STICKMAN_WIDTH / 2 - 10, y + 50); // Left leg
      ctx.moveTo(x + STICKMAN_WIDTH / 2, y + 35);
      ctx.lineTo(x + STICKMAN_WIDTH / 2 + 10, y + 50); // Right leg
    }
    
    ctx.stroke();
  };
  
  // Return to site button handler
  const handleReturnToSite = () => {
    window.history.back(); // Go back to previous page
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="mb-4 text-gray-600">Don't worry, have some fun with this game instead!</p>
      
      <div className="relative border-4 border-gray-800 rounded-lg overflow-hidden shadow-lg">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400}
          className="max-w-full"
          onClick={handleTouchStart}
        />
      </div>
      
      <div className="mt-4 flex gap-4">
        {!gameState.isPlaying && (
          <Button 
            onClick={startGame}
            size="lg"
            className="bg-green-600 hover:bg-green-700"
          >
            {gameState.gameOver ? 'Play Again' : 'Start Game'}
          </Button>
        )}
        
        <Button 
          onClick={handleReturnToSite}
          variant="outline"
          size="lg"
        >
          Return to Site
        </Button>
      </div>
      
      <div className="mt-2 text-sm text-gray-500">
        <p>Controls: Press Space, Up Arrow, or tap/click to jump</p>
      </div>
    </div>
  );
}