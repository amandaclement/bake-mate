import { unitConversions } from '../utils/unitData.js';

// Rounds a number to 4 decimal places
function roundNumber(num) {
    return Math.round((num + Number.EPSILON) * 10000) / 10000;
}

// Converts a measurement of a certain unit type to another unit type
export function convertMeasurement(originalUnit, desiredUnit, numUnits) {
    const originalUnitToCups = unitConversions[originalUnit];
    const desiredUnitToCups = unitConversions[desiredUnit];
    const conversion = originalUnitToCups/desiredUnitToCups * numUnits;

    // Return rounded result
    return roundNumber(conversion);
}

// Prepares measurement conversion to be rendered
export function renderResult(result, unitType) {
    return <p>{result} {unitType}</p>;
}