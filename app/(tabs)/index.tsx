import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import type { Word } from '@/types/words';
import { generateDailyWords } from '@/services/openAi';

export default function TodayWords() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedWord, setExpandedWord] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    loadTodayWords();
  }, []);

  const loadTodayWords = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const storedWords = await AsyncStorage.getItem(`words_${today}`);

      if (storedWords) {
        setWords(JSON.parse(storedWords));
      } else {
        const newWords = await generateDailyWords();
        //console.log('newWords', newWords);
        await AsyncStorage.setItem(`words_${today}`, JSON.stringify(newWords));
        setWords(newWords);
      }
    } catch (error) {
      console.error('Error loading words:', error);
      setError("Failed to load today's words. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (words.length > 0) {
      //console.log('words', words);
    }
  }, [words]);

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={loadTodayWords}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.date}>
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </Text>

      {words.map((word, index) => (
        <Pressable
          key={word.word}
          style={styles.wordCard}
          onPress={() =>
            setExpandedWord(expandedWord === word.word ? null : word.word)
          }
        >
          <View style={styles.wordHeader}>
            <Text style={styles.wordNumber}>#{index + 1}</Text>
            <Text style={styles.word}>{word.word}</Text>
          </View>

          <Text style={styles.meaning}>{word.meaning}</Text>
          <Text style={styles.translation}>{word.hindiTranslation}</Text>

          {expandedWord === word.word && (
            <View style={styles.examples}>
              <Text style={styles.examplesTitle}>Examples:</Text>
              {word.example_sentences.map((example, i) => (
                <View key={i} style={styles.example}>
                  <Text style={styles.exampleText}>{example.english}</Text>
                  <Text style={styles.exampleTranslation}>
                    {example.hindi_translation}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </Pressable>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#ffffff',
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
    marginBottom: 16,
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
  examples: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  examplesTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 8,
  },
  example: {
    marginBottom: 12,
  },
  exampleText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
  exampleTranslation: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6366f1',
  },
});
