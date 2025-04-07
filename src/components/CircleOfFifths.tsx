// src/components/CircleOfFifths.tsx
import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Text as SvgText, G } from 'react-native-svg';

// 12 base notes in circle-of-fifths order, with C at the top (index 0)
const circleKeys = [
  "C","G","D","A","E",
  "B","Gb/F#","Db/C#","Ab/G#","Eb/D#","Bb/A#","F"
];

/**
 * A lighter pastel-like rainbow array for 12 wedges.
 * Starting with a red-ish for "C" at the top and moving clockwise.
 * You can reorder or tweak as you prefer.
 */
const wedgeColors = [
  "#FF8080", // light red/pink
  "#FFA177", // orange/peach
  "#FFD680", // light yellow/orange
  "#FFEE80", // pale yellow
  "#C4F47F", // light green
  "#9EF3F3", // aqua
  "#80C4FF", // light sky blue
  "#A89EFF", // light periwinkle
  "#CE80FF", // lilac
  "#FF80FF", // pinkish magenta
  "#FF80CE", // pinkish
  "#FF80A0", // pink/red
];

interface Props {
  size: number;
  onSelectKey: (keyName: string) => void;
  selectedKey?: string;
}

const CircleOfFifths: React.FC<Props> = ({ size, onSelectKey, selectedKey }) => {
  const radius = size / 2;
  const sliceAngle = 360 / 12;
  const innerR = radius * 0.4; // There's a hole in the middle
  const outerR = radius * .95;

  // Helper to create an arc path from startDeg..endDeg
  const createArcPath = (startDeg: number, endDeg: number) => {
    const largeArc = (endDeg - startDeg) > 180 ? 1 : 0;
    const startRad = (Math.PI / 180) * startDeg;
    const endRad   = (Math.PI / 180) * endDeg;

    const x1Out = radius + outerR * Math.cos(startRad);
    const y1Out = radius + outerR * Math.sin(startRad);
    const x2Out = radius + outerR * Math.cos(endRad);
    const y2Out = radius + outerR * Math.sin(endRad);

    const x2In = radius + innerR * Math.cos(endRad);
    const y2In = radius + innerR * Math.sin(endRad);
    const x1In = radius + innerR * Math.cos(startRad);
    const y1In = radius + innerR * Math.sin(startRad);

    return `M ${x1Out},${y1Out}
            A ${outerR},${outerR} 0 ${largeArc} 1 ${x2Out},${y2Out}
            L ${x2In},${y2In}
            A ${innerR},${innerR} 0 ${largeArc} 0 ${x1In},${y1In}
            Z`;
  };

  // We'll store normal wedges and selected wedge separately so the selected wedge is drawn last (on top).
  const normalSlices: JSX.Element[] = [];
  let selectedSlice: JSX.Element | null = null;

  for (let i = 0; i < 12; i++) {
    const keyName = circleKeys[i];
    // offset so "C" is at top => -90 degrees
    const startAngle = i * sliceAngle - 90;
    const endAngle   = startAngle + sliceAngle;
    const pathData   = createArcPath(startAngle, endAngle);

    const fillColor = wedgeColors[i % wedgeColors.length];

    // midpoint angle for label
    const midAngle = startAngle + sliceAngle / 2;
    const midRad   = (Math.PI / 180) * midAngle;
    const midR     = (innerR + outerR) / 2;
    const labelX   = radius + midR * Math.cos(midRad);
    const labelY   = radius + midR * Math.sin(midRad);

    // Check if this wedge is selected
    if (keyName !== selectedKey) {
      normalSlices.push(
        <G key={keyName} onPress={() => onSelectKey(keyName)}>
          <Path
            d={pathData}
            fill={fillColor}
            stroke="#000"
            strokeWidth={1}
          />
          <SvgText
            x={labelX}
            y={labelY}
            fill="#000" // White text for better contrast
            fontSize="15" // slightly bigger font
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {keyName}
          </SvgText>
        </G>
      );
    } else {
      // This wedge is selected => draw later
      selectedSlice = (
        <G key={keyName} onPress={() => onSelectKey(keyName)}>
          <Path
            d={pathData}
            fill={fillColor}
            // Use a dark gray outline, thicker stroke
            stroke="#333"
            strokeWidth={4}
          />
          <SvgText
            x={labelX}
            y={labelY}
            fill="#000"
            fontSize="15"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {keyName}
          </SvgText>
        </G>
      );
    }
  }

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Draw normal wedges first */}
        {normalSlices}
        {/* Then draw the selected wedge on top */}
        {selectedSlice}
      </Svg>
    </View>
  );
};

export default CircleOfFifths;
