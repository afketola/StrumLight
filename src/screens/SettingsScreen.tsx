import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
  BluetoothSetup: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const SettingsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const bluetooth = useContext(BluetoothContext);
  const isConnected = bluetooth?.connected || false;
  
  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoConnectEnabled, setAutoConnectEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  
  // User profile data (dummy data)
  const userProfile = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    joinDate: 'March 15, 2023',
    level: 'Intermediate',
    totalPracticeTime: '12 hours',
    favoriteGenres: ['Rock', 'Folk', 'Blues'],
    achievements: [
      { id: 1, name: 'First Song', date: 'March 20, 2023' },
      { id: 2, name: '10 Songs Mastered', date: 'April 5, 2023' },
      { id: 3, name: '30 Days Streak', date: 'May 10, 2023' }
    ]
  };

  const handleDisconnect = () => {
    if (bluetooth?.disconnectDevice) {
      bluetooth.disconnectDevice();
      Alert.alert('Disconnected', 'Bluetooth device has been disconnected.');
    }
  };

  const handleConnect = () => {
    navigation.navigate('BluetoothSetup');
    Alert.alert('Connecting', 'Please select your StrumLight device to connect.');
  };

  const renderSettingItem = (
    icon: string, 
    title: string, 
    value: boolean, 
    onValueChange: (value: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Feather name={icon as any} size={22} color="#555" style={styles.settingIcon} />
        <Text style={styles.settingText}>{title}</Text>
      </View>
      <Switch
        trackColor={{ false: '#D1D1D1', true: '#81C784' }}
        thumbColor={value ? '#4CAF50' : '#F4F4F4'}
        ios_backgroundColor="#D1D1D1"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
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
          <Text style={styles.headerTitle}>Profile & Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Image
              source={require('../assets/images/strummy.png')}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{userProfile.name}</Text>
            <Text style={styles.profileEmail}>{userProfile.email}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{userProfile.level}</Text>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProfile.totalPracticeTime}</Text>
              <Text style={styles.statLabel}>Practice Time</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProfile.achievements.length}</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProfile.favoriteGenres.length}</Text>
              <Text style={styles.statLabel}>Genres</Text>
            </View>
          </View>

          {/* Bluetooth Connection Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bluetooth Connection</Text>
            <View style={styles.bluetoothCard}>
              <View style={styles.bluetoothInfo}>
                <Feather 
                  name="bluetooth" 
                  size={24} 
                  color={isConnected ? "#4CAF50" : "#999"} 
                />
                <View style={styles.bluetoothTextContainer}>
                  <Text style={styles.bluetoothStatus}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </Text>
                  <Text style={styles.bluetoothDevice}>
                    {isConnected ? 'StrumLight-ESP' : 'No device connected'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[
                  styles.bluetoothButton, 
                  isConnected ? styles.disconnectButton : styles.connectButton
                ]}
                onPress={isConnected ? handleDisconnect : handleConnect}
              >
                <Text style={styles.bluetoothButtonText}>
                  {isConnected ? 'Disconnect' : 'Connect'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* App Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            <View style={styles.settingsCard}>
              {renderSettingItem('bell', 'Notifications', notificationsEnabled, setNotificationsEnabled)}
              <View style={styles.settingDivider} />
              {renderSettingItem('volume-2', 'Sound Effects', soundEnabled, setSoundEnabled)}
              <View style={styles.settingDivider} />
              {renderSettingItem('bluetooth', 'Auto-Connect', autoConnectEnabled, setAutoConnectEnabled)}
              <View style={styles.settingDivider} />
              {renderSettingItem('moon', 'Dark Mode', darkModeEnabled, setDarkModeEnabled)}
            </View>
          </View>

          {/* Achievements Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsCard}>
              {userProfile.achievements.map((achievement) => (
                <View key={achievement.id} style={styles.achievementItem}>
                  <View style={styles.achievementIcon}>
                    <Feather name="award" size={20} color="#FFC107" />
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementName}>{achievement.name}</Text>
                    <Text style={styles.achievementDate}>{achievement.date}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Account Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.settingsCard}>
              <TouchableOpacity style={styles.accountAction}>
                <Feather name="edit" size={20} color="#555" style={styles.actionIcon} />
                <Text style={styles.actionText}>Edit Profile</Text>
                <Feather name="chevron-right" size={20} color="#999" />
              </TouchableOpacity>
              <View style={styles.settingDivider} />
              <TouchableOpacity style={styles.accountAction}>
                <Feather name="lock" size={20} color="#555" style={styles.actionIcon} />
                <Text style={styles.actionText}>Change Password</Text>
                <Feather name="chevron-right" size={20} color="#999" />
              </TouchableOpacity>
              <View style={styles.settingDivider} />
              <TouchableOpacity style={styles.accountAction}>
                <Feather name="help-circle" size={20} color="#555" style={styles.actionIcon} />
                <Text style={styles.actionText}>Help & Support</Text>
                <Feather name="chevron-right" size={20} color="#999" />
              </TouchableOpacity>
              <View style={styles.settingDivider} />
              <TouchableOpacity style={styles.accountAction}>
                <Feather name="log-out" size={20} color="#F44336" style={styles.actionIcon} />
                <Text style={[styles.actionText, styles.logoutText]}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appVersion}>StrumLight v1.0.0</Text>
            <Text style={styles.appCopyright}>© 2023 StrumLight. All rights reserved.</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  levelBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  levelText: {
    color: '#1976D2',
    fontWeight: '600',
    fontSize: 12,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#F0F0F0',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  bluetoothCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  bluetoothInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bluetoothTextContainer: {
    marginLeft: 10,
  },
  bluetoothStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bluetoothDevice: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  bluetoothButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  connectButton: {
    backgroundColor: '#4CAF50',
  },
  disconnectButton: {
    backgroundColor: '#F44336',
  },
  bluetoothButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  settingsCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  achievementsCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  achievementDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  accountAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  actionIcon: {
    marginRight: 15,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  logoutText: {
    color: '#F44336',
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  appVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  appCopyright: {
    fontSize: 12,
    color: '#999',
  },
});
