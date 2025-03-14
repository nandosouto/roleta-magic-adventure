
import React from 'react';
import { ArrowRight, Gift } from 'lucide-react';

interface ActionButtonsProps {
  show: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div 
      className={`flex flex-col md:flex-row items-center justify-center gap-4 my-10 transform 
                ${show ? 'animate-fade-in opacity-100' : 'opacity-0'}`}
    >
      <a 
        href="https://chat.whatsapp.com/Hy67ieeJ8cFDV3BK0NM747"
        target="_blank" 
        rel="noopener noreferrer"
        className="relative overflow-hidden group glass-button bg-neon-green text-white font-bold py-4 px-6 md:px-8 rounded-xl text-center w-full md:w-auto"
      >
        <span className="absolute inset-0 w-full h-full bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
        <span className="relative flex items-center justify-center gap-2">
          <Gift className="w-5 h-5" />
          Clique aqui e comece a ganhar muito $
          <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </a>
      
      <a 
        href="https://1wgxql.com/casino/list?open=register&p=69za"
        target="_blank" 
        rel="noopener noreferrer"
        className="relative overflow-hidden group glass-button bg-neon-gold text-black font-bold py-4 px-6 md:px-8 rounded-xl text-center w-full md:w-auto"
      >
        <span className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
        <span className="relative flex items-center justify-center gap-2">
          <span className="relative flex items-center justify-center gap-2">
            <Gift className="w-5 h-5" />
            Clique aqui se quiser 500% de bônus e jogar diretamente na casa
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </span>
      </a>
    </div>
  );
};

export default ActionButtons;
