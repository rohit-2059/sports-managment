import StatCard from '../../components/StatCard';
import { ICONS } from '../../utils/icons.jsx';

const Overview = ({ teams, onOpenCreateTeam, onOpenAddPlayer, onSelectTeam }) => {
    const totalPlayers = teams.reduce((sum, team) => sum + (team.players?.length || 0), 0);
    const totalWins = teams.reduce((sum, team) => sum + (team.stats?.wins || 0), 0);
    const totalGames = teams.reduce((sum, team) => sum + (team.stats?.wins || 0) + (team.stats?.losses || 0) + (team.stats?.draws || 0), 0);
    const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

    return (
        <div className="space-y-10 max-w-7xl mx-auto">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Active Teams" value={teams.length} icon={ICONS.TROPHY} colorFrom="blue-500" />
                <StatCard title="Total Roster" value={totalPlayers} icon={ICONS.PLAYERS} colorFrom="green-500" />
                <StatCard title="Win Rate" value={`${winRate}%`} icon={ICONS.STATS_CHART} colorFrom="purple-500" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Teams Section */}
                <div className="xl:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-slate-800">Recent Teams</h2>
                            <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full font-bold">{teams.length}</span>
                        </div>
                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">View All</button>
                    </div>

                    {teams.length > 0 ? (
                        <div className="grid gap-4">
                            {teams.slice(0, 4).map((team) => (
                                <div
                                    key={team._id}
                                    onClick={() => onSelectTeam(team)}
                                    className="group bg-white rounded-xl border border-slate-100 p-5 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:bg-white group-hover:shadow-md transition-all">
                                            {team.sport === 'Football' ? ICONS.SPORTS.FOOTBALL : ICONS.SPORTS.DEFAULT}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{team.name}</h3>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{team.sport} • {team.shortName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 pl-16 sm:pl-0 border-t sm:border-0 border-slate-50 pt-3 sm:pt-0">
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Players</p>
                                            <p className="font-bold text-slate-700">{team.players?.length || 0}</p>
                                        </div>
                                        <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block"></div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Wins</p>
                                            <p className="font-bold text-emerald-600">{team.stats?.wins || 0}</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all ml-2">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-12 text-center">
                            <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-sm text-slate-300">
                                {ICONS.TROPHY}
                            </div>
                            <h3 className="text-slate-900 font-bold mb-1">No Teams Yet</h3>
                            <p className="text-slate-500 text-sm">Create your first team to get started</p>
                        </div>
                    )}
                </div>

                {/* Quick Actions Column */}
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-slate-800 pb-2 border-b border-gray-100">Quick Actions</h2>

                    <div className="bg-white rounded-2xl border border-slate-100 p-1 shadow-sm">
                        <button
                            onClick={onOpenCreateTeam}
                            className="w-full text-left p-4 hover:bg-slate-50 rounded-xl transition-colors group flex items-start gap-3 mb-1"
                        >
                            <div className="mt-1 p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                {ICONS.ADD}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm">Create New Team</p>
                                <p className="text-xs text-slate-500 mt-0.5">Start a fresh roster for the season</p>
                            </div>
                        </button>

                        <div className="h-px bg-slate-50 mx-4"></div>

                        <button
                            onClick={onOpenAddPlayer}
                            className="w-full text-left p-4 hover:bg-slate-50 rounded-xl transition-colors group flex items-start gap-3"
                        >
                            <div className="mt-1 p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                {ICONS.USER_ADD}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm">Add New Player</p>
                                <p className="text-xs text-slate-500 mt-0.5">Register a player to existing team</p>
                            </div>
                        </button>
                    </div>

                    {/* Pro Tip - Dark Card for contrast */}
                    <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg group cursor-pointer">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                                <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">Insight</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2 group-hover:text-blue-200 transition-colors">Track Player Growth</h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-4">
                                Use the 'Performance' tab to see visualized stats for every match.
                            </p>
                            <div className="h-1 w-12 bg-blue-500 rounded-full group-hover:w-full transition-all duration-500"></div>
                        </div>
                        {/* Abstract background shape */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600 rounded-full blur-[80px] opacity-40"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
