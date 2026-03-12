# Deploying to Vercel - Step by Step Guide

## 🚀 Quick Deploy (5 minutes)

### Step 1: Push to GitHub

```bash
# Navigate to project folder
cd dna-racing-next

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial Next.js setup"

# Create GitHub repo and push
# (Create repo on GitHub first, then:)
git remote add origin https://github.com/YOUR_USERNAME/dna-racing-analytics.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Click **"Import Git Repository"**
3. Select your **dna-racing-analytics** repository
4. Vercel will auto-detect Next.js settings:
   - Framework Preset: **Next.js**
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. Click **"Deploy"**

### Step 3: Wait for Build

- First deploy takes 1-2 minutes
- You'll see build logs in real-time
- When done, you'll get a URL: `https://your-project.vercel.app`

### Step 4: Test

Visit your deployed app and verify:
- ✅ Home page loads
- ✅ Dark theme applied
- ✅ Navigation cards visible
- ✅ Gradient header shows

---

## 🔧 Adding Database (Optional - for caching)

### Step 1: Add Vercel Postgres

1. In your Vercel project dashboard
2. Click **"Storage"** tab
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Choose a region (select closest to users)
6. Click **"Create"**

### Step 2: Environment Variables

Vercel automatically adds these to your project:
```
POSTGRES_URL
POSTGRES_PRISMA_URL
POSTGRES_URL_NON_POOLING
POSTGRES_USER
POSTGRES_HOST
POSTGRES_PASSWORD
POSTGRES_DATABASE
```

### Step 3: Redeploy

Database variables are now available to your app!

---

## 📱 Custom Domain (Optional)

### Step 1: Add Domain

1. In Vercel project dashboard
2. Go to **"Settings"** → **"Domains"**
3. Enter your domain (e.g., `dnaracing-analytics.com`)
4. Click **"Add"**

### Step 2: Configure DNS

Vercel will show you DNS records to add:
- **A Record:** Point to Vercel IP
- **CNAME:** Point to `cname.vercel-dns.com`

### Step 3: Wait for SSL

- Vercel auto-provisions SSL certificate
- Takes 5-10 minutes
- Your site will be live at your custom domain!

---

## 🔄 Auto-Deploy Setup

**Already configured!** Every time you push to GitHub:

```bash
git add .
git commit -m "Add new feature"
git push
```

Vercel automatically:
1. Detects the push
2. Starts building
3. Deploys to production
4. Updates your live site

---

## ⚙️ Environment Variables

### For Development (Local)

Create `.env.local`:
```env
# DNA Racing API (if needed)
DNA_API_KEY=your_key_here

# Database (from Vercel)
POSTGRES_URL=postgresql://...
```

### For Production (Vercel)

1. Go to **Settings** → **Environment Variables**
2. Add variables:
   - Name: `DNA_API_KEY`
   - Value: `your_key`
   - Environment: **Production**
3. Click **"Save"**
4. Redeploy to apply

---

## 🐛 Troubleshooting

### Build Fails

**Error:** `Module not found`
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

**Error:** `Type error in .ts file`
```bash
# Solution: Fix TypeScript errors locally first
npm run build
# Fix any errors shown
```

### Runtime Errors

**Error:** `API timeout`
- Check DNA Racing API is accessible
- Increase timeout in `lib/dna-api.ts`

**Error:** `Database connection failed`
- Verify Postgres environment variables
- Check database is created in Vercel

---

## 📊 Monitoring

### View Logs

1. Go to Vercel project
2. Click **"Deployments"**
3. Click any deployment
4. Click **"Build Logs"** or **"Function Logs"**

### Performance

1. Go to **"Analytics"** tab
2. View:
   - Page load times
   - Core Web Vitals
   - Traffic stats

---

## 🎯 Production Checklist

Before going live:

- [ ] Test all pages work
- [ ] Verify API calls succeed
- [ ] Check mobile responsiveness
- [ ] Test with real DNA Racing data
- [ ] Set up custom domain
- [ ] Configure environment variables
- [ ] Enable Analytics
- [ ] Set up error tracking

---

## 🚀 You're Live!

Your Next.js DNA Racing Analytics is now:
- ⚡ Fast (serverless)
- 🌍 Global (CDN)
- 🔒 Secure (HTTPS)
- 🔄 Auto-deploying (CI/CD)

Share your URL and enjoy! 🎉
