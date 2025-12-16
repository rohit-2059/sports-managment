const StatCard = ({ title, value, icon, colorFrom }) => {
    // Map colors to subtle tinted styles
    let theme = {
        bg: 'bg-white',
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
        border: 'hover:border-blue-200'
    };

    if (colorFrom.includes('green')) {
        theme = { ...theme, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', border: 'hover:border-emerald-200' };
    } else if (colorFrom.includes('purple')) {
        theme = { ...theme, iconBg: 'bg-violet-50', iconColor: 'text-violet-600', border: 'hover:border-violet-200' };
    }

    return (
        <div className={`group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden ${theme.border}`}>
            {/* Soft tint background decoration */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-[0.03] transform translate-x-10 -translate-y-10 pointer-events-none ${colorFrom.includes('green') ? 'bg-emerald-500' : colorFrom.includes('purple') ? 'bg-violet-500' : 'bg-blue-500'}`} />

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
                    <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${theme.iconBg} ${theme.iconColor} transition-transform group-hover:scale-110 duration-300`}>
                    {icon}
                </div>
            </div>

            {/* Bottom decoration line */}
            <div className="mt-4 flex gap-1">
                <div className={`h-1 w-8 rounded-full ${colorFrom.includes('green') ? 'bg-emerald-500' : colorFrom.includes('purple') ? 'bg-violet-500' : 'bg-blue-500'} opacity-80`}></div>
                <div className="h-1 w-2 bg-slate-100 rounded-full"></div>
            </div>
        </div>
    );
};

export default StatCard;
