import { useState } from 'react';
import { ICONS } from '../../utils/icons.jsx';

const MatchCalendar = ({ matches, teams, selectedDate, onDateSelect, viewMode = 'month' }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Helper functions
    const isSameDay = (date1, date2) => {
        if (!date1 || !date2) return false;
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    const getMatchesForDate = (date) => {
        return matches.filter(match => isSameDay(match.scheduledDate, date));
    };

    const getMatchColor = (match) => {
        const isHomeOwned = teams.some(t => t._id === match.homeTeam?._id);
        const isAwayOwned = teams.some(t => t._id === match.awayTeam?._id);
        const isBothOwned = isHomeOwned && isAwayOwned;

        if (isBothOwned) return 'amber'; // Internal match
        if (match.status === 'completed') return 'green';
        return 'blue'; // Upcoming
    };

    // Calendar generation
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days in month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const getWeekDays = (date) => {
        const days = [];
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            days.push(day);
        }

        return days;
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const navigateWeek = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction * 7));
        setCurrentDate(newDate);
    };

    const days = viewMode === 'month' ? getDaysInMonth(currentDate) : getWeekDays(currentDate);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Match Calendar</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => viewMode === 'month' ? navigateMonth(-1) : navigateWeek(-1)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Previous"
                        >
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="px-4 py-2 bg-slate-50 rounded-lg font-semibold text-slate-700 min-w-[140px] text-center">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </div>
                        <button
                            onClick={() => viewMode === 'month' ? navigateMonth(1) : navigateWeek(1)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Next"
                        >
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Today Button */}
                <button
                    onClick={() => {
                        setCurrentDate(new Date());
                        onDateSelect(null);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    Today
                </button>
            </div>

            {/* Day Headers */}
            <div className={`grid ${viewMode === 'month' ? 'grid-cols-7' : 'grid-cols-7'} gap-2 mb-2`}>
                {dayNames.map(day => (
                    <div key={day} className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className={`grid ${viewMode === 'month' ? 'grid-cols-7' : 'grid-cols-7'} gap-2`}>
                {days.map((date, index) => {
                    if (!date) {
                        return <div key={`empty-${index}`} className="aspect-square" />;
                    }

                    const dayMatches = getMatchesForDate(date);
                    const isSelected = selectedDate && isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, new Date());
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();

                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => onDateSelect(date)}
                            className={`aspect-square p-2 rounded-lg transition-all relative group ${isSelected
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : isToday
                                        ? 'bg-blue-50 text-blue-700 border-2 border-blue-300'
                                        : isCurrentMonth
                                            ? 'hover:bg-slate-50 text-slate-700'
                                            : 'text-slate-300'
                                }`}
                        >
                            <div className="text-sm font-semibold">{date.getDate()}</div>

                            {/* Match Indicators */}
                            {dayMatches.length > 0 && (
                                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                                    {dayMatches.slice(0, 3).map((match, idx) => {
                                        const color = getMatchColor(match);
                                        return (
                                            <div
                                                key={idx}
                                                className={`w-1.5 h-1.5 rounded-full ${color === 'blue' ? 'bg-blue-500' :
                                                        color === 'green' ? 'bg-green-500' :
                                                            'bg-amber-500'
                                                    } ${isSelected ? 'bg-white' : ''}`}
                                            />
                                        );
                                    })}
                                    {dayMatches.length > 3 && (
                                        <div className={`text-[8px] font-bold ${isSelected ? 'text-white' : 'text-slate-600'}`}>
                                            +{dayMatches.length - 3}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Hover Tooltip */}
                            {dayMatches.length > 0 && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                    <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                                        {dayMatches.length} match{dayMatches.length > 1 ? 'es' : ''}
                                    </div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-500 mb-2">Legend</div>
                <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-slate-600">Upcoming</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-slate-600">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-slate-600">Internal</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchCalendar;
