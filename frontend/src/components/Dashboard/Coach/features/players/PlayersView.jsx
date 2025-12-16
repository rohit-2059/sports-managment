import { ICONS } from '../../utils/icons.jsx';

const PlayersView = ({ teams, selectedTeam, setSelectedTeam, onAddPlayerClick, onRemovePlayer, onEditPlayer }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Roster Management</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage players, positions, and jersey numbers</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {teams.length > 0 && (
                        <div className="relative group">
                            <select
                                value={selectedTeam?._id || ''}
                                onChange={(e) => setSelectedTeam(teams.find(t => t._id === e.target.value))}
                                className="appearance-none w-full md:w-64 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-700 font-medium cursor-pointer transition-all shadow-sm group-hover:border-blue-300"
                            >
                                {!selectedTeam && <option value="">Select Active Team</option>}
                                {teams.map((team) => (
                                    <option key={team._id} value={team._id}>
                                        {team.name} ({team.sport})
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={onAddPlayerClick}
                        disabled={!selectedTeam}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all whitespace-nowrap"
                    >
                        <span className="text-lg">{ICONS.ADD}</span>
                        <span>Add Player</span>
                    </button>
                </div>
            </div>

            {/* Content Section */}
            {!selectedTeam ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full mx-auto mb-6 flex items-center justify-center text-slate-300 shadow-inner">
                        <span className="text-4xl">{ICONS.PLAYERS}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No Team Selected</h3>
                    <p className="text-slate-500 max-w-md mx-auto">Select a team from the dropdown above to view and manage its roster.</p>
                </div>
            ) : selectedTeam.players?.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full mx-auto mb-6 flex items-center justify-center text-blue-300 shadow-inner">
                        <span className="text-4xl">{ICONS.USER_ADD}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Build Your Roster</h3>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">This team currently has no players. Start adding athletes to track their progress.</p>
                    <button
                        onClick={onAddPlayerClick}
                        className="bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-xl font-semibold transition-all"
                    >
                        Add First Player
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Athlete</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Number</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {selectedTeam.players.map((player, index) => (
                                    <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
                                                    {(player.playerId?.name || player.name || 'P').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-slate-900 leading-none">
                                                        {player.playerId?.name || player.name || 'Unknown'}
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-1">
                                                        {player.playerId?.email || player.email || 'No email'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2.5 py-1 inline-flex text-xs leading-none font-semibold rounded-md bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide">
                                                {player.position || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded">
                                                #{player.jerseyNumber || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {player.playerId?.phone || player.phone || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => onEditPlayer(player)}
                                                    className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                                                    title="Edit player details"
                                                >
                                                    {ICONS.EDIT}
                                                </button>
                                                <button
                                                    onClick={() => onRemovePlayer(player.playerId?._id || player._id)}
                                                    className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                                                    title="Remove from team"
                                                >
                                                    {ICONS.REMOVE}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayersView;
