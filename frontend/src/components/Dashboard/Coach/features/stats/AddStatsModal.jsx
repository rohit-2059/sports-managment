import { useState, useEffect } from 'react';
import { CloseIcon } from '../../utils/icons.jsx';

const AddStatsModal = ({ isOpen, onClose, team, onStatsAdded, token }) => {
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [statsData, setStatsData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (team && team.players) {
            setPlayers(team.players);
        }
    }, [team]);

    const handlePlayerChange = (playerId) => {
        setSelectedPlayer(playerId);
        setStatsData({}); // Reset stats when player changes
    };

    const handleStatChange = (key, value) => {
        setStatsData(prev => ({
            ...prev,
            [key]: Number(value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPlayer) {
            setError('Please select a player');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Construct the payload based on backend requirements
            const payload = {
                playerId: selectedPlayer,
                teamId: team._id, // Required by backend
                sport: team.sport,
                stats: statsData,
                matchId: null, // Optional if linked to match
                season: new Date().getFullYear().toString()
            };

            const response = await fetch(`http://localhost:3001/api/stats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                onStatsAdded();
                handleClose();
            } else {
                setError(data.message || data.error || 'Failed to add stats');
            }

        } catch (err) {
            console.error(err);
            setError('Error saving stats');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedPlayer('');
        setStatsData({});
        setError('');
        onClose();
    };

    if (!isOpen || !team) return null;

    // Helper to render input fields based on sport
    const renderStatInputs = () => {
        // Define fields based on sport
        const commonFields = [
            { key: 'matchesPlayed', label: 'Matches Played' },
        ];

        let sportFields = [];
        if (team.sport === 'Football') {
            sportFields = [
                { key: 'goals', label: 'Goals' },
                { key: 'assists', label: 'Assists' },
                { key: 'yellowCards', label: 'Yellow Cards' },
                { key: 'redCards', label: 'Red Cards' },
                { key: 'minutesPlayed', label: 'Minutes Played' },
            ];
        } else if (team.sport === 'Basketball') {
            sportFields = [
                { key: 'points', label: 'Points' },
                { key: 'rebounds', label: 'Rebounds' },
                { key: 'assists', label: 'Assists' },
                { key: 'steals', label: 'Steals' },
                { key: 'blocks', label: 'Blocks' },
            ];
        } else if (team.sport === 'Cricket') {
            sportFields = [
                { key: 'runs', label: 'Runs' },
                { key: 'ballsFaced', label: 'Balls Faced' },
                { key: 'fours', label: 'Fours' },
                { key: 'sixes', label: 'Sixes' },
                { key: 'wickets', label: 'Wickets' },
                { key: 'ballsBowled', label: 'Balls Bowled' },
                { key: 'runsConceded', label: 'Runs Conceded' },
                { key: 'catches', label: 'Catches' },
                { key: 'stumpings', label: 'Stumpings' },
                { key: 'runOuts', label: 'Run Outs' },
            ];
        }
        // ... add others

        const fields = [...commonFields, ...sportFields];

        return (
            <div className="grid grid-cols-2 gap-4">
                {fields.map(field => (
                    <div key={field.key} className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{field.label}</label>
                        <input
                            type="number"
                            min="0"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 font-bold"
                            value={statsData[field.key] || ''}
                            onChange={(e) => handleStatChange(field.key, e.target.value)}
                        />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-100">
                <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Record Performance</h3>
                        <p className="text-sm text-slate-500">Add stats for {team.name} ({team.sport})</p>
                    </div>
                    <button onClick={handleClose} className="text-slate-400 hover:text-red-500 transition-colors">
                        <CloseIcon />
                    </button>
                </div>

                {error && (
                    <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Select Player</label>
                        <select
                            value={selectedPlayer}
                            onChange={(e) => handlePlayerChange(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-900 font-medium bg-white"
                        >
                            <option value="">-- Choose Athlete --</option>
                            {players.map(p => {
                                const pId = p.playerId?._id || p._id; // Handle populated vs unpopulated
                                const pName = p.playerId?.name || p.name || 'Unknown';
                                return (
                                    <option key={pId} value={pId}>{pName} (#{p.jerseyNumber || '-'})</option>
                                );
                            })}
                        </select>
                    </div>

                    {selectedPlayer && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h4 className="text-sm font-bold text-slate-700 mb-4 border-b border-slate-200 pb-2">Enter Match Statistics</h4>
                            {renderStatInputs()}
                        </div>
                    )}

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
                            className="flex-[2] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md shadow-emerald-200 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Statistics'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStatsModal;
