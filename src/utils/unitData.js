// Conversion factors from units to cups
export const unitConversions = {
    'tsp' : 1/48,
    'tbsp' : 1/16,
    'oz' : 1/8,
    'ml' : 1/240,
    'cup' : 1,
    'pint' : 2,
    'quart' : 4,
    'gallon' : 16 
};

// Array of unit types
export const unitTypes = Object.keys(unitConversions);
