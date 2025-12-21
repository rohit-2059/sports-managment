import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import MatchScheduler from './MatchScheduler';

// --- Icons ---
const Icons = {
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
    Plus: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
    ),
    Edit: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    ),
    Trash: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    ),
    Close: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    Search: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
    Eye: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    )
};

const TournamentManagement = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'form', 'schedule'
  const [editingTournament, setEditingTournament] = useState(null);
  const [selectedTournamentForSchedule, setSelectedTournamentForSchedule] = useState(null);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sport: 'Football',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    venue: '',
    maxTeams: 16,
    format: 'knockout',
    prizePool: '',
    rules: '',
    contactEmail: '',
    contactPhone: '',
  });

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/tournaments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setTournaments(data.data);
      }
    } catch (err) {
      console.error('Error fetching tournaments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamsBySport = async (sport) => {
    setLoadingTeams(true);
    try {
      const token = sessionStorage.getItem('token');
      const capitalizedSport = sport.charAt(0).toUpperCase() + sport.slice(1).toLowerCase();
      const response = await fetch(`${API_BASE_URL}/api/teams?sport=${capitalizedSport}&limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setAvailableTeams(data.data);
      } else {
        setAvailableTeams([]);
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
      setAvailableTeams([]);
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'sport') {
      fetchTeamsBySport(value);
      setSelectedTeams([]);
    }
  };

  const handleTeamSelection = (teamId) => {
    setSelectedTeams(prev => {
      if (prev.includes(teamId)) {
        return prev.filter(id => id !== teamId);
      } else {
        return [...prev, teamId];
      }
    });
  };

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const regDeadline = new Date(formData.registrationDeadline);
    
    if (endDate < startDate) {
      alert('End date must be after or equal to start date');
      return;
    }
    
    if (regDeadline > startDate) {
      alert('Registration deadline must be before or equal to start date');
      return;
    }
    
    try {
      const token = sessionStorage.getItem('token');
      const tournamentData = {
        ...formData,
        teams: selectedTeams,
        status: 'upcoming'
      };
      const response = await fetch(`${API_BASE_URL}/api/tournaments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tournamentData),
      });
      const data = await response.json();
      
      if (data.success) {
        setViewMode('list');
        resetForm();
        fetchTournaments();
      } else {
        alert(data.message || 'Failed to create tournament');
      }
    } catch (err) {
      console.error('Error creating tournament:', err);
      alert('Error creating tournament');
    }
  };

  const handleEditTournament = async (e) => {
    e.preventDefault();
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const regDeadline = new Date(formData.registrationDeadline);
    
    if (endDate < startDate) {
      alert('End date must be after or equal to start date');
      return;
    }
    
    if (regDeadline > startDate) {
      alert('Registration deadline must be before or equal to start date');
      return;
    }
    
    try {
      const token = sessionStorage.getItem('token');
      const tournamentData = {
        ...formData,
        teams: selectedTeams
      };
      const response = await fetch(`${API_BASE_URL}/api/tournaments/${editingTournament._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tournamentData),
      });
      const data = await response.json();
      
      if (data.success) {
        setViewMode('list');
        setEditingTournament(null);
        resetForm();
        fetchTournaments();
      } else {
        alert(data.message || 'Failed to update tournament');
      }
    } catch (err) {
      console.error('Error updating tournament:', err);
      alert('Error updating tournament');
    }
  };

  const handleDeleteTournament = async (id) => {
    if (!confirm('Are you sure you want to delete this tournament?')) {
      return;
    }
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/tournaments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        fetchTournaments();
      } else {
        alert(data.message || 'Failed to delete tournament');
      }
    } catch (err) {
      console.error('Error deleting tournament:', err);
      alert('Error deleting tournament');
    }
  };

  const openEditForm = (tournament) => {
    setEditingTournament(tournament);
    setFormData({
      name: tournament.name,
      description: tournament.description || '',
      sport: tournament.sport,
      startDate: tournament.startDate.split('T')[0],
      endDate: tournament.endDate.split('T')[0],
      registrationDeadline: tournament.registrationDeadline.split('T')[0],
      venue: tournament.venue,
      maxTeams: tournament.maxTeams,
      format: tournament.format,
      prizePool: tournament.prizePool || '',
      rules: tournament.rules || '',
      contactEmail: tournament.contactEmail || '',
      contactPhone: tournament.contactPhone || '',
    });
    fetchTeamsBySport(tournament.sport);
    setSelectedTeams(tournament.teams?.map(team => team._id || team) || []);
    setViewMode('form');
  };

  const openCreateForm = () => {
    setEditingTournament(null);
    resetForm();
    fetchTeamsBySport('football');
    setViewMode('form');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      sport: 'Football',
      startDate: '',
      endDate: '',
      registrationDeadline: '',
      venue: '',
      maxTeams: 16,
      format: 'knockout',
      prizePool: '',
      rules: '',
      contactEmail: '',
      contactPhone: '',
    });
    setSelectedTeams([]);
    setAvailableTeams([]);
  };

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {viewMode === 'list' && (
        <>
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Tournament Management</h2>
                <p className="text-slate-500">Create and manage tournaments ({tournaments.length} total)</p>
            </div>
            <button 
                onClick={openCreateForm}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center shadow-sm"
            >
                <Icons.Plus className="w-5 h-5 mr-2" />
                Create Tournament
            </button>
          </div>

          {/* Tournaments List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-500">Loading tournaments...</p>
                </div>
            ) : tournaments.length === 0 ? (
                <div className="text-center py-20">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icons.RealTrophy className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No tournaments found</h3>
                    <p className="text-slate-500 mt-1 mb-6">Get started by creating your first tournament</p>
                    <button
                        onClick={openCreateForm}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center"
                    >
                        <Icons.Plus className="w-5 h-5 mr-2" />
                        Create Tournament
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tournament</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Sport</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Dates</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Venue</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Teams</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {tournaments.map((tournament) => (
                                <tr key={tournament._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-4">
                                                <Icons.RealTrophy className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">{tournament.name}</div>
                                                <div className="text-xs text-slate-500 capitalize">{tournament.format.replace('_', ' ')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 capitalize">
                                            {tournament.sport}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-900">{new Date(tournament.startDate).toLocaleDateString()}</div>
                                        <div className="text-xs text-slate-500">to {new Date(tournament.endDate).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {tournament.venue}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-slate-600">
                                            <span className="font-bold mr-1">{tournament.teams?.length || 0}</span>
                                            <span className="text-slate-400">/ {tournament.maxTeams}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
                                            tournament.status === 'ongoing' ? 'bg-green-50 text-green-700 border-green-100' :
                                            tournament.status === 'upcoming' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            tournament.status === 'completed' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                            'bg-yellow-50 text-yellow-700 border-yellow-100'
                                        }`}>
                                            {tournament.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedTournamentForSchedule(tournament);
                                                setViewMode('schedule');
                                            }}
                                            className="text-slate-400 hover:text-blue-600 transition-colors"
                                            title="Schedule"
                                        >
                                            <Icons.Calendar className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => openEditForm(tournament)}
                                            className="text-slate-400 hover:text-indigo-600 transition-colors"
                                            title="Edit"
                                        >
                                            <Icons.Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTournament(tournament._id)}
                                            className="text-slate-400 hover:text-red-600 transition-colors"
                                            title="Delete"
                                        >
                                            <Icons.Trash className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
          </div>
        </>
      )}

      {/* Tournament Form (Inline) */}
      {viewMode === 'form' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 animate-fade-in">
          <div className="bg-white/95 backdrop-blur border-b border-slate-100 px-8 py-6 flex justify-between items-center rounded-t-2xl">
            <h3 className="text-2xl font-bold text-slate-900">
              {editingTournament ? 'Edit Tournament' : 'Create New Tournament'}
            </h3>
            <button
              onClick={() => {
                setViewMode('list');
                setEditingTournament(null);
                resetForm();
              }}
              className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200 hover:border-slate-300"
            >
              <Icons.Close className="w-5 h-5 mr-2" />
              Cancel
            </button>
          </div>
          
          <form onSubmit={editingTournament ? handleEditTournament : handleCreateTournament} className="p-8">
              <div className="space-y-8">
                {/* Basic Information Section */}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                      <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3 text-sm font-bold">1</span>
                      Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Tournament Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                        placeholder="Enter tournament name"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900 bg-white placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Sport <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="sport"
                        value={formData.sport}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-slate-900"
                      >
                        <option value="Football">Football</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Cricket">Cricket</option>
                        <option value="Tennis">Tennis</option>
                        <option value="Volleyball">Volleyball</option>
                        <option value="Hockey">Hockey</option>
                        <option value="Badminton">Badminton</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows="3"
                      placeholder="Brief description of the tournament"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900 bg-white placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Date Information Section */}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                      <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3 text-sm font-bold">2</span>
                      Schedule & Dates
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Registration Deadline <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="registrationDeadline"
                        value={formData.registrationDeadline}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Venue and Configuration Section */}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                      <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3 text-sm font-bold">3</span>
                      Venue & Configuration
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Venue <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="venue"
                        value={formData.venue}
                        onChange={handleFormChange}
                        required
                        placeholder="Stadium or venue name"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900 bg-white placeholder-slate-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Max Teams <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="maxTeams"
                                value={formData.maxTeams}
                                onChange={handleFormChange}
                                min="2"
                                max="64"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900 bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Format <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="format"
                                value={formData.format}
                                onChange={handleFormChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-slate-900"
                            >
                                <option value="knockout">Knockout</option>
                                <option value="round_robin">Round Robin</option>
                                <option value="league">League</option>
                                <option value="group_stage">Group Stage</option>
                            </select>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Team Selection Section */}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                      <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3 text-sm font-bold">4</span>
                      Select Teams
                  </h4>
                  <p className="text-sm text-slate-500 mb-4">
                    Select teams for this tournament. Only teams matching the selected sport ({formData.sport}) are shown.
                  </p>
                  {loadingTeams ? (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-slate-500 text-sm">Loading teams...</p>
                    </div>
                  ) : availableTeams.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                      <p className="text-slate-500 text-sm">No teams available for {formData.sport}</p>
                      <p className="text-xs text-slate-400 mt-1">Teams need to be created first</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto border border-slate-200 rounded-xl p-4 bg-slate-50">
                      {availableTeams.map((team) => (
                        <label
                          key={team._id}
                          className={`
                            flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all
                            ${selectedTeams.includes(team._id) 
                                ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                : 'bg-white border-slate-200 hover:border-blue-300'}
                          `}
                        >
                          <input
                            type="checkbox"
                            checked={selectedTeams.includes(team._id)}
                            onChange={() => handleTeamSelection(team._id)}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${selectedTeams.includes(team._id) ? 'text-blue-700' : 'text-slate-900'}`}>
                              {team.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {team.shortName}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-slate-500 mt-2 text-right">
                    Selected: <span className="font-bold text-slate-900">{selectedTeams.length}</span> / {formData.maxTeams} teams
                  </p>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('list');
                      setEditingTournament(null);
                      resetForm();
                    }}
                    className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-600/20"
                  >
                    {editingTournament ? 'Update Tournament' : 'Create Tournament'}
                  </button>
                </div>
              </div>
            </form>
        </div>
      )}

      {/* Match Scheduler (Inline) */}
      {viewMode === 'schedule' && selectedTournamentForSchedule && (
        <MatchScheduler
          tournament={selectedTournamentForSchedule}
          onClose={() => {
            setSelectedTournamentForSchedule(null);
            setViewMode('list');
          }}
        />
      )}
    </div>
  );
};

export default TournamentManagement;
