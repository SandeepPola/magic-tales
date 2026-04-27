import { useState, useRef, useCallback, useEffect } from 'react';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef(null);

  const speak = useCallback((text, { rate = 0.9, pitch = 1.05 } = {}) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = rate;
    utt.pitch = pitch;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.name.includes('Samantha') ||
        v.name.includes('Karen') ||
        v.name.includes('Moira') ||
        v.name.includes('Google UK English Female')
    );
    if (preferred) utt.voice = preferred;

    utt.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utt.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utt;
    setIsSpeaking(true);
    setIsPaused(false);
    window.speechSynthesis.speak(utt);
  }, []);

  const pause = useCallback(() => {
    window.speechSynthesis?.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis?.resume();
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!isSpeaking) return;
    if (isPaused) resume();
    else pause();
  }, [isSpeaking, isPaused, pause, resume]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  return { isSpeaking, isPaused, speak, pause, resume, stop, togglePlayPause };
}
