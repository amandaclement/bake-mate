import { useState } from 'react';

export default function SectionMenu({ labels, defaultLabel, handleMenuChoice }) {

    // State variable for keeping track of the active button's label
    const [activeButton, setActiveButton] = useState(defaultLabel);

    // Handles menu selection
    function handleChoice(event, label) {
        // Prevent page reload on button click
        event.preventDefault();

        // Update activeButton to the label of the clicked button
        setActiveButton(label);
        
        // Call handleMenuChoice() with the chosen menu label, which in turn updates the state in App
        handleMenuChoice(label);
    }

    // React component for SectionMenu
    return (
        <div className="folder-top">
            <div className="folder-top-content">
                <nav>
                    {labels.map(label => (
                        <button 
                            key={label}
                            // Apply the 'active' class to the button only if its label matches activeButton state variable
                            className={activeButton === label ? 'active' : ''}
                            onClick={(event) => handleChoice(event, label)}>
                            {label}
                    </button>
                    ))}
                </nav>
            </div>
            {/* Used to create folder shape */}
            <div className="folder-top-gap">
                <div className="folder-top-square" />
                <div className="folder-top-ellipse" />
            </div>
        </div>
    );
}