# MovieFlix - Movie Recommendation Application

A modern, responsive movie recommendation application built with React, TypeScript, and Tailwind CSS.


Check out the **designs** on Figma [here](https://www.figma.com/design/SyFgGk4lgKIymNiQEfjh3m/Movie-app?node-id=12-1788&t=EujxT34StclQVoXf-1).  
See the **live deployed project** on Netlify [here](https://moviefleix.netlify.app/).


##  Features

### Core Features
- **Movie Discovery**: Browse popular, top-rated, and now-playing movies
- **Search Functionality**: Real-time movie search with debounced input
- **Movie Details**: Detailed movie information including cast, crew, ratings, and more
- **Authentication**: Firebase authentication with email/password and Google sign-in
- **Watchlist**: Add and remove movies from personal watchlist
- **Responsive Design**: Mobile-first design that works on all devices
- **Pagination**: Optimized pagination for better performance
- **Loading States**: Beautiful skeleton loaders and progress indicators

### Technical Features
- **State Management**: Zustand for lightweight state management
- **API Integration**: TMDB API with intelligent caching
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Testing**: Unit tests with Vitest and React Testing Library
- **CI/CD**: Automated testing and deployment with GitHub Actions
- **Performance**: Optimized with lazy loading and memoization

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Authentication**: Firebase Auth
- **API Client**: Axios
- **Testing**: Vitest + React Testing Library
- **Build Tool**: Vite
- **Linting**: ESLint
- **CI/CD**: GitHub Actions

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/movieflix-app.git
cd movieflix-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file and add your actual API keys
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
# ... add all other Firebase config values
```

4. Start the development server:
```bash
npm run dev
```

##  Testing

Run the test suite:
```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:ci

# Run tests with UI
npm run test:ui
```

##  Deployment

### Automatic Deployment
The application is automatically deployed using GitHub Actions when code is pushed to the main branch to Netlify.

### Environment Variables Setup
For deployment, you need to configure the following secrets in your GitHub repository:

**GitHub Secrets (Settings → Secrets and variables → Actions):**
- `VITE_TMDB_API_KEY` - Your TMDB API key
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID
- `NETLIFY_AUTH_TOKEN` - Netlify personal access token
- `NETLIFY_SITE_ID` - Netlify site ID

### Netlify Setup
1. Create a Netlify account at [netlify.com](https://netlify.com)
2. Get your personal access token from User Settings → Applications
3. Create a new site and get the Site ID from Site Settings → General
4. Add these as GitHub secrets

### Manual Deployment
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Netlify 
npm run deploy
```

### Branch Strategy
- `main` - Production branch (auto-deploys)
- `development` - Development branch
- Feature branches should be created from `development`


## Design System

The application follows a consistent design system:

- **Colors**: Dark theme with red accents
- **Typography**: Clean, readable font hierarchy
- **Spacing**: 8px grid system
- **Components**: Modular, reusable UI components
- **Animations**: Smooth, purposeful micro-interactions

## Configuration

### TMDB API Setup
1. Visit [TMDB](https://www.themoviedb.org/settings/api)
2. Create an API key
3. Add the API key to your environment variables

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication
3. Configure email/password and Google providers
4. Add Firebase config to environment variables

## Performance Optimizations

- Image lazy loading
- API response caching
- Debounced search input
- Pagination for large datasets
- Code splitting and bundle optimization

## Architecture Decisions

### State Management
- **Zustand**: Lightweight alternative to Redux
- **Separation of Concerns**: Auth and movie data in separate stores
- **Persistence**: User preferences saved to localStorage

### API Layer
- **Axios**: HTTP client with interceptors for error handling
- **Caching**: In-memory cache with TTL for API responses
- **Error Handling**: Centralized error handling with user-friendly messages

### Component Architecture
- **Composition**: Small, focused components
- **Props Interface**: Strong TypeScript typing
- **Error Boundaries**: Graceful error handling at component level

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Write/update tests
5. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Commit Convention
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding/updating tests
- `chore:` - Maintenance tasks


## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for the movie data API
- [Firebase](https://firebase.google.com/) for authentication services
- [Lucide React](https://lucide.dev/) for beautiful icons
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

##  Contact

Eric Kyalo - [erickyalo19@gmail.com](mailto:erickyalo19@gmail.com)

Live Project Link: [https://moviefleix.netlify.app](https://moviefleix.netlify.app)




---