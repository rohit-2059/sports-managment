import { useState } from 'react';
import { API_BASE_URL } from '../../config/api';
import sportsLogo from '../../assets/sports.png';

const Login = ({ onSuccess, onSwitchToRegister, onBackToLanding }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
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
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src={sportsLogo} alt="SportsPro" className="h-16 w-auto" />
              <span className="text-3xl font-bold text-gray-900">SportsPro</span>
            </div>
            
            <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl border border-gray-100 sm:px-12">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Welcome Back!
                </h2>
              </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-6 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02]"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Switch to Register */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">New to SportsPro?</span>
              </div>
            </div>
            <div className="mt-4 text-center space-y-2.5">
              <button
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors"
              >
                Create an account
              </button>
              <br />
              <button
                onClick={onBackToLanding}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:flex w-full lg:w-1/2 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl w-full h-[700px]">
            <img 
              src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop" 
              alt="Sports Stadium" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/75 via-blue-900/50 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-12">
              <h3 className="text-5xl font-bold text-white mb-5 leading-tight">Manage Your Sports Journey</h3>
              <p className="text-xl text-blue-100 leading-relaxed max-w-lg">Track performance, organize tournaments, and lead your team to victory with SportsPro's comprehensive platform.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;