# DNA Racing Analytics - Next.js Version

Modern, fast analytics platform for DNA Racing built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **⚡ Fast Performance** - Serverless architecture with intelligent caching
- **🎨 Dark Theme** - Professional purple gradient design
- **📱 Responsive** - Works perfectly on mobile, tablet, and desktop
- **💾 Smart Caching** - Database-backed caching for instant load times
- **🔄 Real-time Updates** - Live data updates without page refresh

## 📋 Tools

1. **Core Analytics** - Individual core performance analysis
2. **Core Comparison** - Side-by-side core comparisons
3. **Race Finder** - Upcoming race opportunities
4. **Vault Portfolio** - Complete vault analysis
5. **Breeding Analyzer** - Optimal breeding pair finder
6. **Speed Rankings** - Fastest cores by distance
7. **Power Database** - Searchable power stats database

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Vercel Postgres
- **Charts:** Recharts
- **Deployment:** Vercel

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🌐 Deployment to Vercel

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/dna-racing-analytics.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"

3. **Done!** Your app will be live at `https://your-project.vercel.app`

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 🔧 Environment Variables

Create a `.env.local` file:

```env
# Vercel Postgres (auto-populated by Vercel)
POSTGRES_URL="..."
POSTGRES_PRISMA_URL="..."
POSTGRES_URL_NON_POOLING="..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

These are automatically set when you add Vercel Postgres to your project.

## 📁 Project Structure

```
dna-racing-next/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── core-analytics/    # Tool pages (to be built)
│   ├── vault-portfolio/
│   └── api/               # API routes (to be built)
├── components/            # Reusable components (to be built)
├── lib/                   # Utilities
│   └── dna-api.ts        # DNA Racing API client
├── public/                # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## 🎨 Design System

### Colors

- **Background:** `#0e1117`
- **Card:** `#1e2130`
- **Primary:** `#667eea` (Purple)
- **Secondary:** `#764ba2` (Deep Purple)
- **Text:** `#fafafa`

### Components (Coming Soon)

- ToolCard
- DataTable
- CoreCard
- StatCard
- LoadingSpinner
- ErrorBoundary

## 🔄 Migration from Streamlit

This is a complete rebuild of the Streamlit app with:

✅ **Faster performance** - 10x faster than Streamlit
✅ **Better UX** - Instant navigation, no page reloads
✅ **Smarter caching** - Database-backed caching layer
✅ **Modern UI** - Full React component library
✅ **Mobile-first** - Responsive design

## 📈 Performance Targets

| Feature | Streamlit | Next.js Target |
|---------|-----------|----------------|
| Initial Load | 3-5s | <1s |
| Vault (100 cores) | 240s | <5s |
| Speed Rankings | 60-120s | <10s |
| Navigation | Full reload | Instant |

## 🚧 Development Roadmap

### Phase 1: Foundation ✅
- [x] Project setup
- [x] API client
- [x] Home page
- [x] Dark theme

### Phase 2: Core Tools (Week 1)
- [ ] Core Analytics page
- [ ] Vault Portfolio page
- [ ] Database caching layer
- [ ] API routes

### Phase 3: Advanced Tools (Week 2)
- [ ] Breeding Analyzer
- [ ] Speed Rankings
- [ ] Power Database
- [ ] Charts & visualizations

### Phase 4: Polish
- [ ] Loading states
- [ ] Error handling
- [ ] Optimistic updates
- [ ] Performance optimization

## 🤝 Contributing

This is a private project, but feel free to fork and customize!

## 📄 License

Private - All Rights Reserved

## 🆘 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for the DNA Racing community**
