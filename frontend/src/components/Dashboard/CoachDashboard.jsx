import { useState, useEffect } from 'react';

// Components
import Header from './Coach/components/Header';
import NavigationTabs from './Coach/components/NavigationTabs';
import Loader from './Coach/components/Loader';
import Alert from './Coach/components/Alert';
import ProfileEditModal from './shared/ProfileEditModal';

// Feature Views
import Overview from './Coach/features/overview/Overview';
import TeamsView from './Coach/features/teams/TeamsView';
import CreateTeamModal from './Coach/features/teams/CreateTeamModal';
import PlayersView from './Coach/features/players/PlayersView';
import AddPlayerModal from './Coach/features/players/AddPlayerModal';
import EditPlayerModal from './Coach/features/players/EditPlayerModal';
import MatchesView from './Coach/features/matches/MatchesView';
import StatsView from './Coach/features/stats/StatsView';
import AddStatsModal from './Coach/features/stats/AddStatsModal';

const CoachDashboard = ({ user, onLogout }) => {
  // Global State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeView, setActiveView] = useState('overview'); // overview, teams, players, matches, stats

  // Data State
  const [teams, setTeams] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [teamPlayersStats, setTeamPlayersStats] = useState([]);

  // Selection State
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedStatsTeam, setSelectedStatsTeam] = useState(null);

  // Modal State
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showEditPlayerModal, setShowEditPlayerModal] = useState(false);
  const [showAddStatsModal, setShowAddStatsModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState(null);

  // Loading States
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    fetchTeams();
    fetchAvailablePlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeView === 'matches' && teams.length > 0) {
      fetchMatches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView, teams]);

  const getToken = () => sessionStorage.getItem('token');

  const fetchTeams = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/teams', {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      const data = await response.json();

      if (data.success) {
        // Filter teams where this coach is the coach
        const coachTeams = data.data.filter(t => t.coachId?._id === user.id);
        setTeams(coachTeams);
        // If we have teams but none selected (and not in stats view where we might have a different selection logic), select first
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
      const response = await fetch('http://localhost:3001/api/auth/users', {
        headers: { 'Authorization': `Bearer ${getToken()}` },
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
      const allMatches = [];

      // Fetch matches for each team
      for (const team of teams) {
        const response = await fetch(`http://localhost:3001/api/matches/team/${team._id}`, {
          headers: { 'Authorization': `Bearer ${getToken()}` },
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

  const fetchTeamPlayersStats = async (teamId) => {
    setStatsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/stats/team/${teamId}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      const data = await response.json();

      if (data.success) {
        setTeamPlayersStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching team stats:', err);
      setError('Failed to load team statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  // Handlers
  const handleRemovePlayer = async (playerId) => {
    if (!confirm('Are you sure you want to remove this player?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/teams/${selectedTeam._id}/players/${playerId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` },
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
      console.error('Error removing player:', err);
      setError('Error removing player. Please try again.');
    }
  };

  const handleOpenAddPlayer = () => {
    if (teams.length === 0) {
      setError('Please create a team first');
      setTimeout(() => setError(''), 3000);
    } else {
      setShowAddPlayerModal(true);
    }
  };

  const handleEditPlayer = (player) => {
    setPlayerToEdit(player);
    setShowEditPlayerModal(true);
  };

  const onPlayerUpdated = () => {
    setSuccess('Player updated successfully!');
    fetchTeams();
    setShowEditPlayerModal(false);
    setPlayerToEdit(null);
    setTimeout(() => setSuccess(''), 3000);
  };

  const onTeamCreated = (msg) => {
    setSuccess(msg);
    fetchTeams();
    setTimeout(() => setSuccess(''), 3000);
  };

  const onPlayerAdded = (msg) => {
    setSuccess(msg);
    fetchTeams();
    fetchAvailablePlayers();
    setTimeout(() => setSuccess(''), 3000);
  };

  const onStatsAdded = () => {
    fetchTeamPlayersStats(selectedStatsTeam._id);
  };

  if (loading) {
    return <Loader fullScreen text="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header user={user} onLogout={onLogout} onOpenProfileEdit={() => setShowProfileEditModal(true)} />

      <Alert type="success" message={success} />
      <Alert type="error" message={error} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NavigationTabs
          activeView={activeView}
          setActiveView={setActiveView}
          teamsCount={teams.length}
        />

        {activeView === 'overview' && (
          <Overview
            teams={teams}
            onOpenCreateTeam={() => setShowCreateTeamModal(true)}
            onOpenAddPlayer={handleOpenAddPlayer}
            onSelectTeam={(team) => {
              setSelectedTeam(team);
              setActiveView('teams');
            }}
          />
        )}

        {activeView === 'teams' && (
          <TeamsView
            teams={teams}
            onOpenCreateModal={() => setShowCreateTeamModal(true)}
            onSelectTeam={(team) => {
              setSelectedTeam(team);
              setActiveView('players');
            }}
          />
        )}

        {activeView === 'players' && (
          <PlayersView
            teams={teams}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            onAddPlayerClick={() => setShowAddPlayerModal(true)}
            onRemovePlayer={handleRemovePlayer}
            onEditPlayer={handleEditPlayer}
          />
        )}

        {activeView === 'matches' && (
          <MatchesView
            matches={matches}
            loading={matchesLoading}
            onRefresh={fetchMatches}
            teams={teams}
          />
        )}

        {activeView === 'stats' && (
          <StatsView
            teams={teams}
            selectedTeam={selectedStatsTeam}
            setSelectedTeam={(team) => {
              setSelectedStatsTeam(team);
              if (team) fetchTeamPlayersStats(team._id);
            }}
            stats={teamPlayersStats}
            loading={statsLoading}
            onAddStatsClick={() => setShowAddStatsModal(true)}
          />
        )}
      </main>

      <CreateTeamModal
        isOpen={showCreateTeamModal}
        onClose={() => setShowCreateTeamModal(false)}
        onTeamCreated={onTeamCreated}
        userEmail={user.email}
        token={getToken()}
      />

      <AddPlayerModal
        isOpen={showAddPlayerModal}
        onClose={() => setShowAddPlayerModal(false)}
        teams={teams}
        selectedTeam={selectedTeam}
        onPlayerAdded={onPlayerAdded}
        token={getToken()}
      />

      <EditPlayerModal
        isOpen={showEditPlayerModal}
        onClose={() => {
          setShowEditPlayerModal(false);
          setPlayerToEdit(null);
        }}
        player={playerToEdit}
        teamId={selectedTeam?._id}
        onPlayerUpdated={onPlayerUpdated}
        token={getToken()}
      />

      <AddStatsModal
        isOpen={showAddStatsModal}
        onClose={() => setShowAddStatsModal(false)}
        team={selectedStatsTeam}
        token={getToken()}
        onStatsAdded={onStatsAdded}
      />

      <ProfileEditModal
        isOpen={showProfileEditModal}
        onClose={() => setShowProfileEditModal(false)}
        user={user}
        token={getToken()}
        onProfileUpdated={(updatedUser) => {
          // Update user state if needed
          setSuccess('Profile updated successfully!');
          setTimeout(() => setSuccess(''), 3000);
        }}
      />
    </div>
  );
};

export default CoachDashboard;
