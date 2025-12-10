import { useState, useEffect } from 'react';

const CoachDashboard = ({ user, onLogout }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [activeView, setActiveView] = useState('overview'); // overview, teams, players, matches
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    shortName: '',
    sport: 'Football',
    description: '',
    homeGround: '',
    contactEmail: user.email,
    contactPhone: '',
    address: '',
  });

  const [playerFormData, setPlayerFormData] = useState({
    playerId: '',
    isRegistered: true,
    name: '',
    email: '',
    phone: '',
    position: '',
    jerseyNumber: '',
  });

  useEffect(() => {
    fetchTeams();
    fetchAvailablePlayers();
  }, []);

  useEffect(() => {
    if (activeView === 'matches' && teams.length > 0) {
      fetchMatches();
    }
  }, [activeView, teams]);

  const fetchTeams = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/teams', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      
      if (data.success) {
        // Filter teams where this coach is the coach
        const coachTeams = data.data.filter(t => t.coachId?._id === user.id);
        setTeams(coachTeams);
        if (coachTeams.length > 0 && !selectedTeam) {
          setSelectedTeam(coachTeams[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailablePlayers = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/auth/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      
      if (data.success) {
        const players = data.data.users.filter(u => u.role === 'player' && !u.teamId);
        setAvailablePlayers(players);
      }
    } catch (err) {
      console.error('Error fetching players:', err);
    }
  };

  const fetchMatches = async () => {
    setMatchesLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const allMatches = [];
      
      // Fetch matches for each team
      for (const team of teams) {
        const response = await fetch(`http://localhost:3001/api/matches/team/${team._id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          allMatches.push(...data.data);
        }
      }
      
      // Remove duplicates (a match might appear for both teams)
      const uniqueMatches = allMatches.filter((match, index, self) =>
        index === self.findIndex((m) => m._id === match._id)
      );
      
      // Sort by scheduled date
      uniqueMatches.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
      
      setMatches(uniqueMatches);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to load matches');
    } finally {
      setMatchesLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(teamFormData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Team created successfully!');
        fetchTeams();
        setShowCreateTeamModal(false);
        resetTeamForm();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to create team');
      }
    } catch (err) {
      setError('Error creating team. Please try again.');
    }
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/teams/${selectedTeam._id}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(playerFormData.isRegistered ? {
          playerId: playerFormData.playerId,
          position: playerFormData.position,
          jerseyNumber: playerFormData.jerseyNumber,
        } : {
          name: playerFormData.name,
          email: playerFormData.email,
          phone: playerFormData.phone,
          position: playerFormData.position,
          jerseyNumber: playerFormData.jerseyNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Player added successfully!');
        fetchTeams();
        fetchAvailablePlayers();
        setShowAddPlayerModal(false);
        resetPlayerForm();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to add player');
      }
    } catch (err) {
      setError('Error adding player. Please try again.');
    }
  };

  const handleRemovePlayer = async (playerId) => {
    if (!confirm('Are you sure you want to remove this player?')) return;

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/teams/${selectedTeam._id}/players/${playerId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Player removed successfully!');
        fetchTeams();
        fetchAvailablePlayers();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to remove player');
      }
    } catch (err) {
      setError('Error removing player. Please try again.');
    }
  };

  const resetTeamForm = () => {
    setTeamFormData({
      name: '',
      shortName: '',
      sport: 'Football',
      description: '',
      homeGround: '',
      contactEmail: user.email,
      contactPhone: '',
      address: '',
    });
  };

  const resetPlayerForm = () => {
    setPlayerFormData({
      playerId: '',
      isRegistered: true,
      name: '',
      email: '',
      phone: '',
      position: '',
      jerseyNumber: '',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                <span className="text-4xl">🎽</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Coach Dashboard
                </h1>
                <p className="text-sm text-gray-600 mt-1">Welcome back, {user.name}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all transform hover:scale-105 shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Success/Error Messages */}
      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-md">
            <p className="text-green-800 font-medium">✓ {success}</p>
          </div>
        </div>
      )}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md">
            <p className="text-red-800 font-medium">✗ {error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveView('overview')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeView === 'overview'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveView('teams')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeView === 'teams'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🏆 My Teams ({teams.length})
            </button>
            <button
              onClick={() => setActiveView('players')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeView === 'players'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              👥 Players
            </button>
            <button
              onClick={() => setActiveView('matches')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeView === 'matches'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📅 Matches
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeView === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Teams</p>
                    <p className="text-4xl font-bold mt-2">{teams.length}</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <span className="text-4xl">🏆</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Players</p>
                    <p className="text-4xl font-bold mt-2">
                      {teams.reduce((sum, team) => sum + (team.players?.length || 0), 0)}
                    </p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <span className="text-4xl">👥</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Win Rate</p>
                    <p className="text-4xl font-bold mt-2">
                      {teams.length > 0
                        ? Math.round(
                            (teams.reduce((sum, team) => sum + (team.stats?.wins || 0), 0) /
                              teams.reduce((sum, team) => sum + (team.stats?.wins || 0) + (team.stats?.losses || 0) + (team.stats?.draws || 0), 1)) *
                              100
                          )
                        : 0}
                      %
                    </p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <span className="text-4xl">📈</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowCreateTeamModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-6 rounded-xl shadow-md transition-all transform hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <span className="text-3xl">➕</span>
                  <span className="font-semibold text-lg">Create New Team</span>
                </button>
                <button
                  onClick={() => {
                    if (teams.length === 0) {
                      setError('Please create a team first');
                      setTimeout(() => setError(''), 3000);
                    } else {
                      setShowAddPlayerModal(true);
                    }
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white p-6 rounded-xl shadow-md transition-all transform hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <span className="text-3xl">👤</span>
                  <span className="font-semibold text-lg">Add Player</span>
                </button>
              </div>
            </div>

            {/* Recent Teams */}
            {teams.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Teams</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teams.slice(0, 3).map((team) => (
                    <div
                      key={team._id}
                      onClick={() => {
                        setSelectedTeam(team);
                        setActiveView('teams');
                      }}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-500 cursor-pointer transition-all transform hover:scale-105"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-lg text-gray-800">{team.name}</h3>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {team.sport}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{team.shortName}</p>
                      <p className="text-gray-500 text-xs">Players: {team.players?.length || 0}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Teams Tab */}
        {activeView === 'teams' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">My Teams</h2>
              <button
                onClick={() => setShowCreateTeamModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all transform hover:scale-105"
              >
                ➕ Create New Team
              </button>
            </div>

            {teams.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Teams Yet</h3>
                <p className="text-gray-600 mb-6">Create your first team to get started!</p>
                <button
                  onClick={() => setShowCreateTeamModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-medium shadow-md transition-all transform hover:scale-105"
                >
                  Create Team
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {teams.map((team) => (
                  <div key={team._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-bold">{team.name}</h3>
                          <p className="text-blue-100 mt-1">{team.shortName}</p>
                        </div>
                        <span className="bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold">
                          {team.sport}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">Players</p>
                          <p className="text-2xl font-bold text-gray-800">{team.players?.length || 0}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">Wins</p>
                          <p className="text-2xl font-bold text-green-600">{team.stats?.wins || 0}</p>
                        </div>
                      </div>
                      {team.description && (
                        <p className="text-gray-600 text-sm mb-4">{team.description}</p>
                      )}
                      <button
                        onClick={() => {
                          setSelectedTeam(team);
                          setActiveView('players');
                        }}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-medium transition-colors"
                      >
                        View Players →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Players Tab */}
        {activeView === 'players' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Team Players</h2>
                {selectedTeam && (
                  <p className="text-gray-600 mt-1">
                    Managing: <span className="font-semibold">{selectedTeam.name}</span>
                  </p>
                )}
              </div>
              <div className="flex space-x-3">
                {teams.length > 1 && (
                  <select
                    value={selectedTeam?._id || ''}
                    onChange={(e) => setSelectedTeam(teams.find(t => t._id === e.target.value))}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  >
                    {teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  onClick={() => setShowAddPlayerModal(true)}
                  disabled={!selectedTeam}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ➕ Add Player
                </button>
              </div>
            </div>

            {!selectedTeam ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Team Selected</h3>
                <p className="text-gray-600">Please create a team first to manage players.</p>
              </div>
            ) : selectedTeam.players?.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">👤</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Players Yet</h3>
                <p className="text-gray-600 mb-6">Add your first player to {selectedTeam.name}!</p>
                <button
                  onClick={() => setShowAddPlayerModal(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-medium shadow-md transition-all transform hover:scale-105"
                >
                  Add Player
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Player
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Jersey
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedTeam.players.map((player, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold">
                                {(player.playerId?.name || player.name || 'P').charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {player.playerId?.name || player.name || 'Unknown'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {player.playerId?.email || player.email || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {player.position || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-gray-900">#{player.jerseyNumber || 'N/A'}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {player.playerId?.phone || player.phone || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleRemovePlayer(player.playerId?._id || player._id)}
                              className="text-red-600 hover:text-red-900 font-medium transition-colors"
                            >
                              🗑️ Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create Team Modal */}
      {showCreateTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Create New Team</h3>
                <button
                  onClick={() => {
                    setShowCreateTeamModal(false);
                    resetTeamForm();
                  }}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <form onSubmit={handleCreateTeam} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={teamFormData.name}
                    onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    placeholder="Enter team name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="shortName"
                    value={teamFormData.shortName}
                    onChange={(e) => setTeamFormData({ ...teamFormData, shortName: e.target.value })}
                    required
                    maxLength="10"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    placeholder="Max 10 chars"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sport <span className="text-red-500">*</span>
                </label>
                <select
                  name="sport"
                  value={teamFormData.sport}
                  onChange={(e) => setTeamFormData({ ...teamFormData, sport: e.target.value })}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  <option value="Football">⚽ Football</option>
                  <option value="Cricket">🏏 Cricket</option>
                  <option value="Basketball">🏀 Basketball</option>
                  <option value="Volleyball">🏐 Volleyball</option>
                  <option value="Tennis">🎾 Tennis</option>
                  <option value="Badminton">🏸 Badminton</option>
                  <option value="Hockey">🏑 Hockey</option>
                  <option value="Baseball">⚾ Baseball</option>
                  <option value="Rugby">🏉 Rugby</option>
                  <option value="Other">🏅 Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={teamFormData.description}
                  onChange={(e) => setTeamFormData({ ...teamFormData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  placeholder="Team description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Home Ground
                  </label>
                  <input
                    type="text"
                    name="homeGround"
                    value={teamFormData.homeGround}
                    onChange={(e) => setTeamFormData({ ...teamFormData, homeGround: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    placeholder="Stadium name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={teamFormData.contactPhone}
                    onChange={(e) => setTeamFormData({ ...teamFormData, contactPhone: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={teamFormData.address}
                  onChange={(e) => setTeamFormData({ ...teamFormData, address: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  placeholder="Team address"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateTeamModal(false);
                    resetTeamForm();
                  }}
                  className="px-6 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium shadow-md transition-all transform hover:scale-105"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Player Modal */}
      {showAddPlayerModal && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Add Player to {selectedTeam.name}</h3>
                <button
                  onClick={() => {
                    setShowAddPlayerModal(false);
                    resetPlayerForm();
                  }}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <form onSubmit={handleAddPlayer} className="p-6 space-y-4">
              <div className="flex space-x-4 mb-4">
                <button
                  type="button"
                  onClick={() => setPlayerFormData({ ...playerFormData, isRegistered: true })}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    playerFormData.isRegistered
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Registered Player
                </button>
                <button
                  type="button"
                  onClick={() => setPlayerFormData({ ...playerFormData, isRegistered: false })}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    !playerFormData.isRegistered
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Unregistered Player
                </button>
              </div>

              {playerFormData.isRegistered ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Player <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={playerFormData.playerId}
                    onChange={(e) => setPlayerFormData({ ...playerFormData, playerId: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                  >
                    <option value="">Select a player...</option>
                    {availablePlayers.map((player) => (
                      <option key={player._id} value={player._id}>
                        {player.name} - {player.email}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Player Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={playerFormData.name}
                      onChange={(e) => setPlayerFormData({ ...playerFormData, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={playerFormData.email}
                      onChange={(e) => setPlayerFormData({ ...playerFormData, email: e.target.value })}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={playerFormData.phone}
                      onChange={(e) => setPlayerFormData({ ...playerFormData, phone: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={playerFormData.position}
                    onChange={(e) => setPlayerFormData({ ...playerFormData, position: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                    placeholder="e.g., Forward, Midfielder"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jersey Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={playerFormData.jerseyNumber}
                    onChange={(e) => setPlayerFormData({ ...playerFormData, jerseyNumber: e.target.value })}
                    required
                    min="1"
                    max="99"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPlayerModal(false);
                    resetPlayerForm();
                  }}
                  className="px-6 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium shadow-md transition-all transform hover:scale-105"
                >
                  Add Player
                </button>
              </div>
            </form>
          </div>
        </div>
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
              <p className="text-gray-600">Your teams don't have any scheduled matches at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => {
                const isHomeTeam = teams.some(t => t._id === match.homeTeam?._id);
                
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
  );
};

export default CoachDashboard;
