# Quick Setup Guide for Story Magic (Mac)

## 5-Minute Setup

### Step 1: Get your API key
Go to https://console.anthropic.com/ and copy your API key.

### Step 2: Extract and setup
```bash
# Extract the zip
unzip story-magic-source.zip
cd story-magic

# Install dependencies
npm install

# Create .env file with your API key
cp .env.example .env
```

### Step 3: Edit .env
Open `.env` in any text editor and paste your API key:
```
ANTHROPIC_API_KEY=sk-ant-v1-YOUR_KEY_HERE
```

### Step 4: Run it
```bash
npm start
```

Wait for this message:
```
✨ Story Magic server running on http://localhost:3001
```

### Step 5: Open browser
Click here or paste in your browser: **http://localhost:3001**

---

## It's working when you see:
- ✨ Story Magic title
- 📖 Character selection screen
- 🌙 Bedtime mode toggle in top right

## Try it
1. Pick a character (or type your own like "Sonic")
2. Pick a theme
3. Pick Reading or Listening mode
4. Click "Create story"

## That's it!

---

## Troubleshooting

**"Could not generate story"**
- Make sure `.env` has your API key (copy it exactly, including the `sk-ant-v1-` prefix)
- Make sure the server is running (you should see the message above)

**"Port already in use"**
- Edit `.env` and add: `PORT=3002`
- Then open http://localhost:3002

**App looks broken (styling wrong)**
- Stop the server (Ctrl+C)
- Run: `npm run build`
- Run: `npm run server`

---

## Questions?

Check the full README.md in the project folder for detailed docs.
