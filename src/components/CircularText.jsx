export default function CircularText({ text, textId, symbol, symbolId, radius, margin }) {
  
  // Center of SVG canvas
  const center = radius * 2;
  
  return (
    // Set width and height of the SVG
    <svg width={radius*4} height={radius*3}>

      {/* Render an invisible circle to define the path */}
      <circle cx={center} cy={center} r={radius} fill="none" stroke="none" />

      {/* Define path for the circular text */}
      <defs>
        <path id="textPath" d={`M ${center - radius - margin} ${center} 
                                a ${radius + margin},${radius + margin} 0 0,1 
                                ${2 * (radius + margin)},0`} />
      </defs>

      {/* Create a text element, applying the circular path to the text */}
      <text textAnchor="middle">
        <textPath xlinkHref="#textPath" id={textId} startOffset="50%">
          {text}
        </textPath>
      </text>

      {/* If a symbol is provided, render it in center of circle */}
      {symbol &&
        <text x={center} y={center} textAnchor="middle" alignmentBaseline="central" id={symbolId}>
          {symbol}
        </text>
      }
    </svg>
  );
}