import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';

type WordExample = {
  english: string;
  hindi: string;
};

type Word = {
  word: string;
  meaning: string;
  hindiTranslation: string;
  examples: WordExample[];
};

type DayWords = {
  date: string;
  words: Word[];
};

export default function History() {
  const [history, setHistory] = useState<DayWords[]>([]);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const wordKeys = keys.filter(key => key.startsWith('words_'));
      const historyData: DayWords[] = [];

      for (const key of wordKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          historyData.push({
            date: key.replace('words_', ''),
            words: JSON.parse(data),
          });
        }
      }

      // Sort by date, most recent first
      historyData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {history.map((day) => (
        <View key={day.date} style={styles.dayContainer}>
          <Text style={styles.date}>
            {new Date(day.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          {day.words.map((word, index) => (
            <View key={word.word} style={styles.wordCard}>
              <View style={styles.wordHeader}>
                <Text style={styles.wordNumber}>#{index + 1}</Text>
                <Text style={styles.word}>{word.word}</Text>
              </View>
              <Text style={styles.meaning}>{word.meaning}</Text>
              <Text style={styles.translation}>{word.hindiTranslation}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  dayContainer: {
    marginBottom: 24,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  wordCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  wordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  wordNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#6366f1',
    marginRight: 8,
  },
  word: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1e293b',
  },
  meaning: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#475569',
    marginBottom: 8,
  },
  translation: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6366f1',
  },
});