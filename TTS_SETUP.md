# Setting Up Professional Text-to-Speech (OpenAI)

## Why?

The app now uses **OpenAI's professional TTS API** instead of the robotic browser voices. The audio sounds like a real person reading — **much** better for bedtime stories.

## What it costs

- ~$0.015 per story (using the HD model)
- 100 stories/month = ~$1.50 in TTS costs
- Way cheaper than it sounds

## Setup (5 minutes)

### Step 1: Get your OpenAI API key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create a free account
3. Click "Create new secret key"
4. Copy the key (looks like `sk-proj-xxxxxxxxxxxxx`)

### Step 2: Add it to your .env

Open your `.env` file (the one you created for the Anthropic key) and add:

```
ANTHROPIC_API_KEY=sk-ant-v1-xxxxxxxxxxxxx
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

### Step 3: Restart your server

Stop it (Ctrl+C) and run:

```bash
npm start
```

### Step 4: Test it

1. Go to http://localhost:3001
2. Create a story in **listening mode**
3. Wait for "Generating audio..." to finish
4. Click the play button

You should hear natural-sounding audio instead of the robotic voice!

---

## How it works

When you create a story:

1. Claude generates the text (Anthropic API)
2. The text is sent to OpenAI's TTS API
3. OpenAI generates an MP3 audio file
4. The audio is embedded in the page and plays in the audio player
5. Sleep timer, skip, pause all work with the high-quality audio

---

## Voice choices

The app automatically picks the best voice:
- **Ages 3–5**: "Shimmer" (warm, friendly, slower pace)
- **Ages 6+**: "Nova" (clear, engaging, natural pace)

If you want to change these, edit `server.js` line 51:

```javascript
voice: ageGroup === '3–5' ? 'shimmer' : 'nova',
```

Other OpenAI voices to try: `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`

---

## Cost optimization

If you want cheaper audio:

1. Change `tts-1-hd` to `tts-1` in server.js (line 47)
   - Standard model: ~$0.005 per story (3x cheaper)
   - Slightly lower quality but still natural

2. Or use ElevenLabs (cheaper, better quality) — let me know if you want me to set that up

---

## Troubleshooting

**"OPENAI_API_KEY is not set"**
- Make sure you added it to `.env`
- Check the key format (should start with `sk-proj-`)
- Restart the server after editing `.env`

**Audio takes too long to generate**
- First-time generation can take 10–15 seconds
- Subsequent stories should be faster
- Check that your OpenAI account has credits

**Wrong voice for the story**
- Make sure you're testing with age group 3–5 vs 6+
- The voice adjusts based on age

---

That's it! You now have professional TTS for bedtime stories. 🎉
