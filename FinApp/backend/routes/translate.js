const express = require('express');
const router = express.Router();
const { TranslateClient, TranslateTextCommand } = require('@aws-sdk/client-translate');


const translateClient = new TranslateClient({
    region: 'ap-south-1',
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

        const command = new TranslateTextCommand({
            Text: text,
            SourceLanguageCode: source,
            TargetLanguageCode: target
        });


        const response = await translateClient.send(command);


        res.json({ translatedText: response.TranslatedText });

    } catch (error) {
        console.error('AWS Translate Error:', error);
        res.status(500).json({ error: 'Failed to translate text', details: error.message });
    }
});

module.exports = router;
