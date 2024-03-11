import { useState } from 'react';

// Standard pan shapes and their dimensions
const pans = {
    rectangular: [
        { length: 8, width: 8, height: 2 },
        { length: 9, width: 9, height: 2  },
        { length: 10, width: 10, height: 2 },
        { length: 11, width: 7, height: 2 },
        { length: 13, width: 9, height: 2 }
    ],
    round: [
        { diameter: 6, height: 2 },
        { diameter: 8, height: 2 },
        { diameter: 9, height: 2 },
        { diameter: 10, height: 2 }
    ],
    springform: [
        { diameter: 8, height: 3 },
        { diameter: 9, height: 3 }
    ],
    bundt: [
        { diameter: 8, height: 4 },
        { diameter: 10, height: 3 }
    ],
    tube: [
        { diameter: 8, height: 3 },
        { diameter: 9, height: 3 }
    ],
    loaf: [
        { length: 8, width: 4, height: 2.5 },
        { length: 9, width: 5, height: 2.5 }
    ],
};

// For resetting pan dimensions
const emptyDimensions = {
    length: '',
    width: '',
    height: '',
    diameter: ''
};

const maxVolumeDifference = 0.1;
const bundtScaler = 0.7;

// Converts cubic inches to litres
function cubicInchesToLitres(x) {
    return x * 0.0163871;
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
function calculateVolume(type, dimensions) {
    if (type === 'rectangular' || type === 'loaf') {
        return calculateCuboidVolume(dimensions); 
    } else if (type === 'round' || type === 'springform') {
        return calculateCylinderVolume(dimensions); 
    } else if (type === 'tube') {
        return calculateHollowCylinderVolume(dimensions, 1); 
    } else if (type === 'bundt') {
        return calculateHollowCylinderVolume(dimensions, bundtScaler); 
    }
}

// Generates dimension options for specific pan type
function generateLabel(type, dimensions) {
    if (type === 'rectangular' || type === 'loaf') {
        const { length, width, height } = dimensions;
        return `${length} X ${width} X ${height}`;
    } else {
        const { diameter, height } = dimensions;
        return `${diameter} X ${height}`;
    }
}

// Updates each dimension with its corresponding volume and label
function updateDimensions() {
    for (const type in pans) {
        pans[type].forEach(dimensions => {
            dimensions.volume = calculateVolume(type, dimensions);
            dimensions.label = generateLabel(type, dimensions);
        });
    }
}
updateDimensions();

// React component for Pan Sizer
export default function PanSizer() {

    // State variables
    const [shape, setShape] = useState('rectangular');
    const [selectedDimensionsIndex, setSelectedDimensionsIndex] = useState(0);
    const [currentDimensions, setCurrentDimensions] = useState(pans['rectangular'][0]);
    const [volume, setVolume] = useState(0);
    const [isDisplayMatches, setIsDisplayMatches] = useState(false);

    // Handles shape change
    function handleShapeChange(event) {
        const type = event.target.value;
        setShape(type);
        setSelectedDimensionsIndex(0);
        setIsDisplayMatches(false);
    }

    // Handles dimension change
    function handleDimensionChange(event) {
        const selectedIndex = event.target.value;
        setSelectedDimensionsIndex(selectedIndex);

        // If custom chosen, reset dimensions to null, else set them to appropriate shape/dimension combo
        selectedIndex === 'custom' ? setCurrentDimensions(emptyDimensions) : setCurrentDimensions(pans[shape][selectedIndex]);
        setIsDisplayMatches(false);
    }

    // Handles custom dimension input entries
    function handleCustomDimensionChange(event) {
        const {name, value} = event.target;
        setCurrentDimensions({
            ...currentDimensions,
            [name]: value
          });
    }

    // Handles submit button
    function handleResult(event) {
        // Prevent page reload on button click
        event.preventDefault(); 
        setVolume(calculateVolume(shape, currentDimensions));
        setIsDisplayMatches(true);
    }

    // Returns an array of acceptable pan substitutes, formatted as type:label
    function findMatches() {
        var currentLabel = generateLabel(shape, currentDimensions);
        var matches = [];
        for (const type in pans) {
            pans[type].forEach(pan => {
                // Check conditions for matching pans
                const isDifferentLabel = pan.label !== currentLabel;
                const isDifferentShape = shape !== type;
                const isVolumeWithinRange = Math.abs(pan.volume - volume) < maxVolumeDifference;

                if ((isDifferentLabel || !isDifferentLabel && isDifferentShape) && isVolumeWithinRange) {
                    matches.push(`${type}: ${pan.label}`);
                }
            });
        } 
        return matches;  
    }

    // Returns the matches in list form
    function renderMatches() {
        const matches = findMatches();
        if (matches.length === 0) {
            return <p>No substitutions found.</p>;
        }
        return (
            <div>
                <h3>Substitutions:</h3>
                <ul>
                    {matches.map((match, index) => (
                        <li key={index}>{match}</li>
                    ))}
                </ul>
            </div>
        );
    }

    // Renders the component
    return (
        <section className="tool">
            <h2 className="form-title">Pan Sizer</h2>
            <form className="basic-form">
                <p>
                    <label>Shape: </label>
                    <select 
                        id="shape" 
                        name="shape" 
                        value={shape} 
                        onChange={handleShapeChange}
                    >
                        <option value="rectangular">Rectangular</option>
                        <option value="round">Round</option>
                        <option value="springform">Springform</option>
                        <option value="bundt">Bundt</option>
                        <option value="tube">Tube</option>
                        <option value="loaf">Loaf</option>
                    </select>
                </p>

                <p>
                    <label>Dimensions: </label>
                    <select
                        id="shape-dimensions"
                        name="shape-dimensions"
                        value={selectedDimensionsIndex}
                        onChange={handleDimensionChange}
                    >  

                    {/* Map over dimension options to display in dropdown */}
                    {pans[shape].map((option, index) => (
                        <option key={index} value={index}>
                            {option.label}
                        </option>
                    ))}
                    <option value="custom">Custom</option>
                    </select>
                </p>
                
                {/* Displays additional input boxes (based on chosen shape) only if user chooses to enter custom dimensions */}
                {selectedDimensionsIndex === 'custom' && (shape === 'rectangular' || shape == 'loaf') && (
                    <p>
                        <input 
                            type="number" 
                            name="length" 
                            placeholder="Length" 
                            required 
                            value={currentDimensions.length} 
                            onChange={handleCustomDimensionChange} 
                            className="dimension-input"
                        /> X&nbsp;
                        <input 
                            type="number" 
                            name="width" 
                            placeholder="Width" 
                            required 
                            value={currentDimensions.width} 
                            onChange={handleCustomDimensionChange} 
                            className="dimension-input"
                        /> X&nbsp;
                        <input 
                            type="number" 
                            name="height" 
                            placeholder="Height" 
                            required 
                            value={currentDimensions.height} 
                            onChange={handleCustomDimensionChange} 
                            className="dimension-input"
                        />
                    </p>
                )}
                {selectedDimensionsIndex === 'custom' && !(shape === 'rectangular' || shape == 'loaf') && (
                    <p>
                        <input 
                            type="number" 
                            name="diameter" 
                            placeholder="Diameter" 
                            required 
                            value={currentDimensions.diameter} 
                            onChange={handleCustomDimensionChange} 
                            className="dimension-input"
                        /> X&nbsp;
                        <input 
                            type="number" 
                            name="height" 
                            placeholder="Height" 
                            required 
                            value={currentDimensions.height} 
                            onChange={handleCustomDimensionChange}
                            className="dimension-input"
                        />
                    </p>
                )}

                <button onClick={handleResult}>Enter</button>
                
                {/* Renders a list of pan matches, if any */}
                {isDisplayMatches && 
                    <div>{renderMatches()}</div>
                }
            </form>
        </section>
    );
}