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

        // If both or either size values are missing or not greater than 0, prompt user to correct
        if (originalSize <= 0 || desiredSize <= 0) {
            alert('Please enter a value greater than 0 for both the original and desired serving sizes.');
            return;
        }

        // Calculate scaler value
        const recipeScaler = desiredSize / originalSize;

        // Process the recipe, scaling measurements as needed
        const modifiedRecipe = convertMeasurements(originalRecipe, recipeScaler);

        // Update result state variable
        setResult(modifiedRecipe);
    }

    // React component for Recipe Scaler
    return (
        <section id="recipe-scaler" className="tool">
            <h2 className="form-title">RECIPE SCALER</h2>
            <form>
                <p>
                    <label>Recipe</label>
                    <textarea 
                        value={originalRecipe}
                        onChange={handleRecipeChange}
                    />
                </p>
                <p>
                    <label>Original serving size </label>
                    <input 
                        className="number-input"
                        type="number" 
                        name="original-serving-size" 
                        required 
                        value={originalSize} 
                        onChange={handleOriginalSizeChange} 
                    />
                </p>
                <p>
                    <label>Desired serving size </label>
                    <input 
                        className="number-input"
                        type="number" 
                        name="desired-serving-size" 
                        required 
                        value={desiredSize} 
                        onChange={handleDesiredSizeChange} 
                    />
                </p>
                <button onClick={handleResult}>Submit</button>
                {result}
            </form>
        </section>
    );
}