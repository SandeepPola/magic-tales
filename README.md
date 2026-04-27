# 📖 Story Magic — AI-Powered Bedtime Stories for Kids

A React PWA that generates personalized, age-appropriate stories using Claude AI. Features reading mode with word highlighting for pre-readers, listening mode with audio playback, and a cozy bedtime theme.

## Features

✨ **Smart Story Generation**
- Character selection (preset grid or freeform input)
- 8 themes: Adventure, Exploration, Problem-solving, Friendship, Courage, Wonder, Mystery, Kindness
- Age-appropriate: 3–5, 6–8, 9–12 years old
- Adjustable length: short (~300 words), medium (~600), long (~900)

📖 **Pre-reader Mode** (age 3–5, reading mode)
- Strict vocabulary (1–2 syllable words only)
- 6-word sentences, present tense
- Big text (28px), one paragraph per page
- Word-by-word highlighting as you read aloud

🎧 **Young Listener Mode** (age 3–5, listening mode)
- Simple linear plot, short sentences (under 10 words)
- Richer vocabulary (they understand complex words when heard)
- Sound effects and expressive dialogue

🌙 **Bedtime Mode**
- Dark warm theme (#0f1117 background, amber accents)
- Animated twinkling stars
- Audio player with progress bar, skip controls, sleep timer
- Calmer story pacing and soothing voice settings

📱 **PWA (Progressive Web App)**
- Installable on phones and tablets
- Works offline (cached assets)
- Native app-like experience

## Setup

### Prerequisites

- **Node.js** 16+ ([download here](https://nodejs.org/))
- **An Anthropic API key** ([get one free here](https://console.anthropic.com/))

### 1. Clone or download this repo

```bash
unzip story-magic-source.zip
cd story-magic
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your API key

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then open `.env` in your text editor and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-v1-xxxxxxxxxxxxx
```

**Don't share this file or commit it to git!**

### 4. Build the app

```bash
npm run build
```

### 5. Start the server

```bash
npm run server
```

Or in one command:

```bash
npm start
```

You'll see:

```
✨ Story Magic server running on http://localhost:3001
📖 Open http://localhost:3001 in your browser
```

### 6. Open in browser

Go to `http://localhost:3001` and start creating stories!

---

## Development (Local hot reload)

If you want to develop with live reloading, run these in two separate terminals:

**Terminal 1** — Vite dev server (updates React code instantly):
```bash
npm run dev
```

**Terminal 2** — Express server (your backend):
```bash
npm run server
```

Then open `http://localhost:5173` in your browser. The app will still call the backend at `http://localhost:3001` for story generation.

---

## Project Structure

```
story-magic/
├── src/
│   ├── App.jsx                      # Main app, step routing, state
│   ├── main.jsx                     # React entry point
│   ├── index.css                    # Full stylesheet (day + night themes)
│   ├── components/
│   │   ├── CharacterStep.jsx        # Step 1: character selection
│   │   ├── ThemeStep.jsx            # Step 2: theme selection
│   │   ├── ModeStep.jsx             # Step 3: reading vs listening + confirmation
│   │   ├── BookView.jsx             # Paged book reader with word highlighting
│   │   ├── AudioPlayer.jsx          # Audio player with sleep timer
│   │   ├── StepDots.jsx             # Progress indicator
│   │   └── Stars.jsx                # Bedtime twinkling stars
│   ├── hooks/
│   │   ├── useStoryGenerator.js     # Streaming API hook
│   │   └── useSpeech.js             # Web Speech API wrapper
│   └── utils/
│       ├── constants.js             # Characters, themes, ages, lengths
│       └── promptBuilder.js         # Prompt engineering logic
├── server.js                        # Express backend (API proxy)
├── vite.config.js                   # Vite + PWA config
├── package.json
├── .env.example
└── index.html                       # HTML entry point
```

---

## How It Works

### Frontend Flow

1. **Character Step** — User picks a preset animal or types any character (Mickey Mouse, etc.)
2. **Theme Step** — Select one of 8 themes
3. **Mode Step** — Choose reading (book) or listening (audio), pick story length
4. **Story Generation** — Frontend sends prompt to `/api/generate` backend endpoint
5. **Display** — Stream response into either BookView (paged) or AudioPlayer (streaming)

### Backend

The Express server:
- Holds your API key securely (never exposed to client)
- Proxies requests to Anthropic's API
- Streams responses back as Server-Sent Events (SSE)
- Serves the built React app on `/`

### Prompt Engineering

Three distinct prompt paths based on age + mode:

| Age | Mode | Behavior |
|-----|------|----------|
| 3–5 | Reading | Strict 1–2 syllable vocab, 6-word sentences, 6 short paragraphs |
| 3–5 | Listening | Simple plot, short sentences, but richer vocabulary + sound effects |
| 6–8+ | Either | Age-appropriate complexity (standard) |

---

## Customization

### Change colors/theme

Open `src/index.css` and modify the CSS variables at the top:

```css
:root {
  --accent: #6c5ce7;        /* Purple accent */
  --bg-app: #faf8f5;        /* Light background */
  /* ... etc */
}
```

### Add more characters

Edit `src/utils/constants.js`:

```js
export const PRESETS = [
  ['🦁', 'Lion'],
  ['🐯', 'Tiger'],  // Add your own
  // ...
];
```

### Change story length defaults

In `src/utils/constants.js`:

```js
export const LENGTHS = {
  short: { label: 'Short', desc: '~300 words', words: 300 },
  // ...
};
```

### Modify the prompt

The prompt engineering logic is in `src/utils/promptBuilder.js`. This is where you'd tweak vocabulary constraints, sentence structure, or add new rules.

---

## Deployment

### To Vercel (easiest for full-stack)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy

### To Heroku

```bash
git push heroku main
```

Make sure `ANTHROPIC_API_KEY` is set in Heroku config vars.

---

## Monetization (Future)

Once you have users:

- **Free tier**: 3 stories/day
- **Paid**: $4.99/month for unlimited (integrate Stripe)
- **Premium feature**: Export story as illustrated PDF

---

## Troubleshooting

**Q: Stories don't generate, I see "Could not generate the story"**

A: Check that:
1. Your `.env` file has the correct `ANTHROPIC_API_KEY`
2. The backend is running (`npm run server`)
3. Your API key has available credits at [console.anthropic.com](https://console.anthropic.com/)

**Q: App loads but looks wrong (styling issues)**

A: Make sure you ran `npm run build` before starting the server. The server serves static files from the `dist/` folder.

**Q: Port 3001 is already in use**

A: Change it in `.env`:
```
PORT=3002
```

Then open `http://localhost:3002` instead.

---

## API Cost

- ~0.01 USD per story (Haiku model is cheapest)
- At 100 stories/month: ~$1 in API costs
- Once you add TTS (optional), add ~$0.01 per story for audio

---

## Next Steps

- [ ] Add story library (save/load stories to localStorage or DB)
- [ ] Integrate Stripe for subscriptions
- [ ] Add OpenAI TTS for high-quality audio
- [ ] Generate story illustrations with DALL-E
- [ ] Build iOS/Android apps with React Native
- [ ] Implement parental controls (PIN lock, usage limits)

---

## License

MIT

---

**Questions?** Feel free to reach out!
