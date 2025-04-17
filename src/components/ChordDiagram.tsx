import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Line, Circle, Text as SvgText, G } from 'react-native-svg';
import { chordShapes, chordFingers } from '../helpers/ChordShapes';

/** We'll display 4 frets at a time (or shift them) to handle higher chords. */
const DISPLAYED_FRETS = 4;

interface ChordDiagramProps {
  chordName: string;         // e.g. "C Major"
  stringStatuses: string[];  // e.g. ["NO_NOTE","CORRECT",...], length=6
  currentFinger?: number | null; // The current finger that should be used (1-4)
}

/** 
 * We color the main circle based on status and highlight the current finger.
 * Green for correct, gray for default, and show adjustment indicators.
 */
function getMainFillColor(status: string, isCurrent: boolean): string {
  if (isCurrent) {
    return "#3b5998"; // Highlight blue for current finger position
  }
  switch (status) {
    case "CORRECT":
      return "#00cc00"; // bright green
    case "HIGHER":
      return "#ff9900"; // orange for higher
    case "LOWER":
      return "#ff3300"; // red for lower
    case "INCORRECT":
      return "#cc0000"; // dark red for incorrect
    default:
      return "#666666"; // gray for no note
  }
}

function isStatusIndicatingAdjustment(status: string): boolean {
  return (status === "HIGHER" || status === "LOWER");
}

const ChordDiagram: React.FC<ChordDiagramProps> = ({ 
  chordName, 
  stringStatuses,
  currentFinger = null
}) => {
  const shape = chordShapes[chordName];
  const fingers = chordFingers[chordName] || Array(6).fill(0);
  
  if (!shape) {
    return <View style={styles.container} />;
  }

  // 1) Identify min & max fretted note
  const fretted = shape.map(s => s.fret).filter(f => f > 0);
  let minFret = fretted.length > 0 ? Math.min(...fretted) : 1;
  const maxFret = fretted.length > 0 ? Math.max(...fretted) : 4;

  // If minFret >= 2, let's forcibly show 1. 
  // That way we never skip the 1st fret for lower chords
  if (minFret >= 2) {
    minFret = 1;
  }

  // We'll show 4 frets from minFret..(minFret+3)
  let startFret = minFret;

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
          const y = offsetY + i * fretSpacing;
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

        {/* Fret labels */}
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

        {/* X/O markers at the top */}
        {shape.map((stringInfo, i) => {
          const status = stringStatuses[i] || "NO_NOTE";
          const stringX = offsetX + i * stringSpacing;
          const markerY = offsetY - 12;

          if (stringInfo.fret === -1) {
            return (
              <G
                key={`x-${i}`}
                transform={`translate(${stringX}, ${markerY})`}
              >
                <Line
                  x1={-6} y1={-6} x2={6} y2={6}
                  stroke="#666" strokeWidth={3}
                />
                <Line
                  x1={6} y1={-6} x2={-6} y2={6}
                  stroke="#666" strokeWidth={3}
                />
              </G>
            );
          }
          else if (stringInfo.fret === 0) {
            return (
              <Circle
                key={`o-${i}`}
                cx={stringX}
                cy={markerY}
                r={8}
                fill="none"
                stroke="#666"
                strokeWidth={3}
              />
            );
          }
          return null;
        })}

        {/* Fretted notes with finger numbers */}
        {shape.map((stringInfo, i) => {
          if (stringInfo.fret <= 0) return null;

          const status = stringStatuses[i] || "NO_NOTE";
          const finger = fingers[i];
          const isCurrent = finger === currentFinger;
          const mainFillColor = getMainFillColor(status, isCurrent);

          const displayedFret = stringInfo.fret - (startFret - 1);
          if (displayedFret < 1 || displayedFret > DISPLAYED_FRETS) {
            return null;
          }

          const circleX = offsetX + i * stringSpacing;
          const circleY = offsetY + (displayedFret - 0.5) * fretSpacing;

          return (
            <G key={`fingerGroup-${i}`}>
              {/* main circle */}
              <Circle
                cx={circleX}
                cy={circleY}
                r={10}
                fill={mainFillColor}
                stroke={isCurrent ? "#ffffff" : "none"}
                strokeWidth={2}
              />
              
              {/* Finger number */}
              {finger > 0 && (
                <SvgText
                  x={circleX}
                  y={circleY}
                  fill={isCurrent ? "#ffffff" : "#ffffff"}
                  fontSize="12"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {finger}
                </SvgText>
              )}

              {/* Adjustment indicator */}
              {isStatusIndicatingAdjustment(status) && (
                <Circle
                  cx={circleX}
                  cy={
                    status === "HIGHER"
                      ? circleY - 12
                      : circleY + 12
                  }
                  r={5}
                  fill={status === "HIGHER" ? "#ff9900" : "#ff3300"}
                />
              )}
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChordDiagram;
