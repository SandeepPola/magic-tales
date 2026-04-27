import React, { useState, useCallback, useEffect } from 'react';
import StepDots from './components/StepDots.jsx';
import Stars from './components/Stars.jsx';
import CharacterStep from './components/CharacterStep.jsx';
import ThemeStep from './components/ThemeStep.jsx';
import ModeStep from './components/ModeStep.jsx';
import BookView from './components/BookView.jsx';
import StoryView from './components/StoryView.jsx';
import AudioPlayer from './components/AudioPlayer.jsx';
import Login from './components/Login.jsx';
import { useStoryGenerator } from './hooks/useStoryGenerator.js';
import { buildPrompt, splitIntoPages } from './utils/promptBuilder.js';
import { DEFAULT_STATE } from './utils/constants.js';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState(0);
  const [formState, setFormState] = useState({ ...DEFAULT_STATE });
  const [pages, setPages] = useState([]);
  const { storyText, isGenerating, error, generate } = useStoryGenerator();

  // Check if user has a valid token on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setStep(0);
    setFormState({ ...DEFAULT_STATE });
  }, []);

  const nightMode = formState.nightMode;
  // Automatically set storyMode based on nightMode: bedtime = listen, regular = read
  const effectiveStoryMode = nightMode ? 'listen' : 'read';
  const isPreReader = formState.isPreReaderMode && effectiveStoryMode === 'read';

  const update = useCallback((patch) => {
    setFormState((s) => ({ ...s, ...patch }));
  }, []);

  const toggleNight = useCallback(() => {
    setFormState((s) => ({ ...s, nightMode: !s.nightMode }));
  }, []);

  const handleGenerate = useCallback(async () => {
    setStep(3);
    setPages([]);
    // Create a version of formState with the correct storyMode
    const stateWithMode = { ...formState, storyMode: effectiveStoryMode };
    const prompt = buildPrompt(stateWithMode);
    const text = await generate(prompt);
    if (text) {
      const ispr = formState.isPreReaderMode && effectiveStoryMode === 'read';
      setPages(splitIntoPages(text, ispr));
    }
  }, [formState, effectiveStoryMode, generate]);

  const restart = useCallback(() => {
    setStep(0);
    setPages([]);
    setFormState((s) => ({
      ...DEFAULT_STATE,
      nightMode: s.nightMode,
    }));
  }, []);

  const getCharLabel = () => {
    if (formState.charMode === 'custom') return formState.customChar.trim();
    return `${formState.presetEmoji} ${formState.presetType}`;
  };

  const getCharEmoji = () => {
    if (formState.charMode === 'custom') return '⭐';
    return formState.presetEmoji;
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <CharacterStep
            state={formState}
            onChange={update}
            onNext={() => setStep(1)}
          />
        );
      case 1:
        return (
          <ThemeStep
            state={formState}
            onChange={update}
            onNext={() => setStep(2)}
            onBack={() => setStep(0)}
          />
        );
      case 2:
        return (
          <ModeStep
            state={formState}
            onChange={update}
            onNext={handleGenerate}
            onBack={() => setStep(1)}
          />
        );
      case 3: {
        // Still generating
        if (isGenerating || (storyText && pages.length === 0)) {
          return (
            <div className="card">
              <div className="loading-row">
                <div className="spinner" />
                <span>
                  {isPreReader
                    ? 'Writing a pre-reader story…'
                    : formState.ageGroup === '3–5' && formState.storyMode === 'listen'
                    ? 'Writing a story for young ears…'
                    : 'Writing your story…'}
                </span>
              </div>
              {storyText && (
                <div className="story-text preview-text">{storyText}</div>
              )}
            </div>
          );
        }

        if (error) {
          return (
            <div className="card">
              <p className="error-text">{error}</p>
              <div className="btn-row">
                <button className="btn" onClick={restart}>Try again</button>
              </div>
            </div>
          );
        }

        // Story complete — show appropriate view
        if (effectiveStoryMode === 'read' && pages.length > 0) {
          // Pre-readers (3-5) get paged book view
          if (isPreReader) {
            return (
              <BookView
                pages={pages}
                storyText={storyText}
                theme={formState.theme}
                ageGroup={formState.ageGroup}
                nightMode={nightMode}
                onRestart={restart}
              />
            );
          }
          // Older kids (6+) get full story text with optional audio
          return (
            <StoryView
              storyText={storyText}
              charLabel={getCharLabel()}
              charEmoji={getCharEmoji()}
              theme={formState.theme}
              ageGroup={formState.ageGroup}
              isPreReaderMode={formState.isPreReaderMode}
              onRestart={restart}
            />
          );
        }

        if (effectiveStoryMode === 'listen' && storyText) {
          return (
            <AudioPlayer
              storyText={storyText}
              charLabel={getCharLabel()}
              charEmoji={getCharEmoji()}
              theme={formState.theme}
              ageGroup={formState.ageGroup}
              nightMode={nightMode}
              onRestart={restart}
            />
          );
        }

        return null;
      }
      default:
        return null;
    }
  };

  return (
    <>
      {!isAuthenticated ? (
        <Login onLoginSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <div className={`app ${nightMode ? 'night' : ''}`}>
          <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h1 className="app-title">
                {nightMode ? '🌙 Magic Tales' : '✨ Magic Tales'}
              </h1>
              <button
                onClick={handleLogout}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  border: '0.5px solid var(--color-border-secondary)',
                  borderRadius: '6px',
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Logout
              </button>
            </div>
            <p className="app-sub">
              {nightMode
                ? 'Warm, calm stories for drifting off'
                : 'Create magical stories on demand'}
            </p>
            <button className="night-toggle" onClick={toggleNight}>
              <div className={`tog ${nightMode ? 'on' : ''}`}>
                <div className="tog-knob" />
              </div>
              <span>Bedtime mode</span>
            </button>
          </header>

          <StepDots current={step} />
          <Stars visible={nightMode} />

          <main className="screens">{renderStep()}</main>
        </div>
      )}
    </>
  );
}
