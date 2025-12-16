import { ICONS } from '../../../Coach/utils/icons.jsx';

const MatchesView = ({ matches, loading, onRefresh, teamId }) => {
    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Match Schedule</h2>
                    <p className="text-sm text-slate-500 mt-1">Upcoming fixtures and match results</p>
                </div>
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="flex items-center gap-2 bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-blue-300 px-4 py-2 rounded-xl font-semibold shadow-sm transition-all text-sm disabled:opacity-50"
                >
                    <span className={loading ? "animate-spin" : ""}>{ICONS.REFRESH}</span>
                    <span>Refresh</span>
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-medium">Loading schedule...</p>
                </div>
            ) : matches.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full mx-auto mb-6 flex items-center justify-center text-slate-300 shadow-inner">
                        <span className="text-4xl">{ICONS.CALENDAR}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No Matches Scheduled</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">Your team doesn't have any upcoming matches. Check back later for updates.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {matches.map((match) => {
                        const isHomeTeam = teamId === match.homeTeam?._id;
                        const isCompleted = match.status === 'completed';
                        const isLive = match.status === 'live';

                        return (
                            <div key={match._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                                {/* Header / Status Bar */}
                                <div className="px-6 py-3 bg-slate-50/50 border-b border-gray-100 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${isLive ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' :
                                            isCompleted ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                                'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                            {isLive ? '• LIVE' : match.status}
                                        </div>
                                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                                            {ICONS.TROPHY} {match.tournamentId?.name || 'Tournament Match'}
                                        </span>
                                    </div>
                                    <div className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-100 uppercase">
                                        {match.round || 'League Stage'}
                                    </div>
                                </div>

                                {/* Match Content */}
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                        {/* Home Team */}
                                        <div className={`flex-1 text-center md:text-right flex flex-col items-center md:items-end order-1 ${isHomeTeam ? 'opacity-100' : 'opacity-80'}`}>
                                            <h3 className="text-lg font-bold text-slate-800 leading-tight">{match.homeTeam?.name || 'TBD'}</h3>
                                            {isCompleted && <span className="text-3xl font-extrabold text-slate-900 mt-2">{match.homeTeamScore ?? '-'}</span>}
                                            {isHomeTeam && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1">YOUR TEAM</span>}
                                        </div>

                                        {/* VS / Time */}
                                        <div className="flex flex-col items-center justify-center min-w-[120px] order-2">
                                            {isCompleted ? (
                                                <div className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full mb-2">FT</div>
                                            ) : (
                                                <div className="text-2xl font-black text-slate-200 mb-2">VS</div>
                                            )}

                                            <div className="flex flex-col items-center gap-1 text-slate-500">
                                                <div className="flex items-center gap-1.5 text-sm font-semibold">
                                                    <span className="w-4 h-4 text-slate-400">{ICONS.CALENDAR}</span>
                                                    {new Date(match.scheduledDate).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-medium">
                                                    <span className="w-4 h-4 text-slate-400">{ICONS.TIME}</span>
                                                    {match.scheduledTime || 'TBD'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Away Team */}
                                        <div className={`flex-1 text-center md:text-left flex flex-col items-center md:items-start order-3 ${!isHomeTeam ? 'opacity-100' : 'opacity-80'}`}>
                                            <h3 className="text-lg font-bold text-slate-800 leading-tight">{match.awayTeam?.name || 'TBD'}</h3>
                                            {isCompleted && <span className="text-3xl font-extrabold text-slate-900 mt-2">{match.awayTeamScore ?? '-'}</span>}
                                            {!isHomeTeam && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1">YOUR TEAM</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer / Location */}
                                <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 font-medium">
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400">{ICONS.LOCATION}</span>
                                        {match.venue || 'Venue TBD'}
                                    </div>
                                    {match.result && (
                                        <div className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                            Result: {match.result}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MatchesView;
