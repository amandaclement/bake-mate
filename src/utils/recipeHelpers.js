// Returns an array of the individual terms found in a string, separate by whitespace
function getTerms(str) {
    return str.split(/\s+/);
}

// Returns true if a string represents a number
function isNumber(str) {
    return !isNaN(str);
}

// Returns true if a string represents a fraction (e.g. 1/2)
function isFraction(str) {
    // Regular expression to match format "number/number"
    const fractionRegex = /^\d+\/\d+$/;
    return fractionRegex.test(str);
}

// Returns true is a string represents a Unicode fraction (e.g. ½)
function isUnicodeFraction(str) {
    // Regular expression to match common Unicode fraction characters
    const fractionRegex = /[\u00BC-\u00BE\u2150\u215B-\u215E]/;
    return fractionRegex.test(str);
}

// Converts a fraction to decimal form
function fractionToDecimal(str) {
    const [numerator, denominator] = str.split('/').map(Number);
    return numerator/denominator;
}

// Converts a Unicode fraction to decimal form
function unicodeFractionToDecimal(fractionString) {
    // Replace Unicode common fraction characters with their equivalent decimal representations
    const normalizedFractionString = fractionString
        .replace(/\u00BC/g, '1/4')  // ¼
        .replace(/\u00BD/g, '1/2')  // ½
        .replace(/\u00BE/g, '3/4')  // ¾
        .replace(/\u2150/g, '1/7')  // ⅐
        .replace(/\u215B/g, '1/8')  // ⅛
        .replace(/\u215D/g, '5/8')  // ⅝
        .replace(/\u215E/g, '7/8'); // ⅞

    return fractionToDecimal(normalizedFractionString);
}

// Processes a single line, converting and scaling values as needed
function processMeasurementLine(str, scaler) {
    const terms = getTerms(str);
    var processedLine = '';

    terms.forEach(term => {
        if (isFraction(term)) {
            processedLine += fractionToDecimal(term) * scaler;
        } else if (isUnicodeFraction(term)) {
            processedLine += unicodeFractionToDecimal(term) * scaler;
        } else if (isNumber(term)) {
            processedLine += term * scaler;
        } else {
            processedLine += term;
        }
        processedLine += ' ';
    });
    return processedLine;
}

// Returns an entire recipe in list form, with measurements converted and scaled as needed
export function convertMeasurements(str, scaler) {
    const measurementLines = str.split('\n');

    return (
        <ul>
            {measurementLines.map((line, index) => {
                // Skip empty lines
                if (line !== '') {
                    return <li key={index}>{processMeasurementLine(line, scaler)}</li>;
                }
                return null;
            })}
        </ul>
    );
}