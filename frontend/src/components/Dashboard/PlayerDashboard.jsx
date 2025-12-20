import { useState, useEffect } from "react";
import Header from "./Player/components/Header";
import NavigationTabs from "./Player/components/NavigationTabs";
import ProfileView from "./Player/features/profile/ProfileView";
import MatchesView from "./Player/features/matches/MatchesView";
import StatsView from "./Player/features/stats/StatsView";
import ProfileEditModal from "./shared/ProfileEditModal";
import { ICONS } from "./Coach/utils/icons.jsx";

const PlayerDashboard = ({ user, onLogout }) => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [activeView, setActiveView] = useState('profile'); // profile, matches, stats
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [playerStats, setPlayerStats] = useState([]);
  const [aggregatedStats, setAggregatedStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);

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
    if (activeView === 'stats') {
      fetchPlayerStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView, team]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      const response = await fetch("http://localhost:3001/api/teams", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const teams = Array.isArray(data.data) ? data.data : (data.data?.teams || []);

        // Find the team where the current user is a player
        const myTeam = teams.find((t) => {
          return t.players && t.players.some((p) => {
            const playerId = p.playerId?._id || p.playerId;
            return playerId && playerId.toString() === user.id.toString();
          });
        });

        setTeam(myTeam || null);
      }
    } catch (err) {
      console.error("Error fetching team:", err);
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
    } finally {
      setMatchesLoading(false);
    }
  };

  const fetchPlayerStats = async () => {
    setStatsLoading(true);
    try {
      const token = sessionStorage.getItem('token');

      // Fetch individual stats
      const statsResponse = await fetch(`http://localhost:3001/api/stats/player/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const statsData = await statsResponse.json();

      // Fetch aggregated stats
      const aggResponse = await fetch(`http://localhost:3001/api/stats/player/${user.id}/aggregated`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const aggData = await aggResponse.json();

      if (statsData.success) {
        setPlayerStats(statsData.data);
      }

      if (aggData.success) {
        setAggregatedStats(aggData.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setStatsLoading(false);
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
        setTimeout(() => setNotification(""), 5000);
      } else {
        const data = await response.json();
        console.error(data.error || "Failed to leave team");
      }
    } catch (err) {
      console.error("Error leaving team:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header user={user} onLogout={onLogout} onOpenProfileEdit={() => setShowProfileEditModal(true)} />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {notification && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm animate-fade-in">
            <div className="bg-emerald-100 p-1 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <span className="font-medium">{notification}</span>
          </div>
        )}

        <NavigationTabs activeView={activeView} setActiveView={setActiveView} />

        <div className="animate-fade-in">
          {activeView === 'profile' && (
            <ProfileView
              team={team}
              user={user}
              loading={loading}
              onLeaveTeam={handleLeaveTeam}
            />
          )}

          {activeView === 'matches' && (
            <MatchesView
              matches={matches}
              loading={matchesLoading}
              onRefresh={fetchMatches}
              teamId={team?._id}
            />
          )}

          {activeView === 'stats' && (
            <StatsView
              playerStats={playerStats}
              aggregatedStats={aggregatedStats}
              loading={statsLoading}
            />
          )}
        </div>
      </main>

      <ProfileEditModal
        isOpen={showProfileEditModal}
        onClose={() => setShowProfileEditModal(false)}
        user={user}
        token={sessionStorage.getItem('token')}
        onProfileUpdated={(updatedUser) => {
          setNotification('Profile updated successfully!');
          setTimeout(() => setNotification(''), 5000);
        }}
      />
    </div>
  );
};

export default PlayerDashboard;