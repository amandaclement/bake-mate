import { useState } from 'react';
import { unitTypes } from '../utils/unitData.js';
import { convertMeasurement } from '../utils/unitHelpers.js';

export default function UnitConverter() {

    // State variables
    const [numUnits, setNumUnits] = useState(''); 
    const [originalUnit, setOriginalUnit] = useState(unitTypes[0]);
    const [desiredUnit, setDesiredUnit] = useState(unitTypes[0]); 
    const [result, setResult] = useState(''); 

    // Handles changes to number of units
    function handleNumUnitsChange(event) {
        setNumUnits(event.target.value);
        setResult('');
    }

    // Handles changes to original unit type
    function handleOriginalUnitChange(event) {
        setOriginalUnit(event.target.value);
        setResult('');
    }

    // Handles changes to desired unit type
    function handleDesiredUnitChange(event) {
        setDesiredUnit(event.target.value);
        setResult('');
    }

    // Prepares measurement conversion to be rendered
    function renderResult(conversion) {
        return (
            <div>
                <h3>Conversion: </h3>
                <p>{conversion} {desiredUnit}</p>
            </div>
        );
    }

    // Handles submit button
    function handleResult(event) {
        // Prevent page reload on button click
        event.preventDefault(); 

        // If number of units value is missing or not greater than 0, prompt user to correct
        if (numUnits <= 0) {
            alert('Please enter a value greater than 0 for number of units.');
            return;
        }

        // Calculate conversion
        const conversion = convertMeasurement(originalUnit, desiredUnit, numUnits);

        // Update result
        setResult(renderResult(conversion));
    }
    
    return (
        <section id="unit-converter" className="tool">
            <h2 className="form-title">Unit Converter</h2>
            <form className="basic-form">
                <p>
                    <label>Number of units: </label>
                    <input 
                        className="number-input"
                        name="num-units"
                        type="number" 
                        value={numUnits} 
                        onChange={handleNumUnitsChange}
                    />  
                </p>
                <p>
                    <label>From: </label>
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
                    <label>To: </label>
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
                <button onClick={handleResult}>Enter</button>
                {result}
            </form>
        </section>
    );
}