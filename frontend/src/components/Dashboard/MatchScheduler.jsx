import { useState, useEffect } from 'react';

const MatchScheduler = ({ tournament, onClose }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (tournament.scheduleGenerated) {
      fetchMatches();
    }
  }, [tournament._id]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/matches/tournament/${tournament._id}`, {
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
  };

  const handleGenerateSchedule = async () => {
    if (!confirm(`Generate schedule for ${tournament.name}? This cannot be undone.`)) return;
    
    try {
      setGenerating(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/matches/tournament/${tournament._id}/generate-schedule`, {
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
      const response = await fetch(`http://localhost:3001/api/matches/${matchId}`, {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-t-2xl z-10">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">Match Schedule - {tournament.name}</h3>
              <p className="text-sm text-purple-100 mt-1">
                {tournament.format.charAt(0).toUpperCase() + tournament.format.slice(1)} Tournament
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {!tournament.scheduleGenerated ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Schedule Generated Yet</h3>
              <p className="text-gray-600 mb-6">
                Generate matches for this tournament ({tournament.teams?.length || 0} teams registered)
              </p>
              <button
                onClick={handleGenerateSchedule}
                disabled={generating || (tournament.teams?.length || 0) < 2}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-medium shadow-md transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? '⏳ Generating...' : '🎯 Generate Schedule'}
              </button>
              {(tournament.teams?.length || 0) < 2 && (
                <p className="text-red-500 text-sm mt-2">At least 2 teams required</p>
              )}
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading matches...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Match Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-4 text-white">
                  <p className="text-sm font-medium text-blue-100">Total Matches</p>
                  <p className="text-3xl font-bold mt-1">{matches.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-4 text-white">
                  <p className="text-sm font-medium text-green-100">Scheduled</p>
                  <p className="text-3xl font-bold mt-1">
                    {matches.filter(m => m.scheduledDate).length}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-md p-4 text-white">
                  <p className="text-sm font-medium text-yellow-100">Completed</p>
                  <p className="text-3xl font-bold mt-1">
                    {matches.filter(m => m.status === 'completed').length}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-4 text-white">
                  <p className="text-sm font-medium text-purple-100">Pending</p>
                  <p className="text-3xl font-bold mt-1">
                    {matches.filter(m => !m.scheduledDate && m.homeTeam && m.awayTeam).length}
                  </p>
                </div>
              </div>

              {/* Matches List */}
              <div className="space-y-3">
                {Object.entries(
                  matches.reduce((acc, match) => {
                    if (!acc[match.round]) acc[match.round] = [];
                    acc[match.round].push(match);
                    return acc;
                  }, {})
                ).map(([round, roundMatches]) => (
                  <div key={round} className="border-2 border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-100 px-4 py-3 border-b-2 border-gray-200">
                      <h4 className="font-bold text-gray-800">{round}</h4>
                    </div>
                    <div className="p-4 space-y-3">
                      {roundMatches.map((match) => (
                        <MatchCard
                          key={match._id}
                          match={match}
                          onUpdate={(updates) => handleUpdateMatch(match._id, updates)}
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
    </div>
  );
};

const MatchCard = ({ match, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    scheduledDate: match.scheduledDate ? match.scheduledDate.split('T')[0] : '',
    scheduledTime: match.scheduledTime || '',
    venue: match.venue || '',
  });

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-600">Match #{match.matchNumber}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          match.status === 'completed' ? 'bg-green-100 text-green-800' :
          match.status === 'live' ? 'bg-red-100 text-red-800' :
          match.scheduledDate ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {match.status === 'scheduled' && match.scheduledDate ? '📅 Scheduled' :
           match.status === 'completed' ? '✅ Completed' :
           match.status === 'live' ? '🔴 Live' :
           '⏳ Pending'}
        </span>
      </div>

      {match.homeTeam && match.awayTeam ? (
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 text-center">
            <p className="font-bold text-gray-800">{match.homeTeam.name}</p>
            <p className="text-sm text-gray-500">{match.homeTeam.shortName}</p>
          </div>
          <div className="px-4 text-2xl font-bold text-gray-400">VS</div>
          <div className="flex-1 text-center">
            <p className="font-bold text-gray-800">{match.awayTeam.name}</p>
            <p className="text-sm text-gray-500">{match.awayTeam.shortName}</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-2 text-gray-500">
          <p>⏳ Teams TBD</p>
        </div>
      )}

      {isEditing ? (
        <div className="space-y-3 mt-3 pt-3 border-t-2 border-gray-200">
          <div className="grid grid-cols-3 gap-2">
            <input
              type="date"
              value={editData.scheduledDate}
              onChange={(e) => setEditData({ ...editData, scheduledDate: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
            />
            <input
              type="time"
              value={editData.scheduledTime}
              onChange={(e) => setEditData({ ...editData, scheduledTime: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
            />
            <input
              type="text"
              placeholder="Venue"
              value={editData.venue}
              onChange={(e) => setEditData({ ...editData, venue: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              ✓ Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
            >
              ✗ Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 pt-3 border-t-2 border-gray-200">
          {match.scheduledDate ? (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                📅 {new Date(match.scheduledDate).toLocaleDateString()}
                {match.scheduledTime && ` ⏰ ${match.scheduledTime}`}
              </span>
              {match.venue && <span className="text-gray-600">📍 {match.venue}</span>}
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ✏️ Edit
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              📅 Schedule Match
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchScheduler;
