import { useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { ChevronRight } from 'lucide-react-native';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Bold': Inter_700Bold,
  });

  const clearHistory = async () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all your learning history? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              const keys = await AsyncStorage.getAllKeys();
              const wordKeys = keys.filter(key => key.startsWith('words_'));
              await AsyncStorage.multiRemove(wordKeys);
              Alert.alert('Success', 'History cleared successfully');
            } catch (error) {
              console.error('Error clearing history:', error);
              Alert.alert('Error', 'Failed to clear history');
            }
          },
        },
      ]
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.setting}>
          <Text style={styles.settingText}>Daily Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#cbd5e1', true: '#818cf8' }}
            thumbColor={notifications ? '#6366f1' : '#f1f5f9'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <Pressable style={styles.setting} onPress={clearHistory}>
          <Text style={styles.settingText}>Clear History</Text>
          <ChevronRight size={20} color="#64748b" />
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.setting}>
          <Text style={styles.settingText}>Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1e293b',
  },
  settingValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748b',
  },
});