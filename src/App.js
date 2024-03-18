import { useState } from 'react';
import Header from './components/Header.jsx';
import UnitConverter from './components/UnitConverter.jsx';
import PanSizer from './components/PanSizer.jsx';
import RecipeScaler from './components/RecipeScaler.jsx';

function App() {

  // State variable for updating result of calculation
  const [result, setResult] = useState('');

  // Handles updating result, which gets triggered by tool (e.g. RecipeScaler) button
  function handleResult(newResult) {
    setResult(newResult);
  }

  return (
    <div id="container">
      <Header />
      <div id="main-content">
        <div id="tool-container">
          <div id="toolbar">
            <div id="toolbar-content" />
            <div id="toolbar-gap">
              <div id="toolbar-square" />
              <div id="toolbar-ellipse" />
            </div>
          </div>
            {/* Active tool component, with handleResult() passed to it to as a prop to be invoked when user submits form */}
            <UnitConverter handleResult={handleResult} />
        </div>
        <div id="result-container">
          <h2>RESULT</h2>
          <div id="result">
            {result}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
