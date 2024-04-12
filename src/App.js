import { useState } from 'react';
import Header from './components/Header.jsx';
import SectionMenu from './components/SectionMenu.jsx';
import UnitConverter from './components/UnitConverter.jsx';
import PanSizer from './components/PanSizer.jsx';
import RecipeScaler from './components/RecipeScaler.jsx';
import Result from './components/Result.jsx';

// Array of objects containing tool components and their labels
const tools = [
  { component: UnitConverter, label: 'Unit Converter' },
  { component: PanSizer, label: 'Pan Sizer' },
  { component: RecipeScaler, label: 'Recipe Scaler' },
];

// Extracts labels from the tools array
const toolLabels = tools.map(tool => tool.label);

// Serves as default tool label
const defaultToolLabel = toolLabels[0];

// Returns a component from its label
function getComponentFromLabel(label, componentObjectArray) {
  // Find the object with the chosen label
  const obj = componentObjectArray.find((component) => component.label === label);

  // Return the object's component property if it's found, otherwise return null
  return obj ? obj.component : null;
}

function App() {

  // State variable for tracking active tool
  const [toolLabel, setToolLabel] = useState(defaultToolLabel);

  // State variable for updating result of calculation
  const [toolResult, setToolResult] = useState('');

  // State variable for recipes
  const [recipes, setRecipes] = useState({});

  // State variable for tracking active recipe
  const [recipeLabel, setRecipeLabel] = useState('');

  // Handles setting tool based on user's choice from menu options
  function handleToolChoice(label) {
    setToolLabel(label);
    setToolResult(''); 
  }

  // Handles setting recipe based on user's choice from menu options
  function handleRecipeChoice(label) {
    setRecipeLabel(label);
  }

  // Handles updating result, which gets triggered by tool button
  function handleToolResult(newResult) {
    setToolResult(
      <div id="result-text">{newResult}</div>
    );
  }

  // Adds a new recipe to recipes
  function addRecipe(title, content) {
    const placeholderTitle = Object.keys(recipes).length; // temporary
    setRecipes(prevRecipes => ({
      ...prevRecipes,
      [placeholderTitle]: content
    }));
  }

  // Renders selected tool component
  function renderToolComponent() {
    // Get tool component corresponding to label
    const Tool = getComponentFromLabel(toolLabel, tools);

    // Return it in valid component form, with handleResult() passed to it to as a prop to be invoked when user submits form
    return <Tool handleResult={handleToolResult} />;
  }

  // Renders recipe content
  function renderRecipeContent() {
    const content = recipes[recipeLabel];
    return <div>{content}</div>;
  }

  return (
    <div id="container">
      <Header />
      <div id="main-content">
        <section id="tool-container" className="folder">
          {/* <Toolbar labels={toolLabels} defaultLabel={defaultToolLabel} handleTool={handleTool} /> */}
          <SectionMenu labels={toolLabels} defaultLabel={defaultToolLabel} handleMenuChoice={handleToolChoice} />
          {renderToolComponent()} 
        </section>
        <section id="result-container">
          {/* {result && <Result content={result} addNote={addNote} />} */}
          {toolResult && <Result content={toolResult} addRecipe={addRecipe} />}
        </section>

        <section id="recipe-container" className="folder">
          <SectionMenu labels={Object.keys(recipes)} defaultLabel={null} handleMenuChoice={handleRecipeChoice} />
          <section className="folder-bottom">
            {renderRecipeContent()}
          </section>
      </section>
      </div>

      <p id="size-message">BakeMate is not yet optimized for this screen size. Please increase width for now.</p>
    </div>
  );
}

export default App;
