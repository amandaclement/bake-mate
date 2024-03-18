// Default custom pan dimensions
export const customDefaultDimensions = {
    length: 'length',
    width: 'width',
    height: 'height',
    diameter: 'diameter',
    label: 'custom',
    volume: 0
};

// Standard pan shapes and their dimensions
export const defaultPans = {
    rectangular: [
        { length: 8, width: 8, height: 2 },
        { length: 9, width: 9, height: 2  },
        { length: 10, width: 10, height: 2 },
        { length: 11, width: 7, height: 2 },
        { length: 13, width: 9, height: 2 },
        { ...customDefaultDimensions }
    ],
    round: [
        { diameter: 6, height: 2 },
        { diameter: 8, height: 2 },
        { diameter: 9, height: 2 },
        { diameter: 10, height: 2 },
        { ...customDefaultDimensions }
    ],
    springform: [
        { diameter: 8, height: 3 },
        { diameter: 9, height: 3 },
        { ...customDefaultDimensions }
    ],
    bundt: [
        { diameter: 8, height: 4 },
        { diameter: 10, height: 3 },
        { ...customDefaultDimensions }
    ],
    tube: [
        { diameter: 8, height: 3 },
        { diameter: 9, height: 3 },
        { ...customDefaultDimensions }
    ],
    loaf: [
        { length: 8, width: 4, height: 2.5 },
        { length: 9, width: 5, height: 2.5 },
        { ...customDefaultDimensions }
    ],
};

// Array of pan types
export const panTypes = Object.keys(defaultPans);

// Constant variables for calculations
export const maxVolumeDifference = 0.1;
export const bundtScaler = 0.7;
export const cubicInchToLiter = 0.0163871;