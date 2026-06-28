import { motion } from 'framer-motion';
import { cn } from '../../utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Section = ({ children, className, id }: SectionProps) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={cn("py-20 md:py-32 px-6 max-w-7xl mx-auto w-full", className)}
    >
      {children}
    </motion.section>
  );
};
