import { useState } from 'react';
import { maxVolumeDifference, defaultPans } from '../utils/panData.js';
import { calculateVolume, generateLabel, initializePanData } from '../utils/panHelpers.js';

// Assign volume and label to each standard pan size
initializePanData();

// React component for Pan Sizer
export default function PanSizer() {

    // State variables
    const [pans, setPans] = useState(defaultPans);
    const [shape, setShape] = useState('rectangular');
    const [dimensionsIndex, setDimensionsIndex] = useState(0);
    const [isDisplayMatches, setIsDisplayMatches] = useState(false);

    // Handles shape change
    function handleShapeChange(event) {
        const type = event.target.value;
        setShape(type);
        setDimensionsIndex(0);
        setIsDisplayMatches(false);
    }

    // Handles dimension change
    function handleDimensionChange(event) {
        const selectedIndex = event.target.value;
        setDimensionsIndex(selectedIndex);
        setIsDisplayMatches(false);
    }

    // Handles custom dimension input entries
    function handleCustomDimensionChange(event) {
        const { name, value } = event.target;

        // Clone pans, add new dimension to clone, then assign clone back to pans
        const updatedPans = { ...pans };
        updatedPans[shape][dimensionsIndex][name] = value;
        setPans(updatedPans);

        setIsDisplayMatches(false);
    }

    // Handles submit button
    function handleResult(event) {
        // Prevent page reload on button click
        event.preventDefault(); 

        // Update volume if dealing with custom dimensions
        if (dimensionsIndex == (pans[shape].length - 1)) {
            // Clone pans, add new volume to clone if needed, then assign clone back to pans
            const updatedPans = { ...pans };
            updatedPans[shape][dimensionsIndex].volume = calculateVolume(shape, pans[shape][dimensionsIndex]);
            setPans(updatedPans);
        }
        setIsDisplayMatches(true);
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
                const isNotCustom = pan.label !== 'Custom';
                const isVolumeWithinRange = Math.abs(pan.volume - volume) < maxVolumeDifference;

                if ((isDifferentLabel || !isDifferentLabel && isDifferentShape) && isNotCustom && isVolumeWithinRange) {
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
                        value={dimensionsIndex}
                        onChange={handleDimensionChange}
                    >  

                    {/* Map over dimension options to display in dropdown */}
                    {pans[shape].map((option, index) => (
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
                            type="number" 
                            name="length" 
                            placeholder="Length" 
                            required 
                            value={pans[shape][dimensionsIndex].length} 
                            onChange={handleCustomDimensionChange} 
                            className="dimension-input"
                        /> X&nbsp;
                        <input 
                            type="number" 
                            name="width" 
                            placeholder="Width" 
                            required 
                            value={pans[shape][dimensionsIndex].width} 
                            onChange={handleCustomDimensionChange} 
                            className="dimension-input"
                        /> X&nbsp;
                        <input 
                            type="number" 
                            name="height" 
                            placeholder="Height" 
                            required 
                            value={pans[shape][dimensionsIndex].height} 
                            onChange={handleCustomDimensionChange} 
                            className="dimension-input"
                        />
                    </p>
                )}
                {dimensionsIndex == (pans[shape].length - 1) && !(shape === 'rectangular' || shape === 'loaf') && (
                    <p>
                        <input 
                            type="number" 
                            name="diameter" 
                            placeholder="Diameter" 
                            required 
                            value={pans[shape][dimensionsIndex].diameter} 
                            onChange={handleCustomDimensionChange} 
                            className="dimension-input"
                        /> X&nbsp;
                        <input 
                            type="number" 
                            name="height" 
                            placeholder="Height" 
                            required 
                            value={pans[shape][dimensionsIndex].height}  
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