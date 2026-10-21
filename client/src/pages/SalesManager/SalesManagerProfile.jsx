import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SalesManagerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Define backend base URL (Ensure this matches your backend server port)
  const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchSalesManagerProfile = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('No authentication token found. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data);
      } catch (err) {
        console.error('Fetch Sales Manager Profile Error:', err);
        setError(
          err.response?.data?.message || 'Failed to load Sales Manager profile details.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSalesManagerProfile();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setUpdatingPassword(true);
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/api/auth/change-password`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPasswordMessage(
        response.data.message || 'Password updated successfully.'
      );
      setNewPassword('');
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || 'Failed to update password.'
      );
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-lg font-medium text-gray-600 animate-pulse">
          Loading Sales Manager Profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sales Manager Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account credentials and sales territory identity.
        </p>
      </div>

      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatar / Quick Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-teal-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-inner">
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'SM'}
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              {profile.name}
            </h2>
            <span className="inline-block bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full mt-2">
              {profile.role}
            </span>
            <span className="text-xs text-gray-400 mt-1">
              Code: {profile.userCode}
            </span>
          </div>

          {/* Details & Password Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Account Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                Account Information
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-gray-500 font-medium">Full Name</dt>
                  <dd className="text-gray-900 mt-1 font-semibold">
                    {profile.name || 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500 font-medium">Email Address</dt>
                  <dd className="text-gray-900 mt-1 font-semibold">
                    {profile.email || 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500 font-medium">Mobile Number</dt>
                  <dd className="text-gray-900 mt-1 font-semibold">
                    {profile.mobile || 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500 font-medium">User Code</dt>
                  <dd className="text-gray-900 mt-1 font-semibold">
                    {profile.userCode || 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500 font-medium">State / Region</dt>
                  <dd className="text-gray-900 mt-1 font-semibold">
                    {profile.state || 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500 font-medium">District</dt>
                  <dd className="text-gray-900 mt-1 font-semibold">
                    {profile.district || 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Password Update Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                Security Settings
              </h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>

                {passwordMessage && (
                  <p className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    {passwordMessage}
                  </p>
                )}
                {passwordError && (
                  <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {passwordError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition duration-200 disabled:opacity-50"
                >
                  {updatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesManagerProfile;