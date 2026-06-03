# Umar Usmoni — Portfolio Website

Premium cybersecurity-themed portfolio with interactive 3D WebGL background, glassmorphism UI, and neon green accents.

## 🚀 Quick Start (Local)

```bash
npx serve . -l 3000
```
Then open http://localhost:3000

## 🌐 Deploy to GitHub Pages (Free, 24/7)

### Step 1: Create Repository
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `umarusmomi.github.io` (or any name)
3. Keep it **Public**
4. Click **Create repository**

### Step 2: Push Code
```bash
cd d:\mysite
git init
git add .
git commit -m "🚀 Initial portfolio deploy"
git branch -M main
git remote add origin https://github.com/UmarUsmomi/umarusmomi.github.io.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / **(root)**
4. Click **Save**
5. Wait 1-2 minutes

### Step 4: Done! 🎉
Your site is live at: `https://umarusmomi.github.io`

## 📁 Structure

```
├── index.html          # Main page
├── favicon.svg         # SVG favicon
├── css/
│   ├── index.css       # Design tokens & reset
│   ├── components.css  # UI components
│   ├── sections.css    # Section layouts
│   └── animations.css  # Animations & keyframes
└── js/
    ├── particles.js    # 3D wireframe sphere
    ├── cursor.js       # Custom cursor trail
    ├── typing.js       # Terminal typing effect
    └── main.js         # Initialization & utilities
```

## ⚡ Performance
- 0 npm dependencies
- ~50KB total (CSS + JS)
- Lighthouse target: 95+
- No build step required

## 📝 License
© 2026 Umar Usmoni. All rights reserved.
