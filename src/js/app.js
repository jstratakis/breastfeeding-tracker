/**
 * Main Baby Tracker Application
 * Primary React component and business logic
 */

const { useState, useEffect } = React;

// Get references to our modular components
const { 
    Play, Pause, RotateCcw, Calendar, Clock, Home, 
    Baby, Bottle, Diaper, Sleep, Edit, Trash, Plus, X 
} = window.Icons;

const BabyTracker = () => {
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
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [editType, setEditType] = useState(''); // 'feeding', 'diaper', 'sleep'
    const [showAddModal, setShowAddModal] = useState(false);
    const [addType, setAddType] = useState('');

    // Smart theme detection
    useEffect(() => {
        const checkTimeBasedTheme = () => {
            if (!autoTheme) return;
            
            const now = new Date();
            const hour = now.getHours();
            
            // Night mode: 7 PM to 7 AM (19:00 to 07:00)
            const isNightTime = hour >= THEME_CONFIG.NIGHT_START_HOUR || hour < THEME_CONFIG.NIGHT_END_HOUR;
            setDarkMode(isNightTime);
        };

        // Check immediately
        checkTimeBasedTheme();
        
        // Check every minute for theme changes
        const themeInterval = setInterval(checkTimeBasedTheme, THEME_CONFIG.AUTO_THEME_CHECK_INTERVAL);
        
        return () => clearInterval(themeInterval);
    }, [autoTheme]);

    // Load data from localStorage with migration support
    useEffect(() => {
        // Version management for data migration
        const currentVersion = APP_CONFIG.version;
        const savedVersion = localStorage.getItem(STORAGE_KEYS.VERSION) || '1.0';
        
        // Migrate old data if needed
        if (savedVersion !== currentVersion) {
            migrateData(savedVersion, currentVersion);
            localStorage.setItem(STORAGE_KEYS.VERSION, currentVersion);
        }

        // Load feeding sessions
        const feedingKeys = [STORAGE_KEYS.SESSIONS, STORAGE_KEYS.LEGACY_SESSIONS]; // Support old and new keys
        let loadedSessions = [];
        
        for (const key of feedingKeys) {
            const savedSessions = localStorage.getItem(key);
            if (savedSessions && savedSessions !== '[]') {
                try {
                    const parsedSessions = JSON.parse(savedSessions).map(session => ({
                        ...session,
                        startTime: new Date(session.startTime),
                        endTime: session.endTime ? new Date(session.endTime) : null
                    }));
                    if (parsedSessions.length > loadedSessions.length) {
                        loadedSessions = parsedSessions;
                    }
                } catch (error) {
                    console.error(`Error loading sessions from ${key}:`, error);
                }
            }
        }
        
        if (loadedSessions.length > 0) {
            setSessions(loadedSessions);
        }

        // Load diaper changes
        const diaperKeys = [STORAGE_KEYS.DIAPERS];
        let loadedDiapers = [];
        
        for (const key of diaperKeys) {
            const savedDiapers = localStorage.getItem(key);
            if (savedDiapers && savedDiapers !== '[]') {
                try {
                    const parsedDiapers = JSON.parse(savedDiapers).map(diaper => ({
                        ...diaper,
                        time: new Date(diaper.time)
                    }));
                    if (parsedDiapers.length > loadedDiapers.length) {
                        loadedDiapers = parsedDiapers;
                    }
                } catch (error) {
                    console.error(`Error loading diapers from ${key}:`, error);
                }
            }
        }
        
        if (loadedDiapers.length > 0) {
            setDiaperChanges(loadedDiapers);
        }

        // Load sleep sessions
        const sleepKeys = [STORAGE_KEYS.SLEEP];
        let loadedSleep = [];
        
        for (const key of sleepKeys) {
            const savedSleep = localStorage.getItem(key);
            if (savedSleep && savedSleep !== '[]') {
                try {
                    const parsedSleep = JSON.parse(savedSleep).map(sleep => ({
                        ...sleep,
                        startTime: new Date(sleep.startTime),
                        endTime: sleep.endTime ? new Date(sleep.endTime) : null
                    }));
                    if (parsedSleep.length > loadedSleep.length) {
                        loadedSleep = parsedSleep;
                    }
                } catch (error) {
                    console.error(`Error loading sleep from ${key}:`, error);
                }
            }
        }
        
        if (loadedSleep.length > 0) {
            setSleepSessions(loadedSleep);
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

    // Data migration function
    const migrateData = (fromVersion, toVersion) => {
        console.log(`Migrating data from version ${fromVersion} to ${toVersion}`);
        
        // Backup current data before migration
        const backupData = {
            timestamp: new Date().toISOString(),
            version: fromVersion,
            sessions: localStorage.getItem(STORAGE_KEYS.LEGACY_SESSIONS) || localStorage.getItem(STORAGE_KEYS.SESSIONS),
            diapers: localStorage.getItem(STORAGE_KEYS.DIAPERS),
            sleep: localStorage.getItem(STORAGE_KEYS.SLEEP),
            themePrefs: localStorage.getItem(STORAGE_KEYS.THEME_PREFS)
        };
        
        localStorage.setItem(STORAGE_KEYS.BACKUP, JSON.stringify(backupData));
        
        // Migration logic for different versions
        if (fromVersion === '1.0' && toVersion === '2.0') {
            // Migrate from old feeding tracker to new multi-tracker
            const oldSessions = localStorage.getItem(STORAGE_KEYS.LEGACY_SESSIONS);
            if (oldSessions && !localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
                localStorage.setItem(STORAGE_KEYS.SESSIONS, oldSessions);
            }
        }
        
        console.log('Data migration completed and backed up');
    };

    // Save data to localStorage with backup protection
    useEffect(() => {
        if (sessions.length > 0) {
            try {
                localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
                // Keep backup of previous version
                localStorage.setItem(STORAGE_KEYS.SESSIONS + STORAGE_KEYS.BACKUP_SUFFIX, JSON.stringify(sessions));
            } catch (error) {
                console.error('Error saving sessions:', error);
            }
        }
    }, [sessions]);

    useEffect(() => {
        if (diaperChanges.length > 0) {
            try {
                localStorage.setItem(STORAGE_KEYS.DIAPERS, JSON.stringify(diaperChanges));
                localStorage.setItem(STORAGE_KEYS.DIAPERS + STORAGE_KEYS.BACKUP_SUFFIX, JSON.stringify(diaperChanges));
            } catch (error) {
                console.error('Error saving diapers:', error);
            }
        }
    }, [diaperChanges]);

    useEffect(() => {
        if (sleepSessions.length > 0) {
            try {
                localStorage.setItem(STORAGE_KEYS.SLEEP, JSON.stringify(sleepSessions));
                localStorage.setItem(STORAGE_KEYS.SLEEP + STORAGE_KEYS.BACKUP_SUFFIX, JSON.stringify(sleepSessions));
            } catch (error) {
                console.error('Error saving sleep:', error);
            }
        }
    }, [sleepSessions]);

    // Save theme preferences
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

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
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

    // Diaper functions
    const addDiaperChange = () => {
        if (diaperType) {
            const newDiaper = {
                id: Date.now(),
                type: diaperType,
                time: new Date()
            };
            setDiaperChanges(prev => [newDiaper, ...prev]);
            setDiaperType('');
            setShowDiaperModal(false);
        }
    };

    // Sleep functions
    const startSleep = () => {
        const newSleep = {
            id: Date.now(),
            startTime: new Date(),
            duration: 0,
            type: 'sleep'
        };
        setCurrentSession(newSleep);
        setTimer(0);
    };

    const stopSleep = () => {
        if (currentSession && currentSession.type === 'sleep') {
            const completedSleep = {
                id: currentSession.id,
                startTime: currentSession.startTime,
                endTime: new Date(),
                duration: timer
            };
            setSleepSessions(prev => [completedSleep, ...prev]);
            setCurrentSession(null);
            setTimer(0);
        }
    };

    const getTodaysSessions = (type = 'feeding') => {
        const today = new Date().toDateString();
        if (type === 'feeding') {
            return sessions.filter(session => 
                session.startTime.toDateString() === today
            );
        } else if (type === 'diaper') {
            return diaperChanges.filter(diaper => 
                diaper.time.toDateString() === today
            );
        } else if (type === 'sleep') {
            return sleepSessions.filter(sleep => 
                sleep.startTime.toDateString() === today
            );
        }
        return [];
    };

    const getTotalTimeToday = (type = 'feeding') => {
        const todaysSessions = getTodaysSessions(type);
        if (type === 'feeding') {
            return todaysSessions.reduce((total, session) => total + (session.duration || 0), 0);
        } else if (type === 'sleep') {
            return todaysSessions.reduce((total, session) => total + (session.duration || 0), 0);
        }
        return 0;
    };

    // Edit and Delete functions
    const deleteItem = (id, type) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            if (type === 'feeding') {
                setSessions(prev => prev.filter(session => session.id !== id));
            } else if (type === 'diaper') {
                setDiaperChanges(prev => prev.filter(diaper => diaper.id !== id));
            } else if (type === 'sleep') {
                setSleepSessions(prev => prev.filter(sleep => sleep.id !== id));
            }
        }
    };

    const startEdit = (item, type) => {
        setEditingItem(item);
        setEditType(type);
        setShowEditModal(true);
    };

    const saveEdit = (updatedItem) => {
        if (editType === 'feeding') {
            setSessions(prev => prev.map(session => 
                session.id === updatedItem.id ? updatedItem : session
            ));
        } else if (editType === 'diaper') {
            setDiaperChanges(prev => prev.map(diaper => 
                diaper.id === updatedItem.id ? updatedItem : diaper
            ));
        } else if (editType === 'sleep') {
            setSleepSessions(prev => prev.map(sleep => 
                sleep.id === updatedItem.id ? updatedItem : sleep
            ));
        }
        setShowEditModal(false);
        setEditingItem(null);
    };

    const addMissingEntry = (type) => {
        setAddType(type);
        setShowAddModal(true);
    };

    // Navigation Component
    const Navigation = () => (
        <div className={`fixed bottom-0 left-0 right-0 border-t px-4 py-2 ${
            darkMode 
                ? 'bg-gray-900 border-gray-700' 
                : 'bg-white border-gray-200'
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
                    <Home />
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
                    <Baby />
                    <span className="text-xs mt-1">Feeding</span>
                </button>
                <button
                    onClick={() => setCurrentPage('diaper')}
                    className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                        currentPage === 'diaper' 
                            ? (darkMode ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-600')
                            : (darkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-600 hover:text-yellow-600')
                    }`}
                >
                    <Diaper />
                    <span className="text-xs mt-1">Diaper</span>
                </button>
                <button
                    onClick={() => setCurrentPage('sleep')}
                    className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                        currentPage === 'sleep' 
                            ? (darkMode ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-100 text-indigo-600')
                            : (darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600')
                    }`}
                >
                    <Sleep />
                    <span className="text-xs mt-1">Sleep</span>
                </button>
            </div>
        </div>
    );

    // Overview Page
    const OverviewPage = () => (
        <div className="pb-20">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-3">
                    <Home />
                    <h1 className={`text-2xl font-bold ml-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Daily Overview</h1>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Today's summary</p>
                
                {/* Theme Toggle */}
                <div className="flex items-center justify-center mt-4 space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Auto Theme</span>
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
                
                {autoTheme && (
                    <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        🌙 Night mode active (7 PM - 7 AM) • Gentle on your eyes
                    </p>
                )}
            </div>

            {/* Overview Cards */}
            <div className="space-y-4 mb-6">
                {/* Feeding Overview */}
                <div className={`rounded-2xl shadow-lg p-6 ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-semibold flex items-center ${
                            darkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                            <Baby />
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
                                {getTodaysSessions('feeding').length}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sessions</div>
                        </div>
                        <div className="text-center">
                            <div className={`text-2xl font-bold ${
                                darkMode ? 'text-pink-400' : 'text-pink-600'
                            }`}>
                                {formatTime(getTotalTimeToday('feeding'))}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Time</div>
                        </div>
                    </div>
                </div>

                {/* Diaper Overview */}
                <div className={`rounded-2xl shadow-lg p-6 ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-semibold flex items-center ${
                            darkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                            <Diaper />
                            <span className="ml-2">Diapers</span>
                        </h3>
                        <button 
                            onClick={() => setCurrentPage('diaper')}
                            className={`text-sm ${
                                darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-700'
                            }`}
                        >
                            View Details →
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                            <div className={`text-xl font-bold ${
                                darkMode ? 'text-yellow-400' : 'text-yellow-600'
                            }`}>
                                {getTodaysSessions('diaper').filter(d => d.type === 'wet').length}
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>💧 Wet</div>
                        </div>
                        <div className="text-center">
                            <div className={`text-xl font-bold ${
                                darkMode ? 'text-orange-400' : 'text-orange-600'
                            }`}>
                                {getTodaysSessions('diaper').filter(d => d.type === 'dirty').length}
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>💩 Dirty</div>
                        </div>
                        <div className="text-center">
                            <div className={`text-xl font-bold ${
                                darkMode ? 'text-red-400' : 'text-red-600'
                            }`}>
                                {getTodaysSessions('diaper').filter(d => d.type === 'both').length}
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>💧💩 Both</div>
                        </div>
                    </div>
                </div>

                {/* Sleep Overview */}
                <div className={`rounded-2xl shadow-lg p-6 ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-semibold flex items-center ${
                            darkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                            <Sleep />
                            <span className="ml-2">Sleep</span>
                        </h3>
                        <button 
                            onClick={() => setCurrentPage('sleep')}
                            className={`text-sm ${
                                darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
                            }`}
                        >
                            View Details →
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <div className={`text-2xl font-bold ${
                                darkMode ? 'text-indigo-400' : 'text-indigo-600'
                            }`}>
                                {getTodaysSessions('sleep').length}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sessions</div>
                        </div>
                        <div className="text-center">
                            <div className={`text-2xl font-bold ${
                                darkMode ? 'text-indigo-400' : 'text-indigo-600'
                            }`}>
                                {formatTime(getTotalTimeToday('sleep'))}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Sleep</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={`rounded-2xl shadow-lg p-6 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-800'
                }`}>Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => {
                            setCurrentPage('feeding');
                        }}
                        className={`rounded-lg py-3 px-4 text-sm font-medium transition-colors ${
                            darkMode 
                                ? 'bg-pink-700 hover:bg-pink-600 text-white' 
                                : 'bg-pink-500 hover:bg-pink-600 text-white'
                        }`}
                    >
                        🤱 Start Feeding
                    </button>
                    <button
                        onClick={() => {
                            setCurrentPage('diaper');
                        }}
                        className={`rounded-lg py-3 px-4 text-sm font-medium transition-colors ${
                            darkMode 
                                ? 'bg-yellow-700 hover:bg-yellow-600 text-white' 
                                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        }`}
                    >
                        💧 Log Diaper
                    </button>
                    <button
                        onClick={() => {
                            setCurrentPage('sleep');
                        }}
                        className={`rounded-lg py-3 px-4 text-sm font-medium transition-colors ${
                            darkMode 
                                ? 'bg-indigo-700 hover:bg-indigo-600 text-white' 
                                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                        }`}
                    >
                        😴 Start Sleep
                    </button>
                    <button
                        onClick={() => {
                            setCurrentPage('feeding');
                            setShowFormulaModal(true);
                        }}
                        className={`rounded-lg py-3 px-4 text-sm font-medium transition-colors ${
                            darkMode 
                                ? 'bg-blue-700 hover:bg-blue-600 text-white' 
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                        🍼 Add Formula
                    </button>
                </div>
            </div>
        </div>
    );

    // Feeding Page
    const FeedingPage = () => (
        <div className="pb-20">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-3">
                    <Baby />
                    <h1 className={`text-2xl font-bold ml-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Feeding Tracker</h1>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>One-handed tracking made simple</p>
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
                                    darkMode 
                                        ? 'bg-gray-700 hover:bg-gray-600' 
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                <RotateCcw />
                            </button>
                            <button
                                onClick={stopSession}
                                className="bg-red-500 hover:bg-red-600 rounded-full p-4 transition-colors text-white"
                            >
                                <Pause />
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
                            <Play />
                            <span className="ml-3">Start Left Side</span>
                        </div>
                    </button>
                    <button
                        onClick={() => startSession('right')}
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl py-6 px-8 text-xl font-semibold shadow-lg transition-all transform hover:scale-105"
                    >
                        <div className="flex items-center justify-center">
                            <Play />
                            <span className="ml-3">Start Right Side</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setShowFormulaModal(true)}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl py-6 px-8 text-xl font-semibold shadow-lg transition-all transform hover:scale-105"
                    >
                        <div className="flex items-center justify-center">
                            <Bottle />
                            <span className="ml-3">Add Formula Feed</span>
                        </div>
                    </button>
                </div>
            )}

            {/* Today's Summary */}
            <div className={`rounded-2xl shadow-lg p-6 mb-6 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
                <h2 className={`text-lg font-semibold mb-4 flex items-center ${
                    darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                    <Calendar />
                    <span className="ml-2">Today's Feeding</span>
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${
                            darkMode ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                            {getTodaysSessions('feeding').length}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Sessions</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${
                            darkMode ? 'text-green-400' : 'text-green-600'
                        }`}>
                            {formatTime(getTotalTimeToday('feeding'))}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Time</div>
                    </div>
                </div>
            </div>

            {/* Recent Sessions */}
            {sessions.length > 0 && (
                <div className={`rounded-2xl shadow-lg p-6 ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <h2 className={`text-lg font-semibold mb-4 flex items-center ${
                        darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                        <Clock />
                        <span className="ml-2">Recent Sessions</span>
                    </h2>
                    <div className="space-y-3">
                        {sessions.slice(0, UI_CONSTANTS.MAX_RECENT_ITEMS).map(session => (
                            <div key={session.id} className={`flex justify-between items-center p-3 rounded-lg ${
                                darkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}>
                                <div>
                                    <div className={`font-medium ${
                                        darkMode ? 'text-white' : 'text-gray-800'
                                    }`}>
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
                                    <div className={`text-sm ${
                                        darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                        {session.startTime.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`font-bold ${
                                        darkMode ? 'text-white' : 'text-gray-800'
                                    }`}>
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
                                placeholder={DEFAULTS.FORMULA_AMOUNT || "Enter ml amount"}
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

    // Diaper Page
    const DiaperPage = () => (
        <div className="pb-20">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-3">
                    <Diaper />
                    <h1 className={`text-2xl font-bold ml-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Diaper Tracker</h1>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Track diaper changes easily</p>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-4 mb-6">
                <button
                    onClick={() => {
                        setDiaperType('wet');
                        setShowDiaperModal(true);
                    }}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-2xl py-6 px-8 text-xl font-semibold shadow-lg transition-all transform hover:scale-105"
                >
                    <div className="flex items-center justify-center">
                        <Diaper />
                        <span className="ml-3">💧 Wet Diaper</span>
                    </div>
                </button>
                <button
                    onClick={() => {
                        setDiaperType('dirty');
                        setShowDiaperModal(true);
                    }}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl py-6 px-8 text-xl font-semibold shadow-lg transition-all transform hover:scale-105"
                >
                    <div className="flex items-center justify-center">
                        <Diaper />
                        <span className="ml-3">💩 Dirty Diaper</span>
                    </div>
                </button>
                <button
                    onClick={() => {
                        setDiaperType('both');
                        setShowDiaperModal(true);
                    }}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl py-6 px-8 text-xl font-semibold shadow-lg transition-all transform hover:scale-105"
                >
                    <div className="flex items-center justify-center">
                        <Diaper />
                        <span className="ml-3">💧💩 Both</span>
                    </div>
                </button>
            </div>

            {/* Today's Summary */}
            <div className={`rounded-2xl shadow-lg p-6 mb-6 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
                <h2 className={`text-lg font-semibold mb-4 flex items-center ${
                    darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                    <Calendar />
                    <span className="ml-2">Today's Diapers</span>
                </h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${
                            darkMode ? 'text-yellow-400' : 'text-yellow-600'
                        }`}>
                            {getTodaysSessions('diaper').filter(d => d.type === 'wet').length}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>💧 Wet</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${
                            darkMode ? 'text-orange-400' : 'text-orange-600'
                        }`}>
                            {getTodaysSessions('diaper').filter(d => d.type === 'dirty').length}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>💩 Dirty</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${
                            darkMode ? 'text-red-400' : 'text-red-600'
                        }`}>
                            {getTodaysSessions('diaper').filter(d => d.type === 'both').length}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>💧💩 Both</div>
                    </div>
                </div>
            </div>

            {/* Recent Changes */}
            {diaperChanges.length > 0 && (
                <div className={`rounded-2xl shadow-lg p-6 ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <h2 className={`text-lg font-semibold mb-4 flex items-center ${
                        darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                        <Clock />
                        <span className="ml-2">Recent Changes</span>
                    </h2>
                    <div className="space-y-3">
                        {diaperChanges.slice(0, UI_CONSTANTS.MAX_RECENT_ITEMS).map(diaper => (
                            <div key={diaper.id} className={`flex justify-between items-center p-3 rounded-lg ${
                                darkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}>
                                <div>
                                    <div className={`font-medium ${
                                        darkMode ? 'text-white' : 'text-gray-800'
                                    }`}>
                                        {diaper.type === 'wet' && '💧 Wet diaper'}
                                        {diaper.type === 'dirty' && '💩 Dirty diaper'}
                                        {diaper.type === 'both' && '💧💩 Wet & Dirty'}
                                    </div>
                                    <div className={`text-sm ${
                                        darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                        {diaper.time.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-sm ${
                                        darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                        {diaper.time.toLocaleDateString() === new Date().toLocaleDateString() 
                                            ? 'Today' 
                                            : diaper.time.toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Diaper Modal */}
            {showDiaperModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`rounded-2xl p-6 w-full max-w-sm ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <h3 className={`text-xl font-bold mb-4 text-center ${
                            darkMode ? 'text-white' : 'text-gray-800'
                        }`}>Diaper Change</h3>
                        <div className="mb-4">
                            <p className={`text-center text-lg ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                {diaperType === 'wet' && '💧 Wet Diaper'}
                                {diaperType === 'dirty' && '💩 Dirty Diaper'}
                                {diaperType === 'both' && '💧💩 Wet & Dirty Diaper'}
                            </p>
                            <p className={`text-center text-sm mt-2 ${
                                darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                {new Date().toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setShowDiaperModal(false);
                                    setDiaperType('');
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
                                onClick={addDiaperChange}
                                className="flex-1 px-4 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                            >
                                Log Change
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // Sleep Page
    const SleepPage = () => (
        <div className="pb-20">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-3">
                    <Sleep />
                    <h1 className={`text-2xl font-bold ml-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Sleep Tracker</h1>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Monitor sleep patterns</p>
            </div>

            {/* Current Sleep Session */}
            {currentSession && currentSession.type === 'sleep' && (
                <div className={`rounded-2xl shadow-lg p-6 mb-6 border-2 ${
                    darkMode ? 'bg-gray-800 border-indigo-600' : 'bg-white border-indigo-200'
                }`}>
                    <div className="text-center">
                        <div className={`text-4xl font-bold mb-2 ${
                            darkMode ? 'text-indigo-400' : 'text-indigo-600'
                        }`}>
                            {formatTime(timer)}
                        </div>
                        <div className={`text-lg mb-4 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Baby is sleeping 😴
                        </div>
                        <button
                            onClick={stopSleep}
                            className="bg-indigo-500 hover:bg-indigo-600 rounded-full p-4 transition-colors text-white"
                        >
                            <Pause />
                        </button>
                    </div>
                </div>
            )}

            {/* Sleep Controls */}
            {(!currentSession || currentSession.type !== 'sleep') && (
                <div className="space-y-4 mb-6">
                    <button
                        onClick={startSleep}
                        className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-2xl py-6 px-8 text-xl font-semibold shadow-lg transition-all transform hover:scale-105"
                    >
                        <div className="flex items-center justify-center">
                            <Sleep />
                            <span className="ml-3">Start Sleep</span>
                        </div>
                    </button>
                </div>
            )}

            {/* Today's Summary */}
            <div className={`rounded-2xl shadow-lg p-6 mb-6 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
                <h2 className={`text-lg font-semibold mb-4 flex items-center ${
                    darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                    <Calendar />
                    <span className="ml-2">Today's Sleep</span>
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${
                            darkMode ? 'text-indigo-400' : 'text-indigo-600'
                        }`}>
                            {getTodaysSessions('sleep').length}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sleep Sessions</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${
                            darkMode ? 'text-green-400' : 'text-green-600'
                        }`}>
                            {formatTime(getTotalTimeToday('sleep'))}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Sleep</div>
                    </div>
                </div>
            </div>

            {/* Recent Sleep Sessions */}
            {sleepSessions.length > 0 && (
                <div className={`rounded-2xl shadow-lg p-6 ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <h2 className={`text-lg font-semibold mb-4 flex items-center ${
                        darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                        <Clock />
                        <span className="ml-2">Recent Sleep</span>
                    </h2>
                    <div className="space-y-3">
                        {sleepSessions.slice(0, UI_CONSTANTS.MAX_RECENT_ITEMS).map(sleep => (
                            <div key={sleep.id} className={`flex justify-between items-center p-3 rounded-lg ${
                                darkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}>
                                <div>
                                    <div className={`font-medium flex items-center ${
                                        darkMode ? 'text-white' : 'text-gray-800'
                                    }`}>
                                        <div className="w-3 h-3 bg-indigo-400 rounded-full mr-2"></div>
                                        Sleep session
                                    </div>
                                    <div className={`text-sm ${
                                        darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                        {sleep.startTime.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                        {sleep.endTime && (
                                            <span> - {sleep.endTime.toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`font-bold ${
                                        darkMode ? 'text-white' : 'text-gray-800'
                                    }`}>
                                        {formatTime(sleep.duration)}
                                    </div>
                                </div>
                            </div>
                        ))}
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
                {currentPage === 'diaper' && <DiaperPage />}
                {currentPage === 'sleep' && <SleepPage />}
            </div>
            <Navigation />
        </div>
    );
};

// Render the app
ReactDOM.render(React.createElement(BabyTracker), document.getElementById('root'));