import { ICONS } from '../../../Coach/utils/icons.jsx';

const StatsView = ({ playerStats, aggregatedStats, loading }) => {
    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Personal Statistics</h2>
                <p className="text-sm text-slate-500 mt-1">Track your growth and match performance history</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-medium">Loading analytics...</p>
                </div>
            ) : !aggregatedStats ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full mx-auto mb-6 flex items-center justify-center text-slate-300 shadow-inner">
                        <span className="text-4xl">{ICONS.STATS_CHART}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No Statistics Available</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">Your coach hasn't recorded any performance data for you yet.</p>
                </div>
            ) : (
                <>
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Matches</span>
                                <span className="text-blue-500 bg-blue-50 p-1.5 rounded-lg group-hover:scale-110 transition-transform">{ICONS.TROPHY}</span>
                            </div>
                            <p className="text-3xl font-extrabold text-slate-800">{aggregatedStats.totalMatches}</p>
                        </div>
                        {aggregatedStats.stats && Object.entries(aggregatedStats.stats).slice(0, 3).map(([key, value], idx) => {
                            const colors = [
                                'text-emerald-600 bg-emerald-50 border-emerald-100',
                                'text-purple-600 bg-purple-50 border-purple-100',
                                'text-indigo-600 bg-indigo-50 border-indigo-100'
                            ];
                            const style = colors[idx % colors.length];

                            return (
                                <div key={key} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group display-flex flex-col justify-between">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate w-20" title={key}>
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                        <span className={`p-1.5 rounded-lg text-xs font-bold ${style.split(' ')[0]} ${style.split(' ')[1]}`}>
                                            #{idx + 1}
                                        </span>
                                    </div>
                                    <p className={`text-3xl font-extrabold ${style.split(' ')[0]}`}>{value}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Performance Breakdown & Timeline */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Detailed Breakdown */}
                        {aggregatedStats.stats && Object.keys(aggregatedStats.stats).length > 0 && (
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <span className="text-emerald-500">{ICONS.STATS_CHART}</span> Metric Breakdown
                                </h3>
                                <div className="space-y-4">
                                    {Object.entries(aggregatedStats.stats).map(([key, value]) => {
                                        const maxValue = Math.max(...Object.values(aggregatedStats.stats));
                                        const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

                                        return (
                                            <div key={key} className="group">
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <span className="text-sm font-semibold text-slate-600 capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </span>
                                                    <span className="text-sm font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{value}</span>
                                                </div>
                                                <div className="relative w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000 group-hover:bg-blue-600"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Recent Performance Trend */}
                        {playerStats.length > 0 && (
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <span className="text-purple-500">{ICONS.STATS_CHART}</span> Recent Trend
                                    <span className="text-xs font-normal text-slate-400 ml-auto bg-slate-50 px-2 py-1 rounded">Last 10 Matches</span>
                                </h3>
                                <div className="flex-1 flex items-end justify-between gap-2 h-48 border-b border-slate-100 pb-2 px-2">
                                    {playerStats.slice(0, 10).reverse().map((stat, idx) => {
                                        let statsData;
                                        switch (stat.sport) {
                                            case 'Football': statsData = stat.footballStats; break;
                                            case 'Cricket': statsData = stat.cricketStats; break;
                                            case 'Basketball': statsData = stat.basketballStats; break;
                                            default: statsData = stat.genericStats;
                                        }

                                        const firstStatValue = Object.values(statsData || {})[0] || 0;
                                        const maxVal = Math.max(...playerStats.slice(0, 10).map(s => {
                                            let sd;
                                            switch (s.sport) {
                                                case 'Football': sd = s.footballStats; break;
                                                case 'Cricket': sd = s.cricketStats; break;
                                                case 'Basketball': sd = s.basketballStats; break;
                                                default: sd = s.genericStats || {};
                                            }
                                            return Object.values(sd || {})[0] || 0;
                                        }), 1);
                                        const height = maxVal > 0 ? (firstStatValue / maxVal) * 100 : 0;

                                        return (
                                            <div key={stat._id} className="w-full flex flex-col items-center group relative h-full justify-end">
                                                <div
                                                    className="w-full bg-indigo-500/80 rounded-t-sm hover:bg-indigo-600 transition-all duration-300 relative min-h-[4px]"
                                                    style={{ height: `${Math.max(height, 5)}%` }}
                                                >
                                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] rounded px-2 py-1 z-10 whitespace-nowrap shadow-xl">
                                                        {firstStatValue}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Match History List */}
                    {playerStats.length > 0 && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Match Log</h3>
                            <div className="space-y-4">
                                {playerStats.slice(0, 10).map((stat) => {
                                    let statsData;
                                    switch (stat.sport) {
                                        case 'Football': statsData = stat.footballStats; break;
                                        case 'Cricket': statsData = stat.cricketStats; break;
                                        case 'Basketball': statsData = stat.basketballStats; break;
                                        default: statsData = stat.genericStats;
                                    }
                                    return (
                                        <div key={stat._id} className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 hover:border-slate-200 transition-colors">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">
                                                        {stat.matchId ? `Match vs ${stat.matchId.opponent || 'Opponent'}` : `Performance Log`}
                                                        {/* Note: Opponent name might need backend populate, fallback for now */}
                                                        <span className="font-normal text-slate-500 ml-2">{new Date(stat.createdAt).toLocaleDateString()}</span>
                                                    </p>
                                                    <p className="text-xs text-slate-400 font-medium">Season {stat.season}</p>
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                    {stat.sport}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {Object.entries(statsData || {}).map(([key, value]) => (
                                                    <div key={key}>
                                                        <p className="text-[10px] text-slate-400 uppercase font-bold">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                                        <p className="font-bold text-slate-700">{value}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {stat.notes && (
                                                <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm flex gap-2">
                                                    <span className="font-bold text-amber-600 text-xs uppercase shrink-0 mt-0.5">Note:</span>
                                                    <span className="text-slate-600">{stat.notes}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default StatsView;
