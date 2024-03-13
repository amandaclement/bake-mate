// Bool to track validity of recipe text lines
var invalidLine = false;

// Returns an array of the individual terms found in a string, separate by whitespace. Removes whitespace at beginning and end of string
function getTerms(str) {
    return str.trim().split(/\s+/);
}

// Returns true if str represents a number
function isNumber(str) {
    return !isNaN(str);
}

// Returns true if str represents a fraction in Unicode form (e.g. ½)
function isUnicodeFraction(str) {
    const unicodeFractionRegex = /[\u00BC-\u00BE\u2150\u215B-\u215E]/;
    return unicodeFractionRegex.test(str);
}

// Returns true if str represents a fraction in regular form (e.g. 1/2)
function isRegularFraction(str) {
    const fractionRegex = /^\d+\/\d+$/;
    return fractionRegex.test(str);
}

// If str represents a decimal, return its corresponding scaled decimal number
function processNumber(str) {
    if (isNumber(str)) {
        return Number(str);
    }
    return str;
}

// If str represents a fraction (regular or Unicode), return its corresponding scaled decimal number
function processFraction(str) {
    if (isUnicodeFraction(str)) {
        // Accounts for mixed Unicode fractions not separated by whitespace (e.g. 1½)
        // Whole number part of string (if any) is all but the last char
        const whole = str.slice(0,-1);

        // If this isn't a number, update flag and simply return str
        if (!isNumber(whole)) {
            invalidLine = true;
            return str;
        }

        // Unicode fraction part of string is just the last char 
        const fraction = str.slice(-1);

        // Replace Unicode common fraction characters with their equivalent decimal representations
        const convertedFraction = fraction
        .replace(/\u00BC/g, '1/4')  // ¼
        .replace(/\u00BD/g, '1/2')  // ½
        .replace(/\u00BE/g, '3/4')  // ¾
        .replace(/\u2150/g, '1/7')  // ⅐
        .replace(/\u215B/g, '1/8')  // ⅛
        .replace(/\u215D/g, '5/8')  // ⅝
        .replace(/\u215E/g, '7/8'); // ⅞

        // Convert fraction to decimal, add to whole, and return as a number
        const decimalFraction = eval(convertedFraction);
        return Number(whole) + Number(decimalFraction);

    } else if (isRegularFraction(str)) {
        // Convert fraction to decimal and return as a number
        const decimalFraction = eval(str);
        return Number(decimalFraction);
    }
    return str;
}

// Processes a single line, converting and scaling values as needed
function processLine(str, scaler) {
    const terms = getTerms(str);
    const numTerms = terms.length;
    var processedLine = '';

    for (var i = 0; i < numTerms; i++) {
        invalidLine = false;
        var term = processNumber(terms[i]);
        term = processFraction(term); 

        // If term is a number at this point, can safely scale it
        if (isNumber(term)) {
            term = term * scaler;
        }

        // Accounts for mixed fractions separated by whitespace (e.g. 1 ½)
        // If current term is a decimal number and next term is a fraction, sum them
        if (isNumber(term) && i < numTerms-1 && (isUnicodeFraction(terms[i+1]) || isRegularFraction(terms[i+1]))) {
            term += processFraction(terms[i+1]) * scaler;
            i++;
        } 
        processedLine += term + ' ';

        // Inform user if line is invalid
        if (invalidLine) {
            return 'Invalid line. Please ensure all words and numerical values are separated by a space.'
        }
    }
    return processedLine;
}

// Returns the entire scaled recipe in list form
export function convertMeasurements(str, scaler) {
    const measurementLines = str.split('\n');

    return (
        <ul>
            {measurementLines.map((line, index) => {
                // Skip empty lines
                if (line !== '') {
                    return <li key={index}>{processLine(line, scaler)}</li>;
                }
                return null;
            })}
        </ul>
    );
}