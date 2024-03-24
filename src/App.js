import { useState } from 'react';
import Header from './components/Header.jsx';
import Toolbar from './components/Toolbar.jsx';
import UnitConverter from './components/UnitConverter.jsx';
import PanSizer from './components/PanSizer.jsx';
import RecipeScaler from './components/RecipeScaler.jsx';
import Result from './components/Result.jsx';
import Note from './components/Note.jsx';

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
  const [result, setResult] = useState('');

  // State variable for notes
  const [notes, setNotes] = useState([]);

  // Handles setting tool based on user's choice from toolbar options
  function handleTool(label) {
    setToolLabel(label);

    // Also reset result on tool change
    setResult('');
  }

  // Handles updating result, which gets triggered by tool button
  function handleResult(newResult) {
    setResult(
      <div id="result-text">{newResult}</div>
    );
  }

  // Handles adding a new note, which gets triggered by result button
  function addNote() {
    // Create a new Note component and add it to the existing notes array
    const newNote = <Note key={notes.length + 1} title={`Note ${notes.length + 1}`} content={result} />;
    setNotes(prevNotes => [...prevNotes, newNote]);
  }

  // Renders selected tool component
  function renderToolComponent() {
    // Get tool component corresponding to label
    const Tool = getComponentFromLabel(toolLabel, tools);

    // Return it in valid component form, with handleResult() passed to it to as a prop to be invoked when user submits form
    return <Tool handleResult={handleResult} />;
  }

  return (
    <div id="container">
      <Header />
      <div id="main-content">
        <section id="tool-container">
          <Toolbar labels={toolLabels} defaultLabel={defaultToolLabel} handleTool={handleTool} />

          {/* Render active tool component */}
          {renderToolComponent()} 
        </section>
        <section id="result-container">
          {result && <Result content={result} addNote={addNote} />}
        </section>
      </div>

      {/* Render notes */}
      <section id="note-container">
        {notes.map((note, index) => (
          <div key={index}>{note}</div>
        ))}
      </section>

      {/* <Note title="Note" content={result} /> */}
      <p id="size-message">BakeMate is not yet optimized for this screen size. Please increase width for now.</p>
    </div>
  );
}

export default App;
