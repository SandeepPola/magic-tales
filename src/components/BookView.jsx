import React, { useState, useRef, useEffect, useCallback } from 'react';
import { THEME_DECOS } from '../utils/constants.js';
import { useSpeech } from '../hooks/useSpeech.js';

export default function BookView({ pages, theme, ageGroup, nightMode, onRestart, storyText }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [litWordIdx, setLitWordIdx] = useState(-1);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const { isSpeaking, speak, stop } = useSpeech();
  const isPreReader = ageGroup === '3–5';
  const deco = THEME_DECOS[theme] || '📖';
  const pageText = pages[currentPage] || '';

  // Generate professional audio (optional, on demand)
  const generateAudio = useCallback(async () => {
    if (audioUrl) {
      setShowAudioPlayer(true);
      return;
    }
    setIsGeneratingAudio(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          text: storyText || pages.join('\n\n'),
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
    } finally {
      setIsGeneratingAudio(false);
    }
  }, [audioUrl, storyText, pages, ageGroup]);

  const clearHighlight = useCallback(() => {
    clearTimeout(timerRef.current);
    setLitWordIdx(-1);
  }, []);

  const goPage = useCallback(
    (dir) => {
      stop();
      clearHighlight();
      setCurrentPage((p) => Math.max(0, Math.min(pages.length - 1, p + dir)));
    },
    [pages.length, stop, clearHighlight]
  );

  const startWordHighlight = useCallback(
    (text) => {
      const words = text.split(/\s+/);
      const avgMs = Math.max(350, Math.round(60000 / 130));
      let idx = 0;
      setLitWordIdx(0);

      function tick() {
        idx++;
        if (idx < words.length) {
          setLitWordIdx(idx);
          timerRef.current = setTimeout(tick, avgMs);
        } else {
          setLitWordIdx(-1);
        }
      }
      timerRef.current = setTimeout(tick, avgMs);
    },
    []
  );

  const readPage = useCallback(() => {
    if (isSpeaking) {
      stop();
      clearHighlight();
      return;
    }
    const rate = isPreReader ? 0.78 : nightMode ? 0.82 : 0.9;
    const pitch = isPreReader ? 1.1 : nightMode ? 0.95 : 1.05;
    speak(pageText, { rate, pitch });
    if (isPreReader) startWordHighlight(pageText);
  }, [isSpeaking, isPreReader, nightMode, pageText, speak, stop, clearHighlight, startWordHighlight]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // Split text into words for highlighting
  const tokens = pageText.split(/(\s+)/);
  let wordCount = 0;

  return (
    <div className="book-wrap">
      {isPreReader && (
        <div className="info-banner prereader">
          📖 Pre-reader mode — simple words, short sentences, word highlighting
        </div>
      )}

      <div className="book-page">
        <div className="book-deco">{deco}</div>
        <div className={`book-text ${isPreReader ? 'prereader-text' : ''}`}>
          {tokens.map((token, i) => {
            if (/^\s+$/.test(token)) return token;
            const wIdx = wordCount++;
            return (
              <span
                key={i}
                className={`word ${wIdx === litWordIdx && isSpeaking ? 'lit' : ''}`}
              >
                {token}
              </span>
            );
          })}
        </div>

        <div className="book-nav">
          <button
            className="page-btn"
            onClick={() => goPage(-1)}
            disabled={currentPage === 0}
          >
            ← Back
          </button>
          <div className="book-center">
            <div className="book-dots">
              {pages.map((_, i) => (
                <div
                  key={i}
                  className={`book-dot ${i === currentPage ? 'active' : ''}`}
                />
              ))}
            </div>
            <span className="book-page-num">
              Page {currentPage + 1} of {pages.length}
            </span>
          </div>
          {currentPage === pages.length - 1 ? (
            <button className="page-btn primary" onClick={onRestart}>
              New story ✨
            </button>
          ) : (
            <button className="page-btn primary" onClick={() => goPage(1)}>
              Next →
            </button>
          )}
        </div>
      </div>

      <div className="page-actions">
        <button
          className={`page-read-btn ${isSpeaking ? 'reading' : ''}`}
          onClick={readPage}
        >
          {isSpeaking ? '⏹ Stop' : '🔊 Read this page'}
        </button>
        <button
          className="btn small"
          onClick={() => {
            const full = pages.join('\n\n');
            navigator.clipboard?.writeText(full);
          }}
        >
          📋 Copy
        </button>
        {!showAudioPlayer && (
          <button 
            className="btn small" 
            onClick={generateAudio}
            disabled={isGeneratingAudio}
          >
            {isGeneratingAudio ? '⏳ Generating...' : '🎧 Listen'}
          </button>
        )}
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
