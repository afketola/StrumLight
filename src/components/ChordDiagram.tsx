// src/components/ChordDiagram.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Line, Circle, Text as SvgText, G } from 'react-native-svg';
import { chordShapes } from '../helpers/ChordShapes';

/** Returns a color for each status. */
function getColorForStatus(status: string): string {
  switch (status) {
    case "CORRECT": return "#00cc00"; // bright green
    case "HIGHER":  return "orange";
    case "LOWER":   return "red";
    default:        return "#666";
  }
}

/** We'll display 4 frets at a time (or shift them) to handle higher chords. */
const DISPLAYED_FRETS = 4;

interface ChordDiagramProps {
  chordName: string;         // e.g. "C Major"
  stringStatuses: string[];  // e.g. ["NO_NOTE","CORRECT",...], length=6
}

const ChordDiagram: React.FC<ChordDiagramProps> = ({ chordName, stringStatuses }) => {
  const shape = chordShapes[chordName];
  if (!shape) {
    // If chord not found, show nothing or an error placeholder
    return <View style={styles.container} />;
  }

  // 1) Identify min & max fretted note
  const fretted = shape.map(s => s.fret).filter(f => f > 0);
  let minFret = fretted.length > 0 ? Math.min(...fretted) : 1;
  let maxFret = fretted.length > 0 ? Math.max(...fretted) : 4;

  // We'll show 4 frets from minFret..(minFret+3)
  let startFret = minFret;
  // If chord uses more than 4 frets, you could shift or clamp
  // For simplicity, we keep startFret = minFret

  // 2) Dimensions and geometry
  const diagramWidth = 180;
  const diagramHeight = 260;

  const offsetX = 25;
  const offsetY = 40;
  const bottomPadding = 10;

  const fretAreaHeight = diagramHeight - offsetY - bottomPadding;
  const fretSpacing = fretAreaHeight / DISPLAYED_FRETS;
  const chordAreaWidth = diagramWidth - offsetX - 20;

  const numStrings = 6;
  const stringSpacing = chordAreaWidth / (numStrings - 1);

  return (
    <View style={styles.container}>
      <Svg width={diagramWidth} height={diagramHeight}>

        {/* Horizontal lines for the displayed fret range */}
        {Array.from({ length: DISPLAYED_FRETS + 1 }, (_, i) => {
          // i=0 => top line, i=1 => 1st displayed fret, etc.
          const y = offsetY + i * fretSpacing;
          // Thicker if this is the "nut" and startFret=1
          const isNut = (startFret === 1 && i === 0);
          return (
            <Line
              key={`fret-${i}`}
              x1={offsetX}
              y1={y}
              x2={offsetX + chordAreaWidth}
              y2={y}
              stroke={isNut ? "#000" : "#888"}
              strokeWidth={isNut ? 3 : 2}
            />
          );
        })}

        {/* Vertical string lines */}
        {Array.from({ length: numStrings }, (_, i) => {
          const x = offsetX + i * stringSpacing;
          return (
            <Line
              key={`string-${i}`}
              x1={x}
              y1={offsetY}
              x2={x}
              y2={offsetY + fretSpacing * DISPLAYED_FRETS}
              stroke="#888"
              strokeWidth={2}
            />
          );
        })}

        {/* Fret labels (e.g. "1", "2", "3", "4" or "7", "8", "9", "10") */}
        {Array.from({ length: DISPLAYED_FRETS }, (_, i) => {
          const fretNum = startFret + i;  
          const yMid = offsetY + (i + 0.5) * fretSpacing;
          return (
            <SvgText
              key={`fretLabel-${fretNum}`}
              x={offsetX - 15}
              y={yMid}
              fill="#666"
              fontSize="12"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {fretNum}
            </SvgText>
          );
        })}

        {/* X/O markers at the top for strings with fret=-1 or 0 */}
        {shape.map((info, i) => {
          const status = stringStatuses[i] || "NO_NOTE";
          const color = getColorForStatus(status);

          const stringX = offsetX + i * stringSpacing;
          const markerY = offsetY - 12;

          if (info.fret === -1) {
            // X shape
            return (
              <G
                key={`x-${i}`}
                transform={`translate(${stringX}, ${markerY})`}
              >
                {/* Diagonal lines forming X, colored by status */}
                <Line
                  x1={-6} y1={-6} x2={6} y2={6}
                  stroke={color} strokeWidth={3}
                />
                <Line
                  x1={6} y1={-6} x2={-6} y2={6}
                  stroke={color} strokeWidth={3}
                />
              </G>
            );
          }
          else if (info.fret === 0) {
            // O shape (circle outline)
            return (
              <Circle
                key={`o-${i}`}
                cx={stringX}
                cy={markerY}
                r={8}
                fill="none"
                stroke={color}
                strokeWidth={3}
              />
            );
          }
          return null;
        })}

        {/* Fretted notes -> circles on the correct fret row */}
        {shape.map((info, i) => {
          if (info.fret <= 0) return null; // skip X/O

          const status = stringStatuses[i] || "NO_NOTE";
          const fillColor = getColorForStatus(status);

          // convert absolute fret -> displayed fret
          const displayedFret = info.fret - (startFret - 1);
          if (displayedFret < 1 || displayedFret > DISPLAYED_FRETS) {
            // out of displayed range
            return null;
          }

          // place circle in the middle of displayedFret
          const circleX = offsetX + i * stringSpacing;
          const circleY = offsetY + (displayedFret - 0.5) * fretSpacing;
          return (
            <Circle
              key={`finger-${i}`}
              cx={circleX}
              cy={circleY}
              r={10}
              fill={fillColor}
            />
          );
        })}
      </Svg>
    </View>
  );
};

export default ChordDiagram;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
