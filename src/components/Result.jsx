import React, { useState } from 'react';

export default function Result({ content, addNote }) {

    // State variable for extending button on hover
    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            <h2>RESULT</h2>
            <div className="result">
                {content}
            </div>
            <button 
                onMouseEnter={() => setIsHovered(true)} 
                onMouseLeave={() => setIsHovered(false)}
                onClick={addNote}
            >
                {isHovered ? '+ SAVE AS NOTE' : '+'}
            </button>
        </>
    );
}