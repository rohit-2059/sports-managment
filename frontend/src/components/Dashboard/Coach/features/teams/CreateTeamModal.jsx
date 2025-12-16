import { useState } from 'react';
import { SPORTS_OPTIONS } from '../../utils/constants';
import { CloseIcon } from '../../utils/icons.jsx';

const CreateTeamModal = ({ isOpen, onClose, onTeamCreated, userEmail, token }) => {
    const [teamFormData, setTeamFormData] = useState({
        name: '',
        shortName: '',
        sport: 'Football',
        description: '',
        homeGround: '',
        contactEmail: userEmail,
        contactPhone: '',
        address: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setTeamFormData({
            name: '',
            shortName: '',
            sport: 'Football',
            description: '',
            homeGround: '',
            contactEmail: userEmail,
            contactPhone: '',
            address: '',
        });
        setError('');
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/teams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(teamFormData),
            });

            const data = await response.json();

            if (data.success) {
                onTeamCreated('Team created successfully!');
                resetForm();
                onClose();
            } else {
                setError(data.error || 'Failed to create team');
            }
        } catch (err) {
            console.error('Error creating team:', err);
            setError('Error creating team. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100">
                <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Create New Team</h3>
                        <p className="text-sm text-slate-500">Add a new sports team to your collection</p>
                    </div>
                    <button
                        onClick={() => {
                            onClose();
                            resetForm();
                        }}
                        className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border-1 border-red-100 m-6 rounded-xl flex items-center gap-3">
                        <div className="text-red-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <p className="text-red-600 text-sm font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleCreateTeam} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">
                                Team Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={teamFormData.name}
                                onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 placeholder:text-slate-300 transition-all font-medium"
                                placeholder="e.g. Royal Strikers"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">
                                Short Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="shortName"
                                value={teamFormData.shortName}
                                onChange={(e) => setTeamFormData({ ...teamFormData, shortName: e.target.value })}
                                required
                                maxLength="10"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 placeholder:text-slate-300 transition-all font-medium uppercase"
                                placeholder="e.g. RST"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">
                            Sport Type <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="sport"
                                value={teamFormData.sport}
                                onChange={(e) => setTeamFormData({ ...teamFormData, sport: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 appearance-none bg-white font-medium"
                            >
                                {SPORTS_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={teamFormData.description}
                            onChange={(e) => setTeamFormData({ ...teamFormData, description: e.target.value })}
                            rows="3"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 placeholder:text-slate-300 transition-all font-medium"
                            placeholder="Briefly describe your team..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">
                                Home Ground
                            </label>
                            <input
                                type="text"
                                name="homeGround"
                                value={teamFormData.homeGround}
                                onChange={(e) => setTeamFormData({ ...teamFormData, homeGround: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 placeholder:text-slate-300 transition-all font-medium"
                                placeholder="Stadium name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">
                                Contact Phone
                            </label>
                            <input
                                type="tel"
                                name="contactPhone"
                                value={teamFormData.contactPhone}
                                onChange={(e) => setTeamFormData({ ...teamFormData, contactPhone: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 placeholder:text-slate-300 transition-all font-medium"
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={teamFormData.address}
                            onChange={(e) => setTeamFormData({ ...teamFormData, address: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 placeholder:text-slate-300 transition-all font-medium"
                            placeholder="Full address"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                resetForm();
                            }}
                            className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Creating...
                                </span>
                            ) : 'Create Team'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTeamModal;
