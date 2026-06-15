"use client";

import { motion } from "framer-motion";

type ContactSuccessModalProps = {
  onClose: () => void;
};

export default function ContactSuccessModal({ onClose }: ContactSuccessModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        role="dialog"
        aria-labelledby="contact-success-title"
        aria-modal="true"
        className="relative z-10 w-full max-w-md rounded-2xl px-8 py-8 text-center text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
        style={{
          background: "linear-gradient(180deg, #F26223 0%, #E04E12 100%)",
        }}
      >
        <h3
          id="contact-success-title"
          className="text-2xl font-extrabold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
        >
          Message Sent!
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-white/95">
          Thank you for reaching out. The ACCESS team will get back to you as soon as possible.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 rounded-xl px-10 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:opacity-90"
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          }}
        >
          Okay
        </button>
      </motion.div>
    </div>
  );
}
