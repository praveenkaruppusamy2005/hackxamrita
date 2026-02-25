const express = require('express');
const router = express.Router();
const { TranslateClient, TranslateTextCommand } = require('@aws-sdk/client-translate');

// Configure AWS Translate Client using environment variables
const translateClient = new TranslateClient({
    region: 'ap-south-1', // Defaulting to Mumbai, adjust if your role is elsewhere
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
});

router.post('/', async (req, res) => {
    const { text, targetLanguage, targetLanguageCode, sourceLanguageCode } = req.body;

    const target = targetLanguage || targetLanguageCode;
    const source = sourceLanguageCode || 'auto';

    if (!text || !target) {
        return res.status(400).json({ error: 'Missing text or targetLanguage in request body' });
    }

    try {
        // Prepare the translation command
        const command = new TranslateTextCommand({
            Text: text,
            SourceLanguageCode: source,
            TargetLanguageCode: target
        });

        // Execute translation
        const response = await translateClient.send(command);

        // Return translated text
        res.json({ translatedText: response.TranslatedText });

    } catch (error) {
        console.error('AWS Translate Error:', error);
        res.status(500).json({ error: 'Failed to translate text', details: error.message });
    }
});

module.exports = router;
