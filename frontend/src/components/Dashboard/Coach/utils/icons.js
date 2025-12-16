export const ICONS = {
  DASHBOARD_LOGO: '🎽',
  TROPHY: '🏆',
  PLAYERS: '👥',
  STATS_CHART: '📈',
  ADD: '➕',
  USER_ADD: '👤',
  REMOVE: '🗑️',
  CALENDAR: '📅',
  REFRESH: '🔄',
  VS: 'VS',
  LOCATION: '📍',
  TIME: '⏰',
  RESULT: 'Result:',
};

// Function that returns JSX for close icon
export const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
