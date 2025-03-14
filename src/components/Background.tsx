
import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
}

export const Background: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    const particleCount = Math.min(Math.floor((width * height) / 12000), 50);
    
    const colors = ['#007BFF', '#28A745', '#6F42C1', '#FFC107', '#DC3545', '#FFFFFF'];
    
    // Create initial particles
    const initialParticles: Particle[] = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    
    setParticles(initialParticles);
    
    const handleResize = () => {
      setParticles(prev => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        const newCount = Math.min(Math.floor((newWidth * newHeight) / 12000), 50);
        
        if (newCount > prev.length) {
          // Add more particles
          const additionalParticles: Particle[] = Array.from({ length: newCount - prev.length }).map((_, i) => ({
            id: prev.length + i,
            x: Math.random() * newWidth,
            y: Math.random() * newHeight,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random() * 0.5 + 0.1,
            color: colors[Math.floor(Math.random() * colors.length)]
          }));
          
          return [...prev, ...additionalParticles];
        }
        
        return prev.slice(0, newCount);
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle animate-particles-float"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            backgroundColor: particle.color,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${12 + Math.random() * 8}s`
          }}
        />
      ))}
    </div>
  );
};

export default Background;
