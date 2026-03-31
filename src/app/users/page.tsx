'use client';

import MainLayout from '@/components/layout/MainLayout';
import { useGetAllUsersQuery, useDeleteUserMutation } from '@/redux/features/user/userApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Trash2, Edit, Plus, UserPlus, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function UsersPage() {
  const { data: usersData, isLoading } = useGetAllUsersQuery(undefined);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap();
        toast.success('User deleted successfully');
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  const canEdit = currentUser?.permissions.includes('edit_users');
  const canDelete = currentUser?.permissions.includes('delete_users');
  const canCreate = currentUser?.permissions.includes('create_users');

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Identity Management</h1>
            <p className="text-slate-400 mt-1">Manage platform users and their primary roles.</p>
          </div>
          {canCreate && (
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all">
              <UserPlus className="w-5 h-5" />
              <span>Add User</span>
            </button>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto shadow-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800">
                <th className="px-6 py-4 text-slate-400 font-semibold text-sm">User</th>
                <th className="px-6 py-4 text-slate-400 font-semibold text-sm">Role</th>
                <th className="px-6 py-4 text-slate-400 font-semibold text-sm">Joined</th>
                <th className="px-6 py-4 text-slate-400 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {usersData?.data?.map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-blue-500 font-bold">
                        {user.email[0].toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
                      {user.role?.name || 'No Role'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        disabled={!canEdit}
                        className="p-2 text-slate-400 hover:text-blue-400 disabled:opacity-30 transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        disabled={!canDelete || user.id === currentUser?.id}
                        className="p-2 text-slate-400 hover:text-red-400 disabled:opacity-30 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {isLoading && (
            <div className="p-20 flex justify-center w-full">
               <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {!isLoading && usersData?.data?.length === 0 && (
            <div className="p-20 text-center text-slate-500">
              No users found in the system.
            </div>
          )}
        </div>

        {/* Security Alert */}
        <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl flex items-start space-x-4">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h4 className="text-amber-500 font-bold">Grant Ceiling Active</h4>
            <p className="text-slate-400 text-sm mt-1">You can only assign or delegate permissions that you currently possess. Attempting to bypass this will result in an audit failure.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
