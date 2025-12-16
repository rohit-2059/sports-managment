import { ICONS } from '../../Coach/utils/icons.jsx';

const NavigationTabs = ({ activeView, setActiveView }) => {
    return (
        <div className="flex justify-center mb-8">
            <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-full border border-slate-200 shadow-lg shadow-slate-200/50 inline-flex relative">
                <button
                    onClick={() => setActiveView('profile')}
                    className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeView === 'profile'
                            ? 'bg-slate-800 text-white shadow-md'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                >
                    <span className={activeView === 'profile' ? 'text-emerald-400' : 'text-slate-400'}>{ICONS.PLAYERS}</span>
                    <span>Profile</span>
                </button>
                <button
                    onClick={() => setActiveView('matches')}
                    className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeView === 'matches'
                            ? 'bg-slate-800 text-white shadow-md'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                >
                    <span className={activeView === 'matches' ? 'text-blue-400' : 'text-slate-400'}>{ICONS.CALENDAR}</span>
                    <span>My Matches</span>
                </button>
                <button
                    onClick={() => setActiveView('stats')}
                    className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeView === 'stats'
                            ? 'bg-slate-800 text-white shadow-md'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                >
                    <span className={activeView === 'stats' ? 'text-indigo-400' : 'text-slate-400'}>{ICONS.STATS_CHART}</span>
                    <span>My Stats</span>
                </button>
            </div>
        </div>
    );
};

export default NavigationTabs;
