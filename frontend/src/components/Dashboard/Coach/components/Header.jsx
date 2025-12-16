import { ICONS } from '../utils/icons.jsx';

const Header = ({ user, onLogout, onOpenProfileEdit }) => {
    return (
        <header className="bg-slate-900 sticky top-0 z-50 shadow-md border-b border-slate-800/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-18 py-3">
                    {/* Brand */}
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
                            {ICONS.DASHBOARD_LOGO}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight leading-none">Coach Portal</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <p className="text-[10px] font-bold text-blue-200/80 uppercase tracking-widest">Team Manager</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Profile Section with Divider */}
                        <div className="flex items-center gap-4 pl-6 border-l border-slate-700/50 h-10">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-200 leading-tight">{user.name}</p>
                                <p className="text-xs text-slate-500 font-medium">Head Coach</p>
                            </div>
                            <div className="relative group cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-all shadow-inner">
                                    {ICONS.USER_ADD}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
                            </div>
                        </div>

                        <button
                            onClick={onOpenProfileEdit}
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
                            <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
