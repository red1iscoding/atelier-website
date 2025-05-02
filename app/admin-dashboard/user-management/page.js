'use client';

import Navbar from '../Navbar';
import { useState, useEffect } from 'react';
import { FaUserAlt, FaSearch, FaEdit, FaTrash, FaCheck, FaTimes, FaClipboardList } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';  // Relative path

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch users from Supabase
  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(
          `full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) return;

    try {
      const updates = selectedUsers.map(async (userId) => {
        const { error } = await supabase
          .from('users')
          .update({ status: action === 'activate' ? 'active' : 'inactive' })
          .eq('user_id', userId);

        if (error) throw error;
      });

      await Promise.all(updates);
      fetchUsers(); // Refresh the list
      setSelectedUsers([]); // Clear selection
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const handleRowSelect = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const { error } = await supabase
        .from('users')
        .update({ status: newStatus })
        .eq('user_id', userId);

      if (error) throw error;
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: editingUser.full_name,
          email: editingUser.email,
          role: editingUser.role,
          status: editingUser.status,
          subscription_plan: editingUser.subscription_plan,
          unlimited_scans: editingUser.unlimited_scans
        })
        .eq('user_id', editingUser.user_id);

      if (error) throw error;
      fetchUsers(); // Refresh the list
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteClick = (userId) => {
    setShowDeleteConfirmation(true);
    setUserToDelete(userId);
  };

  const handleConfirmDelete = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('user_id', userToDelete);

      if (error) throw error;
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setShowDeleteConfirmation(false);
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setUserToDelete(null);
  };

  const checkSubscriptionExpiry = (endDate) => {
    if (!endDate) return 'N/A';
    const currentDate = new Date();
    const expiryDate = new Date(endDate);
    return expiryDate < currentDate ? 'Expired' : 'Active';
  };

  if (loading) return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
      <Navbar />
      <div className="flex-1 p-6 mt-20 flex justify-center items-center">
        <p>Loading users...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
      <Navbar />
      <div className="flex-1 p-6 mt-20">
        <h2 className="text-3xl font-semibold mb-6">User Management</h2>

        {/* Search Bar Section */}
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <input 
              type="text" 
              placeholder="Search users..." 
              className="p-2 bg-gray-800 text-white rounded-l-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 transition-all duration-300"
              onClick={fetchUsers}
            >
              <FaSearch />
            </button>
          </div>
          <div>
            <button 
              onClick={() => handleBulkAction('activate')} 
              className="bg-green-600 text-white px-4 py-2 rounded-md mr-2 hover:bg-green-700 transition-all duration-300"
            >
              Activate Selected
            </button>
            <button 
              onClick={() => handleBulkAction('deactivate')} 
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all duration-300"
            >
              Deactivate Selected
            </button>
          </div>
        </div>

        <div className="bg-gray-800 dark:bg-gray-900 p-4 rounded shadow-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-700 dark:bg-gray-800">
              <tr>
                <th className="p-4 text-left text-white">Select</th>
                <th className="p-4 text-left text-white">User ID</th>
                <th className="p-4 text-left text-white">Full Name</th>
                <th className="p-4 text-left text-white">Email</th>
                <th className="p-4 text-left text-white">Role</th>
                <th className="p-4 text-left text-white">Status</th>
                <th className="p-4 text-left text-white">Subscription</th>
                <th className="p-4 text-left text-white">Created At</th>
                <th className="p-4 text-left text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-300">
                  <td className="p-4 text-white">
                    <input 
                      type="checkbox" 
                      onChange={() => handleRowSelect(user.user_id)} 
                      checked={selectedUsers.includes(user.user_id)} 
                    />
                  </td>
                  <td className="p-4 text-white">{user.user_id}</td>
                  <td className="p-4 text-white">
                    {editingUser?.user_id === user.user_id ? (
                      <input
                        type="text"
                        value={editingUser.full_name}
                        onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})}
                        className="p-2 bg-gray-700 text-white rounded"
                      />
                    ) : (
                      user.full_name
                    )}
                  </td>
                  <td className="p-4 text-white">
                    {editingUser?.user_id === user.user_id ? (
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                        className="p-2 bg-gray-700 text-white rounded"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="p-4 text-white">
                    {editingUser?.user_id === user.user_id ? (
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                        className="p-2 bg-gray-700 text-white rounded"
                      >
                        <option value="admin">Admin</option>
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className={`p-4 ${user.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                    {user.status}
                  </td>
                  <td className="p-4 text-white">
                    {editingUser?.user_id === user.user_id ? (
                      <select
                        value={editingUser.subscription_plan}
                        onChange={(e) => setEditingUser({...editingUser, subscription_plan: e.target.value})}
                        className="p-2 bg-gray-700 text-white rounded"
                      >
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                      </select>
                    ) : (
                      user.subscription_plan || 'N/A'
                    )}
                  </td>
                  <td className="p-4 text-white">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 flex gap-2">
                    {editingUser?.user_id === user.user_id ? (
                      <>
                        <button 
                          onClick={handleSaveEdit}
                          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-all duration-300" 
                          title="Save"
                        >
                          <FaCheck /> Save
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-all duration-300" 
                          title="Cancel"
                        >
                          <FaTimes /> Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleEditClick(user)}
                          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-all duration-300" 
                          title="Edit"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(user.user_id)}
                          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-all duration-300" 
                          title="Delete"
                        >
                          <FaTrash /> Delete
                        </button>
                        {user.status !== 'active' && (
                          <button 
                            onClick={() => handleStatusToggle(user.user_id, user.status)}
                            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-all duration-300" 
                            title="Activate"
                          >
                            <FaCheck /> Activate
                          </button>
                        )}
                        {user.status !== 'inactive' && (
                          <button 
                            onClick={() => handleStatusToggle(user.user_id, user.status)}
                            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-all duration-300" 
                            title="Deactivate"
                          >
                            <FaTimes /> Deactivate
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-white">Showing {users.length} users</span>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this user?</h3>
            <div className="flex justify-end gap-4">
              <button 
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all duration-300"
              >
                Yes, Delete
              </button>
              <button 
                onClick={handleCancelDelete}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;