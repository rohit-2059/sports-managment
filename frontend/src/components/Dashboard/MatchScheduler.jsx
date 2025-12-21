import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../../config/api';

// --- Icons ---
const Icons = {
    Close: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    Calendar: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    Clock: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Location: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    Edit: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    ),
    Check: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
    ),
    Refresh: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
    ),
    Trophy: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )
};

const MatchScheduler = ({ tournament, onClose }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/matches/tournament/${tournament._id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      
      if (data.success) {
        setMatches(data.data);
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  }, [tournament._id]);

  useEffect(() => {
    if (tournament.scheduleGenerated) {
      fetchMatches();
    }
  }, [tournament.scheduleGenerated, fetchMatches]);

  const handleGenerateSchedule = async () => {
    if (!confirm(`Generate schedule for ${tournament.name}? This cannot be undone.`)) return;
    
    try {
      setGenerating(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/matches/tournament/${tournament._id}/generate-schedule`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      
      if (data.success) {
        alert(`Successfully generated ${data.data.matchesGenerated} matches!`);
        setMatches(data.data.matches);
        tournament.scheduleGenerated = true;
      } else {
        console.error('Server error details:', data);
        alert(data.error || 'Failed to generate schedule');
      }
    } catch (err) {
      console.error('Error generating schedule:', err);
      alert('Error generating schedule: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdateMatch = async (matchId, updates) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/matches/${matchId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      
      if (data.success) {
        fetchMatches();
      } else {
        alert(data.error || 'Failed to update match');
      }
    } catch (err) {
      console.error('Error updating match:', err);
      alert('Error updating match');
    }
  };

  const handleUpdateScore = async (matchId, scoreData) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/matches/${matchId}/score`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreData),
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Match result updated successfully!');
        fetchMatches();
      } else {
        alert(data.error || 'Failed to update match result');
      }
    } catch (err) {
      console.error('Error updating match result:', err);
      alert('Error updating match result');
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 animate-fade-in">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur border-b border-slate-100 px-8 py-6 flex justify-between items-center rounded-t-2xl">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Match Schedule</h3>
          <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {tournament.name}
              </span>
              <span className="text-sm text-slate-500 capitalize">
                  • {tournament.format.replace('_', ' ')} Format
              </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200 hover:border-slate-300"
        >
          <Icons.Close className="w-5 h-5 mr-2" />
          Back to Tournaments
        </button>
      </div>

      <div className="p-8">
          {!tournament.scheduleGenerated ? (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                <Icons.Calendar className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Schedule Generated Yet</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Generate matches for this tournament. There are currently <span className="font-bold text-slate-900">{tournament.teams?.length || 0}</span> teams registered.
              </p>
              <button
                onClick={handleGenerateSchedule}
                disabled={generating || (tournament.teams?.length || 0) < 2}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-blue-600/20 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center mx-auto"
              >
                {generating ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Generating...
                    </>
                ) : (
                    <>
                        <Icons.Refresh className="w-5 h-5 mr-2" />
                        Generate Schedule
                    </>
                )}
              </button>
              {(tournament.teams?.length || 0) < 2 && (
                <p className="text-red-500 text-sm mt-4 font-medium bg-red-50 inline-block px-4 py-2 rounded-lg">
                    At least 2 teams are required to generate a schedule
                </p>
              )}
            </div>
          ) : loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-slate-500 font-medium">Loading matches...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Match Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Matches', value: matches.length, color: 'blue' },
                    { label: 'Scheduled', value: matches.filter(m => m.scheduledDate).length, color: 'indigo' },
                    { label: 'Completed', value: matches.filter(m => m.status === 'completed').length, color: 'green' },
                    { label: 'Pending', value: matches.filter(m => !m.scheduledDate && m.homeTeam && m.awayTeam).length, color: 'orange' }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                        <p className={`text-3xl font-bold mt-1 text-${stat.color}-600`}>{stat.value}</p>
                    </div>
                ))}
              </div>

              {/* Matches List */}
              <div className="space-y-6">
                {Object.entries(
                  matches.reduce((acc, match) => {
                    if (!acc[match.round]) acc[match.round] = [];
                    acc[match.round].push(match);
                    return acc;
                  }, {})
                ).map(([round, roundMatches]) => (
                  <div key={round} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center">
                      <div className="w-2 h-6 bg-blue-600 rounded-full mr-3"></div>
                      <h4 className="font-bold text-slate-900 text-lg">{round}</h4>
                      <span className="ml-auto text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                        {roundMatches.length} Matches
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {roundMatches.map((match) => (
                        <MatchCard
                          key={match._id}
                          match={match}
                          onUpdate={(updates) => handleUpdateMatch(match._id, updates)}
                          onUpdateScore={(scoreData) => handleUpdateScore(match._id, scoreData)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
  );
};

const MatchCard = ({ match, onUpdate, onUpdateScore }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    scheduledDate: match.scheduledDate ? match.scheduledDate.split('T')[0] : '',
    scheduledTime: match.scheduledTime || '',
    venue: match.venue || '',
  });
  const [scoreData, setScoreData] = useState({
    homeScore: match.homeTeamScore || 0,
    awayScore: match.awayTeamScore || 0,
    status: match.status === 'completed' ? 'completed' : 'completed',
  });

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleSaveScore = () => {
    onUpdateScore(scoreData);
    // setIsEditingScore(false); // Assuming we might want to close something, but logic was mixed in original
  };

  return (
    <div className="p-6 hover:bg-slate-50 transition-colors group">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Match Info & Status */}
        <div className="flex items-center space-x-4 min-w-[200px]">
            <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-100 rounded-xl border border-slate-200 text-slate-600">
                <span className="text-xs font-bold uppercase">{match.scheduledDate ? new Date(match.scheduledDate).toLocaleDateString(undefined, { month: 'short' }) : 'TBD'}</span>
                <span className="text-lg font-bold">{match.scheduledDate ? new Date(match.scheduledDate).getDate() : '--'}</span>
            </div>
            <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Match #{match.matchNumber}</div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    match.status === 'completed' ? 'bg-green-50 text-green-700 border-green-100' :
                    match.status === 'live' ? 'bg-red-50 text-red-700 border-red-100 animate-pulse' :
                    match.scheduledDate ? 'bg-blue-50 text-blue-700 border-blue-100' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                    {match.status === 'scheduled' && match.scheduledDate ? 'Scheduled' :
                    match.status === 'completed' ? 'Completed' :
                    match.status === 'live' ? 'Live Now' :
                    'Pending'}
                </span>
            </div>
        </div>

        {/* Teams & Score */}
        <div className="flex-1 flex items-center justify-center space-x-8">
            {match.homeTeam && match.awayTeam ? (
                <>
                    <div className="flex-1 text-right">
                        <p className="font-bold text-slate-900 text-lg">{match.homeTeam.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{match.homeTeam.shortName}</p>
                    </div>
                    
                    <div className="flex flex-col items-center px-4">
                        {match.status === 'completed' ? (
                            <div className="flex items-center space-x-3 text-3xl font-bold text-slate-900 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                                <span className={match.homeTeamScore > match.awayTeamScore ? 'text-green-600' : ''}>{match.homeTeamScore}</span>
                                <span className="text-slate-300 text-xl">:</span>
                                <span className={match.awayTeamScore > match.homeTeamScore ? 'text-green-600' : ''}>{match.awayTeamScore}</span>
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm border border-slate-200">
                                VS
                            </div>
                        )}
                        <div className="mt-2 flex items-center text-xs text-slate-500">
                            <Icons.Clock className="w-3 h-3 mr-1" />
                            {match.scheduledTime || '--:--'}
                        </div>
                    </div>

                    <div className="flex-1 text-left">
                        <p className="font-bold text-slate-900 text-lg">{match.awayTeam.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{match.awayTeam.shortName}</p>
                    </div>
                </>
            ) : (
                <div className="text-center py-2 text-slate-400 font-medium bg-slate-50 px-6 py-3 rounded-lg border border-dashed border-slate-200 w-full">
                    Waiting for teams to be determined
                </div>
            )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2 min-w-[100px]">
            <button
                onClick={() => setIsEditing(!isEditing)}
                className={`p-2 rounded-lg transition-colors ${isEditing ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:bg-slate-100 hover:text-blue-600'}`}
                title="Edit Schedule"
            >
                <Icons.Edit className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Edit Mode */}
      {isEditing && (
        <div className="mt-6 pt-6 border-t border-slate-100 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Schedule Edit */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h5 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
                        <Icons.Calendar className="w-4 h-4 mr-2 text-blue-500" />
                        Update Schedule
                    </h5>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                            <input
                                type="date"
                                value={editData.scheduledDate}
                                onChange={(e) => setEditData({ ...editData, scheduledDate: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Time</label>
                            <input
                                type="time"
                                value={editData.scheduledTime}
                                onChange={(e) => setEditData({ ...editData, scheduledTime: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Venue</label>
                        <input
                            type="text"
                            placeholder="Enter venue name"
                            value={editData.venue}
                            onChange={(e) => setEditData({ ...editData, venue: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Save Schedule
                    </button>
                </div>

                {/* Score Edit (Only if teams exist) */}
                {match.homeTeam && match.awayTeam && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h5 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
                            <Icons.Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                            Update Result
                        </h5>
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-slate-500 mb-1 truncate">{match.homeTeam.name}</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={scoreData.homeScore}
                                    onChange={(e) => setScoreData({ ...scoreData, homeScore: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <span className="text-slate-300 font-bold text-xl mt-4">:</span>
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-slate-500 mb-1 truncate">{match.awayTeam.name}</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={scoreData.awayScore}
                                    onChange={(e) => setScoreData({ ...scoreData, awayScore: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleSaveScore}
                            className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                            Update Score & Finish Match
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default MatchScheduler;
