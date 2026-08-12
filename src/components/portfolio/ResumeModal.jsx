import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RESUME_URL = 'https://media.base44.com/files/public/user_69ea6c7f92a6132bbc600406/c16d89b18_Resume.pdf';

export default function ResumeModal({ open, onClose }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
          />
          {/* Modal */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 z-[201] h-full w-full md:w-[70%] lg:w-[55%] bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-border">
              <h2 className="font-heading font-bold text-xl" style={{ color: '#2C3E50' }}>Resume</h2>
              <div className="flex items-center gap-3">
                <a
                  href={RESUME_URL}
                  download="Devin_Sanders_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 font-body font-medium border-2 hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
                    style={{ borderColor: '#F15B22', color: '#F15B22' }}
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                </a>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                  aria-label="Close resume"
                >
                  <X className="w-5 h-5" style={{ color: '#2C3E50' }} />
                </button>
              </div>
            </div>
            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={`${RESUME_URL}#toolbar=0`}
                title="Devin Sanders Resume"
                className="w-full h-full"
                style={{ border: 'none' }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
