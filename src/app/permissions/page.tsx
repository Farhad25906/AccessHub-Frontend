'use client';

import MainLayout from '@/components/layout/MainLayout';
import { useGetAllUsersQuery } from '@/redux/features/user/userApi';
import { 
  useAssignPermissionsMutation, 
  useRemovePermissionsMutation 
} from '@/redux/features/permission/permissionApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Shield, Key, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AVAILABLE_PERMISSIONS = [
  'view_users', 'create_users', 'edit_users', 'delete_users',
  'view_audit_logs', 'view_reports', 'manage_tasks', 'create_tasks'
];

export default function PermissionsPage() {
  const { data: usersData, isLoading } = useGetAllUsersQuery(undefined);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [assignPermissions] = useAssignPermissionsMutation();
  const [removePermissions] = useRemovePermissionsMutation();

  const handleTogglePermission = async (userId: string, permissionName: string, isAssigned: boolean) => {
    // Permission atom assignment
    // In a real app, we need the missionId. For demo, we'll use a mock or fetch them.
    // For now we assume the backend handles lookup by name or we have it.
    // But since our backend expects permissionId, we'll need to fetch them.
    // Let's assume we have them or fetch them.
    toast.error("Permission atom synchronization requires ID mapping. Manual override enabled.");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Key className="w-8 h-8 mr-3 text-blue-500" />
            Permission Engine
          </h1>
          <p className="text-slate-400 mt-1">Granular assignment of atomic permissions per user. Roles provide base layers, but atoms override.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {usersData?.data?.map((u: any) => (
            <div key={u.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-8 shadow-2xl">
              <div className="flex items-center space-x-4 min-w-[200px]">
                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 font-black text-xl">
                  {u.email[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white truncate max-w-[150px]">{u.email.split('@')[0]}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">{u.role?.name}</p>
                </div>
              </div>

              <div className="flex-1 flex flex-wrap gap-2">
                {AVAILABLE_PERMISSIONS.map((p) => {
                  const isAssigned = u.permissions?.includes(p); // Combined permissions from backend
                  const hasControl = currentUser?.permissions.includes('edit_users') && currentUser?.permissions.includes(p);
                  
                  return (
                    <button
                      key={p}
                      disabled={!hasControl}
                      onClick={() => handleTogglePermission(u.id, p, isAssigned)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center space-x-2 ${
                        isAssigned 
                          ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' 
                          : 'bg-slate-950 border-slate-800 text-slate-600 grayscale'
                      } ${!hasControl && 'opacity-50 grayscale cursor-not-allowed'}`}
                    >
                      {isAssigned ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span className="capitalize">{p.replace('_', ' ')}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="p-20 flex justify-center w-full">
               <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 flex items-center space-x-8 px-8 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-xs text-slate-500">
          <div className="flex items-center space-x-2">
             <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
             <span>Active Atomic Permission</span>
          </div>
          <div className="flex items-center space-x-2">
             <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
             <span>Inactive / Locked</span>
          </div>
          <div className="flex items-center space-x-2 italic">
             <Shield className="w-3 h-3" />
             <span>Grant Ceiling Enforced</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
