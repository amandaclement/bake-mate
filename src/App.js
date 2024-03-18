import Header from './components/Header.jsx';
import UnitConverter from './components/UnitConverter.jsx';
import PanSizer from './components/PanSizer.jsx';
import RecipeScaler from './components/RecipeScaler.jsx';

function App() {
  return (
    <div id="container">
      <Header />
      <div id="main-content">
        <div id="tools">
          <div id="toolbar">
            <div id="toolbar-content" />
            <div id="toolbar-gap">
              <div id="toolbar-square" />
              <div id="toolbar-ellipse" />
            </div>
          </div>
            <RecipeScaler />
        </div>
        <div id="results"></div>
      </div>
    </div>
  );
}

export default App;
