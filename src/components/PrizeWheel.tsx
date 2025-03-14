
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
    audioRef.current = new Audio('/spinning-sound.mp3');
    clickAudioRef.current = new Audio('/click-sound.mp3');
    
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
    
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
    } catch (error) {
      console.log("Audio error:", error);
    }
    
    const finalSegment = segments[finalPrizeIndex];
    
    const markerPosition = 270;
    const segmentStopDegree = finalSegment.middleDegree;
    
    const fullRotations = 5;
    const degreesToRotate = (360 * fullRotations) + (markerPosition - segmentStopDegree);
    
    setRotationDegree(degreesToRotate);
    
    setTimeout(() => {
      setIsSpinning(false);
      setHasSpun(true);
      
      try {
        if (clickAudioRef.current) {
          clickAudioRef.current.currentTime = 0;
          clickAudioRef.current.play().catch(e => console.log("Click sound failed:", e));
        }
      } catch (error) {
        console.log("Audio error:", error);
      }
      
      onSpinEnd(prizes[finalPrizeIndex]);
    }, 3000);
  };

  return (
    <div className="relative prize-wheel-container mx-auto my-8 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px]">
      <div 
        ref={wheelRef}
        className="prize-wheel absolute inset-0 rounded-full overflow-hidden border-4 border-white/20 shadow-[0_0_25px_rgba(0,123,255,0.5)]"
        style={{
          transform: `rotate(${rotationDegree}deg)`,
          transition: isSpinning ? 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
        }}
      >
        {segments.map((segment, idx) => {
          const startAngle = segment.startDegree * (Math.PI / 180);
          const endAngle = segment.endDegree * (Math.PI / 180);
          
          const centerX = 50;
          const centerY = 50;
          const radius = 50;
          
          const x1 = centerX;
          const y1 = centerY;
          const x2 = centerX + radius * Math.cos(startAngle);
          const y2 = centerY + radius * Math.sin(startAngle);
          const x3 = centerX + radius * Math.cos(endAngle);
          const y3 = centerY + radius * Math.sin(endAngle);
          
          const largeArcFlag = segment.endDegree - segment.startDegree > 180 ? 1 : 0;
          
          const pathData = `M ${x1},${y1} L ${x2},${y2} A ${radius},${radius} 0 ${largeArcFlag} 1 ${x3},${y3} Z`;
          
          const textRotation = segment.middleDegree + 90;
          
          // Adjust text distance from center based on segment size
          const textDistance = 32; // Increased distance from center
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
                  fontSize="8"
                  fontFamily="Arial, sans-serif"
                  fontWeight="normal"
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

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10"></div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 z-20">
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 0L24 12L0 12z" fill="#FFC107" />
        </svg>
      </div>

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
