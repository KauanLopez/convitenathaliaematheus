import { motion } from 'framer-motion';
import { Image } from './ui/Image';

interface EnvelopeProps {
  onOpen: () => void;
}

export const Envelope = ({ onOpen }: EnvelopeProps) => {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary overflow-hidden cursor-pointer"
      onClick={onOpen}
      exit={{ 
        opacity: 0, 
        scale: 1.1,
        filter: "blur(10px)",
        transition: { duration: 1.2 }
      }}
    >
      <div className="relative h-full flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-full relative shadow-subtle flex items-center justify-center overflow-hidden"
        >
          <Image 
            src="/envelope.png" 
            alt="Convite Fechado"
            fallbackText="Convite Fechado"
            containerClassName="h-[100vh] w-auto bg-transparent"
            className="h-[100vh] w-auto max-w-none object-cover"
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute top-[40%] text-center z-10 w-full px-4"
        >
          <p className="font-heading text-4xl md:text-5xl text-bg-secondary drop-shadow-md">
            Toque para abrir
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
