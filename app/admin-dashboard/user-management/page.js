'use client';

import Navbar from '../Navbar';  // Importing Navbar
import { useState } from 'react';
import { FaUserAlt, FaSearch, FaEdit, FaTrash, FaCheck, FaTimes, FaClipboardList } from 'react-icons/fa';  // Icons

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, userId: 'U123', email: 'userx@example.com', fullName: 'User X', role: 'Patient', status: 'Active', subscriptionPlan: 'Premium', createdAt: '2025-03-20', subscriptionEndDate: '2025-04-20' },
    { id: 2, userId: 'U124', email: 'usery@example.com', fullName: 'User Y', role: 'Admin', status: 'Inactive', subscriptionPlan: 'Free', createdAt: '2025-03-18', subscriptionEndDate: null },
    { id: 3, userId: 'U125', email: 'userz@example.com', fullName: 'User Z', role: 'User', status: 'Active', subscriptionPlan: 'Premium', createdAt: '2025-03-19', subscriptionEndDate: '2025-05-19' },
  ]);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleBulkAction = (action) => {
    console.log(action, selectedUsers);
  };

  const handleRowSelect = (userId) => {
    setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  const handleActivate = (userId) => {
    console.log('Activating user:', userId);
    setUsers(prevUsers => 
      prevUsers.map(user => user.id === userId ? { ...user, status: 'Active' } : user)
    );
  };

  const handleDeactivate = (userId) => {
    console.log('Deactivating user:', userId);
    setUsers(prevUsers => 
      prevUsers.map(user => user.id === userId ? { ...user, status: 'Inactive' } : user)
    );
  };

  const handleEditClick = (userId) => {
    setEditingUser(userId);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleSaveEdit = (userId, updatedUser) => {
    setUsers(prevUsers => 
      prevUsers.map(user => user.id === userId ? { ...user, ...updatedUser } : user)
    );
    setEditingUser(null);
  };

  const handleDeleteClick = (userId) => {
    setShowDeleteConfirmation(true);
    setUserToDelete(userId);
  };

  const handleConfirmDelete = () => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete));
    setShowDeleteConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  // Function to check subscription expiry
  const checkSubscriptionExpiry = (endDate) => {
    if (!endDate) return 'N/A';
    const currentDate = new Date();
    const expiryDate = new Date(endDate);
    return expiryDate < currentDate ? 'Expired' : 'Active';
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
      <Navbar />
      <div className="flex-1 p-6 mt-20">
        <h2 className="text-3xl font-semibold mb-6">User Management</h2>

        {/* Search Bar Section */}
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <input type="text" placeholder="Search users..." className="p-2 bg-gray-800 text-white rounded-l-md" />
            <button className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 transition-all duration-300">
              <FaSearch />
            </button>
          </div>
          <div>
            {/* Bulk Action Buttons */}
            <button onClick={() => handleBulkAction('activate')} className="bg-green-600 text-white px-4 py-2 rounded-md mr-2 hover:bg-green-700 transition-all duration-300">
              Activate
            </button>
            <button onClick={() => handleBulkAction('deactivate')} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all duration-300">
              Deactivate
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
                <th className="p-4 text-left text-white">Subscription Plan</th>
                <th className="p-4 text-left text-white">Subscription Period</th>
                <th className="p-4 text-left text-white">Created At</th>
                <th className="p-4 text-left text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-300">
                  <td className="p-4 text-white">
                    <input type="checkbox" onChange={() => handleRowSelect(user.id)} checked={selectedUsers.includes(user.id)} />
                  </td>
                  <td className="p-4 text-white">{user.userId}</td>
                  <td className="p-4 text-white">
                    {editingUser === user.id ? (
                      <input
                        type="text"
                        value={user.fullName}
                        onChange={(e) => setUsers(prev => prev.map(u => u.id === user.id ? { ...u, fullName: e.target.value } : u))}
                        className="p-2 bg-gray-700 text-white rounded"
                      />
                    ) : (
                      user.fullName
                    )}
                  </td>
                  <td className="p-4 text-white">{user.email}</td>
                  <td className="p-4 text-white">
                    {editingUser === user.id ? (
                      <select
                        value={user.role}
                        onChange={(e) => setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: e.target.value } : u))}
                        className="p-2 bg-gray-700 text-white rounded"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Patient">Patient</option>
                        <option value="User">User</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className={`p-4 ${user.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>{user.status}</td>
                  <td className="p-4 text-white">
                    {editingUser === user.id ? (
                      <select
                        value={user.subscriptionPlan}
                        onChange={(e) => setUsers(prev => prev.map(u => u.id === user.id ? { ...u, subscriptionPlan: e.target.value } : u))}
                        className="p-2 bg-gray-700 text-white rounded"
                      >
                        <option value="Free">Free</option>
                        <option value="Premium">Premium</option>
                      </select>
                    ) : (
                      user.subscriptionPlan
                    )}
                  </td>
                  <td className="p-4 text-white">
                    {user.role === 'Patient' ? (
                      editingUser === user.id ? (
                        <input
                          type="date"
                          value={user.subscriptionEndDate}
                          onChange={(e) => setUsers(prev => prev.map(u => u.id === user.id ? { ...u, subscriptionEndDate: e.target.value } : u))}
                          className="p-2 bg-gray-700 text-white rounded"
                        />
                      ) : (
                        checkSubscriptionExpiry(user.subscriptionEndDate)
                      )
                    ) : '-'}
                  </td>
                  <td className="p-4 text-white">{user.createdAt}</td>
                  <td className="p-4 flex gap-2">
                    {editingUser === user.id ? (
                      <>
                        <button onClick={() => handleSaveEdit(user.id, { ...user, fullName: user.fullName, role: user.role, subscriptionPlan: user.subscriptionPlan, subscriptionEndDate: user.subscriptionEndDate })} className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-all duration-300" title="Save">
                          Save
                        </button>
                        <button onClick={handleCancelEdit} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-all duration-300" title="Cancel">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditClick(user.id)} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-all duration-300" title="Edit">
                          <FaEdit /> Edit
                        </button>
                        <button onClick={() => handleDeleteClick(user.id)} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-all duration-300" title="Delete">
                          <FaTrash /> Delete
                        </button>
                      </>
                    )}
                    {user.status !== 'Active' && (
                      <button onClick={() => handleActivate(user.id)} className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-all duration-300" title="Activate">
                        <FaCheck /> Activate
                      </button>
                    )}
                    {user.status !== 'Inactive' && (
                      <button onClick={() => handleDeactivate(user.id)} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-all duration-300" title="Deactivate">
                        <FaTimes /> Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-white">Showing 1 to 10 of 100 users</span>
          <div>
            <button className="bg-gray-700 text-white px-4 py-2 rounded-l-md hover:bg-gray-800 transition-all duration-300">Previous</button>
            <button className="bg-gray-700 text-white px-4 py-2 rounded-r-md hover:bg-gray-800 transition-all duration-300">Next</button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this user?</h3>
            <div className="flex justify-end gap-4">
              <button onClick={handleConfirmDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all duration-300">
                Yes, Delete
              </button>
              <button onClick={handleCancelDelete} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all duration-300">
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
