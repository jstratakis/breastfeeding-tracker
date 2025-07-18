/**
 * Main Baby Tracker Application
 * Entry point for the React application
 */

const { useState, useEffect } = React;

const BabyTracker = () => {
    // State management
    const [currentPage, setCurrentPage] = useState('overview');
    const [currentSession, setCurrentSession] = useState(null);
    const [timer, setTimer] = useState(0);
    const [sessions, setSessions] = useState([]);
    const [diaperChanges, setDiaperChanges] = useState([]);
    const [sleepSessions, setSleepSessions] = useState([]);
    const [activeInterval, setActiveInterval] = useState(null);
    const [showFormulaModal, setShowFormulaModal] = useState(false);
    const [formulaAmount, setFormulaAmount] = useState('');
    const [showDiaperModal, setShowDiaperModal] = useState(false);
    const [diaperType, setDiaperType] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [autoTheme, setAutoTheme] = useState(true);

    // Get icons from window object
    const { Play, Pause, RotateCcw, Calendar, Clock, Home, Baby, Bottle, Diaper, Sleep } = window.Icons || {};

    // Smart theme detection
    useEffect(() => {
        const checkTimeBasedTheme = () => {
            if (!autoTheme) return;
            
            const now = new Date();
            const hour = now.getHours();
            
            // Night mode: 7 PM to 7 AM
            const isNightTime = hour >= THEME_CONFIG.NIGHT_START_HOUR || hour < THEME_CONFIG.NIGHT_END_HOUR;
            setDarkMode(isNightTime);
        };

        checkTimeBasedTheme();
        const themeInterval = setInterval(checkTimeBasedTheme, THEME_CONFIG.AUTO_THEME_CHECK_INTERVAL);
        
        return () => clearInterval(themeInterval);
    }, [autoTheme]);

    // Load data from localStorage
    useEffect(() => {
        // Load feeding sessions
        const savedSessions = localStorage.getItem(STORAGE_KEYS.SESSIONS) || localStorage.getItem(STORAGE_KEYS.LEGACY_SESSIONS);
        if (savedSessions) {
            try {
                const parsedSessions = JSON.parse(savedSessions).map(session => ({
                    ...session,
                    startTime: new Date(session.startTime),
                    endTime: session.endTime ? new Date(session.endTime) : null
                }));
                setSessions(parsedSessions);
            } catch (error) {
                console.error('Error loading sessions:', error);
            }
        }

        // Load theme preferences
        const savedThemePrefs = localStorage.getItem(STORAGE_KEYS.THEME_PREFS);
        if (savedThemePrefs) {
            try {
                const { autoTheme: savedAutoTheme, darkMode: savedDarkMode } = JSON.parse(savedThemePrefs);
                setAutoTheme(savedAutoTheme);
                if (!savedAutoTheme) {
                    setDarkMode(savedDarkMode);
                }
            } catch (error) {
                console.error('Error loading theme preferences:', error);
            }
        }
    }, []);

    // Save data to localStorage
    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
        }
    }, [sessions]);

    useEffect(() => {
        const themePrefs = { autoTheme, darkMode };
        localStorage.setItem(STORAGE_KEYS.THEME_PREFS, JSON.stringify(themePrefs));
    }, [autoTheme, darkMode]);

    // Timer effect
    useEffect(() => {
        if (currentSession) {
            const interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, UI_CONSTANTS.TIMER_UPDATE_INTERVAL);
            setActiveInterval(interval);
            return () => clearInterval(interval);
        } else {
            if (activeInterval) {
                clearInterval(activeInterval);
                setActiveInterval(null);
            }
        }
    }, [currentSession]);

    // Utility functions
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getTodaysSessions = () => {
        const today = new Date().toDateString();
        return sessions.filter(session => 
            session.startTime.toDateString() === today
        );
    };

    const getTotalTimeToday = () => {
        const todaysSessions = getTodaysSessions();
        return todaysSessions.reduce((total, session) => total + (session.duration || 0), 0);
    };

    // Feeding functions
    const startSession = (side) => {
        const newSession = {
            id: Date.now(),
            side,
            startTime: new Date(),
            duration: 0
        };
        setCurrentSession(newSession);
        setTimer(0);
    };

    const stopSession = () => {
        if (currentSession && !currentSession.type) {
            const completedSession = {
                ...currentSession,
                duration: timer,
                endTime: new Date()
            };
            setSessions(prev => [completedSession, ...prev]);
            setCurrentSession(null);
            setTimer(0);
        }
    };

    const resetTimer = () => {
        setTimer(0);
    };

    const addFormulaFeed = () => {
        if (formulaAmount && formulaAmount > 0) {
            const formulaSession = {
                id: Date.now(),
                type: 'formula',
                amount: parseInt(formulaAmount),
                startTime: new Date(),
                endTime: new Date(),
                duration: 0
            };
            setSessions(prev => [formulaSession, ...prev]);
            setFormulaAmount('');
            setShowFormulaModal(false);
        }
    };

    // Navigation Component
    const Navigation = () => (
        <div className={`fixed bottom-0 left-0 right-0 border-t px-4 py-2 ${
            darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}>
            <div className="flex justify-around max-w-md mx-auto">
                <button
                    onClick={() => setCurrentPage('overview')}
                    className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                        currentPage === 'overview' 
                            ? (darkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600')
                            : (darkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-600 hover:text-green-600')
                    }`}
                >
                    {Home && <Home />}
                    <span className="text-xs mt-1">Overview</span>
                </button>
                <button
                    onClick={() => setCurrentPage('feeding')}
                    className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                        currentPage === 'feeding' 
                            ? (darkMode ? 'bg-pink-900 text-pink-400' : 'bg-pink-100 text-pink-600')
                            : (darkMode ? 'text-gray-400 hover:text-pink-400' : 'text-gray-600 hover:text-pink-600')
                    }`}
                >
                    {Baby && <Baby />}
                    <span className="text-xs mt-1">Feeding</span>
                </button>
            </div>
        </div>
    );

    // Overview Page
    const OverviewPage = () => (
        <div className="pb-20">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-3">
                    {Home && <Home />}
                    <h1 className={`text-2xl font-bold ml-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Daily Overview
                    </h1>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Today's summary
                </p>

                {/* Theme Toggle */}
                <div className="flex items-center justify-center mt-4 space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Auto Theme
                        </span>
                        <button
                            onClick={() => setAutoTheme(!autoTheme)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                autoTheme ? 'bg-blue-600' : (darkMode ? 'bg-gray-600' : 'bg-gray-200')
                            }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                autoTheme ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                        </button>
                    </div>
                    {!autoTheme && (
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                darkMode 
                                    ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                                    : 'bg-gray-800 text-white hover:bg-gray-900'
                            }`}
                        >
                            {darkMode ? '☀️ Light' : '🌙 Dark'}
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className={`rounded-2xl shadow-lg p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold flex items-center ${
                        darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                        {Baby && <Baby />}
                        <span className="ml-2">Feeding</span>
                    </h3>
                    <button 
                        onClick={() => setCurrentPage('feeding')}
                        className={`text-sm ${
                            darkMode ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-700'
                        }`}
                    >
                        View Details →
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${
                            darkMode ? 'text-pink-400' : 'text-pink-600'
                        }`}>
                            {getTodaysSessions().length}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Sessions
                        </div>
                    </div>
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${
                            darkMode ? 'text-pink-400' : 'text-pink-600'
                        }`}>
                            {formatTime(getTotalTimeToday())}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Total Time
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Feeding Page
    const FeedingPage = () => (
        <div className="pb-20">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-3">
                    {Baby && <Baby />}
                    <h1 className={`text-2xl font-bold ml-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Feeding Tracker
                    </h1>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    One-handed tracking made simple
                </p>
            </div>

            {/* Current Session Display */}
            {currentSession && !currentSession.type && (
                <div className={`rounded-2xl shadow-lg p-6 mb-6 border-2 ${
                    darkMode ? 'bg-gray-800 border-pink-600' : 'bg-white border-pink-200'
                }`}>
                    <div className="text-center">
                        <div className={`text-4xl font-bold mb-2 ${
                            darkMode ? 'text-pink-400' : 'text-pink-600'
                        }`}>
                            {formatTime(timer)}
                        </div>
                        <div className={`text-lg mb-4 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Feeding from {currentSession.side} side
                        </div>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={resetTimer}
                                className={`rounded-full p-4 transition-colors ${
                                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                {RotateCcw && <RotateCcw />}
                            </button>
                            <button
                                onClick={stopSession}
                                className="bg-red-500 hover:bg-red-600 rounded-full p-4 transition-colors text-white"
                            >
                                {Pause && <Pause />}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Start Session Buttons */}
            {!currentSession && (
                <div className="space-y-4 mb-6">
                    <button
                        onClick={() => startSession('left')}
                        className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-2xl py-6 px-8 text-xl font-semibold shadow-lg transition-all transform hover:scale-105"
                    >
                        <div className="flex items-center justify-center">
                            {Play && <Play />}
                            <span className="ml-3">Start Left Side</span>
                        </div>
                    </button>
                    <button
                        onClick={() => startSession('right')}
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl py-6 px-8 text-xl font-semibold shadow-lg transition-all transform hover:scale-105"
                    >
                        <div className="flex items-center justify-center">
                            {Play && <Play />}
                            <span className="ml-3">Start Right Side</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setShowFormulaModal(true)}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl py-6 px-8 text-xl font-semibold shadow-lg transition-all transform hover:scale-105"
                    >
                        <div className="flex items-center justify-center">
                            {Bottle && <Bottle />}
                            <span className="ml-3">Add Formula Feed</span>
                        </div>
                    </button>
                </div>
            )}

            {/* Recent Sessions */}
            {sessions.length > 0 && (
                <div className={`rounded-2xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h2 className={`text-lg font-semibold mb-4 flex items-center ${
                        darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                        {Clock && <Clock />}
                        <span className="ml-2">Recent Sessions</span>
                    </h2>
                    <div className="space-y-3">
                        {sessions.slice(0, UI_CONSTANTS.MAX_RECENT_ITEMS).map(session => (
                            <div key={session.id} className={`flex justify-between items-center p-3 rounded-lg ${
                                darkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}>
                                <div>
                                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                        {session.type === 'formula' ? (
                                            <span className="flex items-center">
                                                <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                                                Formula feed
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                <div className={`w-3 h-3 rounded-full mr-2 ${
                                                    session.side === 'left' ? 'bg-pink-400' : 'bg-purple-400'
                                                }`}></div>
                                                {session.side} side
                                            </span>
                                        )}
                                    </div>
                                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {session.startTime.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                        {session.type === 'formula' ? `${session.amount} ml` : formatTime(session.duration)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Formula Modal */}
            {showFormulaModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`rounded-2xl p-6 w-full max-w-sm ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <h3 className={`text-xl font-bold mb-4 text-center ${
                            darkMode ? 'text-white' : 'text-gray-800'
                        }`}>Formula Feed</h3>
                        <div className="mb-4">
                            <label className={`block text-sm font-medium mb-2 ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Amount (ml)
                            </label>
                            <input
                                type="number"
                                value={formulaAmount}
                                onChange={(e) => setFormulaAmount(e.target.value)}
                                placeholder={DEFAULTS.FORMULA_AMOUNT}
                                className={`w-full px-4 py-3 border rounded-lg text-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    darkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white' 
                                        : 'bg-white border-gray-300 text-gray-900'
                                }`}
                                autoFocus
                            />
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setShowFormulaModal(false);
                                    setFormulaAmount('');
                                }}
                                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                                    darkMode 
                                        ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addFormulaFeed}
                                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                                disabled={!formulaAmount || formulaAmount <= 0}
                            >
                                Add Feed
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className={`min-h-screen p-4 transition-colors duration-300 ${
            darkMode 
                ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
                : 'bg-gradient-to-br from-pink-50 to-purple-50'
        }`}>
            <div className="max-w-md mx-auto">
                {currentPage === 'overview' && <OverviewPage />}
                {currentPage === 'feeding' && <FeedingPage />}
            </div>
            <Navigation />
        </div>
    );
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(React.createElement(BabyTracker), document.getElementById('root'));
});