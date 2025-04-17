// src/screens/TutorialScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Image,
  Dimensions,
  ScrollView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const { width, height } = Dimensions.get('window');

// Define navigation types to match RootNavigator
type RootStackParamList = {
  Home: undefined;
  Tutorial: undefined;
  DemoSong: undefined;
  Command: undefined;
  Settings: undefined;
  Tuning: undefined;
  LearnSongs: undefined;
  BluetoothSetup: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Tutorial'>;

const TutorialScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState(0);
  
  const handleStartDemo = () => {
    navigation.navigate('DemoSong');
  };

  const handleLearnMore = () => {
    navigation.navigate('LearnSongs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Welcome to Strumlight</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>

          
          <Text style={styles.title}>Your Guitar Learning Companion</Text>
          
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 0 && styles.activeTab]} 
              onPress={() => setActiveTab(0)}
            >
              <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>How It Works</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 1 && styles.activeTab]} 
              onPress={() => setActiveTab(1)}
            >
              <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>Features</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 2 && styles.activeTab]} 
              onPress={() => setActiveTab(2)}
            >
              <Text style={[styles.tabText, activeTab === 2 && styles.activeTabText]}>Song Library</Text>
            </TouchableOpacity>
          </View>
          
          {activeTab === 0 && (
            <View style={styles.tabContent}>
              <View style={styles.card}>
                <Text style={styles.subtitle}>Interactive Learning System</Text>
                <Text style={styles.description}>
                  Strumlight connects to your guitar and guides you through songs with real-time feedback. Watch notes move across the staff and play the correct strings at the right time.
                </Text>
                
                <View style={styles.demoContainer}>
                  <View style={styles.staffPreview}>
                    <View style={styles.staffLines}>
                      {[0, 1, 2, 3, 4].map((i) => (
                        <View key={i} style={styles.staffLine} />
                      ))}
                    </View>
                    <View style={styles.playZone}>
                      <View style={styles.playZoneBorder} />
                      <View style={styles.playZoneBorder} />
                    </View>
                    <View style={styles.notePreview} />
                  </View>
                  <Text style={styles.demoText}>Notes move toward the playing zone</Text>
                </View>
              </View>
            </View>
          )}
          
          {activeTab === 1 && (
            <View style={styles.tabContent}>
              <View style={styles.card}>
                <Text style={styles.subtitle}>Key Features</Text>
                
                <View style={styles.featuresContainer}>
                  <View style={styles.featureItem}>
                    <View style={styles.iconContainer}>
                      <Text style={styles.iconText}>🎵</Text>
                    </View>
                    <View style={styles.featureTextContainer}>
                      <Text style={styles.featureTitle}>Real-time Feedback</Text>
                      <Text style={styles.featureDescription}>Get instant feedback on your playing accuracy</Text>
                    </View>
                  </View>
                  
                  <View style={styles.featureItem}>
                    <View style={styles.iconContainer}>
                      <Text style={styles.iconText}>📚</Text>
                    </View>
                    <View style={styles.featureTextContainer}>
                      <Text style={styles.featureTitle}>Extensive Song Library</Text>
                      <Text style={styles.featureDescription}>Learn from hundreds of songs across genres</Text>
                    </View>
                  </View>
                  
                  <View style={styles.featureItem}>
                    <View style={styles.iconContainer}>
                      <Text style={styles.iconText}>🎸</Text>
                    </View>
                    <View style={styles.featureTextContainer}>
                      <Text style={styles.featureTitle}>Chord Diagrams</Text>
                      <Text style={styles.featureDescription}>Visual guides for proper fingering</Text>
                    </View>
                  </View>
                  
                  <View style={styles.featureItem}>
                    <View style={styles.iconContainer}>
                      <Text style={styles.iconText}>🎯</Text>
                    </View>
                    <View style={styles.featureTextContainer}>
                      <Text style={styles.featureTitle}>Progress Tracking</Text>
                      <Text style={styles.featureDescription}>Monitor your improvement over time</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
          
          {activeTab === 2 && (
            <View style={styles.tabContent}>
              <View style={styles.card}>
                <Text style={styles.subtitle}>Universal Song Library</Text>
                <Text style={styles.description}>
                  Our system works with any song in our library. From beginner-friendly tunes to advanced pieces, you can learn at your own pace.
                </Text>
                
                <View style={styles.songLibraryPreview}>
                  <View style={styles.songItem}>
                    <Text style={styles.songTitle}>Wonderwall</Text>
                    <Text style={styles.songArtist}>Oasis</Text>
                    <View style={styles.difficultyContainer}>
                      <View style={[styles.difficultyDot, styles.difficultyEasy]} />
                      <View style={[styles.difficultyDot, styles.difficultyEasy]} />
                      <View style={[styles.difficultyDot, styles.difficultyMedium]} />
                    </View>
                  </View>
                  
                  <View style={styles.songItem}>
                    <Text style={styles.songTitle}>Sweet Child O' Mine</Text>
                    <Text style={styles.songArtist}>Guns N' Roses</Text>
                    <View style={styles.difficultyContainer}>
                      <View style={[styles.difficultyDot, styles.difficultyMedium]} />
                      <View style={[styles.difficultyDot, styles.difficultyMedium]} />
                      <View style={[styles.difficultyDot, styles.difficultyHard]} />
                    </View>
                  </View>
                  
                  <View style={styles.songItem}>
                    <Text style={styles.songTitle}>Nothing Else Matters</Text>
                    <Text style={styles.songArtist}>Metallica</Text>
                    <View style={styles.difficultyContainer}>
                      <View style={[styles.difficultyDot, styles.difficultyHard]} />
                      <View style={[styles.difficultyDot, styles.difficultyHard]} />
                      <View style={[styles.difficultyDot, styles.difficultyHard]} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleLearnMore}
        >
          <Text style={styles.secondaryButtonText}>Explore Song Library</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleStartDemo}
        >
          <Text style={styles.primaryButtonText}>Try Demo Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  imageContainer: {
    width: width * 0.7,
    height: width * 0.5,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333333',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    width: '100%',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b5998',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
  },
  activeTabText: {
    color: '#3b5998',
    fontWeight: 'bold',
  },
  tabContent: {
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color: '#666666',
  },
  demoContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  staffPreview: {
    width: '100%',
    height: 120,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 10,
  },
  staffLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  staffLine: {
    height: 1,
    backgroundColor: '#333333',
    width: '100%',
  },
  playZone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '40%',
    width: '20%',
    backgroundColor: 'rgba(59, 89, 152, 0.1)',
  },
  playZoneBorder: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#3b5998',
  },
  notePreview: {
    position: 'absolute',
    top: '50%',
    left: '20%',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3b5998',
    transform: [{ translateY: -10 }],
  },
  demoText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  featuresContainer: {
    marginTop: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(59, 89, 152, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
    color: '#3b5998',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666666',
  },
  songLibraryPreview: {
    marginTop: 10,
  },
  songItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  songArtist: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  difficultyContainer: {
    flexDirection: 'row',
  },
  difficultyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  difficultyEasy: {
    backgroundColor: '#4CAF50',
  },
  difficultyMedium: {
    backgroundColor: '#FFC107',
  },
  difficultyHard: {
    backgroundColor: '#F44336',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#3b5998',
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b5998',
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#3b5998',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TutorialScreen;
