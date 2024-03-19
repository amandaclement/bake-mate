import { useState } from 'react';

export default function Toolbar({ labels, defaultLabel, handleTool }) {

    // State variable for keeping track of the active button's label
    const [activeButton, setActiveButton] = useState(defaultLabel);

    // Handles tool selection
    function handleToolChoice(event, label) {
        // Prevent page reload on button click
        event.preventDefault();

        // Update activeButton to the label of the clicked button
        setActiveButton(label);
        
        // Call handleTool() with the chosen tool, which in turn updates the tool state in App
        handleTool(label);
    }

    // React component for Toolbar
    return (
        <div id="toolbar">
            <div id="toolbar-content">
                <nav>
                    {labels.map(label => (
                        <button 
                            key={label}
                            // Apply the 'active' class to the button only if its label matches activeButton state variable
                            className={activeButton === label ? 'active' : ''}
                            onClick={(event) => handleToolChoice(event, label)}>
                            {label}
                    </button>
                    ))}
                </nav>
            </div>
            {/* Used to create toolbar shape */}
            <div id="toolbar-gap">
                <div id="toolbar-square" />
                <div id="toolbar-ellipse" />
            </div>
        </div>
    );
}