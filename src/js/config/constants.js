/**
 * Application Constants
 * Centralized configuration for the Baby Tracker app
 */

// App Configuration
const APP_CONFIG = {
    name: 'Baby Tracker',
    version: '2.1.0',
    description: 'Professional baby care tracking application',
    author: 'Baby Tracker Team'
};

// Storage Keys
const STORAGE_KEYS = {
    VERSION: 'baby-tracker-version',
    SESSIONS: 'baby-tracker-sessions',
    DIAPERS: 'baby-tracker-diapers',
    SLEEP: 'baby-tracker-sleep',
    THEME_PREFS: 'baby-tracker-theme-prefs',
    BACKUP: 'baby-tracker-backup',
    
    // Legacy keys for migration
    LEGACY_SESSIONS: 'breastfeeding-sessions'
};

// Theme Configuration
const THEME_CONFIG = {
    NIGHT_START_HOUR: 19, // 7 PM
    NIGHT_END_HOUR: 7,    // 7 AM
    TRANSITION_DURATION: 300, // 300ms
    AUTO_THEME_CHECK_INTERVAL: 60000 // 1 minute
};

// UI Constants
const UI_CONSTANTS = {
    MAX_RECENT_ITEMS: 5,
    DEFAULT_HISTORY_LIMIT: 7,
    TIMER_UPDATE_INTERVAL: 1000,
    ANIMATION_DURATION: 300,
    
    // Breakpoints
    MOBILE_MAX_WIDTH: 768,
    TABLET_MAX_WIDTH: 1024
};

// Data Validation Rules
const VALIDATION_RULES = {
    FEEDING: {
        MIN_DURATION: 0,        // seconds
        MAX_DURATION: 3600,     // 1 hour
        MIN_FORMULA_AMOUNT: 1,  // ml
        MAX_FORMULA_AMOUNT: 500 // ml
    },
    SLEEP: {
        MIN_DURATION: 60,       // 1 minute
        MAX_DURATION: 43200     // 12 hours
    },
    TIMER_FORMAT: /^\d{1,3}:\d{2}$/ // MM:SS or MMM:SS
};

// Default Values
const DEFAULTS = {
    FEEDING_DURATION: '15:00',
    SLEEP_DURATION: '45:00',
    FORMULA_AMOUNT: '120',
    DIAPER_TYPE: 'wet',
    FEEDING_SIDE: 'left'
};

// Error Messages
const ERROR_MESSAGES = {
    INVALID_DURATION: 'Please enter a valid duration (MM:SS)',
    INVALID_AMOUNT: 'Please enter a valid amount',
    LOAD_ERROR: 'Failed to load data',
    SAVE_ERROR: 'Failed to save data',
    MIGRATION_ERROR: 'Data migration failed',
    VALIDATION_ERROR: 'Invalid input provided'
};

// Success Messages
const SUCCESS_MESSAGES = {
    DATA_SAVED: 'Data saved successfully',
    ENTRY_ADDED: 'Entry added successfully',
    ENTRY_UPDATED: 'Entry updated successfully',
    ENTRY_DELETED: 'Entry deleted successfully',
    MIGRATION_SUCCESS: 'Data migrated successfully'
};

// Feature Flags
const FEATURES = {
    DARK_MODE: true,
    AUTO_THEME: true,
    DATA_EXPORT: false,      // Future feature
    CLOUD_SYNC: false,       // Future feature
    NOTIFICATIONS: false,    // Future feature
    ANALYTICS: false,        // Future feature
    VOICE_NOTES: false       // Future feature
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.APP_CONFIG = APP_CONFIG;
    window.STORAGE_KEYS = STORAGE_KEYS;
    window.THEME_CONFIG = THEME_CONFIG;
    window.UI_CONSTANTS = UI_CONSTANTS;
    window.VALIDATION_RULES = VALIDATION_RULES;
    window.DEFAULTS = DEFAULTS;
    window.ERROR_MESSAGES = ERROR_MESSAGES;
    window.SUCCESS_MESSAGES = SUCCESS_MESSAGES;
    window.FEATURES = FEATURES;
}