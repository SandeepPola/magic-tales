import { useState, useRef, useCallback } from 'react';

export function useStoryGenerator() {
  const [storyText, setStoryText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const generate = useCallback(async (prompt) => {
    setStoryText('');
    setIsGenerating(true);
    setError(null);

    abortRef.current = new AbortController();

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        signal: abortRef.current.signal,
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || `API responded with ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;

          try {
            const json = JSON.parse(data);
            if (json.type === 'content_block_delta' && json.delta?.text) {
              fullText += json.delta.text;
              setStoryText(fullText);
            }
          } catch {
            // skip malformed JSON chunks
          }
        }
      }

      setIsGenerating(false);
      return fullText;
    } catch (err) {
      if (err.name === 'AbortError') return '';
      setError(err.message || 'Could not generate the story. Please try again.');
      setIsGenerating(false);
      return '';
    }
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setIsGenerating(false);
  }, []);

  return { storyText, isGenerating, error, generate, cancel };
}
