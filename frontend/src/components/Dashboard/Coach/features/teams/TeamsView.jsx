import { ICONS } from '../../utils/icons.jsx';

const TeamsView = ({ teams, onOpenCreateModal, onSelectTeam }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Active Teams</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your sports teams and seasonal performance</p>
                </div>
                <button
                    onClick={onOpenCreateModal}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 transition-all transform hover:-translate-y-0.5"
                >
                    <span className="text-lg">{ICONS.ADD}</span>
                    <span>New Team</span>
                </button>
            </div>

            {teams.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-20 text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full mx-auto mb-6 flex items-center justify-center text-slate-300 shadow-inner">
                        {ICONS.TROPHY}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Start Your Season</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">You haven't created any teams yet. Set up your first team to begin managing players and matches.</p>
                    <button
                        onClick={onOpenCreateModal}
                        className="bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold transition-all"
                    >
                        Create First Team
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {teams.map((team) => (
                        <div
                            key={team._id}
                            onClick={() => onSelectTeam(team)}
                            className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-6 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative overflow-hidden"
                        >
                            {/* Decorative Background Blur */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors duration-500"></div>

                            <div className="relative z-10 flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-2xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform duration-300">
                                        {team.sport === 'Football' ? ICONS.SPORTS.FOOTBALL :
                                            team.sport === 'Basketball' ? ICONS.SPORTS.BASKETBALL :
                                                team.sport === 'Cricket' ? ICONS.SPORTS.CRICKET : ICONS.TROPHY}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">{team.name}</h3>
                                        <p className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded mt-1 inline-block border border-slate-100">{team.sport}</p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </div>
                            </div>

                            <div className="relative z-10 grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100 group-hover:border-blue-100 transition-colors">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Roster</p>
                                    <p className="text-xl font-extrabold text-slate-700">{team.players?.length || 0}</p>
                                </div>
                                <div className="bg-emerald-50/50 rounded-xl p-3 text-center border border-emerald-100">
                                    <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-widest mb-1">Wins</p>
                                    <p className="text-xl font-extrabold text-emerald-600">{team.stats?.wins || 0}</p>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                                <span className="text-xs font-medium text-slate-400">ID: {team.shortName}</span>
                                <span className="text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0">Manage Team</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeamsView;
