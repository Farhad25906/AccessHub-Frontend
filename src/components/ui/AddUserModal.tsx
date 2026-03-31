'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Mail, Lock, Shield, Loader2 } from 'lucide-react';
import { useGetRolesQuery, useCreateUserMutation } from '@/redux/features/user/userApi';
import { toast } from 'react-hot-toast';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');

  const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery(undefined, { skip: !isOpen });
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setRoleId('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !roleId) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await createUser({ email, password, roleId }).unwrap();
      toast.success('User created successfully');
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create user');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isCreating ? onClose : undefined}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-all"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-[var(--border)] w-full max-w-md overflow-hidden pointer-events-auto flex flex-col"
            >
              <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between bg-white relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--orange)] rounded-xl flex items-center justify-center shadow-sm">
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text-dark)] tracking-tight">Add New User</h2>
                    <p className="text-[var(--text-mid)] text-[13px] mt-0.5">Create a new identity and assign roles.</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  disabled={isCreating}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-light)] hover:bg-[#F5F0EB] hover:text-[var(--text-dark)] transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5 bg-[#FAFAF8]">
                
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[var(--text-dark)] ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-light)]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--border)] rounded-xl text-sm focus:border-[var(--orange)] focus:ring-2 focus:ring-[var(--orange)]/20 outline-none transition-all placeholder:text-[var(--text-light)] text-[var(--text-dark)]"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[var(--text-dark)] ml-1">Temporary Password</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-light)]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--border)] rounded-xl text-sm focus:border-[var(--orange)] focus:ring-2 focus:ring-[var(--orange)]/20 outline-none transition-all placeholder:text-[var(--text-light)] text-[var(--text-dark)]"
                    />
                  </div>
                </div>

                {/* Role Field */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[var(--text-dark)] ml-1">System Role</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--orange)]">
                      <Shield className="w-4 h-4" />
                    </div>
                    <select
                      required
                      value={roleId}
                      onChange={(e) => setRoleId(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-white border border-[var(--border)] rounded-xl text-sm focus:border-[var(--orange)] focus:ring-2 focus:ring-[var(--orange)]/20 outline-none transition-all appearance-none ${roleId ? 'text-[var(--text-dark)]' : 'text-[var(--text-light)]'}`}
                    >
                      <option value="" disabled>Select a role</option>
                      {isLoadingRoles ? (
                        <option disabled>Loading roles...</option>
                      ) : (
                        rolesData?.data?.map((role: any) => (
                          <option key={role.id} value={role.id} className="text-[var(--text-dark)]">
                            {role.name}
                          </option>
                        ))
                      )}
                    </select>
                    {/* Custom unstyled chevron for the native select */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-light)]">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isCreating}
                    className="flex-1 py-3 px-4 rounded-xl border border-[var(--border)] bg-white text-[var(--text-dark)] font-semibold hover:bg-[#F5F0EB] transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 py-3 px-4 rounded-xl border border-transparent bg-[var(--orange-btn)] text-white font-bold hover:opacity-90 transition-all shadow-md active:translate-y-[1px] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create User'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
