# Smart Meal Recommender Frontend

Frontend application for Smart Meal Recommender - an AI-powered meal suggestion app built with React, TypeScript, and shadcn/ui.

## 🚀 Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: TailwindCSS
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Toast Notifications**: Sonner

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── layout/         # Layout components (Header, WeatherWidget)
│   ├── meals/          # Meal-related components (MealCard, MealForm)
│   ├── ratings/        # Rating components
│   ├── recommendations/ # Recommendation components
│   ├── preferences/    # Preferences form components
│   └── ui/           # shadcn/ui components
├── lib/
│   ├── api/           # API client and endpoints
│   └── types/         # TypeScript type definitions
├── pages/             # Page components
│   ├── Dashboard.tsx   # Main dashboard page
│   ├── History.tsx     # Meal history page
│   ├── Recommendations.tsx # AI recommendations page
│   └── Settings.tsx   # Settings/preferences page
├── App.tsx            # Main app component with routing
└── main.tsx           # Application entry point
```

## 🛠️ Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running at `http://localhost:3000`

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔗 API Integration

The frontend connects to the backend API at `http://localhost:3000`. Make sure the backend server is running before starting the frontend.

### API Endpoints

- **Meals**: `/api/meals`
- **Recommendations**: `/api/recommendations`
- **Ratings**: `/api/ratings`
- **Preferences**: `/api/preferences`
- **Weather**: `/api/weather`

## 🎨 Features

### Dashboard
- View today's meals organized by type (Breakfast, Lunch, Dinner)
- Weather widget showing current conditions
- Quick actions to add meals or get recommendations
- Edit and delete meals directly from the dashboard

### History
- View complete meal history
- Filter by meal type
- Search meals by name or description
- Edit, delete, and rate meals

### Recommendations
- Get AI-powered meal suggestions
- Filter by meal type
- Accept suggestions to add as meals
- Skip and refresh for new suggestions

### Settings
- Manage dietary restrictions
- Set favorite cuisines
- Add disliked ingredients
- Configure location for weather

## 🎯 Component Library

### Layout Components
- **Header**: Navigation header with logo and menu
- **WeatherWidget**: Displays current weather information

### Meal Components
- **MealCard**: Display meal with actions (edit, delete, rate)
- **MealForm**: Form to add/edit meals

### Recommendation Components
- **RecommendationCard**: Display AI suggestion with accept/skip actions

### Rating Components
- **RatingDialog**: Modal for rating meals

### Preference Components
- **PreferencesForm**: Form to manage user preferences

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Components

1. Add shadcn/ui component:
```bash
npx shadcn@latest add [component-name]
```

2. Create custom component in appropriate folder
3. Add exports to index files

## 📝 TypeScript Types

All API types are defined in `src/lib/types/index.ts`:
- `Meal` - Meal entity
- `Recommendation` - AI recommendation
- `Rating` - Meal rating
- `Preferences` - User preferences
- API request/response types

## 🎨 Styling

The app uses TailwindCSS with custom theme:
- Primary colors: Orange, Amber (warm food tones)
- Responsive design (mobile-first)
- Dark mode support (planned)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy

The frontend can be deployed to:
- Vercel
- Netlify
- Any static hosting service

## 📚 Documentation

- [PRD](../get-meals/PRD.md) - Product Requirements
- [User Guide](../get-meals/USER_GUIDE.md) - User documentation
- [API Documentation](../get-meals/API.md) - Backend API docs

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Add proper error handling
4. Update type definitions when adding new features
5. Test on multiple screen sizes

## 📄 License

This project is part of Smart Meal Recommender.

---

**Built with ❤️ using React, TypeScript, and shadcn/ui**
