/**
 * Text-to-Speech utility
 * Generates audio files using OpenAI's TTS API
 */

export async function generateAudio(text, storyId) {
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, storyId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate audio');
    }

    const data = await response.json();
    return data.audioUrl; // URL to the generated MP3
  } catch (error) {
    console.error('TTS error:', error);
    throw error;
  }
}
