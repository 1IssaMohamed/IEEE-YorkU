# IEEE YorkU Club Website

A modern, responsive website for the IEEE student branch at York University, built with React and Express.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation & Running

```bash
# Install all dependencies (client + server)
npm run install-all

# Run both client and server with one command
npm run dev
```

That's it! The app will open at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
ieee/
├── client/           # React frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   └── api/          # API client utilities
│   └── package.json
│
├── server/           # Express backend API
│   ├── data.js       # Mock data (replace with DB later)
│   ├── index.js      # Server entry point
│   └── package.json
│
└── package.json      # Root - runs both client & server
```

## 🎨 Features

- ✅ Responsive design with Tailwind CSS
- ✅ Dynamic event showcase with image carousels
- ✅ Team member profiles
- ✅ Smooth scroll navigation
- ✅ Auto-play image galleries
- ✅ Mobile-friendly interface

## ⚡ Best Practices Implemented

### **Performance Optimization**
- **Lazy Loading Images** - All images use `loading="lazy"` and `decoding="async"` attributes for better initial load times
- **Code Splitting & Memoization** - React hooks (`useMemo`, `useCallback`) prevent unnecessary re-renders
- **Optimized API Client** - Centralized Axios configuration with request cancellation via AbortController
- **Production Build** - Vite bundler with minification, tree-shaking, and code splitting

### **Security**
- **Helmet.js Integration** - Sets secure HTTP headers (XSS protection, content security policy, etc.)
- **Rate Limiting** - Express middleware limits API requests to 100 per 15 minutes per IP
- **CORS Configuration** - Properly configured cross-origin resource sharing with allowed origins
- **Input Validation** - PropTypes for runtime type checking on all React components

### **Code Quality**
- **ESLint Configuration** - Enforces consistent code style with React-specific rules
- **PropTypes Validation** - Type checking for all component props with default values
- **Error Boundaries** - Proper error handling with loading and error states throughout the app
- **Modular Architecture** - Clean separation of concerns (components, pages, API layer)

### **User Experience**
- **Loading States** - Custom LoadingSpinner component provides feedback during data fetching
- **Error Handling** - User-friendly error messages instead of crashes
- **Mobile Responsiveness** - Touch-optimized targets (48x48px minimum), responsive typography, mobile-first design
- **Accessibility (WCAG)** - Semantic HTML, ARIA labels on interactive elements, proper heading hierarchy

### **SEO & Analytics**
- **Meta Tags** - Comprehensive SEO meta tags (description, keywords, author, Open Graph)
- **robots.txt** - Proper search engine crawling directives
- **Vercel Analytics** - Privacy-friendly web analytics for tracking visitor metrics
- **Semantic HTML** - Proper use of header, nav, main, section, footer elements

### **Developer Experience**
- **Single Command Development** - Run both client and server with `npm run dev`
- **Hot Module Replacement** - Instant feedback during development with Vite HMR
- **Auto-reload Server** - Nodemon automatically restarts Express server on file changes
- **Clear Project Structure** - Intuitive folder organization for easy navigation

## 🔧 Development

### Available Scripts

**Root directory:**
- `npm run install-all` - Install dependencies for client and server
- `npm run dev` - Run both client and server in development mode

**Client (frontend):**
```bash
cd client
npm run dev     # Start dev server
npm run build   # Build for production
npm run preview # Preview production build
```

**Server (backend):**
```bash
cd server
npm run dev     # Start with nodemon (auto-reload)
npm start       # Start production server
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client

### Backend
- **Express** - Web framework
- **Node.js** - Runtime environment
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development auto-reload

## 📝 Adding Content

### Adding Events
Edit `server/data.js` and add to the `events` array:

```javascript
{
  id: 4,
  title: "Your Event Name",
  date: "Jan 15, 2026",
  time: "6:00 PM EST",
  location: "YorkU Campus",
  category: "Technical", // or "Professional" or "Project"
  images: [
    { url: "https://...", caption: "Description" }
  ]
}
```

### Adding Team Members
Edit `server/data.js` and add to the `team` array:

```javascript
{
  id: 5,
  name: "Your Name",
  role: "Your Position",
  program: "Your Program"
}
```

## 🌐 Deployment

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Render/Railway
- Connect your GitHub repo
- Set build command: `npm run install-all`
- Set start command: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this for your own club website!
