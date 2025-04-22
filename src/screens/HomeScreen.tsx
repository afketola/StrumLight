import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  Linking
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { BluetoothContext } from '../context/BluetoothContext';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the navigation param list type
type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Tutorial: undefined;
  Command: undefined;
  LearnSongs: undefined;
  Tuning: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const bluetooth = useContext(BluetoothContext);
  const isConnected = bluetooth?.connected || false;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        {/* Top Header with Profile and Icons */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Settings')}>
              <Feather name="settings" size={22} color="#555" />
            </TouchableOpacity>
          </View>

          {/* Centered logo */}
          <View style={styles.headerCenter}>
            <Image
              source={require('../assets/images/strummy.png')}
              style={styles.logo}
            />
            <Text style={styles.appName}>StrumLight</Text>
          </View>

          {/* Right-side icons */}
          <View style={styles.headerRight}>
            {/* Bluetooth connection indicator */}
            <View style={styles.bluetoothIndicator}>
              <Feather 
                name="bluetooth" 
                size={20} 
                color={isConnected ? "#4CAF50" : "#999"} 
                style={styles.icon} 
              />
            </View>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Beta Promotion Banner - Replacing Stats Section */}
          <TouchableOpacity 
            style={styles.betaBanner}
            onPress={() => Linking.openURL('https://getstrumlight.com')}
          >
            <LinearGradient
              colors={['#4A90E2', '#357ABD']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.betaGradient}
            >
              <View style={styles.betaContent}>
                <View style={styles.betaTextContainer}>
                  <Text style={styles.betaTitle}>🚀 Pre-order StrumLight Beta</Text>
                  <Text style={styles.betaSubtext}>Get early access to all features</Text>
                </View>
                <Feather name="arrow-right" size={20} color="#FFF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.subtitle}>Ready to make some music?</Text>
          </View>

          {/* Main Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Tutorial')}
              activeOpacity={0.8}
              style={styles.buttonWrapper}
            >
              <LinearGradient
                colors={['#FF6F61', '#FF8A65']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.button}
              >
                <View style={styles.buttonContent}>
                  <Feather name="play-circle" size={28} color="#FFF" style={styles.buttonIcon} />
                  <View style={styles.buttonTextContainer}>
                    <Text style={styles.buttonText}>Start Tutorial</Text>
                    <Text style={styles.buttonSubtext}>Learn the basics</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Command')}
              activeOpacity={0.8}
              style={styles.buttonWrapper}
            >
              <LinearGradient
                colors={['#FF9800', '#FFA726']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.button}
              >
                <View style={styles.buttonContent}>
                  <Feather name="music" size={28} color="#FFF" style={styles.buttonIcon} />
                  <View style={styles.buttonTextContainer}>
                    <Text style={styles.buttonText}>Freestyle</Text>
                    <Text style={styles.buttonSubtext}>Play what you want</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('LearnSongs')}
              activeOpacity={0.8}
              style={styles.buttonWrapper}
            >
              <LinearGradient
                colors={['#66BB6A', '#81C784']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.button}
              >
                <View style={styles.buttonContent}>
                  <Feather name="book" size={28} color="#FFF" style={styles.buttonIcon} />
                  <View style={styles.buttonTextContainer}>
                    <Text style={styles.buttonText}>Learn Songs</Text>
                    <Text style={styles.buttonSubtext}>Master your favorites</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Tuning')}
              activeOpacity={0.8}
              style={styles.buttonWrapper}
            >
              <LinearGradient
                colors={['#42A5F5', '#64B5F6']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.button}
              >
                <View style={styles.buttonContent}>
                  <Feather name="sliders" size={28} color="#FFF" style={styles.buttonIcon} />
                  <View style={styles.buttonTextContainer}>
                    <Text style={styles.buttonText}>Tuning</Text>
                    <Text style={styles.buttonSubtext}>Perfect your sound</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Navigation Menu */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
            <Feather name="home" size={24} color="#4A90E2" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Tutorial')}>
            <Feather name="book-open" size={24} color="#555" />
            <Text style={styles.navText}>Learn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Settings')}>
            <Feather name="user" size={24} color="#555" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

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
  headerLeft: {
    width: 40,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
    marginRight: -10,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bluetoothIndicator: {
    padding: 5,
  },
  icon: {
    marginRight: 0,
  },
  iconButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 5,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 5,
  },
  buttonWrapper: {
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    height: 90,
    borderRadius: 16,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 15,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#555',
  },
  betaBanner: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  betaGradient: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  betaContent: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  betaTextContainer: {
    flex: 1,
  },
  betaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 2,
  },
  betaSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
