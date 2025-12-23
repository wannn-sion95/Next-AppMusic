import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string | null;
  isVisible: boolean;
}

export default function Toast({ message, isVisible }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-150 bg-[#22c527] text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-2"
        >
          <i className="ri-checkbox-circle-fill text-xl"></i>
          <span className="font-bold text-sm">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
