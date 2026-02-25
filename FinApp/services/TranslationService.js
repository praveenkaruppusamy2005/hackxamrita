import { useState } from 'react';
import { Platform } from 'react-native';


export const useTranslationService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const translateText = async (text, targetLang, sourceLang = 'auto') => {
    try {
      if (!text || text.trim() === '') return text;

      const targetCode = targetLang.split('-')[0];
      let sourceCode = sourceLang;
      if (sourceCode && sourceCode.includes('-')) {
        sourceCode = sourceCode.split('-')[0];
      }

      if (sourceCode !== 'auto' && sourceCode === targetCode) return text;

      setIsLoading(true);
      setError(null);


      const backendUrl = 'http://localhost:3000';

      const response = await fetch(`${backendUrl}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLanguageCode: sourceCode,
          targetLanguageCode: targetCode
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation request failed with status: ${response.status}`);
      }

      const data = await response.json();
      setIsLoading(false);
      return data.translatedText || text;
    } catch (err) {
      console.error('Translation error:', err);
      setIsLoading(false);
      setError(err);
      return text;
    }
  };


  const translateBatch = async (texts, targetLang, sourceLang = 'auto') => {
    try {
      const promises = texts.map(t => translateText(t, targetLang, sourceLang));
      return await Promise.all(promises);
    } catch (err) {
      console.error('Batch translation error:', err);
      return texts;
    }
  };

  return {
    translateText,
    translateBatch,
    isLoading,
    error
  };
};


export const LANGUAGE_CODES = {
  'en-US': 'en',
  'ta-IN': 'ta',
  'hi-IN': 'hi',
  'te-IN': 'te',
  'kn-IN': 'kn',
  'ml-IN': 'ml',
  'mr-IN': 'mr',
  'bn-IN': 'bn',
};


export const getLanguageCode = (locale) => {
  return LANGUAGE_CODES[locale] || locale.split('-')[0];
};
