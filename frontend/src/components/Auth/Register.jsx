import { useState } from 'react';
import { API_BASE_URL } from '../../config/api';
import sportsLogo from '../../assets/sports.png';

const Register = ({ onSuccess, onSwitchToLogin, onBackToLanding }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError('Please fill in all fields');
      return;
    }

    // Email validation - must be valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Password validation - minimum 8 characters, at least one uppercase, one lowercase, one number
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    if (!/[a-z]/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter');
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one number');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.data.user));
        
        if (onSuccess) {
          onSuccess(data.data.user);
        }
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full h-full flex flex-col lg:flex-row-reverse items-center gap-4 lg:gap-6 py-4">
        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 h-full flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src={sportsLogo} alt="SportsPro" className="h-14 w-auto" />
              <span className="text-2xl font-bold text-gray-900">SportsPro</span>
            </div>
            
            <div className="bg-white py-6 px-6 shadow-2xl rounded-2xl border border-gray-100 sm:px-12">
              <div className="mb-4 text-center">
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  Create your account!
                </h2>
              </div>

          <form className="space-y-3.5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-xs">
                {error}
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-0.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-0.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Role Selection - This is the key part! */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Register as
              </label>
              <div className="space-y-1.5">
                <div className="relative flex items-center p-2 border-2 border-gray-200 rounded-lg hover:border-purple-500 transition-colors cursor-pointer">
                  <input
                    id="coach"
                    name="role"
                    type="radio"
                    value="coach"
                    checked={formData.role === 'coach'}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <label htmlFor="coach" className="ml-3 block text-xs text-gray-700 cursor-pointer flex-1">
                    <span className="font-semibold text-gray-900">Coach / Team Manager</span>
                    <p className="text-xs text-gray-500 mt-0">Manage teams and organize matches</p>
                  </label>
                </div>
                
                <div className="relative flex items-center p-2 border-2 border-gray-200 rounded-lg hover:border-purple-500 transition-colors cursor-pointer">
                  <input
                    id="player"
                    name="role"
                    type="radio"
                    value="player"
                    checked={formData.role === 'player'}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <label htmlFor="player" className="ml-3 block text-xs text-gray-700 cursor-pointer flex-1">
                    <span className="font-semibold text-gray-900">Player</span>
                    <p className="text-xs text-gray-500 mt-0">Join teams and participate in tournaments</p>
                  </label>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-0.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Create a strong password"
                />
              </div>
              <p className="mt-0.5 text-xs text-gray-500">
                Must be at least 8 characters with uppercase, lowercase, and a number
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 mb-0.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-0.5">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-lg text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02]"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          {/* Switch to Login */}
          <div className="mt-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
            <div className="mt-2 text-center space-y-1.5">
              <button
                onClick={onSwitchToLogin}
                className="text-purple-600 hover:text-purple-700 text-xs font-semibold transition-colors"
              >
                Sign in instead
              </button>
              <br />
              <button
                onClick={onBackToLanding}
                className="text-gray-500 hover:text-gray-700 text-xs font-medium transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
          </div>
        </div>
        </div>

        {/* Left Side - Image */}
        <div className="hidden lg:flex w-full lg:w-1/2 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full h-full max-h-[90vh]">
            <img 
              src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop" 
              alt="Team Celebration" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/75 via-purple-900/50 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-12">
              <h3 className="text-5xl font-bold text-white mb-5 leading-tight">Join the Winning Team</h3>
              <p className="text-xl text-purple-100 leading-relaxed max-w-lg">Connect with coaches, track your progress, and become part of a thriving sports community.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;