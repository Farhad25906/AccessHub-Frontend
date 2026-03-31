'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, ShieldCheck, ShieldAlert, Loader2, Save, RotateCcw } from 'lucide-react';
import { 
  useGetAllPermissionsQuery, 
  useGetUserPermissionsQuery, 
  useAssignPermissionsMutation, 
  useRemovePermissionsMutation 
} from '@/redux/features/permission/permissionApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { toast } from 'react-hot-toast';

interface PermissionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: { id: string; email: string } | null;
}

export default function PermissionEditorModal({ isOpen, onClose, targetUser }: PermissionEditorModalProps) {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  
  // Queries
  const { data: allPermissionsData, isLoading: isLoadingAll } = useGetAllPermissionsQuery(undefined, { skip: !isOpen });
  const { data: userPermissionsData, isLoading: isLoadingUser, refetch: refetchUser } = useGetUserPermissionsQuery(targetUser?.id, { skip: !isOpen || !targetUser });
  
  // Mutations
  const [assignPermissions, { isLoading: isAssigning }] = useAssignPermissionsMutation();
  const [removePermissions, { isLoading: isRemoving }] = useRemovePermissionsMutation();

  // Local state for toggled permissions
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Initialize selected permissions when data loads
  useEffect(() => {
    if (userPermissionsData?.data) {
      setSelectedPermissions(userPermissionsData.data);
    }
  }, [userPermissionsData]);

  const allPermissions = allPermissionsData?.data || [];
  const currentUserPermissions = currentUser?.permissions || [];
  const initialPermissions = userPermissionsData?.data || [];

  const handleToggle = (permissionName: string) => {
    if (selectedPermissions.includes(permissionName)) {
      setSelectedPermissions(prev => prev.filter(p => p !== permissionName));
    } else {
      setSelectedPermissions(prev => [...prev, permissionName]);
    }
  };

  const handleSave = async () => {
    if (!targetUser) return;

    const toAssign = selectedPermissions.filter((p: string) => !initialPermissions.includes(p));
    const toRemove = initialPermissions.filter((p: string) => !selectedPermissions.includes(p));

    if (toAssign.length === 0 && toRemove.length === 0) {
      toast.error('No changes to save');
      return;
    }

    try {
      if (toAssign.length > 0) {
        await assignPermissions({ targetUserId: targetUser.id, permissions: toAssign }).unwrap();
      }
      if (toRemove.length > 0) {
        await removePermissions({ targetUserId: targetUser.id, permissions: toRemove }).unwrap();
      }
      toast.success('Permissions updated successfully');
      refetchUser(); // Refresh local list
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update permissions');
    }
  };

  const isSaving = isAssigning || isRemoving;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isSaving ? onClose : undefined}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-all"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-[var(--border)] w-full max-w-lg overflow-hidden pointer-events-auto flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--orange)] rounded-xl flex items-center justify-center shadow-sm">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text-dark)] tracking-tight">Manage Permissions</h2>
                    <p className="text-[var(--text-mid)] text-[13px] mt-0.5 truncate max-w-[240px]">
                      Editing: <span className="text-[var(--orange)] font-semibold">{targetUser?.email}</span>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  disabled={isSaving}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-light)] hover:bg-[#F5F0EB] hover:text-[var(--text-dark)] transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAF8] space-y-6">
                
                {/* Grant Ceiling Note */}
                <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[12px] text-slate-600 leading-relaxed">
                    <strong className="text-amber-600">Grant Ceiling Active:</strong> Some permissions may be disabled because you do not possess them. You cannot delegate higher authority than your own.
                  </p>
                </div>

                {isLoadingAll || isLoadingUser ? (
                  <div className="py-20 flex flex-col items-center justify-center text-[var(--text-mid)] gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--orange)]" />
                    <span className="text-sm font-medium">Loading permissions...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {allPermissions.map((permission: any) => {
                      const hasPossession = currentUserPermissions.includes(permission.name);
                      const isSelected = selectedPermissions.includes(permission.name);
                      
                      return (
                        <div 
                          key={permission.id}
                          className={`
                            relative flex items-center p-3.5 rounded-xl border transition-all cursor-pointer select-none
                            ${isSelected ? 'bg-white border-[var(--orange)] shadow-sm' : 'bg-white border-[var(--border)] hover:border-[var(--text-light)]'}
                            ${!hasPossession ? 'opacity-40 grayscale-[0.5] cursor-not-allowed' : ''}
                          `}
                          onClick={() => hasPossession && handleToggle(permission.name)}
                        >
                          <div className={`
                            w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0
                            ${isSelected ? 'bg-[var(--orange)] border-[var(--orange)] text-white' : 'border-slate-300 bg-slate-50'}
                          `}>
                            {isSelected && <ShieldCheck className="w-3.5 h-3.5" />}
                          </div>
                          
                          <div className="ml-3 overflow-hidden">
                            <p className={`text-[13px] font-bold truncate ${isSelected ? 'text-[var(--text-dark)]' : 'text-[var(--text-mid)]'}`}>
                              {permission.name.replace(/_/g, ' ')}
                            </p>
                            <p className="text-[10px] text-[var(--text-light)] uppercase tracking-tight">Atom: {permission.name}</p>
                          </div>

                          {!hasPossession && (
                            <div className="absolute top-2 right-2">
                              <ShieldAlert className="w-3 h-3 text-amber-500" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-5 border-t border-[var(--border)] bg-white flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPermissions(initialPermissions)}
                  disabled={isSaving || isLoadingUser}
                  className="px-4 py-2.5 rounded-[10px] bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-[10px] bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || isLoadingUser}
                  className="px-6 py-2.5 rounded-[10px] bg-orange-500 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-md active:translate-y-[1px] disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
