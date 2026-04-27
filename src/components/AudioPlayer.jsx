import React, { useState, useEffect, useRef } from 'react';

function fmt(s) {
  s = Math.max(0, Math.round(s));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export default function AudioPlayer({ storyText, charLabel, charEmoji, theme, ageGroup, nightMode, onRestart }) {
  const audioRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sleepTimer, setSleepTimer] = useState('off');
  const [audioUrl, setAudioUrl] = useState(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [speed, setSpeed] = useState(1.0);
  const intervalRef = useRef(null);
  const sleepRef = useRef(null);
  const isYoungListener = ageGroup === '3–5';

  const pct = duration > 0 ? Math.min((elapsed / duration) * 100, 100) : 0;

  // Generate audio on mount
  useEffect(() => {
    const generateAudio = async () => {
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
            nightMode,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to generate audio');
        }

        const data = await response.json();
        setAudioUrl(data.audioUrl);
      } catch (error) {
        console.error('TTS error:', error);
        setAudioError(error.message);
      } finally {
        setIsGeneratingAudio(false);
      }
    };

    generateAudio();
  }, [storyText, ageGroup, nightMode]);

  // Update duration when audio is loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Update elapsed time as audio plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setElapsed(audioRef.current.currentTime);
    }
  };

  // Handle when audio ends
  const handleEnded = () => {
    setIsSpeaking(false);
    setIsPaused(false);
    clearInterval(intervalRef.current);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isSpeaking && !isPaused) {
      audioRef.current.pause();
      setIsPaused(true);
      clearInterval(intervalRef.current);
    } else if (isPaused) {
      audioRef.current.play();
      setIsPaused(false);
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setElapsed(audioRef.current.currentTime);
        }
      }, 1000);
    } else if (audioUrl) {
      audioRef.current.play();
      setIsSpeaking(true);
      setIsPaused(false);
      setElapsed(0);
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setElapsed(audioRef.current.currentTime);
        }
      }, 1000);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const skipAhead = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + seconds);
    }
  };

  const skipBack = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - seconds);
    }
  };

  // Handle sleep timer
  useEffect(() => {
    clearTimeout(sleepRef.current);
    if (sleepTimer !== 'off' && isSpeaking && audioRef.current) {
      const ms = parseInt(sleepTimer) * 60000;
      sleepRef.current = setTimeout(() => {
        audioRef.current.pause();
        setIsSpeaking(false);
        setIsPaused(false);
        clearInterval(intervalRef.current);
      }, ms);
    }
    return () => clearTimeout(sleepRef.current);
  }, [sleepTimer, isSpeaking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(sleepRef.current);
    };
  }, []);

  if (nightMode) {
    return (
      <>
        <audio
          ref={audioRef}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          src={audioUrl}
          style={{ display: 'none' }}
        />

        <div className="player">
          <div className="player-art">{charEmoji}</div>
          <div className="player-title">{charLabel}'s {theme} story</div>
          <div className="player-sub">
            {ageGroup} yrs{isYoungListener ? ' · young listener' : ''}
          </div>

          {isGeneratingAudio && (
            <div style={{ textAlign: 'center', padding: '16px 0', color: '#7a6e5e', fontSize: '13px' }}>
              <div className="spinner" style={{ margin: '0 auto 8px', width: '16px', height: '16px' }} />
              Generating audio...
            </div>
          )}

          {audioError && (
            <div style={{ textAlign: 'center', padding: '12px', color: '#e24b4a', fontSize: '13px', background: 'rgba(226, 75, 74, 0.1)', borderRadius: '8px', marginBottom: '12px' }}>
              ⚠️ {audioError}
            </div>
          )}

          {audioUrl && (
            <>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct.toFixed(1)}%` }} />
              </div>
              <div className="time-row">
                <span>{fmt(elapsed)}</span>
                <span>-{fmt(Math.max(0, duration - elapsed))}</span>
              </div>

              <div className="player-controls">
                <button className="ctrl-btn" onClick={() => skipBack(15)}>
                  «15
                </button>
                <button className="ctrl-btn play-btn" onClick={togglePlayPause}>
                  {isSpeaking && !isPaused ? '⏸' : '▶'}
                </button>
                <button className="ctrl-btn" onClick={() => skipAhead(15)}>
                  15»
                </button>
              </div>

              <div className="sleep-row">
                <label>Sleep timer</label>
                <select value={sleepTimer} onChange={(e) => setSleepTimer(e.target.value)}>
                  <option value="off">Off</option>
                  <option value="5">5 min</option>
                  <option value="10">10 min</option>
                  <option value="20">20 min</option>
                  <option value="30">30 min</option>
                </select>
              </div>

              <div className="sleep-row">
                <label>Narration speed</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1 }}>
                  <button 
                    className="ctrl-btn" 
                    onClick={() => handleSpeedChange(0.75)}
                    style={{ opacity: speed === 0.75 ? 1 : 0.5, fontSize: '12px' }}
                  >
                    0.75×
                  </button>
                  <button 
                    className="ctrl-btn" 
                    onClick={() => handleSpeedChange(1.0)}
                    style={{ opacity: speed === 1.0 ? 1 : 0.5, fontSize: '12px', fontWeight: speed === 1.0 ? 'bold' : 'normal' }}
                  >
                    Normal
                  </button>
                  <button 
                    className="ctrl-btn" 
                    onClick={() => handleSpeedChange(1.25)}
                    style={{ opacity: speed === 1.25 ? 1 : 0.5, fontSize: '12px' }}
                  >
                    1.25×
                  </button>
                  <button 
                    className="ctrl-btn" 
                    onClick={() => handleSpeedChange(1.5)}
                    style={{ opacity: speed === 1.5 ? 1 : 0.5, fontSize: '12px' }}
                  >
                    1.5×
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <p className="card-sub" style={{ marginBottom: 8 }}>Story text</p>
          <div className="story-text night-text">{storyText}</div>
        </div>
        <div className="btn-row">
          <button className="btn" onClick={onRestart}>✨ New story</button>
        </div>
      </>
    );
  }

  // Day mode: simple read-aloud with text
  return (
    <div className="card">
      <div className="badge-row" style={{ marginBottom: 12 }}>
        <span className="badge">{charLabel}</span>
        <span className="badge">{theme}</span>
        <span className="badge">{ageGroup} yrs</span>
        {isYoungListener && <span className="badge">🎧 Young listener</span>}
      </div>
      <div className="story-text">{storyText}</div>

      {isGeneratingAudio && (
        <div style={{ marginTop: '12px', padding: '12px', background: '#f3f0eb', borderRadius: '8px', textAlign: 'center', fontSize: '13px', color: '#6b6560' }}>
          <span style={{ marginRight: '8px' }}>Generating audio...</span>
        </div>
      )}

      {audioError && (
        <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(226, 75, 74, 0.1)', borderRadius: '8px', textAlign: 'center', fontSize: '13px', color: '#e24b4a' }}>
          ⚠️ {audioError}
        </div>
      )}

      <div className="story-actions">
        {audioUrl && (
          <button className="btn" onClick={togglePlayPause}>
            {isSpeaking ? (isPaused ? '▶ Resume' : '⏸ Pause') : '🔊 Play audio'}
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

      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        src={audioUrl}
        style={{ display: 'none' }}
      />
    </div>
  );
}
