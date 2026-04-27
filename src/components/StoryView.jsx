import React, { useState } from 'react';

export default function StoryView({ storyText, charLabel, charEmoji, theme, ageGroup, isPreReaderMode, onRestart }) {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  const generateAudio = async () => {
    if (audioUrl) {
      setShowAudioPlayer(true);
      return;
    }
    setIsGeneratingAudio(true);
    setAudioError(null);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: storyText,
          ageGroup,
          nightMode: false,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }
      const data = await response.json();
      setAudioUrl(data.audioUrl);
      setShowAudioPlayer(true);
    } catch (error) {
      console.error('TTS error:', error);
      setAudioError(error.message);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <div className="card">
      <div className="badge-row" style={{ marginBottom: 12 }}>
        <span className="badge">{charLabel}</span>
        <span className="badge">{theme}</span>
        <span className="badge">{ageGroup} yrs</span>
      </div>

      <div className="story-text">{storyText}</div>

      {audioError && (
        <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(226, 75, 74, 0.1)', borderRadius: '8px', textAlign: 'center', fontSize: '13px', color: '#e24b4a' }}>
          ⚠️ {audioError}
        </div>
      )}

      <div className="story-actions">
        {!showAudioPlayer && !isPreReaderMode && (
          <button
            className="btn"
            onClick={generateAudio}
            disabled={isGeneratingAudio}
          >
            {isGeneratingAudio ? '⏳ Generating audio...' : '🎧 Listen to story'}
          </button>
        )}
        <button
          className="btn"
          onClick={() => navigator.clipboard?.writeText(storyText)}
        >
          📋 Copy
        </button>
        <button className="btn primary" onClick={onRestart}>
          ✨ New story
        </button>
      </div>

      {showAudioPlayer && audioUrl && (
        <div style={{ marginTop: '16px', padding: '14px', background: 'var(--bg-surface)', borderRadius: '8px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px' }}>Audio player</div>
          <audio controls style={{ width: '100%' }} src={audioUrl} />
          <button
            className="btn small"
            onClick={() => setShowAudioPlayer(false)}
            style={{ marginTop: '8px' }}
          >
            Hide player
          </button>
        </div>
      )}
    </div>
  );
}
