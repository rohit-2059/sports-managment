import { useState } from 'react';

function LandingPage({ onSwitchToLogin, onSwitchToRegister }) {
  const [showLogin, setShowLogin] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuth = () => {
    setIsLogin(!isLogin);
  };

  const openAuth = (type) => {
    if (type === 'login') {
      if (onSwitchToLogin) {
        onSwitchToLogin();
      }
    } else {
      if (onSwitchToRegister) {
        onSwitchToRegister();
      }
    }
  };

  const closeAuth = () => {
    setShowLogin(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(isLogin ? 'Login submitted' : 'Register submitted');
    closeAuth();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-md border-b border-gray-800 z-50 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-8">
          <div className="flex items-center gap-2 text-xl font-bold">
            <span className="text-4xl bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">⚽</span>
            <span className="text-white">SportsPro</span>
          </div>
          <div className="flex gap-4">
            <button 
              className="px-6 py-3 border border-gray-700 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 hover:-translate-y-0.5"
              onClick={() => openAuth('login')}
            >
              Login
            </button>
            <button 
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/30"
              onClick={() => openAuth('register')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex items-center min-h-screen px-8 max-w-6xl mx-auto gap-16">
        <div className="flex-1 max-w-2xl">
          <h1 className="text-6xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              Manage Your Sports
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Like a Pro
            </span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-10">
            Complete sports management solution for teams, players, and tournaments.
            Track performance, manage schedules, and dominate the field.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button 
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl text-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary-500/40"
              onClick={() => openAuth('register')}
            >
              Get Started Free
            </button>
            <button 
              className="px-8 py-4 bg-transparent border-2 border-gray-700 rounded-xl text-lg font-semibold hover:bg-gray-800 hover:border-gray-600 transition-all duration-300 hover:-translate-y-0.5"
              onClick={() => openAuth('login')}
            >
              Sign In
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center items-center">
          <div className="grid grid-cols-3 gap-8 p-8">
            {['🏀', '⚽', '🏈', '🏐', '🎾', '🏓'].map((icon, index) => (
              <div 
                key={index}
                className={`w-28 h-28 flex items-center justify-center text-6xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-primary-500/20 ${
                  index % 2 === 0 ? 'animate-float' : 'animate-float [animation-delay:1.5s]'
                }`}
              >
                {icon}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
            Why Choose SportsPro?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '📊', title: 'Performance Analytics', desc: 'Track player statistics and team performance with advanced analytics and insights.' },
              { icon: '📅', title: 'Schedule Management', desc: 'Organize games, practices, and events with our intelligent scheduling system.' },
              { icon: '👥', title: 'Team Coordination', desc: 'Keep your team connected with messaging, notifications, and real-time updates.' },
              { icon: '🏆', title: 'Tournament Mode', desc: 'Create and manage tournaments with brackets, scoring, and live updates.' }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-10 rounded-2xl border border-gray-700 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-500"
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm" onClick={closeAuth}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-10 w-full max-w-md relative animate-modal-slide-in" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 transition-all duration-300"
              onClick={closeAuth}
            >
              ✕
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 text-white">
                {isLogin ? 'Welcome Back' : 'Join SportsPro'}
              </h2>
              <p className="text-gray-400">
                {isLogin ? 'Sign in to your account' : 'Create your account'}
              </p>
            </div>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-4 border border-gray-700 rounded-lg bg-black text-white text-lg focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300"
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-4 border border-gray-700 rounded-lg bg-black text-white text-lg focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300"
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-4 border border-gray-700 rounded-lg bg-black text-white text-lg focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300"
                required
              />
              {!isLogin && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full p-4 border border-gray-700 rounded-lg bg-black text-white text-lg focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300"
                  required
                />
              )}
              
              <button 
                type="submit" 
                className="w-full p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg text-white text-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 hover:-translate-y-0.5 mt-6"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="text-center mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button" 
                  className="text-primary-500 font-medium underline hover:text-secondary-500 transition-colors duration-300"
                  onClick={toggleAuth}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xl font-bold">
              <span className="text-3xl bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">⚽</span>
              <span className="text-white">SportsPro</span>
            </div>
            <p className="text-gray-600">&copy; 2024 SportsPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;