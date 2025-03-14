
import React, { useState, useEffect, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import PrizeWheel from '@/components/PrizeWheel';
import Background from '@/components/Background';
import ActionButtons from '@/components/ActionButtons';

const prizes = [
  { 
    text: "Ganhou um iPhone", 
    color: "#007BFF", 
    textColor: "white",
    percentage: 15 
  },
  { 
    text: "Viagem para fora", 
    color: "#28A745", 
    textColor: "white",
    percentage: 15 
  },
  { 
    text: "100% de bônus", 
    color: "#6F42C1", 
    textColor: "white",
    percentage: 15 
  },
  { 
    text: "500% de bônus", 
    color: "#FFC107", 
    textColor: "black",
    percentage: 15 
  },
  { 
    text: "Estratégia secreta para ganhar R$100 por dia", 
    color: "#DC3545", 
    textColor: "white",
    percentage: 40 
  }
];

const createConfetti = (container: HTMLDivElement) => {
  const colors = ['#007BFF', '#28A745', '#6F42C1', '#FFC107', '#DC3545'];
  const confettiCount = 150;
  
  Array.from({ length: confettiCount }).forEach((_, i) => {
    const confetti = document.createElement('div');
    confetti.className = 'confetti animate-confetti-fall';
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.backgroundColor = color;
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.width = `${Math.random() * 10 + 5}px`;
    confetti.style.height = `${Math.random() * 10 + 5}px`;
    confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    
    container.appendChild(confetti);
    
    // Remove confetti after animation ends
    setTimeout(() => {
      confetti.remove();
    }, 5000);
  });
};

const Index = () => {
  const [hasSpun, setHasSpun] = useState(false);
  const [showPrize, setShowPrize] = useState(false);
  const [currentPrize, setCurrentPrize] = useState<any>(null);
  const confettiContainerRef = useRef<HTMLDivElement>(null);
  const finalPrizeIndex = 4; // Index of "Estratégia secreta para ganhar R$100 por dia"
  
  // Check localStorage to see if user has already spun
  useEffect(() => {
    const userHasSpun = localStorage.getItem('hasSpun');
    if (userHasSpun === 'true') {
      setHasSpun(true);
      setShowPrize(true);
      setCurrentPrize(prizes[finalPrizeIndex]);
    }
  }, []);
  
  const handleSpinEnd = (prize: any) => {
    setCurrentPrize(prize);
    
    // Save to localStorage
    localStorage.setItem('hasSpun', 'true');
    
    setTimeout(() => {
      setShowPrize(true);
      
      // Create confetti effect
      if (confettiContainerRef.current) {
        createConfetti(confettiContainerRef.current);
      }
      
      // Show toast notification
      toast({
        title: "Parabéns!",
        description: `Você ganhou: ${prize.text}`,
        variant: "default",
      });
    }, 500);
  };
  
  return (
    <>
      <Background />
      <Navbar />
      
      <main className="relative pt-24 pb-16 px-4 min-h-screen flex flex-col items-center justify-start overflow-hidden">
        <div className="container max-w-5xl mx-auto z-10">
          <section className="text-center mb-12 pt-8">
            <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm text-neon-blue mb-4 animate-fade-in">
              <span className="text-sm font-medium">Gira a roleta para o seu prêmio</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white animate-fade-in neon-text" style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.5)' }}>
              Gire a Roleta e Ganhe Prêmios Incríveis!
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in">
              Participe agora e tenha a chance de ganhar um iPhone, viagens, bônus exclusivos e muito mais!
            </p>
          </section>
          
          <section className="relative">
            <PrizeWheel 
              prizes={prizes} 
              onSpinEnd={handleSpinEnd}
              finalPrizeIndex={finalPrizeIndex}
            />
            
            {showPrize && (
              <div className="mt-8 text-center animate-scale-in">
                <div className="bg-site-blue-dark/70 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg mx-auto max-w-2xl">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 text-neon-red animate-pulse-glow">
                    Parabéns! Você ganhou:
                  </h2>
                  <p className="text-xl md:text-2xl font-bold text-white mb-4">
                    {currentPrize?.text}
                  </p>
                </div>
              </div>
            )}
            
            <ActionButtons show={showPrize} />
          </section>
        </div>
        
        {/* Confetti container */}
        <div 
          ref={confettiContainerRef} 
          className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
        ></div>
      </main>
    </>
  );
};

export default Index;
