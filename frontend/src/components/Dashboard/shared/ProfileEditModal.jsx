import { useState } from 'react';

const CloseIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const ProfileEditModal = ({ isOpen, onClose, user, token, onProfileUpdated }) => {
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Profile form state
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    // Password form state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Profile updated successfully!');
                onProfileUpdated(data.data.user);
                setTimeout(() => {
                    setSuccess('');
                }, 3000);
            } else {
                setError(data.error || 'Failed to update profile');
            }
        } catch (err) {
            console.error(err);
            setError('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(passwordData),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Password changed successfully!');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                setTimeout(() => {
                    setSuccess('');
                }, 3000);
            } else {
                setError(data.error || 'Failed to change password');
            }
        } catch (err) {
            console.error(err);
            setError('Error changing password');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError('');
        setSuccess('');
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Profile Settings</h3>
                        <p className="text-sm text-slate-500 mt-1">Manage your account details</p>
                    </div>
                    <button onClick={handleClose} className="text-slate-400 hover:text-red-500 transition-colors">
                        <CloseIcon />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${activeTab === 'profile'
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Profile Details
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${activeTab === 'password'
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Change Password
                    </button>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-100 rounded-xl text-green-600 text-sm font-medium flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        {success}
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'profile' ? (
                        <form onSubmit={handleProfileSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 font-medium"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 font-medium"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 font-medium"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <p className="text-xs text-slate-500">
                                    <span className="font-semibold">Role:</span> {user?.role?.replace('_', ' ').toUpperCase()}
                                </p>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-200 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handlePasswordSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700">Current Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 font-medium"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 font-medium"
                                    minLength="6"
                                />
                                <p className="text-xs text-slate-500">Minimum 6 characters</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 font-medium"
                                    minLength="6"
                                />
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-200 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileEditModal;
