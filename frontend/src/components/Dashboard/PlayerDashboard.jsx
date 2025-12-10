import { useState, useEffect } from "react";

const PlayerDashboard = ({ user, onLogout }) => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [notification, setNotification] = useState("");
  const [activeView, setActiveView] = useState('profile'); // profile, matches
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(false);

  useEffect(() => {
    fetchTeamData();
    
    // Check for notifications using user ID
    const addedNotification = sessionStorage.getItem(`notification_${user.id}`);
    if (addedNotification) {
      setNotification(addedNotification);
      sessionStorage.removeItem(`notification_${user.id}`);
      setTimeout(() => setNotification(""), 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeView === 'matches' && team) {
      fetchMatches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView, team]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      
      console.log("Fetching teams for player:", user.id);
      
      const response = await fetch("http://localhost:3001/api/teams", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Full response:", data);
        console.log("Teams data:", data.data);
        console.log("Is array?", Array.isArray(data.data));
        
        // Get teams array - handle both array and object responses
        const teams = Array.isArray(data.data) ? data.data : (data.data?.teams || []);
        console.log("Teams array:", teams);
        
        // Find the team where the current user is a player
        const myTeam = teams.find((t) => {
          console.log("Checking team:", t.name, "Coach:", t.coachId, "Players:", t.players);
          return t.players && t.players.some((p) => {
            const playerId = p.playerId?._id || p.playerId;
            console.log("Comparing player ID:", playerId, "with user ID:", user.id);
            return playerId && playerId.toString() === user.id.toString();
          });
        });
        
        console.log("My team:", myTeam);
        setTeam(myTeam || null);
      } else {
        console.error("Failed to fetch teams:", response.status);
        setError("Failed to load team data");
      }
    } catch (err) {
      console.error("Error fetching team:", err);
      setError("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    if (!team) return;
    
    setMatchesLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/matches/team/${team._id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      
      if (data.success) {
        // Sort by scheduled date
        const sortedMatches = data.data.sort((a, b) => 
          new Date(a.scheduledDate) - new Date(b.scheduledDate)
        );
        setMatches(sortedMatches);
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to load matches');
    } finally {
      setMatchesLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/teams/leave", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setNotification("Successfully left the team");
        setTeam(null);
        setShowLeaveConfirm(false);
        setTimeout(() => setNotification(""), 5000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to leave team");
      }
    } catch (err) {
      console.error("Error leaving team:", err);
      setError("Failed to leave team");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🧍‍♂️</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Player Dashboard</h1>
                <p className="text-sm text-gray-500">Track performance and participate</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              {notification && (
                <div className="relative">
                  <button className="text-gray-600 hover:text-gray-900 relative">
                    <span className="text-2xl">🔔</span>
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                  </button>
                </div>
              )}
              <span className="text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={onLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Notification */}
          {notification && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              {notification}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
              <button
                onClick={() => setError("")}
                className="absolute top-0 right-0 px-4 py-3"
              >
                ×
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-lg p-2 mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveView('profile')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeView === 'profile'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                🧍‍♂️ Profile
              </button>
              <button
                onClick={() => setActiveView('matches')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeView === 'matches'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                disabled={!team}
              >
                📅 My Matches
              </button>
            </div>
          </div>

          {/* Profile View */}
          {activeView === 'profile' && (
            <>
              {/* Welcome Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 mb-6">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="text-6xl">🧍‍♂️</div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-lg font-medium text-gray-900 truncate">
                          Player Profile
                        </dt>
                        <dd className="text-sm text-gray-500">
                          {team
                            ? `You are a member of ${team.name || team.teamName || 'Unknown Team'}`
                            : "You are not currently part of any team"}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

          {/* My Team Section */}
          {loading ? (
            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
              <div className="px-4 py-5 sm:p-6 text-center">
                <p className="text-gray-500">Loading team information...</p>
              </div>
            </div>
          ) : team ? (
            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  My Team
                </h3>

                {/* Team Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Team Name
                    </label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {team.name || team.teamName || 'Unknown Team'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sport
                    </label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {team.sport || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Coach
                    </label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {team.coachId?.name || team.coach?.name || "Not assigned"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Total Players
                    </label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {team.players?.length || 0}
                    </p>
                  </div>
                </div>

                {/* Team Members */}
                <div className="mb-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">
                    Team Members
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {team.players && team.players.length > 0 ? (
                      <ul className="space-y-2">
                        {team.players.map((player, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">👤</span>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {player.isRegistered
                                    ? player.playerId?.name || "Unknown"
                                    : player.name}
                                </p>
                                {player.position && (
                                  <p className="text-sm text-gray-500">
                                    Position: {player.position}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                player.isRegistered
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {player.isRegistered ? "Registered" : "Guest"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-center">
                        No players in the team yet
                      </p>
                    )}
                  </div>
                </div>

                {/* Leave Team Button */}
                <div className="mt-6">
                  <button
                    onClick={() => setShowLeaveConfirm(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Leave Team
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
              <div className="px-4 py-5 sm:p-6 text-center">
                <div className="text-6xl mb-4">🚫</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Team Assigned
                </h3>
                <p className="text-gray-500">
                  You are not currently part of any team. Wait for a coach to add you to their team.
                </p>
              </div>
            </div>
          )}
            </>
          )}

          {/* Matches View */}
          {activeView === 'matches' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">📅 My Team Matches</h2>
                <button
                  onClick={fetchMatches}
                  disabled={matchesLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  🔄 Refresh
                </button>
              </div>

              {matchesLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Loading matches...</p>
                </div>
              ) : matches.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Matches Yet</h3>
                  <p className="text-gray-600">Your team doesn't have any scheduled matches at the moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {matches.map((match) => {
                    const isHomeTeam = team._id === match.homeTeam?._id;
                    
                    return (
                      <div 
                        key={match._id} 
                        className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-blue-50 to-indigo-50"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              match.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              match.status === 'live' ? 'bg-green-100 text-green-800 animate-pulse' :
                              match.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                              match.status === 'postponed' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {match.status.toUpperCase()}
                            </span>
                            {match.round && (
                              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                                {match.round}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            🏆 {match.tournamentId?.name || 'Tournament'}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 items-center mb-4">
                          {/* Home Team */}
                          <div className={`text-center p-4 rounded-lg ${isHomeTeam ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white'}`}>
                            <div className="text-2xl mb-2">🏆</div>
                            <div className="font-bold text-lg text-gray-900">{match.homeTeam?.name || 'TBD'}</div>
                            {isHomeTeam && <div className="text-xs text-blue-600 font-semibold mt-1">YOUR TEAM</div>}
                            {match.status === 'completed' && match.homeTeamScore !== undefined && (
                              <div className="text-3xl font-bold text-gray-900 mt-2">{match.homeTeamScore}</div>
                            )}
                          </div>

                          {/* VS */}
                          <div className="text-center">
                            <div className="text-3xl font-bold text-gray-400">VS</div>
                          </div>

                          {/* Away Team */}
                          <div className={`text-center p-4 rounded-lg ${!isHomeTeam ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white'}`}>
                            <div className="text-2xl mb-2">🏆</div>
                            <div className="font-bold text-lg text-gray-900">{match.awayTeam?.name || 'TBD'}</div>
                            {!isHomeTeam && <div className="text-xs text-blue-600 font-semibold mt-1">YOUR TEAM</div>}
                            {match.status === 'completed' && match.awayTeamScore !== undefined && (
                              <div className="text-3xl font-bold text-gray-900 mt-2">{match.awayTeamScore}</div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 bg-white p-4 rounded-lg">
                          <div>
                            <span className="font-semibold">📅 Date:</span>{' '}
                            {new Date(match.scheduledDate).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-semibold">⏰ Time:</span>{' '}
                            {match.scheduledTime || 'TBD'}
                          </div>
                          <div className="col-span-2">
                            <span className="font-semibold">📍 Venue:</span>{' '}
                            {match.venue || 'TBD'}
                          </div>
                        </div>

                        {match.result && (
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <span className="font-semibold text-yellow-800">Result:</span>{' '}
                            <span className="text-gray-900">{match.result}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Leave Team Confirmation Modal */}
      {showLeaveConfirm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowLeaveConfirm(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Leave Team
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to leave this team? This action cannot be undone and you will need to be re-added by a coach.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleLeaveTeam}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Leave Team
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeaveConfirm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerDashboard;
