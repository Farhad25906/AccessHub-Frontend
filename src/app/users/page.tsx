'use client';

import MainLayout from '@/components/layout/MainLayout';
import { useGetAllUsersQuery, useDeleteUserMutation } from '@/redux/features/user/userApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Trash2, Edit, Plus, UserPlus, ShieldAlert, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import AddUserModal from '@/components/ui/AddUserModal';
import PermissionEditorModal from '@/components/ui/PermissionEditorModal';
import UpdateRoleModal from '@/components/ui/UpdateRoleModal';

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isUpdateRoleModalOpen, setIsUpdateRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; email: string; roleId?: string } | null>(null);

  const { data: usersData, isLoading } = useGetAllUsersQuery(undefined);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [deleteUser] = useDeleteUserMutation();

  const handleEditPermissions = (user: any) => {
    setSelectedUser(user);
    setIsPermissionModalOpen(true);
  };

  const handleUpdateRole = (user: any) => {
    setSelectedUser(user);
    setIsUpdateRoleModalOpen(true);
  };

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
            <h1 className="text-3xl font-bold text-[var(--text-dark)]">Identity Management</h1>
            <p className="text-[var(--text-mid)] mt-1">Manage platform users and their primary roles.</p>
          </div>
          {canCreate && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[var(--orange-btn)] text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-md active:translate-y-[1px] font-bold"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add User</span>
            </button>
          )}
        </div>

        <div className="bg-white border border-[var(--border)] rounded-[24px] overflow-hidden overflow-x-auto shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FAF7F4] border-b border-[var(--border)]">
                <th className="px-6 py-4 text-[var(--text-dark)] font-bold text-sm">User</th>
                <th className="px-6 py-4 text-[var(--text-dark)] font-bold text-sm">Role</th>
                <th className="px-6 py-4 text-[var(--text-dark)] font-bold text-sm">Joined</th>
                <th className="px-6 py-4 text-[var(--text-dark)] font-bold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {usersData?.data?.map((user: any) => (
                <tr key={user.id} className="hover:bg-[#FDF6EF]/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[var(--orange)]/10 rounded-xl flex items-center justify-center text-[var(--orange)] font-bold">
                        {user.email[0].toUpperCase()}
                      </div>
                      <span className="text-[var(--text-dark)] font-semibold">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-[var(--orange)]/10 text-[var(--orange)] rounded-full text-[11px] font-bold uppercase tracking-wider">
                      {user.role?.name || 'No Role'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--text-mid)] text-sm font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleEditPermissions(user)}
                        disabled={!canEdit}
                        title="Edit Permissions"
                        className="p-2.5 bg-[var(--orange)] text-white disabled:opacity-30 transition-all rounded-lg shadow-sm hover:opacity-90 active:translate-y-[1px]"
                      >
                        <Shield className="w-4.5 h-4.5" />
                      </button>
                      <button 
                        onClick={() => handleUpdateRole(user)}
                        disabled={!canEdit}
                        title="Edit User Role"
                        className="p-2.5 bg-[var(--orange)] text-white disabled:opacity-30 transition-all rounded-lg shadow-sm hover:opacity-90 active:translate-y-[1px]"
                      >
                        <Edit className="w-4.5 h-4.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        disabled={!canDelete || user.id === currentUser?.id}
                        className="p-2.5 bg-[#1B1B1B] text-white disabled:opacity-30 transition-all rounded-lg shadow-sm hover:opacity-90 active:translate-y-[1px]"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {isLoading && (
            <div className="p-20 flex justify-center w-full bg-white">
               <div className="w-8 h-8 border-4 border-[var(--orange)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {!isLoading && usersData?.data?.length === 0 && (
            <div className="p-20 text-center text-[var(--text-mid)] bg-white font-medium">
              No users found in the system.
            </div>
          )}
        </div>

        {/* Security Alert */}
        <div className="bg-[var(--orange)]/5 border border-[var(--orange)]/10 p-6 rounded-2xl flex items-start space-x-4">
          <div className="p-2 bg-[var(--orange)]/10 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-[var(--orange)]" />
          </div>
          <div>
            <h4 className="text-[var(--text-dark)] font-bold">Grant Ceiling Active</h4>
            <p className="text-[var(--text-mid)] text-sm mt-1 font-medium">You can only assign or delegate permissions that you currently possess. Attempting to bypass this will result in an audit failure.</p>
          </div>
        </div>
      </div>

      <AddUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <PermissionEditorModal
        isOpen={isPermissionModalOpen}
        onClose={() => {
          setIsPermissionModalOpen(false);
          setSelectedUser(null);
        }}
        targetUser={selectedUser}
      />

      <UpdateRoleModal
        isOpen={isUpdateRoleModalOpen}
        onClose={() => {
          setIsUpdateRoleModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </MainLayout>
  );
}
