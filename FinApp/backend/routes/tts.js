const express = require('express');
const router = express.Router();

router.post('/speak', async (req, res) => {
    const { text, voiceId = 'pNInz6obpgH9P39Pue6S' } = req.body; // Default: 'Rachel' or any premium voice

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': process.env.ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    style: 0.5,
                    use_speaker_boost: true
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`ElevenLabs Error: ${errorText}`);
        }

        const buffer = await response.arrayBuffer();
        res.set('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(buffer));

    } catch (error) {
        console.error('TTS Error:', error);
        res.status(500).json({ error: 'Failed to generate speech', details: error.message });
    }
});

router.post('/token', async (req, res) => {
    try {
        const response = await fetch('https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=' + req.body.agentId, {
            method: 'GET',
            headers: {
                'xi-api-key': process.env.ELEVENLABS_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get signed URL');
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
