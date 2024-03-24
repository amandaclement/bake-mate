import { useState } from 'react';
import { unitTypes } from '../utils/unitData.js';
import { convertMeasurement, renderResult } from '../utils/unitHelpers.js';

export default function UnitConverter({ handleResult }) {

    // State variables
    const [numUnits, setNumUnits] = useState(''); 
    const [originalUnit, setOriginalUnit] = useState(unitTypes[0]);
    const [desiredUnit, setDesiredUnit] = useState(unitTypes[0]); 

    // Handles changes to number of units
    function handleNumUnitsChange(event) {
        setNumUnits(event.target.value);
    }

    // Handles changes to original unit type
    function handleOriginalUnitChange(event) {
        setOriginalUnit(event.target.value);
    }

    // Handles changes to desired unit type
    function handleDesiredUnitChange(event) {
        setDesiredUnit(event.target.value);
    }

    // Handles submit button which calls handleResult(), passing the new result to it
    function handleSubmit(event) {
        // Prevent page reload on button click
        event.preventDefault(); 

        // If number of units value is missing or not greater than 0, prompt user to correct
        if (numUnits <= 0) {
            alert('Please enter a value greater than 0 for number of units.');
            return;
        }

        // Calculate conversion
        const conversion = convertMeasurement(originalUnit, desiredUnit, numUnits);

        // Call handleResult() with the new result, which in turn updates the result state in App
        handleResult(renderResult(conversion, desiredUnit));
    }
    
    // React component for Unit Converter
    return (
        <section id="unit-converter" className="tool folder-bottom">
            <h2 className="form-title">UNIT CONVERTER</h2>
            <form className="basic-form">
                <p>
                    <label>Number of Units </label>
                    <input 
                        className="number-input"
                        name="num-units"
                        type="number" 
                        value={numUnits} 
                        onChange={handleNumUnitsChange}
                    />  
                </p>
                <p>
                    <label>From </label>
                    <select 
                        name="originalUnit"
                        value={originalUnit} 
                        onChange={handleOriginalUnitChange}
                    >
                        {unitTypes.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </p>
                <p>
                    <label>To </label>
                    <select 
                        name="desiredUnit"
                        value={desiredUnit} 
                        onChange={handleDesiredUnitChange}
                    >
                        {unitTypes.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </p>
                <button onClick={handleSubmit}>Submit</button>
            </form>
        </section>
    );
}