// TuningScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define navigation types
type RootStackParamList = {
  Home: undefined;
  Tuning: undefined;
  DemoSong: undefined;
  LearnSongs: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Tuning'>;

// Define string data
interface StringData {
  name: string;
  note: string;
  frequency: number;
  isSelected: boolean;
  tuningStatus: 'in-tune' | 'sharp' | 'flat' | 'not-tuned';
}

const TuningScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [strings, setStrings] = useState<StringData[]>([
    { name: 'Low E', note: 'E2', frequency: 82.41, isSelected: false, tuningStatus: 'not-tuned' },
    { name: 'A', note: 'A2', frequency: 110.00, isSelected: false, tuningStatus: 'not-tuned' },
    { name: 'D', note: 'D3', frequency: 146.83, isSelected: false, tuningStatus: 'not-tuned' },
    { name: 'G', note: 'G3', frequency: 196.00, isSelected: false, tuningStatus: 'not-tuned' },
    { name: 'B', note: 'B3', frequency: 246.94, isSelected: false, tuningStatus: 'not-tuned' },
    { name: 'High E', note: 'E4', frequency: 329.63, isSelected: false, tuningStatus: 'not-tuned' },
  ]);
  const [currentFrequency, setCurrentFrequency] = useState<number>(0);
  const [tuningDirection, setTuningDirection] = useState<'sharp' | 'flat' | 'in-tune' | null>(null);
  const [tuningProgress, setTuningProgress] = useState<number>(0);

  // Simulate tuning process
  useEffect(() => {
    let tuningInterval: NodeJS.Timeout | null = null;
    
    const selectedString = strings.find(s => s.isSelected);
    
    if (selectedString) {
      // Simulate frequency changes
      let simulatedFreq = selectedString.frequency - 5 + Math.random() * 10;
      setCurrentFrequency(simulatedFreq);
      
      // Determine tuning direction
      if (Math.abs(simulatedFreq - selectedString.frequency) < 0.5) {
        setTuningDirection('in-tune');
        setTuningProgress(100);
        
        // Update string status after a delay
        setTimeout(() => {
          setStrings(prevStrings => 
            prevStrings.map(s => 
              s.name === selectedString.name 
                ? { ...s, tuningStatus: 'in-tune', isSelected: false } 
                : s
            )
          );
          setTuningDirection(null);
          setTuningProgress(0);
        }, 1000);
      } else if (simulatedFreq > selectedString.frequency) {
        setTuningDirection('sharp');
        setTuningProgress(Math.min(100, (simulatedFreq - selectedString.frequency) * 10));
      } else {
        setTuningDirection('flat');
        setTuningProgress(Math.min(100, (selectedString.frequency - simulatedFreq) * 10));
      }
      
      // Continue simulating
      tuningInterval = setInterval(() => {
        simulatedFreq = selectedString.frequency - 5 + Math.random() * 10;
        setCurrentFrequency(simulatedFreq);
        
        if (Math.abs(simulatedFreq - selectedString.frequency) < 0.5) {
          setTuningDirection('in-tune');
          setTuningProgress(100);
          
          // Update string status after a delay
          setTimeout(() => {
            setStrings(prevStrings => 
              prevStrings.map(s => 
                s.name === selectedString.name 
                  ? { ...s, tuningStatus: 'in-tune', isSelected: false } 
                  : s
              )
            );
            setTuningDirection(null);
            setTuningProgress(0);
          }, 1000);
          
          if (tuningInterval) {
            clearInterval(tuningInterval);
          }
        } else if (simulatedFreq > selectedString.frequency) {
          setTuningDirection('sharp');
          setTuningProgress(Math.min(100, (simulatedFreq - selectedString.frequency) * 10));
        } else {
          setTuningDirection('flat');
          setTuningProgress(Math.min(100, (selectedString.frequency - simulatedFreq) * 10));
        }
      }, 500);
    }
    
    return () => {
      if (tuningInterval) {
        clearInterval(tuningInterval);
      }
    };
  }, [strings]);

  const selectString = (stringName: string) => {
    setStrings(prevStrings => 
      prevStrings.map(s => 
        s.name === stringName 
          ? { ...s, isSelected: true } 
          : { ...s, isSelected: false }
      )
    );
    setTuningDirection(null);
    setTuningProgress(0);
  };

  const getTuningIndicatorColor = () => {
    switch (tuningDirection) {
      case 'sharp':
        return '#ff9900'; // Orange for sharp
      case 'flat':
        return '#ff3300'; // Red for flat
      case 'in-tune':
        return '#00cc00'; // Green for in-tune
      default:
        return '#cccccc'; // Gray for not tuning
    }
  };

  const getStringStatusColor = (status: string) => {
    switch (status) {
      case 'in-tune':
        return '#00cc00'; // Green
      case 'sharp':
        return '#ff9900'; // Orange
      case 'flat':
        return '#ff3300'; // Red
      default:
        return '#cccccc'; // Gray
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Tuner</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.tunerDisplay}>
          <View style={styles.frequencyDisplay}>
            <Text style={styles.frequencyText}>
              {currentFrequency.toFixed(1)} Hz
            </Text>
          </View>
          
          <View style={styles.tuningIndicator}>
            <View 
              style={[
                styles.indicatorBar, 
                { 
                  width: `${tuningProgress}%`,
                  backgroundColor: getTuningIndicatorColor(),
                  transform: [
                    { translateX: tuningDirection === 'flat' ? -50 : 0 },
                    { translateX: tuningDirection === 'sharp' ? 50 : 0 }
                  ]
                }
              ]} 
            />
            <View style={styles.centerLine} />
          </View>
          
          <Text style={styles.tuningDirectionText}>
            {tuningDirection === 'sharp' ? 'SHARP' : 
             tuningDirection === 'flat' ? 'FLAT' : 
             tuningDirection === 'in-tune' ? 'IN TUNE' : 'SELECT A STRING'}
          </Text>
        </View>
        
        <View style={styles.stringsContainer}>
          {strings.map((string) => (
            <TouchableOpacity
              key={string.name}
              style={[
                styles.stringItem,
                string.isSelected && styles.selectedString
              ]}
              onPress={() => selectString(string.name)}
            >
              <View style={styles.stringInfo}>
                <Text style={styles.stringName}>{string.name}</Text>
                <Text style={styles.stringNote}>{string.note}</Text>
              </View>
              <View style={styles.stringStatus}>
                <View 
                  style={[
                    styles.statusIndicator, 
                    { backgroundColor: getStringStatusColor(string.tuningStatus) }
                  ]} 
                />
                <Text style={styles.statusText}>
                  {string.tuningStatus === 'in-tune' ? 'In Tune' : 
                   string.tuningStatus === 'sharp' ? 'Sharp' : 
                   string.tuningStatus === 'flat' ? 'Flat' : 'Not Tuned'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#333333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tunerDisplay: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  frequencyDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  frequencyText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333333',
  },
  tuningIndicator: {
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    marginBottom: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  indicatorBar: {
    height: '100%',
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -25 }],
    borderRadius: 30,
  },
  centerLine: {
    position: 'absolute',
    left: '50%',
    width: 2,
    height: '100%',
    backgroundColor: '#333333',
  },
  tuningDirectionText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
  },
  stringsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stringItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedString: {
    backgroundColor: '#f0f8ff',
  },
  stringInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stringName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 10,
  },
  stringNote: {
    fontSize: 16,
    color: '#666666',
  },
  stringStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666666',
  },
});

export default TuningScreen;
