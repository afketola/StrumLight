import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Tutorial: undefined;
  Command: undefined;
  LearnSongs: undefined;
  Tuning: undefined;
  SongDetail: { songId: string };
};

type SongDetailScreenRouteProp = RouteProp<RootStackParamList, 'SongDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Chord {
  name: string;
  position: string;
}

interface TutorialStep {
  step: number;
  description: string;
  duration: string;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  difficulty: string;
  genre: string;
  image: string;
  progress: number;
  chords: Chord[];
  lyrics: { line: string; chord: string }[];
  tutorialSteps: TutorialStep[];
}

// Dummy song data
const songs: Song[] = [
  {
    id: '1',
    title: 'Wonderwall',
    artist: 'Oasis',
    difficulty: 'Beginner',
    genre: 'Rock',
    image: 'https://example.com/wonderwall.jpg',
    progress: 75,
    chords: [
      { name: 'Em', position: '022000' },
      { name: 'G', position: '320003' },
      { name: 'D', position: 'xx0232' },
      { name: 'A7sus4', position: 'x00230' }
    ],
    lyrics: [
      { line: 'Today is gonna be the day', chord: 'Em' },
      { line: 'That they\'re gonna throw it back to you', chord: 'G' },
      { line: 'By now you should\'ve somehow', chord: 'D' },
      { line: 'Realized what you gotta do', chord: 'A7sus4' }
    ],
    tutorialSteps: [
      { step: 1, description: 'Learn the basic chord progression', duration: '5 min' },
      { step: 2, description: 'Practice strumming pattern', duration: '10 min' },
      { step: 3, description: 'Play along with the song', duration: '15 min' }
    ]
  },
  // Add more songs as needed
];

const SongDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SongDetailScreenRouteProp>();
  const [activeTab, setActiveTab] = useState<'chords' | 'tutorial'>('chords');

  const song = songs.find((s) => s.id === route.params.songId);

  if (!song) {
    return (
      <View style={styles.container}>
        <Text>Song not found</Text>
      </View>
    );
  }

  const handleStartTutorial = () => {
    navigation.navigate('Tutorial');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{song.title}</Text>
          <Text style={styles.headerSubtitle}>{song.artist}</Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Song Image and Info */}
        <View style={styles.songInfo}>
          <Image
            source={{ uri: song.image }}
            style={styles.songImage}
            defaultSource={require('../assets/default-song.png')}
          />
          <View style={styles.songDetails}>
            <View style={styles.difficultyContainer}>
              <Text style={styles.difficultyText}>{song.difficulty}</Text>
            </View>
            <Text style={styles.genreText}>{song.genre}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${song.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{song.progress}% Complete</Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'chords' && styles.activeTab]}
            onPress={() => setActiveTab('chords')}
          >
            <Text style={[styles.tabText, activeTab === 'chords' && styles.activeTabText]}>
              Chords
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'tutorial' && styles.activeTab]}
            onPress={() => setActiveTab('tutorial')}
          >
            <Text style={[styles.tabText, activeTab === 'tutorial' && styles.activeTabText]}>
              Tutorial
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'chords' ? (
          <View style={styles.chordsContainer}>
            {song.chords.map((chord, index) => (
              <View key={index} style={styles.chordCard}>
                <Text style={styles.chordName}>{chord.name}</Text>
                <Text style={styles.chordPosition}>{chord.position}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.tutorialContainer}>
            {song.tutorialSteps.map((step, index) => (
              <View key={index} style={styles.tutorialStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.step}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                  <Text style={styles.stepDuration}>{step.duration}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Practice Button */}
      <TouchableOpacity
        style={styles.practiceButton}
        onPress={handleStartTutorial}
      >
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.practiceButtonGradient}
        >
          <Text style={styles.practiceButtonText}>Start Practicing</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    height: 60,
  },
  backButton: {
    padding: 8,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#999',
    fontSize: 14,
  },
  menuButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  songInfo: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  songImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  songDetails: {
    marginLeft: 16,
  },
  difficultyContainer: {
    backgroundColor: '#4c669f',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  genreText: {
    color: '#999',
    fontSize: 14,
  },
  progressContainer: {
    padding: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4c669f',
    borderRadius: 2,
  },
  progressText: {
    color: '#999',
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4c669f',
  },
  tabText: {
    color: '#999',
    fontSize: 16,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  chordsContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  chordCard: {
    width: '48%',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  chordName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chordPosition: {
    color: '#999',
    fontSize: 16,
  },
  tutorialContainer: {
    padding: 16,
  },
  tutorialStep: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4c669f',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepDescription: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  stepDuration: {
    color: '#999',
    fontSize: 14,
  },
  practiceButton: {
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  practiceButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  practiceButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SongDetailScreen; 