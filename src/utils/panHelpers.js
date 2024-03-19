import { defaultPans, bundtScaler, cubicInchToLiter, panTypes } from '../utils/panData.js';

// Converts cubic inches to litres
function cubicInchesToLitres(x) {
    return x * cubicInchToLiter;
}

// Calculates volume of a cylinder without unit conversion
function cylinderVolume(diameter, height) {
    return (diameter/2) * (diameter/2) * height * Math.PI;
}

// Calculates volume of a cuboid with unit conversion
function calculateCuboidVolume({ length, width, height }) {
    return cubicInchesToLitres(length * width * height);
}

// Calculates volume of a cylinder with unit conversion
function calculateCylinderVolume({ diameter, height }) {
    return cubicInchesToLitres(cylinderVolume(diameter, height));
}

// Calculates volume of a cylinder with a hole in the middle with unit conversion
// Scaler is used in a very rudimentary way to account for loss of volume due to angled base of certain pan types
function calculateHollowCylinderVolume({ diameter, height }, scaler) {
    const outerVolume = cylinderVolume(diameter, height);
    const innerDiameter = diameter/10;
    const innerVolume = cylinderVolume(innerDiameter, height);
    return cubicInchesToLitres(outerVolume * scaler - innerVolume);
}

// Calculates volume of pan based on type and dimensions
export function calculateVolume(type, dimensions) {
    switch(type) {
        case 'rectangular':
        case 'loaf':
            return calculateCuboidVolume(dimensions); 
        case 'round':
        case 'springform':
            return calculateCylinderVolume(dimensions);
        case 'tube':
            return calculateHollowCylinderVolume(dimensions, 1); 
        case 'bundt':
            return calculateHollowCylinderVolume(dimensions, bundtScaler); 
    }
}

// Generates dimension options for specific pan type
export function generateLabel(type, dimensions) {
    if (dimensions.label === 'custom') {
        return 'custom';
    } else if (type === 'rectangular' || type === 'loaf') {
        const { length, width, height } = dimensions;
        return `${length} X ${width} X ${height}`;
    } else {
        const { diameter, height } = dimensions;
        return `${diameter} X ${height}`;
    }
}

// Updates each dimension with its corresponding volume and label
export function initializePanData() {
    for (const type in defaultPans) {
        defaultPans[type].forEach(dimensions => {
            dimensions.volume = calculateVolume(type, dimensions);
            dimensions.label = generateLabel(type, dimensions);
        });
    }
}

// Returns true if str represents a number
function isNumber(str) {
    return !isNaN(str);
}

// Returns false if any custom input field is missing a value
export function isInputValid({ length, width, height, diameter, label }, type) {
    if (label === 'custom') {
        if (type === 'rectangular' || type === 'loaf') {
            if (!isNumber(length) || !isNumber(width) ||!isNumber(height)) {
                return false;
            }
        } else if (!isNumber(diameter) || !isNumber(height)) {
            return false;
        }
    }
    return true;
}

// Returns the resulting matches in list form, rendy to be rendered
export function renderResult(matches) {
    if (matches.length === 0) {
        return <p>No substitutions found.</p>;
    }
    return (
        <ul>
            {matches.map((match, index) => (
                <li key={index}>{match}</li>
            ))}
        </ul>
    );
}