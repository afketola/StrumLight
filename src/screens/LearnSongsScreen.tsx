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

// Define the navigation param list type
type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Tutorial: undefined;
  Command: undefined;
  LearnSongs: undefined;
  Tuning: undefined;
  SongDetail: { songId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

// Dummy song data
const songs = [
  {
    id: '1',
    title: 'Wonderwall',
    artist: 'Oasis',
    difficulty: 'Beginner',
    genre: 'Rock',
    image: require('../assets/images/strummy.png'),
    progress: 75,
    chords: ['Em', 'G', 'D', 'A7sus4', 'C', 'D7']
  },
  {
    id: '2',
    title: 'Let It Be',
    artist: 'The Beatles',
    difficulty: 'Beginner',
    genre: 'Rock',
    image: require('../assets/images/strummy.png'),
    progress: 60,
    chords: ['C', 'G', 'Am', 'F']
  },
  {
    id: '3',
    title: 'Sweet Home Alabama',
    artist: 'Lynyrd Skynyrd',
    difficulty: 'Intermediate',
    genre: 'Rock',
    image: require('../assets/images/strummy.png'),
    progress: 30,
    chords: ['D', 'C', 'G']
  },
  {
    id: '4',
    title: 'Hallelujah',
    artist: 'Leonard Cohen',
    difficulty: 'Intermediate',
    genre: 'Folk',
    image: require('../assets/images/strummy.png'),
    progress: 45,
    chords: ['C', 'Am', 'F', 'G', 'Em']
  },
  {
    id: '5',
    title: 'Wagon Wheel',
    artist: 'Old Crow Medicine Show',
    difficulty: 'Intermediate',
    genre: 'Folk',
    image: require('../assets/images/strummy.png'),
    progress: 0,
    chords: ['G', 'D', 'Em', 'C']
  },
  {
    id: '6',
    title: 'Sweet Child O\' Mine',
    artist: 'Guns N\' Roses',
    difficulty: 'Advanced',
    genre: 'Rock',
    image: require('../assets/images/strummy.png'),
    progress: 10,
    chords: ['D', 'C', 'G', 'Em']
  },
  {
    id: '7',
    title: 'Dust in the Wind',
    artist: 'Kansas',
    difficulty: 'Advanced',
    genre: 'Rock',
    image: require('../assets/images/strummy.png'),
    progress: 0,
    chords: ['C', 'D', 'Em', 'G', 'Am']
  },
  {
    id: '8',
    title: 'Blackbird',
    artist: 'The Beatles',
    difficulty: 'Advanced',
    genre: 'Rock',
    image: require('../assets/images/strummy.png'),
    progress: 0,
    chords: ['G', 'Em', 'C', 'D']
  }
];

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
    const matchesGenre = !selectedGenre || song.genre === selectedGenre;
    
    return matchesSearch && matchesDifficulty && matchesGenre;
  });

  // Get unique genres and difficulties for filters
  const genres = Array.from(new Set(songs.map(song => song.genre)));
  const difficulties = Array.from(new Set(songs.map(song => song.difficulty)));

  const renderSongItem = ({ item }: { item: typeof songs[0] }) => (
    <TouchableOpacity 
      style={styles.songCard}
      onPress={() => navigation.navigate('SongDetail', { songId: item.id })}
    >
      <Image source={item.image} style={styles.songImage} />
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
            <Text style={styles.metaText}>{item.genre}</Text>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
          <Text style={styles.progressText}>{item.progress}%</Text>
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

        <View style={styles.filtersContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            <Text style={styles.filterLabel}>Genre:</Text>
            {renderFilterChip('All', selectedGenre === null, () => setSelectedGenre(null))}
            {genres.map(genre => (
              renderFilterChip(
                genre, 
                selectedGenre === genre, 
                () => setSelectedGenre(genre)
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
  progressContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginTop: 8,
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    position: 'absolute',
    right: 0,
    top: -18,
    fontSize: 12,
    color: '#666',
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