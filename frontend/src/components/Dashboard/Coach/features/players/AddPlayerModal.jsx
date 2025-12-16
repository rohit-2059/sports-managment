import { useState, useEffect } from 'react';
import { CloseIcon, ICONS } from '../../utils/icons.jsx';

const AddPlayerModal = ({ isOpen, onClose, teams, selectedTeam, onPlayerAdded, token }) => {
    const [formData, setFormData] = useState({
        teamId: selectedTeam?._id || '',
        name: '',
        userId: '', // ID if selecting existing user
        email: '', // Email if creating new user
        position: '',
        jerseyNumber: '',
        phone: '',
        password: '', // Needed only for new users
    });

    const [availableUsers, setAvailableUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isNewUser, setIsNewUser] = useState(false);
    const [isSelectingExisting, setIsSelectingExisting] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (selectedTeam) {
            setFormData(prev => ({ ...prev, teamId: selectedTeam._id }));
        }
    }, [selectedTeam]);

    useEffect(() => {
        // When modal opens or a team is selected, fetch registered players
        if (!isOpen) return;

        const controller = new AbortController();

        const fetchPlayers = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/auth/players`, {
                    headers: { Authorization: `Bearer ${token}` },
                    signal: controller.signal,
                });
                const data = await res.json();
                if (data.success) {
                    // Filter to players that are not assigned to a team (available)
                    const unassigned = (data.data?.players || []).filter(p => !p.teamId);
                    setAvailableUsers(unassigned);
                }
            } catch (err) {
                if (err.name !== 'AbortError') console.error('Failed to fetch players', err);
            }
        };

        fetchPlayers();

        return () => controller.abort();
    }, [isOpen, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Determine endpoint based on whether we are adding existing user or creating new
            // Assuming the backend handles both or we have specific logic. 
            // For now, let's assume we send everything to the add-player endpoint and let backend handle it
            // or we might need separate logic. 
            // Based on typical flows:

            // Build payload depending on whether an existing registered player was chosen
            let payload = {};
            if (isSelectingExisting && formData.userId) {
                payload = {
                    playerId: formData.userId,
                    isRegistered: true,
                    position: formData.position,
                    jerseyNumber: formData.jerseyNumber,
                };
            } else {
                payload = {
                    isRegistered: false,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    position: formData.position,
                    jerseyNumber: formData.jerseyNumber,
                };
            }

            const response = await fetch(`http://localhost:3001/api/teams/${formData.teamId}/players`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                onPlayerAdded();
                onClose();
                setFormData({
                    teamId: '',
                    name: '',
                    userId: '',
                    email: '',
                    position: '',
                    jerseyNumber: '',
                    phone: '',
                    password: ''
                });
                setSearchEmail('');
            } else {
                setError(data.message || 'Failed to add player');
            }
        } catch (err) {
            setError('Error adding player');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-100">
                <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Add Player</h3>
                        <p className="text-sm text-slate-500">Register a new athlete to your team</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
                        <CloseIcon />
                    </button>
                </div>

                {error && (
                    <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Team Selection */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Team</label>
                        <select
                            value={formData.teamId}
                            onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 font-medium"
                        >
                            <option value="">Select a Team</option>
                            {teams.map(team => (
                                <option key={team._id} value={team._id}>{team.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* New/Existing Toggle */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Add Player</label>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => { setIsSelectingExisting(true); setIsNewUser(false); }}
                                className={`px-3 py-1 rounded-lg ${isSelectingExisting ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
                                Select Registered
                            </button>
                            <button
                                type="button"
                                onClick={() => { setIsSelectingExisting(false); setIsNewUser(true); setFormData(prev => ({ ...prev, userId: '' })); }}
                                className={`px-3 py-1 rounded-lg ${!isSelectingExisting ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
                                Create New
                            </button>
                        </div>

                        {isSelectingExisting ? (
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-600">Search registered players</label>
                            
                                <select
                                    value={formData.userId}
                                    onChange={(e) => {
                                        const sel = availableUsers.find(u => u._id === e.target.value);
                                        setFormData(prev => ({
                                            ...prev,
                                            userId: e.target.value,
                                            name: sel?.name || '',
                                            email: sel?.email || '',
                                        }));
                                    }}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 font-medium"
                                >
                                    <option value="">Select existing player (unassigned)</option>
                                    {availableUsers
                                        .filter(u => {
                                            if (!searchQuery) return true;
                                            const q = searchQuery.toLowerCase();
                                            return (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
                                        })
                                        .map(u => (
                                            <option key={u._id} value={u._id}>{u.name} — {u.email}</option>
                                        ))}
                                </select>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 transition-all font-medium"
                                        placeholder="Player Name"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 transition-all font-medium"
                                        placeholder="player@example.com"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">Position</label>
                            <input
                                type="text"
                                required
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 transition-all font-medium"
                                placeholder="e.g. Forward"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">Jersey Number</label>
                            <input
                                type="text"
                                required
                                value={formData.jerseyNumber}
                                onChange={(e) => setFormData({ ...formData, jerseyNumber: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 transition-all font-medium"
                                placeholder="#"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Phone (Optional)</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 transition-all font-medium"
                            placeholder="+1..."
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-200 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Player to Roster'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPlayerModal;
