import { useState } from 'react';

// Standard pan shapes and their dimensions
const pans = {
    rectangular: [
        { length: 8, width: 8, height: 2 },
        { length: 9, width: 9, height: 2 },
        { length: 10, width: 10, height: 2 },
        { length: 11, width: 7, height: 2 },
        { length: 13, width: 9, height: 2 }
    ],
    round: [
        { diameter: 6, height: 2 },
        { diameter: 9, height: 2 },
        { diameter: 9, height: 2 }
    ],
    springform: [
        { diameter: 9, height: 2.5 },
        { diameter: 10, height: 2.5 }
    ],
    bundt: [
        { diameter: 10, height: 3 }
    ],
    tube: [
        { diameter: 9, height: 3 }
    ],
    loaf: [
        { length: 8, width: 4, height: 3 },
        { length: 9, width: 5, height: 3 }
    ],
};

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

    // Get the selected dimension based on the selected index
    const selectedDimension = dimensions[selectedDimensionsIndex];

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
                        <option value="loaf">Loaf</option>
                        <option value="bundt">Bundt</option>
                        <option value="tube">Tube</option>
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
                
                <div>
                    {/* Display selected shape and dimensions */}
                    <p>{`Chosen shape: ${shape}`}</p>
                    <p>Dimensions: </p>
                    {(shape === 'rectangular' || shape === 'loaf') ?
                    `Length: ${selectedDimension.value.length}, Width: ${selectedDimension.value.width}, Height: ${selectedDimension.value.height}` :
                    `Diameter: ${selectedDimension.value.diameter}, Height: ${selectedDimension.value.height}` }
                </div>
            </form>
        </section>
    );
}