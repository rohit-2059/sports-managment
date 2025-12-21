import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../../../config/api';
import { CloseIcon } from '../../utils/icons.jsx';

const EditPlayerModal = ({ isOpen, onClose, player, teamId, onPlayerUpdated, token }) => {
    const [formData, setFormData] = useState({
        position: '',
        jerseyNumber: '',
        phone: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (player) {
            setFormData({
                position: player.position || '',
                jerseyNumber: player.jerseyNumber || '',
                phone: player.playerId?.phone || player.phone || '',
            });
        }
    }, [player]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const playerId = player.playerId?._id || player._id;
            const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}/players/${playerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                onPlayerUpdated();
                onClose();
            } else {
                setError(data.message || 'Failed to update player');
            }
        } catch (err) {
            setError('Error updating player');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !player) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100">
                <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex justify-between items-center rounded-t-2xl">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Edit Player Details</h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Update {player.playerId?.name || player.name || 'player'}'s information
                        </p>
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
                    {/* Player Info Display */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm ring-2 ring-white">
                                {(player.playerId?.name || player.name || 'P').charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-900">
                                    {player.playerId?.name || player.name || 'Unknown'}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {player.playerId?.email || player.email || 'No email'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Editable Fields */}
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
                        <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 transition-all font-medium"
                            placeholder="+1 (555) 000-0000"
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
                            {loading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPlayerModal;
