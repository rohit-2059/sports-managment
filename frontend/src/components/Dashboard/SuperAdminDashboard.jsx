import { useState, useEffect } from 'react';
import TournamentManagement from './TournamentManagement';
import MatchScheduler from './MatchScheduler';
import { AnimatePresence, motion } from "framer-motion";
import ProfileEditModal from './shared/ProfileEditModal';

// --- Icons ---
const Icons = {
    Dashboard: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
    ),
    Trophy: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    RealTrophy: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
    ),
    Calendar: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    Chart: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    Users: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
    Teams: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
    Stats: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
    ),
    Logout: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    ),
    ChevronRight: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
    ),
    Search: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    )
};

const SuperAdminDashboard = ({ user, onLogout }) => {
    const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'tournaments', 'matches', 'teams', 'users', 'schedules', 'stats'
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tournaments, setTournaments] = useState([]);
    const [allMatches, setAllMatches] = useState([]);
    const [filteredMatches, setFilteredMatches] = useState([]);
    const [selectedTournamentFilter, setSelectedTournamentFilter] = useState('all');
    const [selectedTournamentForResults, setSelectedTournamentForResults] = useState(null);
    const [showProfileEditModal, setShowProfileEditModal] = useState(false);

    useEffect(() => {
        fetchTeams();
        fetchUsers();
        fetchTournaments();
    }, []);

    const fetchTeams = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/teams', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) setTeams(data.data);
        } catch (err) {
            console.error('Error fetching teams:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/auth/users', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) setUsers(data.data.users);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const fetchTournaments = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/tournaments', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) {
                const tournamentsWithSchedules = data.data.filter(t => t.scheduleGenerated);
                setTournaments(tournamentsWithSchedules);
            }
        } catch (err) {
            console.error('Error fetching tournaments:', err);
        }
    };

    const fetchAllMatches = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const allMatchesData = [];
            const tournamentsResponse = await fetch('http://localhost:3001/api/tournaments', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const tournamentsData = await tournamentsResponse.json();

            if (tournamentsData.success) {
                for (const tournament of tournamentsData.data) {
                    if (tournament.scheduleGenerated) {
                        const matchesResponse = await fetch(`http://localhost:3001/api/matches/tournament/${tournament._id}`, {
                            headers: { 'Authorization': `Bearer ${token}` },
                        });
                        const matchesData = await matchesResponse.json();
                        if (matchesData.success) {
                            allMatchesData.push(...matchesData.data);
                        }
                    }
                }
            }

            allMatchesData.sort((a, b) => {
                if (!a.scheduledDate) return 1;
                if (!b.scheduledDate) return -1;
                return new Date(a.scheduledDate) - new Date(b.scheduledDate);
            });

            setAllMatches(allMatchesData);
            setFilteredMatches(allMatchesData);
        } catch (err) {
            console.error('Error fetching matches:', err);
        }
    };

    const handleFilterChange = (tournamentId) => {
        setSelectedTournamentFilter(tournamentId);
        if (tournamentId === 'all') {
            setFilteredMatches(allMatches);
        } else {
            setFilteredMatches(allMatches.filter(m => m.tournamentId?._id === tournamentId));
        }
    };

    // --- Sub-Components for Views ---

    const DashboardHome = () => {
        const [hoveredIndex, setHoveredIndex] = useState(null);

        return (
            <div className="animate-fade-in">
                {/* Welcome Section */}
                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-slate-900">Dashboard Overview</h2>
                    <p className="mt-2 text-slate-500">Welcome back, {user.name}. Here's what's happening today.</p>
                </div>

                {/* Stats Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Users', value: users.length, icon: Icons.Users, color: 'blue', trend: '+12%' },
                        { label: 'Active Teams', value: teams.length, icon: Icons.Teams, color: 'indigo', trend: '+5%' },
                        { label: 'Tournaments', value: tournaments.length, icon: Icons.RealTrophy, color: 'purple', trend: 'Active' },
                        { label: 'System Status', value: 'Online', icon: Icons.Chart, color: 'green', trend: 'Stable' },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full bg-${stat.color}-50 text-${stat.color}-700`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Feature Grid */}
                <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Access</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { id: 'tournaments', title: 'Tournaments', desc: 'Create and manage tournaments', icon: Icons.RealTrophy, color: 'blue' },
                        { id: 'matches', title: 'Match Results', desc: 'Update scores and standings', icon: Icons.Chart, color: 'red' },
                        { id: 'teams', title: 'Teams', desc: 'Manage team registrations', icon: Icons.Teams, color: 'green' },
                        { id: 'users', title: 'Users', desc: 'Manage coaches and players', icon: Icons.Users, color: 'purple' },
                        { id: 'schedules', title: 'Schedules', desc: 'Plan match calendar', icon: Icons.Calendar, color: 'orange' },
                        { id: 'stats', title: 'Statistics', desc: 'View platform analytics', icon: Icons.Stats, color: 'teal' },
                    ].map((feature, idx) => (
                        <div
                            key={feature.id}
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="relative group block p-2 h-full w-full"
                        >
                            <AnimatePresence>
                                {hoveredIndex === idx && (
                                    <motion.span
                                        className="absolute inset-0 h-full w-full bg-slate-900 shadow-md border border-slate-800/60 block rounded-3xl z-0"
                                        layoutId="hoverBackground"
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: 1,
                                            transition: { duration: 0.15 },
                                        }}
                                        exit={{
                                            opacity: 0,
                                            transition: { duration: 0.15, delay: 0.2 },
                                        }}
                                    />
                                )}
                            </AnimatePresence>
                            <button
                                onClick={() => setActiveView(feature.id)}
                                className="relative z-10 w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 text-left overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-${feature.color}-600`}>
                                    <feature.icon className="w-24 h-24 transform translate-x-4 -translate-y-4" />
                                </div>
                                <div className="relative">
                                    <div className={`w-12 h-12 bg-${feature.color}-50 text-${feature.color}-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                                    <p className="text-sm text-slate-500">{feature.desc}</p>
                                    <div className="mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                        <span>Open Manager</span>
                                        <Icons.ChevronRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const TeamsView = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Teams Directory</h2>
                    <p className="text-slate-500">Manage all registered teams</p>
                </div>
                <div className="flex space-x-3">
                    <div className="relative">
                        <input type="text" placeholder="Search teams..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                        <Icons.Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Export Data
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Team</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Sport</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Coach</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Stats</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {teams.map((team) => (
                            <tr key={team._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                                            {team.shortName?.substring(0, 2)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-bold text-slate-900">{team.name}</div>
                                            <div className="text-xs text-slate-500">{team.homeGround || 'No Venue'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                        {team.sport}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-slate-900">{team.coachId?.name || 'Unknown'}</div>
                                    <div className="text-xs text-slate-500">{team.coachId?.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2 text-xs font-medium">
                                        <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded">W: {team.stats?.wins || 0}</span>
                                        <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded">L: {team.stats?.losses || 0}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${team.isActive ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                        {team.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const UsersView = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
                    <p className="text-slate-500">Coaches, players, and administrators</p>
                </div>
                <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {users.filter(u => u.role === 'coach').length} Coaches
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {users.filter(u => u.role === 'player').length} Players
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((usr) => (
                            <tr key={usr._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${usr.role === 'coach' ? 'bg-blue-500' : 'bg-green-500'}`}>
                                            {usr.name.charAt(0)}
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-bold text-slate-900">{usr.name}</div>
                                            <div className="text-xs text-slate-500">Joined {new Date(usr.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${usr.role === 'coach' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                                        {usr.role === 'coach' ? 'Coach' : 'Player'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-slate-900">{usr.email}</div>
                                    <div className="text-xs text-slate-500">{usr.phone || 'No Phone'}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${usr.isActive ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                        {usr.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const SchedulesView = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Match Schedules</h2>
                    <p className="text-slate-500">Upcoming fixtures and calendar</p>
                </div>
                <button
                    onClick={() => fetchAllMatches()}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                    <Icons.Calendar className="w-4 h-4 mr-1" /> Refresh
                </button>
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-sm font-medium text-slate-700">Filter by Tournament:</span>
                <select
                    value={selectedTournamentFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                >
                    <option value="all">All Tournaments</option>
                    {tournaments.map((t) => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                </select>
            </div>

            {filteredMatches.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                    <Icons.Calendar className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <h3 className="text-lg font-medium text-slate-900">No Matches Scheduled</h3>
                    <p className="text-slate-500">Select a tournament or generate a new schedule</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredMatches.map((match) => (
                        <div key={match._id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all duration-200 group">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex items-center space-x-6 w-full md:w-auto">
                                    <div className="flex flex-col items-center min-w-[80px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            {match.scheduledDate ? new Date(match.scheduledDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'TBD'}
                                        </span>
                                        <span className="text-xl font-bold text-slate-900">
                                            {match.scheduledTime || '--:--'}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider border border-blue-100">
                                                {match.tournamentId?.name}
                                            </span>
                                            <span className="text-xs text-slate-400">• Round {match.round}</span>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="font-bold text-lg text-slate-900">{match.homeTeam?.name || 'TBD'}</span>
                                            <span className="text-slate-300 text-sm font-medium">VS</span>
                                            <span className="font-bold text-lg text-slate-900">{match.awayTeam?.name || 'TBD'}</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1 flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            {match.venue || 'Venue TBD'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${match.status === 'completed' ? 'bg-green-100 text-green-700' : match.status === 'live' ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                                        {match.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const MatchResultsView = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Match Results</h2>
                <p className="text-slate-500">Update scores and manage outcomes</p>
            </div>

            {tournaments.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500">No active tournaments found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tournaments.map((tournament) => (
                        <button
                            key={tournament._id}
                            onClick={() => setSelectedTournamentForResults(tournament)}
                            className="group flex flex-col items-start p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 text-left w-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Icons.RealTrophy className="w-20 h-20" />
                            </div>
                            <div className="flex justify-between w-full mb-4 relative z-10">
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${tournament.status === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {tournament.status}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors relative z-10">{tournament.name}</h3>
                            <p className="text-sm text-slate-500 mt-1 relative z-10">{tournament.sport} • {tournament.format}</p>
                            <div className="mt-6 w-full bg-slate-50 py-2 px-4 rounded-lg text-center text-sm font-medium text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors relative z-10">
                                Manage Results
                            </div>
                        </button>
                    ))}
                </div>
            )}
            {selectedTournamentForResults && (
                <MatchScheduler
                    tournament={selectedTournamentForResults}
                    onClose={() => setSelectedTournamentForResults(null)}
                />
            )}
        </div>
    );

    const StatsView = () => (
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-xl border border-dashed border-slate-300 animate-fade-in">
            <Icons.Stats className="w-16 h-16 text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-900">Analytics Dashboard</h3>
            <p className="text-slate-500">Detailed platform statistics coming soon.</p>
        </div>
    );

    // --- Main Render ---

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
        { id: 'tournaments', label: 'Tournaments', icon: Icons.RealTrophy },
        { id: 'matches', label: 'Results', icon: Icons.Chart },
        { id: 'schedules', label: 'Schedules', icon: Icons.Calendar },
        { id: 'teams', label: 'Teams', icon: Icons.Teams },
        { id: 'users', label: 'Users', icon: Icons.Users },
        { id: 'stats', label: 'Statistics', icon: Icons.Stats },
    ];

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">

            {/* Sidebar - Only visible when activeView !== 'dashboard' */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 shadow-xl transform transition-all duration-500 ease-in-out flex flex-col
                    ${activeView === 'dashboard' ? '-translate-x-full w-0 opacity-0' : 'translate-x-0 w-64 opacity-100'}
                `}
            >
                <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
                    <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                        <Icons.RealTrophy className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        SportsManager
                    </span>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`
                                w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
                                ${activeView === item.id
                                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                            `}
                        >
                            <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                            <span>{item.label}</span>
                            {activeView === item.id && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center p-3 bg-slate-50 rounded-xl mb-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Icons.Logout className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div
                className={`
                    flex-1 flex flex-col h-full transition-all duration-500 ease-in-out
                    ${activeView === 'dashboard' ? 'ml-0' : 'ml-64'}
                `}
            >
                {/* Header - Always visible but adapts */}
                <header className={`
                    bg-slate-900 sticky top-0 z-50 shadow-md border-b border-slate-800/60 h-18 py-3 flex-none transition-all duration-500
                    ${activeView === 'dashboard' ? 'px-8' : 'px-8'}
                `}>
                    <div className="h-full flex justify-between items-center max-w-7xl mx-auto w-full">
                        {/* Left side of header */}
                        <div className="flex items-center gap-4">
                            {activeView === 'dashboard' && (
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl text-white shadow-lg shadow-purple-500/20 ring-1 ring-white/10">
                                        <Icons.RealTrophy className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-white tracking-tight leading-none">Admin Portal</h1>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                            <p className="text-[10px] font-bold text-purple-200/80 uppercase tracking-widest">System Manager</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeView !== 'dashboard' && (
                                <h1 className="text-xl font-bold text-white capitalize">{navItems.find(n => n.id === activeView)?.label}</h1>
                            )}
                        </div>

                        {/* Right side of header */}
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex items-center gap-4 text-sm text-slate-400">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700/50">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span>System Operational</span>
                                </div>
                            </div>
                            {activeView === 'dashboard' && (
                                <>
                                    <div className="h-10 w-px bg-slate-700/50"></div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-bold text-slate-200 leading-tight">{user.name}</p>
                                            <p className="text-xs text-slate-500 font-medium">Super Admin</p>
                                        </div>
                                        <button
                                            onClick={() => setShowProfileEditModal(true)}
                                            className="bg-slate-800/50 hover:bg-blue-500/10 hover:text-blue-400 text-slate-400 p-2.5 rounded-xl transition-all border border-slate-700 hover:border-blue-500/20 group"
                                            title="Profile Settings"
                                        >
                                            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={onLogout}
                                            className="bg-slate-800/50 hover:bg-red-500/10 hover:text-red-400 text-slate-400 p-2.5 rounded-xl transition-all border border-slate-700 hover:border-red-500/20 group"
                                            title="Sign Out"
                                        >
                                            <Icons.Logout className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content Scroll Area */}
                <main className="flex-1 overflow-y-auto bg-slate-50 relative">
                    <div className="max-w-7xl mx-auto p-8 min-h-full">
                        {activeView === 'dashboard' ? (
                            <DashboardHome />
                        ) : (
                            <div className="animate-slide-in-right">
                                {activeView === 'tournaments' && <TournamentManagement />}
                                {activeView === 'matches' && <MatchResultsView />}
                                {activeView === 'teams' && <TeamsView />}
                                {activeView === 'users' && <UsersView />}
                                {activeView === 'schedules' && <SchedulesView />}
                                {activeView === 'stats' && <StatsView />}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <ProfileEditModal
                isOpen={showProfileEditModal}
                onClose={() => setShowProfileEditModal(false)}
                user={user}
                token={sessionStorage.getItem('token')}
                onProfileUpdated={(updatedUser) => {
                    // Profile updated successfully
                    console.log('Profile updated:', updatedUser);
                }}
            />
        </div>
    );
};

export default SuperAdminDashboard;
