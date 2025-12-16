// Helper to create SVG icons consistently
const IconWrapper = ({ children, className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);

export const ICONS = {
    DASHBOARD_LOGO: (
        <IconWrapper className="w-6 h-6">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </IconWrapper>
    ),
    TROPHY: (
        <IconWrapper>
            <path d="M8 21h8M12 17v4M7 4h10M17 4v3a5 5 0 0 1-10 0V4" />
            <path d="M5 9a2 2 0 0 1 0-2H4a2 2 0 0 1 0 2v2a2 2 0 0 1 2 2h0" />
            <path d="M19 9a2 2 0 0 0 0-2h1a2 2 0 0 0 0 2v2a2 2 0 0 0-2 2h0" />
        </IconWrapper>
    ),
    PLAYERS: (
        <IconWrapper>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </IconWrapper>
    ),
    STATS_CHART: (
        <IconWrapper>
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
        </IconWrapper>
    ),
    ADD: (
        <IconWrapper>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </IconWrapper>
    ),
    USER_ADD: (
        <IconWrapper>
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
        </IconWrapper>
    ),
    REMOVE: (
        <IconWrapper>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </IconWrapper>
    ),
    EDIT: (
        <IconWrapper>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </IconWrapper>
    ),
    CALENDAR: (
        <IconWrapper>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </IconWrapper>
    ),
    REFRESH: (
        <IconWrapper>
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </IconWrapper>
    ),
    LOCATION: (
        <IconWrapper>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </IconWrapper>
    ),
    TIME: (
        <IconWrapper>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </IconWrapper>
    ),
    SPORTS: {
        FOOTBALL: <IconWrapper><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></IconWrapper>,
        BASKETBALL: <IconWrapper><circle cx="12" cy="12" r="10" /><path d="M5.65 5.65a10 10 0 0 0 12.7 12.7" /><path d="M20 12a8 8 0 0 0-8-8" /><path d="M4 12a8 8 0 0 1 8 8" /><path d="M12 2v20" /></IconWrapper>,
        CRICKET: <IconWrapper><line x1="12" y1="22" x2="12" y2="2" /><path d="M12 2l-5 5h10z" /></IconWrapper>, // Simplified cricket bat approximation or stump
        DEFAULT: <IconWrapper><circle cx="12" cy="12" r="10" /></IconWrapper>
    }
};

// Function that returns JSX for close icon
export const CloseIcon = () => (
    <IconWrapper>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </IconWrapper>
);
