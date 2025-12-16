import { ICONS } from "../../utils/icons.jsx";

const StatsView = ({ teams, selectedTeam, setSelectedTeam, stats, loading, onAddStatsClick }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-100 pb-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Performance Analytics</h2>
                    <p className="text-sm text-slate-500 mt-1">Track player statistics and team growth</p>
                </div>

                {teams.length > 0 && (
                    <div className="w-full md:w-auto">
                        <select
                            value={selectedTeam?._id || ''}
                            onChange={(e) => {
                                const team = teams.find(t => t._id === e.target.value);
                                setSelectedTeam(team);
                            }}
                            className="w-full md:w-64 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-700 font-medium cursor-pointer transition-all shadow-sm"
                        >
                            <option value="">Select Team to Analyze</option>
                            {teams.map(team => (
                                <option key={team._id} value={team._id}>
                                    {team.name} ({team.sport})
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {teams.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-20 text-center">
                    <div className="text-slate-300 text-5xl mb-4">{ICONS.STATS_CHART}</div>
                    <p className="text-slate-500">No teams available. Create a team first to manage player statistics.</p>
                </div>
            ) : !selectedTeam ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full mx-auto mb-6 flex items-center justify-center text-blue-300 shadow-inner text-4xl">
                        {ICONS.STATS_CHART}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Select a Team</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">Choose a team from the dropdown to view detailed player performance metrics.</p>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <span className="text-blue-600">{ICONS.SPORTS.DEFAULT}</span>
                            {selectedTeam.name} Statistics
                        </h3>
                        <button
                            onClick={onAddStatsClick}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium shadow-sm transition-all"
                        >
                            <span className="text-lg">{ICONS.ADD}</span>
                            <span>Record Stats</span>
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-100 border-t-blue-600"></div>
                            <p className="mt-4 text-slate-500">Loading metrics...</p>
                        </div>
                    ) : stats.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
                            <div className="text-5xl text-slate-200 mb-4">{ICONS.STATS_CHART}</div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No Data Yet</h3>
                            <p className="text-slate-500">Start recording player statistics to see insights here.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Overview Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Players</p>
                                    <p className="text-3xl font-extrabold text-slate-800">{stats.length}</p>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Records</p>
                                    <p className="text-3xl font-extrabold text-blue-600">{stats.reduce((sum, p) => sum + p.stats.length, 0)}</p>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Sport</p>
                                    <p className="text-xl font-bold text-slate-800">{selectedTeam.sport}</p>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Season</p>
                                    <p className="text-xl font-bold text-slate-800 px-2 py-0.5 bg-slate-100 rounded inline-block">{new Date().getFullYear()}</p>
                                </div>
                            </div>

                            {/* Leaderboard Card */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                                    <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <span className="text-yellow-500">{ICONS.TROPHY}</span> Top Performers
                                    </h4>
                                </div>
                                <div className="p-6 space-y-5">
                                    {stats.slice(0, 6).map((playerData, index) => {
                                        const latestStat = playerData.stats[0];
                                        if (!latestStat || !playerData.player) return null;

                                        let statsData;
                                        switch (latestStat.sport) {
                                            case 'Football': statsData = latestStat.footballStats; break;
                                            case 'Cricket': statsData = latestStat.cricketStats; break;
                                            case 'Basketball': statsData = latestStat.basketballStats; break;
                                            case 'Volleyball': statsData = latestStat.volleyballStats; break;
                                            case 'Tennis':
                                            case 'Badminton': statsData = latestStat.racketStats; break;
                                            case 'Hockey': statsData = latestStat.hockeyStats; break;
                                            default: statsData = latestStat.genericStats;
                                        }

                                        const firstStatValue = Object.values(statsData || {})[0] || 0;
                                        const firstStatKey = Object.keys(statsData || {})[0] || '';
                                        const maxValue = Math.max(...stats.map(p => {
                                            const stat = p.stats[0];
                                            let sd;
                                            switch (stat?.sport) {
                                                case 'Football': sd = stat.footballStats; break;
                                                case 'Cricket': sd = stat.cricketStats; break;
                                                case 'Basketball': sd = stat.basketballStats; break;
                                                default: sd = stat?.genericStats || {};
                                            }
                                            return Object.values(sd || {})[0] || 0;
                                        }), 1);
                                        const percentage = (firstStatValue / maxValue) * 100;

                                        return (
                                            <div key={playerData.player._id} className="flex items-center space-x-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm
                                                    ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-slate-300' : index === 2 ? 'bg-orange-400' : 'bg-slate-100 text-slate-500'}`}>
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <span className="text-sm font-bold text-slate-700">{playerData.player.name}</span>
                                                        <span className="text-sm font-bold text-slate-900">{firstStatValue} <span className="text-[10px] text-slate-400 uppercase font-normal ml-1">{firstStatKey}</span></span>
                                                    </div>
                                                    <div className="w-full bg-slate-50 rounded-full h-1.5 overflow-hidden">
                                                        <div className={`h-full rounded-full transition-all duration-700 ${index < 3 ? 'bg-blue-500' : 'bg-slate-300'}`} style={{ width: `${percentage}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Detailed List */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {stats.map((playerData) => (
                                    <div key={playerData.player._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                                {(playerData.player.name || '?').charAt(0)}
                                            </div>
                                            {playerData.player.name}
                                        </h4>

                                        {playerData.stats.slice(0, 3).map((stat) => {
                                            let statsData;
                                            switch (stat.sport) {
                                                case 'Football': statsData = stat.footballStats; break;
                                                case 'Cricket': statsData = stat.cricketStats; break;
                                                case 'Basketball': statsData = stat.basketballStats; break;
                                                default: statsData = stat.genericStats;
                                            }
                                            return (
                                                <div key={stat._id} className="mb-3 bg-slate-50/50 p-3 rounded-lg border border-slate-50 last:mb-0">
                                                    <div className="text-xs text-slate-400 mb-2 font-medium flex justify-between">
                                                        <span>{new Date(stat.createdAt).toLocaleDateString()}</span>
                                                        <span className="text-blue-500 bg-blue-50 px-1.5 rounded">{stat.sport}</span>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {Object.entries(statsData || {}).slice(0, 6).map(([key, value]) => (
                                                            <div key={key}>
                                                                <p className="text-[10px] text-slate-400 uppercase">{key}</p>
                                                                <p className="font-bold text-slate-700 text-sm">{value}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default StatsView;
