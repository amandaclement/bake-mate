import { useState } from 'react';
import { convertMeasurements } from '../utils/recipeHelpers.js';

export default function RecipeScaler() {

    // State variables
    const [originalRecipe, setOriginalRecipe] = useState('');
    const [originalSize, setOriginalSize] = useState(''); 
    const [desiredSize, setDesiredSize] = useState(''); 
    const [result, setResult] = useState(''); 

    // Handles changes to user-inputted recipe
    function handleRecipeChange(event) {
        setOriginalRecipe(event.target.value);
    }

    // Handles changes to original serving size
    function handleOriginalSizeChange(event) {
        setOriginalSize(event.target.value);
        setResult('');
    }

    // Handles change to desired serving size
    function handleDesiredSizeChange(event) {
        setDesiredSize(event.target.value);
        setResult('');
    }

    // Handles submit button
    function handleResult(event) {
        // Prevent page reload on button click
        event.preventDefault();

        // If both or either size values are missing, alert user
        if (originalSize === '' || desiredSize === '') {
            alert('Please enter both the original and desired serving sizes.');
            return;
        }

        // Process the recipe, scaling measurements as needed
        const recipeScaler = desiredSize / originalSize;
        const modifiedRecipe = convertMeasurements(originalRecipe, recipeScaler);

        // Update result state variable
        setResult(modifiedRecipe);
    }

    // React component for Recipe Scaler
    return (
        <section className="tool">
            <h2 className="form-title">Recipe Scaler</h2>
            <p>Paste your recipe: </p>
            <form>
                <textarea 
                    value={originalRecipe}
                    onChange={handleRecipeChange}
                />
                <p>
                    <label>Original serving size: </label>
                    <input 
                        type="number" 
                        name="original-serving-size" 
                        required 
                        value={originalSize} 
                        onChange={handleOriginalSizeChange} 
                    />
                </p>
                <p>
                    <label>Desired serving size: </label>
                    <input 
                        type="number" 
                        name="desired-serving-size" 
                        required 
                        value={desiredSize} 
                        onChange={handleDesiredSizeChange} 
                    />
                </p>
                <button onClick={handleResult}>Enter</button>
                {result}
            </form>
        </section>
    );
}