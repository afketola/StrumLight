import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const SettingsScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>⚙️ Settings</Text>
            <Text style={styles.subtitle}>Adjust your StrumLight preferences</Text>

            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Enable Notifications</Text>
                <Switch />
            </View>

            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Dark Mode</Text>
                <Switch />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 20 },
    title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
    subtitle: { fontSize: 16, color: '#444', textAlign: 'center', marginBottom: 30 },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', width: '80%', paddingVertical: 10 },
    settingText: { fontSize: 18, color: '#000' },
});

export default SettingsScreen;
