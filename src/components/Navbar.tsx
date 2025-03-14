
import React, { useEffect, useState } from 'react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
                ${scrolled 
                  ? 'py-2 bg-site-black/80 backdrop-blur-md shadow-md' 
                  : 'py-4 bg-transparent'}`}
    >
      <div className="container mx-auto px-4 flex justify-center items-center">
        <div className="flex items-center">
          <img
            src="https://i.ibb.co/jPn4HzH9/ROLETA-1.png" 
            alt="Roleta Premiada"
            className={`transition-all duration-300 ${scrolled ? 'h-10' : 'h-14'} animate-pulse-glow`}
            style={{ '--glow-color': 'rgba(0, 123, 255, 0.5)' } as React.CSSProperties}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/placeholder.svg';
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
