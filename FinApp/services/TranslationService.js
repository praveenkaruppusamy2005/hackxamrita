import { useState } from 'react';
import { Platform } from 'react-native';

/**
 * Translation Service Hook
 * Provides dynamic translation capabilities for any text in the app
 * Uses our own Node.js backend integration with AWS Translate
 */
export const useTranslationService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Translate text to target language
   * @param {string} text - Text to translate
   * @param {string} targetLang - Target language code (e.g., 'ta', 'hi', 'te')
   * @param {string} sourceLang - Source language code (default: 'auto')
   * @returns {Promise<string>} Translated text
   */
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

      // Use local machine IP for physical device testing
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

  /**
   * Translate multiple texts at once
   */
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

/**
 * Language code mapping for common languages
 */
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

/**
 * Get short language code from full locale
 * @param {string} locale - Full locale code (e.g., 'ta-IN')
 * @returns {string} Short language code (e.g., 'ta')
 */
export const getLanguageCode = (locale) => {
  return LANGUAGE_CODES[locale] || locale.split('-')[0];
};
