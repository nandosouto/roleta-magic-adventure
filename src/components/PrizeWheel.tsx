
import React, { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface Prize {
  text: string;
  color: string;
  percentage: number;
  textColor: string;
}

interface PrizeWheelProps {
  prizes: Prize[];
  onSpinEnd: (prize: Prize) => void;
  finalPrizeIndex: number;
}

const PrizeWheel: React.FC<PrizeWheelProps> = ({ 
  prizes, 
  onSpinEnd,
  finalPrizeIndex
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  // Calculate total degrees for each segment
  const calculateSegments = () => {
    let currentDegree = 0;
    return prizes.map((prize, index) => {
      const segmentDegree = 360 * (prize.percentage / 100);
      const startDegree = currentDegree;
      currentDegree += segmentDegree;
      const endDegree = currentDegree;
      
      return {
        ...prize,
        startDegree,
        endDegree,
        middleDegree: startDegree + (segmentDegree / 2)
      };
    });
  };

  const segments = calculateSegments();

  useEffect(() => {
    // Create audio elements
    audioRef.current = new Audio('/spinning-sound.mp3');
    clickAudioRef.current = new Audio('/click-sound.mp3');
    
    // Clean up audio elements
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (clickAudioRef.current) {
        clickAudioRef.current.pause();
        clickAudioRef.current = null;
      }
    };
  }, []);

  const spinWheel = () => {
    if (isSpinning || hasSpun) return;
    
    setIsSpinning(true);
    
    // Try to play sounds
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
    } catch (error) {
      console.log("Audio error:", error);
    }
    
    // Calculate the final rotation
    // We need to ensure the wheel spins at least 5 full rotations (1800 degrees)
    // and then stops at the desired prize
    const finalSegment = segments[finalPrizeIndex];
    
    // Calculate the position where the marker should point
    // Invert because the wheel is rotating counter-clockwise
    const markerPosition = 270; // Marker at the top (270 degrees from the right)
    
    // Calculate where the segment should stop (middle of the segment aligned with marker)
    const segmentStopDegree = finalSegment.middleDegree;
    
    // Calculate how much to rotate to align the segment with the marker
    // We add 360 degrees for each full rotation (minimum 5)
    const fullRotations = 5;
    const degreesToRotate = (360 * fullRotations) + (markerPosition - segmentStopDegree);
    
    // Set the rotation
    setRotationDegree(degreesToRotate);
    
    // After the animation completes
    setTimeout(() => {
      setIsSpinning(false);
      setHasSpun(true);
      
      try {
        // Play click sound when wheel stops
        if (clickAudioRef.current) {
          clickAudioRef.current.currentTime = 0;
          clickAudioRef.current.play().catch(e => console.log("Click sound failed:", e));
        }
      } catch (error) {
        console.log("Audio error:", error);
      }
      
      onSpinEnd(prizes[finalPrizeIndex]);
    }, 3000); // 3 seconds matches our animation duration
  };

  return (
    <div className="relative prize-wheel-container mx-auto my-8 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px]">
      {/* Wheel */}
      <div 
        ref={wheelRef}
        className="prize-wheel absolute inset-0 rounded-full overflow-hidden border-4 border-white/20 shadow-[0_0_25px_rgba(0,123,255,0.5)]"
        style={{
          transform: `rotate(${rotationDegree}deg)`,
          transition: isSpinning ? 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
        }}
      >
        {segments.map((segment, idx) => {
          // Calculate the cone shape for each segment
          const startAngle = segment.startDegree * (Math.PI / 180);
          const endAngle = segment.endDegree * (Math.PI / 180);
          
          // Calculate the x,y coordinates for the cone
          const centerX = 50;
          const centerY = 50;
          const radius = 50;
          
          // Calculate points for the SVG path
          const x1 = centerX;
          const y1 = centerY;
          const x2 = centerX + radius * Math.cos(startAngle);
          const y2 = centerY + radius * Math.sin(startAngle);
          const x3 = centerX + radius * Math.cos(endAngle);
          const y3 = centerY + radius * Math.sin(endAngle);
          
          // Create SVG arc flag
          const largeArcFlag = segment.endDegree - segment.startDegree > 180 ? 1 : 0;
          
          // SVG path for the segment
          const pathData = `M ${x1},${y1} L ${x2},${y2} A ${radius},${radius} 0 ${largeArcFlag} 1 ${x3},${y3} Z`;
          
          // Calculate text rotation to display text diagonally
          // Rotate text to be more diagonal within each segment
          const textRotation = segment.middleDegree + 90;
          
          // Calculate text position to be aligned properly along the radius
          // These values are used for text positioning along the radius
          const textDistance = 25; // Distance from center (0-50, where 50 is edge)
          const textX = centerX + textDistance * Math.cos(segment.middleDegree * (Math.PI / 180));
          const textY = centerY + textDistance * Math.sin(segment.middleDegree * (Math.PI / 180));
          
          return (
            <div key={idx} className="absolute inset-0">
              <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
                <path
                  d={pathData}
                  fill="transparent"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="0.5"
                  className="transition-all duration-300"
                />
                <text
                  x={textX}
                  y={textY}
                  fill="white"
                  fontSize="3.5"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="prize-text neon-text pointer-events-none"
                  style={{
                    transform: `rotate(${textRotation}deg)`,
                    transformOrigin: `${textX}px ${textY}px`,
                  }}
                >
                  {segment.text}
                </text>
              </svg>
            </div>
          );
        })}
      </div>

      {/* Center point */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10"></div>

      {/* Marker triangle at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 z-20">
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 0L24 12L0 12z" fill="#FFC107" />
        </svg>
      </div>

      {/* Spin button */}
      <button
        onClick={spinWheel}
        disabled={isSpinning || hasSpun}
        className={`absolute -bottom-20 left-1/2 -translate-x-1/2 main-button ${
          isSpinning || hasSpun 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:scale-105 animate-pulse-glow'
        }`}
      >
        {isSpinning ? 'Girando...' : hasSpun ? 'Girado' : 'Girar Roleta'}
      </button>
    </div>
  );
};

export default PrizeWheel;
