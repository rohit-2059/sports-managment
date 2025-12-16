import { useState } from 'react';
import { ICONS } from '../../../Coach/utils/icons.jsx';
import LeaveTeamModal from '../../components/LeaveTeamModal';

const ProfileView = ({ team, user, loading, onLeaveTeam }) => {
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Loading profile data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            {/* Welcome / Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 shrink-0">
                    <span className="scale-150">{ICONS.USER_ADD}</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Welcome, {user.name}</h2>
                    <p className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold border ${team ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                        {team ? (
                            <>
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Active Roster: {team.name}
                            </>
                        ) : (
                            <>
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                No Active Team
                            </>
                        )}
                    </p>
                </div>
            </div>

            {team ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <span className="text-blue-500">{ICONS.TROPHY}</span>
                            Team Details
                        </h3>
                        <button
                            onClick={() => setShowLeaveModal(true)}
                            className="text-sm font-semibold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        >
                            Leave Team
                        </button>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Sport</p>
                            <p className="font-bold text-slate-700 flex items-center gap-2">
                                {ICONS.SPORTS.DEFAULT} {team.sport}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Head Coach</p>
                            <p className="font-bold text-slate-700 flex items-center gap-2">
                                {ICONS.USER_ADD} {team.coachId?.name || team.coach?.name || "Unknown"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Squad Size</p>
                            <p className="font-bold text-slate-700">{team.players?.length || 0} Players</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-100">
                        <div className="p-4 bg-slate-50/30">
                            <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-3 px-2">Team Roster</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {team.players?.map((player, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs ring-2 ring-white">
                                            {(player.playerId?.name || player.name || "?").charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 leading-tight">
                                                {player.playerId?.name || player.name}
                                            </p>
                                            <p className="text-xs text-slate-400 font-medium">
                                                {player.position || 'Player'} {player.jerseyNumber && `• #${player.jerseyNumber}`}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full mx-auto mb-6 flex items-center justify-center text-slate-300">
                        <span className="scale-150 grayscale opacity-50">{ICONS.TROPHY}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Free Agent</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                        You are not currently part of any team. Contact your coach to be added to a roster.
                    </p>
                </div>
            )}

            <LeaveTeamModal
                isOpen={showLeaveModal}
                onClose={() => setShowLeaveModal(false)}
                onConfirm={onLeaveTeam}
            />
        </div>
    );
};

export default ProfileView;
