import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/95 p-4 backdrop-blur-sm overflow-y-auto"
        >
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-bg-primary border-thin border-border-light w-full max-w-[600px] min-h-[50vh] max-h-[90vh] overflow-y-auto shadow-subtle z-10"
          >
            <button
              onClick={onClose}
              className="sticky top-4 right-4 float-right p-2 text-text-muted hover:text-text-main z-20 bg-bg-primary rounded-full shadow-sm"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-6 md:p-10 pt-16">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
