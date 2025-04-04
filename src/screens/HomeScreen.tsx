import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Top Header with Profile and Icons */}
      <View style={styles.header}>
        {/* Profile image navigates to Settings */}
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image
            source={require('../assets/images/strummy.png')}
            style={styles.profileImage}
          />
        </TouchableOpacity>

        {/* Right-side icons navigate to Settings */}
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Feather name="bell" size={24} color="#555" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Feather name="settings" size={24} color="#555" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title and Subtitle */}
      <Text style={styles.title}>Welcome to StrumLight!</Text>
      <Text style={styles.subtitle}>Let’s get started</Text>

      {/* Bright, Bold Gradient Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Tutorial')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF6F61', '#FF8A65']}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Start Tutorial</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Freestyle → navigates to Command */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Command')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF9800', '#FFA726']}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Freestyle</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('LearnSongs')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#66BB6A', '#81C784']}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Learn Songs</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Renamed to "Tuning" only */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Tuning')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#42A5F5', '#64B5F6']}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Tuning</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Menu */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Feather name="home" size={28} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Tutorial')}>
          <Feather name="book-open" size={28} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Feather name="user" size={28} color="#555" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: '25%',
  },
  header: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginRight: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 4,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '85%',
  },
  button: {
    height: 90,
    borderRadius: 16,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-around',
    backgroundColor: '#F8F8F8',
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
