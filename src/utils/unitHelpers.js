import { unitConversions } from '../utils/unitData.js';

// Converts a measurement of a certain unit type to another unit type
export function convertMeasurement(originalUnit, desiredUnit, numUnits) {
    const originalUnitToCups = unitConversions[originalUnit];
    const desiredUnitToCups = unitConversions[desiredUnit];
    const conversion = originalUnitToCups/desiredUnitToCups * numUnits;

    // Return result, rounded to 4 decimal points only if necessary
    return Math.round((conversion + Number.EPSILON) * 10000) / 10000
}