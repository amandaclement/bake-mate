import Header from './components/Header.jsx';
import PanSizer from './components/PanSizer.jsx';
import RecipeScaler from './components/RecipeScaler.jsx';

function App() {
  return (
    <>
      <Header />
      <div id="tools">
        <PanSizer />
        <RecipeScaler />
      </div>
    </>
  );
}

export default App;
