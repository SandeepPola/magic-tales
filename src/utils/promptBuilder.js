import { LENGTHS } from './constants.js';

export function buildPrompt({ charMode, customChar, presetType, theme, ageGroup, storyMode, length, nightMode, isPreReaderMode }) {
  const isCustom = charMode === 'custom';
  const charName = isCustom ? customChar.trim() : presetType;
  const len = LENGTHS[length]?.words || 600;

  const bedtime = nightMode
    ? '\nThis is a bedtime story — gentle, soothing tone. End peacefully with the character resting or falling asleep.'
    : '';

  const charInstruction = isCustom
    ? `The main character is inspired by "${charName}". Capture their well-known personality and spirit but create an entirely original story. Do not reproduce copyrighted dialogue, settings, or plots.`
    : `The main character is a ${charName}.`;

  const isPreReader = isPreReaderMode && storyMode === 'read';
  const isYoungListener = ageGroup === '3–5' && storyMode === 'listen';

  if (isPreReader) {
    // Tailor pre-reader vocabulary based on age group
    let vocabRules = '';
    if (ageGroup === '3–5') {
      vocabRules = `STRICT pre-reader rules (ages 3–5):
- Use ONLY simple 1–2 syllable words. Replace: "enormous"→"big", "discovered"→"found", "beautiful"→"pretty", "immediately"→"now", "angry"→"mad"
- Every sentence MUST be 6 words or fewer
- Write exactly 6 short paragraphs of exactly 2 sentences each
- Use lots of repetition ("and then... and then...")
- Present tense only ("runs" not "ran")
- One simple idea per paragraph — no subplots
- Blank line between each paragraph`;
    } else if (ageGroup === '6–8') {
      vocabRules = `Pre-reader rules (ages 6–8 learning to read):
- Use mostly simple 1–2 syllable words, but 2–3 syllables ok occasionally (happen, garden, remember, animal)
- Sentences under 8 words each
- Write 5–6 short paragraphs of 2–3 sentences each
- Use some repetition for rhythm
- Mix present and simple past tense ("was", "had", "did")
- Simple plots with one clear storyline
- Blank line between each paragraph`;
    } else {
      // 9–12
      vocabRules = `Pre-reader rules (ages 9–12 learning to read):
- Use a mix of 1–3 syllable words, avoiding words with 4+ syllables or complex roots
- Sentences under 12 words each
- Write 4–5 longer paragraphs with 3–4 sentences each
- Include some dialogue
- Can use past tense, simple future ("will", "going to")
- Richer plot with character development
- Blank line between each paragraph`;
    }

    return `You are a children's book author writing for pre-readers who are learning to read independently.

${charInstruction}
Theme: ${theme}

${vocabRules}
- End warmly and happily
${bedtime}
Begin the story directly. No title.`;
  }

  if (isYoungListener) {
    return `You are a warm storyteller narrating aloud to children aged 3–5. This story will be LISTENED to, not read.

${charInstruction}
Theme: ${theme}

Rules for young listeners (ages 3–5):
- Keep sentences short — under 10 words each
- One simple, linear plot. No subplots or flashbacks
- Use repetition and rhythm — kids this age love patterns and refrains
- Vocabulary can be richer than what they'd read ("magnificent", "enormous", "spectacular" are fine — they understand these when heard)
- Include sound effects and onomatopoeia ("SPLASH!", "whoooosh", "crunch crunch crunch")
- Write 4 short paragraphs with a clear beginning, middle, and end
- Use expressive dialogue — voices are part of the fun when read aloud
- Keep it under ${len} words
- Blank line between each paragraph
${bedtime}
Begin the story directly. No title.`;
  }

  const ageGuidance =
    ageGroup === '6–8'
      ? '- Sentences under 15 words. Simple vocabulary but not babyish\n- Include fun dialogue and action\n- 3–4 paragraphs'
      : '- Can use more complex vocabulary and longer sentences\n- Include character development and richer descriptions\n- 4–5 paragraphs';

  return `You are a warm, imaginative children's story author. Write a ${len}-word story for children aged ${ageGroup}.

${charInstruction}
Theme: ${theme}
${storyMode === 'listen' ? 'This story will be read aloud — write for the ear. Include expressive dialogue and natural rhythms.' : ''}

Guidelines:
${ageGuidance}
- Theme of "${theme}" drives the plot
- Positive, satisfying ending
- Blank line between each paragraph
${bedtime}
Begin directly. No title.`;
}

export function splitIntoPages(text, isPreReader) {
  const paras = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (isPreReader) {
    return paras.map((p) => p.replace(/\n/g, ' ').trim());
  }

  const pages = [];
  let current = '';
  for (const para of paras) {
    if (current && (current + '\n\n' + para).length > 400) {
      pages.push(current.trim());
      current = para;
    } else {
      current = current ? current + '\n\n' + para : para;
    }
  }
  if (current.trim()) pages.push(current.trim());
  return pages;
}
