import { useState } from 'react';
import { ICONS } from '../../utils/icons.jsx';
import MatchCalendar from './MatchCalendar.jsx';

const MatchesView = ({ matches, loading, onRefresh, teams }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [viewMode, setViewMode] = useState('month');
    const [flippedCards, setFlippedCards] = useState(new Set());

    const toggleFlip = (matchId) => {
        setFlippedCards(prev => {
            const newSet = new Set(prev);
            if (newSet.has(matchId)) {
                newSet.delete(matchId);
            } else {
                newSet.add(matchId);
            }
            return newSet;
        });
    };

    // Helper function to check if two dates are the same day
    const isSameDay = (date1, date2) => {
        if (!date1 || !date2) return false;
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    // Filter matches by selected date
    const filteredMatches = selectedDate
        ? matches.filter(match => isSameDay(match.scheduledDate, selectedDate))
        : matches;

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const clearFilter = () => {
        setSelectedDate(null);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Match Schedule</h2>
                    <p className="text-sm text-slate-400 mt-1">Upcoming and past games for your teams</p>
                </div>
                <div className="flex gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('month')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${viewMode === 'month'
                                ? 'bg-white text-slate-700 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Month
                        </button>
                        <button
                            onClick={() => setViewMode('week')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${viewMode === 'week'
                                ? 'bg-white text-slate-700 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Week
                        </button>
                    </div>
                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 hover:border-blue-300 text-slate-600 rounded-xl font-medium transition-all disabled:opacity-50 shadow-sm"
                    >
                        <span className={`text-lg ${loading ? 'animate-spin' : ''}`}>{ICONS.REFRESH}</span>
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Main Content - Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Panel - Fixed/Sticky */}
                <div className="lg:col-span-1">
                    <div className="lg:sticky lg:top-6">
                        <MatchCalendar
                            matches={matches}
                            teams={teams}
                            selectedDate={selectedDate}
                            onDateSelect={handleDateSelect}
                            viewMode={viewMode}
                        />
                    </div>
                </div>

                {/* Match List Panel - Scrollable */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
                        {/* Filter Indicator */}
                        {selectedDate && (
                            <div className="mb-4 flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 sticky top-0 z-10">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    <span className="text-sm font-semibold text-blue-700">
                                        Showing matches for: {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                                <button
                                    onClick={clearFilter}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
                                >
                                    Clear Filter
                                </button>
                            </div>
                        )}

                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : filteredMatches.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-sm">
                                    <span className="text-3xl">{ICONS.CALENDAR}</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">No Matches Found</h3>
                                <p className="text-slate-500 text-sm">
                                    {selectedDate
                                        ? 'No matches scheduled for this date'
                                        : 'No matches scheduled yet'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {filteredMatches.map((match) => {
                                    const isHomeTeamOwned = teams.some(t => t._id === match.homeTeam?._id);
                                    const isAwayTeamOwned = teams.some(t => t._id === match.awayTeam?._id);
                                    const isBothTeamsOwned = isHomeTeamOwned && isAwayTeamOwned;
                                    const isFlipped = flippedCards.has(match._id);
                                    const isCompleted = match.status === 'completed';

                                    return (
                                        <div
                                            key={match._id}
                                            className="perspective-container relative"
                                            style={{
                                                perspective: '1000px',
                                                zIndex: isFlipped ? 50 : 1
                                            }}
                                        >
                                            <div
                                                className={`flip-card ${isFlipped ? 'flipped' : ''} ${isCompleted ? 'cursor-pointer' : ''} relative`}
                                                onClick={() => isCompleted && toggleFlip(match._id)}
                                                style={{
                                                    transformStyle: 'preserve-3d',
                                                    transition: 'transform 0.7s ease-in-out',
                                                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                    height: '450px'
                                                }}
                                            >
                                                {/* FRONT SIDE */}
                                                <div
                                                    className="flip-card-front absolute top-0 left-0 w-full h-full"
                                                    style={{
                                                        backfaceVisibility: 'hidden',
                                                        WebkitBackfaceVisibility: 'hidden'
                                                    }}
                                                >
                                                    <div className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                                                        {/* Internal Match Banner */}
                                                        {isBothTeamsOwned && (
                                                            <div className="mb-4 -mt-2 -mx-2 px-4 py-2 bg-blue-50 border-b border-blue-100">
                                                                <div className="flex items-center justify-center gap-2 text-blue-700">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                                    </svg>
                                                                    <span className="text-xs font-bold uppercase tracking-wider">Internal Match - Both Your Teams</span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Header */}
                                                        <div className="flex items-center justify-between mb-6">
                                                            <div className="flex items-center gap-3">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${match.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                                    match.status === 'live' ? 'bg-red-50 text-red-600 border border-red-100 animate-pulse' :
                                                                        match.status === 'completed' ? 'bg-green-50 text-green-700 border border-green-100' :
                                                                            'bg-yellow-50 text-yellow-700 border border-yellow-100'
                                                                    }`}>
                                                                    {match.status}
                                                                </span>
                                                                {match.round && (
                                                                    <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                                        {match.round}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                                                                    <span className="text-yellow-500">{ICONS.TROPHY}</span>
                                                                    {match.tournamentId?.name || 'Tournament Match'}
                                                                </div>
                                                                {isCompleted && (
                                                                    <div className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded-md border border-blue-100 animate-pulse">
                                                                        Click to view details
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Teams */}
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-6">
                                                            <div className={`text-center p-5 rounded-xl transition-colors ${isHomeTeamOwned ? 'bg-blue-50/50 border border-blue-100' : 'bg-slate-50/50 border border-slate-100'
                                                                }`}>
                                                                <div className="w-12 h-12 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center text-2xl mb-3">
                                                                    {ICONS.SPORTS.DEFAULT}
                                                                </div>
                                                                <div className="font-bold text-lg text-slate-900">{match.homeTeam?.name || 'TBD'}</div>
                                                                {isHomeTeamOwned && <div className="text-[10px] font-bold text-blue-600 uppercase mt-1">Your Team</div>}
                                                                {isCompleted && (
                                                                    <div className="text-3xl font-extrabold text-slate-800 mt-2">
                                                                        {match.sport === 'Cricket' && match.scoreDetails?.homeTeam
                                                                            ? `${match.scoreDetails.homeTeam.runs || 0}-${match.scoreDetails.homeTeam.wickets || 0}`
                                                                            : match.homeTeamScore ?? '-'}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col items-center justify-center">
                                                                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 font-black text-xs flex items-center justify-center ring-4 ring-white">VS</div>
                                                            </div>
                                                            <div className={`text-center p-5 rounded-xl transition-colors ${isAwayTeamOwned ? 'bg-blue-50/50 border border-blue-100' : 'bg-slate-50/50 border border-slate-100'
                                                                }`}>
                                                                <div className="w-12 h-12 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center text-2xl mb-3">
                                                                    {ICONS.SPORTS.DEFAULT}
                                                                </div>
                                                                <div className="font-bold text-lg text-slate-900">{match.awayTeam?.name || 'TBD'}</div>
                                                                {isAwayTeamOwned && <div className="text-[10px] font-bold text-blue-600 uppercase mt-1">Your Team</div>}
                                                                {isCompleted && (
                                                                    <div className="text-3xl font-extrabold text-slate-800 mt-2">
                                                                        {match.sport === 'Cricket' && match.scoreDetails?.awayTeam
                                                                            ? `${match.scoreDetails.awayTeam.runs || 0}-${match.scoreDetails.awayTeam.wickets || 0}`
                                                                            : match.awayTeamScore ?? '-'}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Footer */}
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-slate-100 pt-5">
                                                            <div className="flex items-center gap-3 text-slate-600">
                                                                <span className="text-slate-400">{ICONS.CALENDAR}</span>
                                                                <span className="text-sm font-medium">{new Date(match.scheduledDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3 text-slate-600">
                                                                <span className="text-slate-400">{ICONS.TIME}</span>
                                                                <span className="text-sm font-medium">{match.scheduledTime || 'TBD'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3 text-slate-600 sm:col-span-2 lg:col-span-1">
                                                                <span className="text-slate-400">{ICONS.LOCATION}</span>
                                                                <span className="text-sm font-medium truncate">{match.venue || 'To Be Announced'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* BACK SIDE - Detailed Scorecard */}
                                                {isCompleted && (
                                                    <div
                                                        className="flip-card-back absolute top-0 left-0 w-full h-full overflow-y-auto"
                                                        style={{
                                                            backfaceVisibility: 'hidden',
                                                            WebkitBackfaceVisibility: 'hidden',
                                                            transform: 'rotateY(180deg)'
                                                        }}
                                                    >
                                                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 text-white shadow-2xl">
                                                            {/* Back Header */}
                                                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
                                                                <div>
                                                                    <h3 className="text-xl font-bold">Match Scorecard</h3>
                                                                    <p className="text-xs text-slate-400 mt-1">{match.tournamentId?.name}</p>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); toggleFlip(match._id); }}
                                                                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            </div>

                                                            {/* Score Summary */}
                                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                                                    <div className="text-sm text-slate-400 mb-2">{match.homeTeam?.name}</div>
                                                                    <div className="text-4xl font-black">
                                                                        {match.sport === 'Cricket' && match.scoreDetails?.homeTeam
                                                                            ? `${match.scoreDetails.homeTeam.runs || 0}-${match.scoreDetails.homeTeam.wickets || 0}`
                                                                            : match.homeTeamScore ?? '-'}
                                                                    </div>
                                                                    {match.scoreDetails?.homeTeam && match.sport === 'Cricket' && (
                                                                        <div className="text-xs text-slate-400 mt-2">
                                                                            {match.scoreDetails.homeTeam.overs || 0} overs
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                                                    <div className="text-sm text-slate-400 mb-2">{match.awayTeam?.name}</div>
                                                                    <div className="text-4xl font-black">
                                                                        {match.sport === 'Cricket' && match.scoreDetails?.awayTeam
                                                                            ? `${match.scoreDetails.awayTeam.runs || 0}-${match.scoreDetails.awayTeam.wickets || 0}`
                                                                            : match.awayTeamScore ?? '-'}
                                                                    </div>
                                                                    {match.scoreDetails?.awayTeam && match.sport === 'Cricket' && (
                                                                        <div className="text-xs text-slate-400 mt-2">
                                                                            {match.scoreDetails.awayTeam.overs || 0} overs
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Match Result */}
                                                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 text-center mb-6">
                                                                <div className="text-sm font-medium text-green-100 mb-1">Result</div>
                                                                <div className="text-lg font-bold">{match.result || 'Match Completed'}</div>
                                                            </div>

                                                            {/* Match Details */}
                                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                                <div className="bg-slate-800/30 rounded-lg p-3">
                                                                    <div className="text-slate-400 text-xs mb-1">Date</div>
                                                                    <div className="font-semibold">{new Date(match.scheduledDate).toLocaleDateString()}</div>
                                                                </div>
                                                                <div className="bg-slate-800/30 rounded-lg p-3">
                                                                    <div className="text-slate-400 text-xs mb-1">Venue</div>
                                                                    <div className="font-semibold truncate">{match.venue || 'TBA'}</div>
                                                                </div>
                                                                <div className="bg-slate-800/30 rounded-lg p-3">
                                                                    <div className="text-slate-400 text-xs mb-1">Round</div>
                                                                    <div className="font-semibold">{match.round || 'N/A'}</div>
                                                                </div>
                                                                <div className="bg-slate-800/30 rounded-lg p-3">
                                                                    <div className="text-slate-400 text-xs mb-1">Sport</div>
                                                                    <div className="font-semibold">{match.sport || match.tournamentId?.sport || 'General'}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchesView;
