# Deploy Story Magic to Vercel

Vercel is perfect for hosting Node.js + React apps. It's free for the first tier and takes 5 minutes to set up.

## Step 1: Prepare for Deployment

### Update server.js for Vercel

Vercel serverless functions work differently. Create a `vercel.json` file:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Add a start script to package.json

Already done — `npm start` runs the server.

## Step 2: Push to GitHub

1. Create a GitHub account (free at github.com)
2. Create a new repository called `story-magic`
3. In your `story-magic` folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/story-magic.git
git push -u origin main
```

Make sure your `.env` is in `.gitignore` (it is) — never commit secrets.

## Step 3: Deploy to Vercel

1. Go to https://vercel.com and sign up (free)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `ANTHROPIC_API_KEY` = your Anthropic key
   - `OPENAI_API_KEY` = your OpenAI key
   - `APP_PASSWORD` = your chosen password (e.g., "MySecurePass123")
   - `JWT_SECRET` = a long random string (generate one: `openssl rand -base64 32`)

5. Click Deploy!

Vercel will automatically build and deploy. Your app is now live at a URL like `story-magic-abc123.vercel.app`.

## Step 4: Update Password Later

To change the password without redeploying:

1. Go to your Vercel project
2. Settings → Environment Variables
3. Edit `APP_PASSWORD`
4. Vercel auto-redeploys (takes ~2 minutes)

New users will need the new password to log in.

## Security Notes

- **Change `JWT_SECRET`** — generate a new random string for production
- **Strong password** — use something like "StoryMagic#2024MyFamily" (mix uppercase, numbers, symbols)
- **Shared password** — works for your use case. If you later want individual logins, let me know.

## Troubleshooting

**"Build failed":**
- Check that all 3 API keys are set in Vercel environment variables
- Make sure there are no typos in the keys

**"Login not working":**
- Clear browser cookies/cache
- Make sure `APP_PASSWORD` in Vercel matches what you're trying

**"Stories won't generate":**
- Verify Anthropic and OpenAI API keys have available credits
- Check Vercel logs: Project → Deployments → click failed deployment

## Updating the App

After changes locally:

```bash
git add .
git commit -m "Add feature X"
git push
```

Vercel auto-deploys from GitHub within a few seconds.

---

**Questions?** Let me know if you hit any issues!
