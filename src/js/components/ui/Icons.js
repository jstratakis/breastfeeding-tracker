/**
 * Icon Components
 * Centralized SVG icons for the Baby Tracker app
 */

// Primary Action Icons
const Play = ({ size = 28, className = "", ...props }) => 
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        className: className,
        ...props
    }, React.createElement('polygon', { points: "5,3 19,12 5,21 5,3" }));

const Pause = ({ size = 24, className = "", ...props }) => 
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        className: className,
        ...props
    }, [
        React.createElement('rect', { key: 1, x: "6", y: "4", width: "4", height: "16" }),
        React.createElement('rect', { key: 2, x: "14", y: "4", width: "4", height: "16" })
    ]);

const RotateCcw = ({ size = 24, className = "", ...props }) => 
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        className: className,
        ...props
    }, [
        React.createElement('polyline', { key: 1, points: "1,4 1,10 7,10" }),
        React.createElement('path', { key: 2, d: "M3.51,15a9,9,0,0,0,14.85-3.36,9,9,0,0,0-5.51-11.48" })
    ]);

const Calendar = ({ size = 20, className = "", ...props }) => 
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        className: className,
        ...props
    }, [
        React.createElement('rect', { key: 1, x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
        React.createElement('line', { key: 2, x1: "16", y1: "2", x2: "16", y2: "6" }),
        React.createElement('line', { key: 3, x1: "8", y1: "2", x2: "8", y2: "6" }),
        React.createElement('line', { key: 4, x1: "3", y1: "10", x2: "21", y2: "10" })
    ]);

const Clock = ({ size = 20, className = "", ...props }) => 
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        className: className,
        ...props
    }, [
        React.createElement('circle', { key: 1, cx: "12", cy: "12", r: "10" }),
        React.createElement('polyline', { key: 2, points: "12,6 12,12 16,14" })
    ]);

const Home = ({ size = 20, className = "", ...props }) => 
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        className: className,
        ...props
    }, [
        React.createElement('path', { key: 1, d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
        React.createElement('polyline', { key: 2, points: "9,22 9,12 15,12 15,22" })
    ]);

const Baby = ({ size = 32, className = "", ...props }) => 
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        className: className,
        ...props
    }, [
        React.createElement('path', { key: 1, d: "M9 12a4 4 0 1 1 8 0c0 1.5-2 4-4 4s-4-2.5-4-4Z" }),
        React.createElement('path', { key: 2, d: "M8 14v.5c0 .5.5 1 1 1h6c.5 0 1-.5 1-1V14" }),
        React.createElement('path', { key: 3, d: "M16 12V9a4 4 0 1 0-8 0v3" })
    ]);

const Bottle = ({ size = 28, className = "", ...props }) => 
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        className: className,
        ...props
    }, [
        React.createElement('path', { key: 1, d: "M5 17v-4a8 8 0 1 1 16 0v4H5Z" }),
        React.createElement('path', { key: 2, d: "M5 17h16v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2Z" }),
        React.createElement('path', { key: 3, d: "M12 1v4" }),
        React.createElement('path', { key: 4, d: "M10 5h4" })
    ]);

const Diaper = ({ size = 28, className = "", ...props }) => 
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        className: className,
        ...props
    }, [
        React.createElement('path', { key: 1, d: "M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" }),
        React.createElement('path', { key: 2, d: "M8 7v10" }),
        React.createElement('path', { key: 3, d: "M16 7v10" }),
        React.createElement('circle', { key: 4, cx: "12", cy: "12", r: "2" })
    ]);

const Sleep = ({ size = 28, className = "", ...props }) => 
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        className: className,
        ...props
    }, React.createElement('path', { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" }));

const Edit = ({ size = 16, className = "", ...props }) => 
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        className: className,
        ...props
    }, [
        React.createElement('path', { key: 1, d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
        React.createElement('path', { key: 2, d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
    ]);

const Trash = ({ size = 16, className = "", ...props }) => 
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        className: className,
        ...props
    }, [
        React.createElement('polyline', { key: 1, points: "3,6 5,6 21,6" }),
        React.createElement('path', { key: 2, d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })
    ]);

const Plus = ({ size = 20, className = "", ...props }) => 
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        className: className,
        ...props
    }, [
        React.createElement('line', { key: 1, x1: "12", y1: "5", x2: "12", y2: "19" }),
        React.createElement('line', { key: 2, x1: "5", y1: "12", x2: "19", y2: "12" })
    ]);

const X = ({ size = 20, className = "", ...props }) => 
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        className: className,
        ...props
    }, [
        React.createElement('line', { key: 1, x1: "18", y1: "6", x2: "6", y2: "18" }),
        React.createElement('line', { key: 2, x1: "6", y1: "6", x2: "18", y2: "18" })
    ]);

// Export all icons for use in other components
window.Icons = {
    Play,
    Pause,
    RotateCcw,
    Calendar,
    Clock,
    Home,
    Baby,
    Bottle,
    Diaper,
    Sleep,
    Edit,
    Trash,
    Plus,
    X
};

console.log('Icons loaded successfully:', Object.keys(window.Icons));