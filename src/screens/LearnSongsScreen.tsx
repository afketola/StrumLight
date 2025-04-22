import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  FlatList,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { StackNavigationProp } from '@react-navigation/stack';
import { songs, Song } from '../data/songs';

// Define the navigation param list type
type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Tutorial: undefined;
  Command: undefined;
  LearnSongs: undefined;
  Tuning: undefined;
  SongDetail: { songId: string };
  SongPlay: { song: Song };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const LearnSongsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Filter songs based on search query and filters
  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || song.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  // Get unique difficulties for filters
  const difficulties = Array.from(new Set(songs.map(song => song.difficulty)));

  const handleSongPress = (song: Song) => {
    // Navigate to the song play screen with the selected song
    navigation.navigate('SongPlay', { song });
  };

  const renderSongItem = ({ item }: { item: Song }) => (
    <TouchableOpacity 
      style={styles.songCard}
      onPress={() => handleSongPress(item)}
    >
      <Image 
        source={typeof item.thumbnailUrl === 'string' ? { uri: item.thumbnailUrl } : item.thumbnailUrl} 
        style={styles.songImage} 
      />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
        <View style={styles.songMeta}>
          <View style={styles.metaItem}>
            <Feather name="activity" size={14} color="#666" />
            <Text style={styles.metaText}>{item.difficulty}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="music" size={14} color="#666" />
            <Text style={styles.metaText}>{item.timeSignature} • {item.tempo} BPM</Text>
          </View>
        </View>
        <View style={styles.chordContainer}>
          {item.chords.map((chord, index) => (
            <View key={index} style={styles.chordChip}>
              <Text style={styles.chordText}>{chord}</Text>
            </View>
          ))}
        </View>
      </View>
      <Feather name="chevron-right" size={20} color="#999" style={styles.chevron} />
    </TouchableOpacity>
  );

  const renderFilterChip = (
    label: string, 
    selected: boolean, 
    onPress: () => void
  ) => (
    <TouchableOpacity 
      style={[styles.filterChip, selected && styles.filterChipSelected]} 
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Learn Songs</Text>
          <TouchableOpacity>
            <Feather name="search" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search songs or artists"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            <Text style={styles.filterLabel}>Difficulty:</Text>
            {renderFilterChip('All', selectedDifficulty === null, () => setSelectedDifficulty(null))}
            {difficulties.map(difficulty => (
              renderFilterChip(
                difficulty, 
                selectedDifficulty === difficulty, 
                () => setSelectedDifficulty(difficulty)
              )
            ))}
          </ScrollView>
        </View>

        {/* Songs List */}
        <FlatList
          data={filteredSongs}
          renderItem={renderSongItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.songsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="music" size={50} color="#CCC" />
              <Text style={styles.emptyText}>No songs found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default LearnSongsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 15,
    paddingHorizontal: 15,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    marginTop: 15,
  },
  filtersScroll: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 10,
    alignSelf: 'center',
  },
  filterChip: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  filterChipSelected: {
    backgroundColor: '#4A90E2',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  filterChipTextSelected: {
    color: '#FFF',
  },
  songsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  songCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  songInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  songArtist: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  songMeta: {
    flexDirection: 'row',
    marginTop: 5,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  chordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chordChip: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  chordText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  chevron: {
    alignSelf: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
}); 