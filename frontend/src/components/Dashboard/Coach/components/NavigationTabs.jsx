import { ICONS } from '../utils/icons.jsx';

const NavigationTabs = ({ activeView, setActiveView, teamsCount }) => {
    const tabs = [
        { id: 'overview', label: 'Overview', icon: ICONS.STATS_CHART },
        { id: 'teams', label: 'My Teams', icon: ICONS.TROPHY, count: teamsCount },
        { id: 'players', label: 'Players', icon: ICONS.PLAYERS },
        { id: 'matches', label: 'Matches', icon: ICONS.CALENDAR },
        { id: 'stats', label: 'Performance', icon: ICONS.STATS_CHART },
    ];

    return (
        <div className="mb-8 flex justify-center sticky top-20 z-30 pt-4">
            <nav className="flex items-center p-1.5 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/60 ring-1 ring-slate-100">
                {tabs.map((tab) => {
                    const isActive = activeView === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveView(tab.id)}
                            className={`
                                relative flex items-center px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300
                                ${isActive
                                    ? 'bg-slate-800 text-white shadow-lg shadow-slate-200'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                }
                            `}
                        >
                            <span className={`mr-2.5 ${isActive ? 'text-blue-300' : 'text-slate-400'}`}>
                                {tab.icon}
                            </span>
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-md border font-bold ${isActive
                                        ? 'bg-slate-700 border-slate-600 text-slate-200'
                                        : 'bg-slate-100 border-slate-200 text-slate-500'
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default NavigationTabs;
