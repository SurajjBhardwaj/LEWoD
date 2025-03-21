import { SAMPLE_WORDS } from '@/constant/sampleWords';
import { Word } from '@/types/words';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateDailyWords(): Promise<Word[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a language learning assistant. Generate 10 advanced English words with their meanings, Hindi translations, and two example sentences (with Hindi translations). Format the response as a JSON array.',
        },
        {
          role: 'user',
          content: 'Generate 10 words.',
        },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (content) {
      const response = JSON.parse(content);
      return response;
    } else {
      throw new Error('No content received from OpenAI');
    }
  } catch (error) {
    console.error('Error generating words:', error);
    // Return sample words as fallback
    return SAMPLE_WORDS.map((word) => ({
      ...word,
      example_sentences: word.examples.map((example) => ({
        english: example.english,
        hindi_translation: example.hindi,
      })),
    }));
  }
}
