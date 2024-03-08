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

const maxVolumeDifference = 0.1;

// Generates dimension options for specific pan type
function dimensionOptions(type) {
    if (type === 'rectangular' || type === 'loaf') {
        return pans[type].map(({ length, width, height }) => ({
            value: { length, width, height },
            label: `${length} x ${width} x ${height}`
        }));
    } else {
        return pans[type].map(({ diameter, height }) => ({
            value: { diameter, height },
            label: `${diameter} x ${height}`
        }));
    }
}

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
// Scaler is used in a very rudimentary way to account for loss of volume due to angled base of bundt cakes
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
        return calculateHollowCylinderVolume(dimensions, 0.7); 
    }
}

// Adds corresponding volume for each dimension set in pans
function addVolumes() {
    for (const type in pans) {
        pans[type].forEach(dimensions => {
            dimensions.volume = calculateVolume(type, dimensions);
        });
    }
}
addVolumes();

// Generates dimension options for specific pan type
function getDimensions(type, pan) {
    if (type === 'rectangular' || type === 'loaf') {
        return `${pan.length} x ${pan.width} x ${pan.height}`;
    } else {
        return `${pan.diameter} x ${pan.height}`;
    }
}

// React component for Pan Sizer
export default function PanSizer() {

    // State variable for selected shape
    const [shape, setShape] = useState('rectangular');

    // State variable for dimensions of selected shape
    const [dimensions, setDimensions] = useState(dimensionOptions('rectangular'));
    
    // State variable for index of selected dimensions
    const [selectedDimensionsIndex, setSelectedDimensionsIndex] = useState(0);

    // Event handler for shape change
    function handleShapeChange(event) {
        const type = event.target.value;
        setShape(type);

        // Update dimensions based on the selected shape
        setDimensions(dimensionOptions(type));

        // Reset selected dimension to the first one
        setSelectedDimensionsIndex(0);
    }

    // Event handler for dimension change
    function handleDimensionChange(event) {
        // event.target.value represents the selected index
        setSelectedDimensionsIndex(event.target.value);
    }

    // Returns an array of acceptable pan conversions, formatted as [pan type, pan dimension string]
    function findMatches(shape, selectedVolume) {
        var matches = [];
        for (const type in pans) {
            if (type !== shape) {
                pans[type].forEach(pan => {
                    if (Math.abs(pan.volume - selectedVolume) < maxVolumeDifference) {
                        matches.push([type, getDimensions(type, pan)]);
                    }
                });
            }
        } 
        return matches;  
    }

    // Renders the matches array in list form
    function renderMatches(shape, selectedVolume) {
        const matches = findMatches(shape, selectedVolume);
        if (matches.length === 0) {
            return <p>No substitutions found.</p>;
        }
        return (
            <div>
                <h3>Can be substituted with</h3>
                <ul>
                    {matches.map((item, index) => (
                        <li key={index}>{item[0]}: {item[1]}</li>
                    ))}
                </ul>
            </div>
        );
    }

    // Render the component
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
                    {dimensions.map((option, index) => (
                        <option key={index} value={index}>
                            {option.label}
                        </option>
                    ))}
                    </select>
                </p>
                
                <div id="pan-matches">
                    {/* Display matches, if any */}
                    {renderMatches(shape, pans[shape][selectedDimensionsIndex].volume)}
                </div>
            </form>
        </section>
    );
}