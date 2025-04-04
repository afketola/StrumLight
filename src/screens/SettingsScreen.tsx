import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';

const SettingsScreen = () => {
  return (
    <LinearGradient colors={['#654ea3', '#eaafc8']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <View style={styles.container}>
          <TouchableOpacity style={styles.option}>
            <Feather name="bluetooth" size={24} color="#fff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Bluetooth Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Feather name="user" size={24} color="#fff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Feather name="info" size={24} color="#fff" style={styles.optionIcon} />
            <Text style={styles.optionText}>About</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.5)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 18,
    color: '#fff',
  },
});
