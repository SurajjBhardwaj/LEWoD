export type WordExample = {
  english: string;
  hindi_translation: string;
};

export type Word = {
  word: string;
  meaning: string;
  hindiTranslation: string;
  example_sentences: WordExample[];
};
