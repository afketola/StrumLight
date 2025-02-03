import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';

const HomeScreen = () => {
  const navigation = useNavigation();

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Top Header with Profile and Icons */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={require('../assets/images/strummy.png')} style={styles.profileImage} />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <Feather name="bell" size={28} color="black" style={styles.icon} />
          <Feather name="settings" size={28} color="black" />
        </View>
      </View>

      {/* Title and Subtitle */}
      <Text style={styles.title}>Welcome to StrumLight 🎸</Text>
      <Text style={styles.subtitle}>Your interactive guitar learning experience</Text>

      {/* Gradient Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Tutorial')} activeOpacity={0.8}>
          <LinearGradient colors={['#FF0000', '#FF6347']} style={styles.button}>
            <Text style={styles.buttonText}>Start Tutorial</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Freestyle')} activeOpacity={0.8}>
          <LinearGradient colors={['#FFA500', '#FFCC00']} style={styles.button}>
            <Text style={styles.buttonText}>Freestyle Mode</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('LearnSongs')} activeOpacity={0.8}>
          <LinearGradient colors={['#33FF57', '#66FF99']} style={styles.button}>
            <Text style={styles.buttonText}>Learn Songs</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Tuning')} activeOpacity={0.8}>
          <LinearGradient colors={['#3380FF', '#66A3FF']} style={styles.button}>
            <Text style={styles.buttonText}>Tuning & Settings</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Menu */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Feather name="home" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Tutorial')}>
          <Feather name="book-open" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Feather name="user" size={32} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: '15%',
  },
  header: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  },
  subtitle: {
    fontSize: 18,
    color: '#444',
    textAlign: 'center',
    marginBottom: 30, // Adjusted to move buttons higher
  },
  buttonContainer: {
    width: '80%',
    marginTop: 0, // Moves buttons up
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 100,
    paddingVertical: 10, // Increased padding to make buttons bigger
    borderRadius: 30, // Rounder buttons
    marginVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 0,
    textAlignVertical: 'top',
    paddingBottom: 15,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-around',
    backgroundColor: '#F5F5F5',
    paddingVertical: 15,
    borderRadius: 20,
  },
});

export default HomeScreen;
