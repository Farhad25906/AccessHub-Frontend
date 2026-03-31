'use client';

import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[24px] p-10 text-center shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-[var(--border)]"
      >
        <div className="w-20 h-20 bg-red-50 rounded-2xl mx-auto flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-[var(--text-dark)] mb-3">Access Denied</h1>
        <p className="text-[var(--text-mid)] text-sm mb-8">
          You don't have the required permissions to view this page. Please contact your system administrator if you believe this is a mistake.
        </p>

        <button
          onClick={() => router.back()}
          className="w-full flex items-center justify-center py-3.5 bg-[#F5F0EB] text-[var(--text-dark)] font-semibold rounded-xl hover:bg-[#EDE8E2] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </button>
      </motion.div>
    </div>
  );
}
