/**
 * Icon Components
 * Centralized SVG icons for the Baby Tracker app
 */

// Primary Action Icons
const Play = ({ size = 28, className = "", ...props }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className={className}
        {...props}
    >
        <polygon points="5,3 19,12 5,21 5,3"></polygon>
    </svg>
);

const Pause = ({ size = 24, className = "", ...props }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className={className}
        {...props}
    >
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
);

const RotateCcw = ({ size = 24, className = "", ...props }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className={className}
        {...props}
    >
        <polyline points="1,4 1,10 7,10"></polyline>
        <path d="M3.51,15a9,9,0,0,0,14.85-3.36,9,9,0,0,0-5.51-11.48"></path>
    </svg>
);

const Calendar = ({ size = 20, className = "", ...props }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className={className}
        {...props}
    >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

const Clock = ({ size = 20, className = "", ...props }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className={className}
        {...props}
    >
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12,6 12,12 16,14"></polyline>
    </svg>
);

const Home = ({ size = 20, className = "", ...props }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className={className}
        {...props}
    >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9,22 9,12 15,12 15,22"></polyline>
    </svg>
);

const ChevronDown = ({ size = 16, className = "", ...props }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className={className}
        {...props}
    >
        <polyline points="6,9 12,15 18,9"></polyline>
    </svg>
);

const ChevronUp = ({ size = 16, className = "", ...props }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className={className}
        {...props}
    >
        <polyline points="18,15 12,9 6,15"></polyline>
    </svg>
);

const Baby = ({ size = 32, className = "", ...props }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className={className}
        {...props}
    >
        <path d="M9 12a4 4 0 1 1 8 0c0 1.5-2 4-4 4s-4-2.5-4-4Z"></path>
        <path d="M8 14v.5c0 .5.5 1 1 1h6c.5 0 1-.5 1-1V14"></path>
        <path d="M16 12V9a4 4 0 1 0-8 0v3"></path>
    </svg>
);

const Bottle = ({ size = 28, className = "", ...props }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className={className}
        {...props}
    >
        <path d="M5 17v-4a8 8 0 1 1 16 0v4H5Z"></path>
        <path d="M5 17h16v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2Z"></path>
        <path d="M12 1v4"></path>
        <path d="M10 5h4"></path>
    </svg>
);

const Diaper = ({ size = 28, className = "", ...props }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className={className}
        {...props}
    >
        <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z"></path>
        <path d="M8 7v10"></path>
        <path d="M16 7v10"></path>
        <circle cx="12" cy="12" r="2"></circle>
    </svg>
);

const Sleep = ({ size = 28, className = "", ...props }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className={className}
        {...props}
    >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
    </svg>
);

// Export all icons
if (typeof window !== 'undefined') {
    window.Icons = {
        Play,
        Pause,
        RotateCcw,
        Calendar,
        Clock,
        Home,
        ChevronDown,
        ChevronUp,
        Baby,
        Bottle,
        Diaper,
        Sleep
    };
}