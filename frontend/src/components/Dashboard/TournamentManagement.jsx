import { useState, useEffect } from 'react';
import MatchScheduler from './MatchScheduler';

const TournamentManagement = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [showTournaments, setShowTournaments] = useState(false);
  const [showTournamentForm, setShowTournamentForm] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const [selectedTournamentForSchedule, setSelectedTournamentForSchedule] = useState(null);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sport: 'football',
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
      const response = await fetch('http://localhost:3001/api/tournaments', {
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
      // Capitalize first letter to match database enum values
      const capitalizedSport = sport.charAt(0).toUpperCase() + sport.slice(1).toLowerCase();
      console.log('Fetching teams for sport:', capitalizedSport);
      const response = await fetch(`http://localhost:3001/api/teams?sport=${capitalizedSport}&limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('Teams response:', data);
      
      if (data.success) {
        setAvailableTeams(data.data);
      } else {
        console.error('Failed to fetch teams:', data.error || data.message);
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
    
    // Fetch teams when sport changes
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
    
    // Client-side date validation
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
      const response = await fetch('http://localhost:3001/api/tournaments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tournamentData),
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Tournament created successfully!');
        setShowTournamentForm(false);
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
    
    // Client-side date validation
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
      const response = await fetch(`http://localhost:3001/api/tournaments/${editingTournament._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tournamentData),
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Tournament updated successfully!');
        setShowTournamentForm(false);
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
      const response = await fetch(`http://localhost:3001/api/tournaments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Tournament deleted successfully!');
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
    // Fetch teams for the tournament's sport and set selected teams
    fetchTeamsBySport(tournament.sport);
    setSelectedTeams(tournament.teams?.map(team => team._id || team) || []);
    setShowTournamentForm(true);
  };

  const openCreateForm = () => {
    setEditingTournament(null);
    resetForm();
    fetchTeamsBySport('football'); // Fetch football teams by default
    setShowTournamentForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      sport: 'football',
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
    <div className="space-y-6">
      {/* Tournament Management Card */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-4xl">🏆</div>
              </div>
              <div className="ml-5">
                <h2 className="text-2xl font-bold text-gray-900">
                  Tournament Management
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Create and manage tournaments ({tournaments.length} total)
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex space-x-3">
            <button 
              onClick={openCreateForm}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              ➕ Create New Tournament
            </button>
            <button 
              onClick={() => setShowTournaments(!showTournaments)}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              {showTournaments ? '👁️ Hide Tournaments' : '👁️ View All Tournaments'}
            </button>
          </div>
        </div>
      </div>

      {/* Tournament Form Modal */}
      {showTournamentForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingTournament ? '✏️ Edit Tournament' : '➕ Create New Tournament'}
              </h3>
              <button
                onClick={() => {
                  setShowTournamentForm(false);
                  setEditingTournament(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 text-3xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={editingTournament ? handleEditTournament : handleCreateTournament} className="p-6">
              <div className="space-y-6">
                {/* Basic Information Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tournament Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                        placeholder="Enter tournament name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sport <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="sport"
                        value={formData.sport}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-gray-900"
                      >
                        <option value="football">⚽ Football</option>
                        <option value="basketball">🏀 Basketball</option>
                        <option value="cricket">🏏 Cricket</option>
                        <option value="tennis">🎾 Tennis</option>
                        <option value="volleyball">🏐 Volleyball</option>
                        <option value="other">🏅 Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows="3"
                      placeholder="Brief description of the tournament"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
                    />
                  </div>
                </div>

                {/* Date Information Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Schedule & Dates</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Deadline <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="registrationDeadline"
                        value={formData.registrationDeadline}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Venue and Configuration Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Venue & Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Venue <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="venue"
                        value={formData.venue}
                        onChange={handleFormChange}
                        required
                        placeholder="Stadium or venue name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Format <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="format"
                        value={formData.format}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-gray-900"
                      >
                        <option value="knockout">🏆 Knockout</option>
                        <option value="round_robin">🔄 Round Robin</option>
                        <option value="league">📊 League</option>
                        <option value="group_stage">👥 Group Stage</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Team Selection Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Select Teams</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Select teams for this tournament. Only teams matching the selected sport ({formData.sport}) are shown.
                  </p>
                  {loadingTeams ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-500">Loading teams...</p>
                    </div>
                  ) : availableTeams.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No teams available for {formData.sport}</p>
                      <p className="text-xs text-gray-400 mt-2">Teams need to be created first</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                      {availableTeams.map((team) => (
                        <label
                          key={team._id}
                          className="flex items-center space-x-3 p-3 bg-white rounded-md border border-gray-200 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTeams.includes(team._id)}
                            onChange={() => handleTeamSelection(team._id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {team.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {team.shortName}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Selected: {selectedTeams.length} / {formData.maxTeams} teams
                  </p>
                </div>

                {/* Additional Information Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Additional Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prize Pool
                      </label>
                      <input
                        type="text"
                        name="prizePool"
                        value={formData.prizePool}
                        onChange={handleFormChange}
                        placeholder="e.g., $10,000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleFormChange}
                        placeholder="contact@tournament.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleFormChange}
                        placeholder="+1 234 567 8900"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rules & Regulations
                    </label>
                    <textarea
                      name="rules"
                      value={formData.rules}
                      onChange={handleFormChange}
                      rows="4"
                      placeholder="Tournament rules, regulations, and guidelines..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 bg-white"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTournamentForm(false);
                      setEditingTournament(null);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition"
                  >
                    {editingTournament ? '💾 Update Tournament' : '➕ Create Tournament'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tournaments List */}
      {showTournaments && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-xl leading-6 font-bold text-gray-900">
              All Tournaments
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage and monitor all tournaments on the platform
            </p>
          </div>
          <div className="border-t border-gray-200">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading tournaments...</p>
              </div>
            ) : tournaments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏆</div>
                <p className="text-gray-500 text-lg">No tournaments created yet</p>
                <button
                  onClick={openCreateForm}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Create First Tournament
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tournament
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sport
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Venue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teams
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tournaments.map((tournament) => (
                      <tr key={tournament._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">🏆</div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {tournament.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {tournament.format.replace('_', ' ')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            {tournament.sport}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{new Date(tournament.startDate).toLocaleDateString()}</div>
                          <div className="text-xs">to {new Date(tournament.endDate).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tournament.venue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="font-medium">{tournament.teams?.length || 0}</span> / {tournament.maxTeams}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            tournament.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                            tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            tournament.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            tournament.status === 'registration_open' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {tournament.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                          <button
                            onClick={() => setSelectedTournamentForSchedule(tournament)}
                            className="text-green-600 hover:text-green-900 transition"
                          >
                            📅 Schedule
                          </button>
                          <button
                            onClick={() => openEditForm(tournament)}
                            className="text-blue-600 hover:text-blue-900 transition"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTournament(tournament._id)}
                            className="text-red-600 hover:text-red-900 transition"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Match Scheduler Modal */}
      {selectedTournamentForSchedule && (
        <MatchScheduler
          tournament={selectedTournamentForSchedule}
          onClose={() => setSelectedTournamentForSchedule(null)}
        />
      )}
    </div>
  );
};

export default TournamentManagement;
