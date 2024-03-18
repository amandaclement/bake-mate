import { useState } from 'react';
import { maxVolumeDifference, defaultPans, panTypes } from '../utils/panData.js';
import { calculateVolume, generateLabel, initializePanData, isInputValid, renderResult } from '../utils/panHelpers.js';

// Assign volume and label to each standard pan size
initializePanData();

// React component for Pan Sizer
export default function PanSizer({ handleResult }) {

    // State variables
    const [pans, setPans] = useState(defaultPans);
    const [shape, setShape] = useState('rectangular');
    const [dimensionsIndex, setDimensionsIndex] = useState(0);

    // Handles shape change
    function handleShapeChange(event) {
        setShape(event.target.value);
        setDimensionsIndex(0);
    }

    // Handles dimension change
    function handleDimensionChange(event) {
        setDimensionsIndex(event.target.value);
    }

    // Handles custom dimension input entries
    function handleCustomDimensionChange(event) {
        const { name, value } = event.target;

        // Clone pans, add new dimension to clone, then assign clone back to pans
        const updatedPans = { ...pans };
        updatedPans[shape][dimensionsIndex][name] = value;
        setPans(updatedPans);
    }

    // Handles submit button which calls handleResult(), passing the new result to it
    function handleSubmit(event) {
        // Prevent page reload on button click
        event.preventDefault(); 

        // Get current pan
        const pan = pans[shape][dimensionsIndex];

        // If number of units value is missing or not greater than 0, prompt user to correct
        if (!isInputValid(pan, shape)) {
            alert('Please enter a value for all custom fields.');
            return;
        }

        // Update volume if dealing with custom dimensions
        if (dimensionsIndex == (pans[shape].length - 1)) {
            // Clone pans, add new volume to clone if needed, then assign clone back to pans
            const updatedPans = { ...pans };
            updatedPans[shape][dimensionsIndex].volume = calculateVolume(shape, pan);
            setPans(updatedPans);
        }

        // Get the array of matches
        const matches = findMatches();

        // Call handleResult() with the new result, which in turn updates the result state in App
        handleResult(renderResult(matches));
    }

    // Returns an array of acceptable pan substitutes, formatted as type:label
    function findMatches() {
        var label = generateLabel(shape, pans[shape][dimensionsIndex]);
        var volume = pans[shape][dimensionsIndex].volume;
        var matches = [];
        for (const type in pans) {
            pans[type].forEach(pan => {
                // Check conditions for matching pans
                const isDifferentLabel = pan.label !== label;
                const isDifferentShape = shape !== type;
                const isNotCustom = pan.label !== 'custom';
                const isVolumeWithinRange = Math.abs(pan.volume - volume) < maxVolumeDifference;

                if ((isDifferentLabel || !isDifferentLabel && isDifferentShape) && isNotCustom && isVolumeWithinRange) {
                    matches.push(`${type}: ${pan.label}`);
                }
            });
        } 
        return matches;  
    }

    // Renders the component
    return (
        <section id="pan-sizer" className="tool">
            <h2 className="form-title">PAN SIZER</h2>
            <form className="basic-form">
                <p>
                    <label>Shape </label>
                    <select 
                        id="shape" 
                        name="shape" 
                        value={shape} 
                        onChange={handleShapeChange}
                    >
                        {panTypes.map((panType) => (
                            <option key={panType} value={panType}>{panType}</option>
                        ))}
                    </select>
                </p>

                <p>
                    <label>Dimensions </label>
                    <select
                        id="shape-dimensions"
                        name="shape-dimensions"
                        value={dimensionsIndex}
                        onChange={handleDimensionChange}
                    >  

                    {/* Map over dimension options to display in dropdown */}
                    {defaultPans[shape].map((option, index) => (
                        <option key={index} value={index}>
                            {option.label}
                        </option>
                    ))}
                    </select>
                </p>
                
                {/* Displays additional input boxes (based on chosen shape) only if user chooses to enter custom dimensions */}
                {dimensionsIndex == (pans[shape].length - 1) && (shape === 'rectangular' || shape === 'loaf') && (
                    <p>
                        <input 
                            className="dimension-input"
                            type="number" 
                            name="length" 
                            placeholder="Length" 
                            required 
                            value={pans[shape][dimensionsIndex].length} 
                            onChange={handleCustomDimensionChange} 
                        /><br />
                        <input 
                            className="dimension-input"
                            type="number" 
                            name="width" 
                            placeholder="Width" 
                            required 
                            value={pans[shape][dimensionsIndex].width} 
                            onChange={handleCustomDimensionChange} 
                        /><br />
                        <input 
                            className="dimension-input"
                            type="number" 
                            name="height" 
                            placeholder="Height" 
                            required 
                            value={pans[shape][dimensionsIndex].height} 
                            onChange={handleCustomDimensionChange} 
                        />
                    </p>
                )}
                {dimensionsIndex == (pans[shape].length - 1) && !(shape === 'rectangular' || shape === 'loaf') && (
                    <p>
                        <input 
                            className="dimension-input"
                            type="number" 
                            name="diameter" 
                            placeholder="Diameter" 
                            required 
                            value={pans[shape][dimensionsIndex].diameter} 
                            onChange={handleCustomDimensionChange} 
                        /><br />
                        <input 
                            className="dimension-input"
                            type="number" 
                            name="height" 
                            placeholder="Height" 
                            required 
                            value={pans[shape][dimensionsIndex].height}  
                            onChange={handleCustomDimensionChange}
                        />
                    </p>
                )}
                <button onClick={handleSubmit}>Submit</button>
            </form>
        </section>
    );
}