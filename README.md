# 🌸 Flower Farm Frenzy

A modern, full-stack arcade-style web game celebrating **Galleria Farms' 25th Anniversary**! Players click flowers to gain points while avoiding caterpillars in this beautifully designed, responsive game built with Vue 3 + Phaser.js frontend and Django REST API backend.

## 🎮 Game Features

- **Arcade-style grid game**: Flowers pop up randomly across a responsive grid
- **60-second rounds**: Fast-paced gameplay with countdown timer
- **Multi-flower scoring system**: Different flowers worth different points (🌸 +10, 🌻 +15, 🌺 +20)
- **Caterpillar avoidance**: Avoid clicking caterpillars (🐛 -5 points)
- **Difficulty levels**: Easy, Normal, and Hard modes with varying spawn rates
- **Score submission**: Enter 3-letter initials to save high scores
- **Enhanced leaderboard**: Podium display for top 3, comprehensive stats
- **Modern UI/UX**: Glassmorphism design with smooth animations
- **Fully responsive**: Optimized for desktop, tablet, and mobile devices
- **Accessibility features**: WCAG compliant with keyboard navigation

## 🏗️ Tech Stack

### Frontend
- **Vue 3** with Composition API and TypeScript
- **Vite** for lightning-fast build tooling
- **Phaser.js 3.90** for game engine and sprite management
- **Tailwind CSS 3.4** with custom design system
- **Axios** for API communication with interceptors
- **Modern animations** with custom CSS keyframes

### Backend
- **Django 5.2** with Django REST Framework 3.16
- **PostgreSQL** database (SQLite for development)
- **CORS** enabled for frontend communication
- **Input validation** with regex patterns
- **Admin interface** for score management
- **Environment-based configuration** with python-decouple

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** (recommended: Python 3.11+)
- **Node.js 18+** (recommended: Node.js 20+)
- **PostgreSQL 13+** (for production)

### Backend Setup

1. **Navigate to backend directory**:
   ```powershell
   cd backend
   ```

2. **Create and activate virtual environment**:
   ```powershell
   python -m venv venv
   venv\Scripts\activate  # Windows PowerShell
   # On Unix: source venv/bin/activate
   ```

3. **Install dependencies**:
   ```powershell
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   ```powershell
   cp env.example .env
   # Edit .env with your configuration (see Environment Variables section)
   ```

5. **Run database migrations**:
   ```powershell
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser** (optional, for admin access):
   ```powershell
   python manage.py createsuperuser
   ```

7. **Start development server**:
   ```powershell
   python manage.py runserver
   ```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```powershell
   cd frontend
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Set up environment variables**:
   ```powershell
   cp env.example .env
   # Edit .env with your API URL (see Environment Variables section)
   ```

4. **Start development server**:
   ```powershell
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## 🎯 How to Play

1. **Choose Difficulty**: Select Easy, Normal, or Hard mode
2. **Start Game**: Click "Start Game" to begin a 60-second round
3. **Click Flowers**: 
   - 🌸 Cherry Blossom: +10 points
   - 🌻 Sunflower: +15 points  
   - 🌺 Hibiscus: +20 points
4. **Avoid Caterpillars**: 🐛 Caterpillars deduct -5 points
5. **Beat the Clock**: Score as many points as possible in 60 seconds
6. **Submit Score**: Enter your 3-letter initials to save your score
7. **Check Leaderboard**: View the top 10 highest scores with podium display

## 📡 API Endpoints

### Game Scores
- `POST /api/scores/` - Submit a new score
  ```json
  {
    "initials": "ABC",
    "score": 150
  }
  ```
- `GET /api/scores/top/` - Get top 10 scores for leaderboard

### System Health
- `GET /api/health/` - API health check and player count

### Admin Interface
- `GET /admin/` - Django admin panel (requires superuser)

## 🔧 Development

### Backend Commands
```powershell
# Run tests (when implemented)
python manage.py test

# Create new migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Start development server
python manage.py runserver

# Access admin panel at http://localhost:8000/admin
```

### Frontend Commands
```powershell
# Development server with hot reload
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview

# Lint and fix code
npm run lint

# Format code with Prettier
npm run format
```

## 🚢 Deployment

### Environment Variables

#### Backend (.env)
```env
# Security
SECRET_KEY=your-super-secret-key-here-minimum-50-characters
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com

# Database (PostgreSQL for production)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=flower_farm_db
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_HOST=localhost
DB_PORT=5432

# For SQLite (development only)
# DB_ENGINE=django.db.backends.sqlite3
# DB_NAME=db.sqlite3
```

#### Frontend (.env)
```env
# API Configuration
VITE_API_URL=https://your-backend-domain.com/api

# Development
# VITE_API_URL=http://localhost:8000/api
```

### Railway Deployment

#### Backend Deployment
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Railway will automatically detect Django and deploy
4. Database will be automatically provisioned (PostgreSQL)

#### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to Railway or static hosting service
3. Update `VITE_API_URL` to point to your deployed backend

### Production Checklist
- [ ] Set `DEBUG=False` in backend
- [ ] Use PostgreSQL database
- [ ] Set secure `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Set up HTTPS
- [ ] Remove console.log statements
- [ ] Test all API endpoints
- [ ] Verify CORS configuration

## 🎨 Design System

### Color Palette
- **Primary**: Flower Pink (#FF69B4)
- **Secondary**: Leaf Green (#228B22)  
- **Accent**: Flower Yellow (#FFD700)
- **Success**: Emerald (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Game Headings**: Fredoka One (playful, bold)
- **Body Text**: Poppins (clean, modern)
- **Display Text**: Poppins (friendly, readable)

### Animation System
- Fade transitions (fade-in, fade-in-up, fade-in-down)
- Scale animations (scale-in)
- Bounce effects (bounce-subtle)
- Float animations for background elements
- Smooth hover transitions

## 🔒 Security Features

- **Input validation**: Regex validation for initials, score validation
- **CORS configuration**: Restricted to allowed origins
- **Environment variables**: Sensitive data stored securely
- **CSRF protection**: Enabled for admin, disabled for API endpoints
- **SQL injection protection**: Django ORM provides built-in protection
- **XSS protection**: Vue.js templates provide automatic escaping

## 🐛 Troubleshooting

### Common Issues

1. **CORS errors**
   - Ensure backend CORS settings include your frontend URL
   - Check `CORS_ALLOWED_ORIGINS` in Django settings

2. **Database connection failures**
   - Verify PostgreSQL is running and credentials are correct
   - Check database exists and user has proper permissions

3. **Port conflicts**
   - Backend runs on port 8000, frontend on 5173 by default
   - Use `netstat -an | findstr :8000` to check port usage

4. **Module not found errors**
   - Run `pip install -r requirements.txt` for backend
   - Run `npm install` for frontend
   - Ensure virtual environment is activated

5. **Game not loading**
   - Check browser console for JavaScript errors
   - Verify API endpoints are responding
   - Check network tab for failed requests

### Debug Mode

Enable debug mode by setting `DEBUG=True` in backend `.env` file for detailed error messages. **Never use debug mode in production.**

## 🧪 Testing

### Current Testing Status
- **Frontend**: ESLint + TypeScript for code quality
- **Backend**: Django test framework ready (tests need implementation)

### Recommended Testing Strategy
```powershell
# Backend tests (to be implemented)
python manage.py test

# Frontend tests (to be added)
npm run test

# E2E tests (future enhancement)
npm run test:e2e
```

## 📊 Performance Optimization

### Frontend Optimizations
- **Vite build optimization**: Tree shaking and code splitting
- **Tailwind CSS purging**: Unused styles automatically removed
- **Image optimization**: Logos and assets optimized
- **Lazy loading**: Components loaded on demand

### Backend Optimizations
- **Database indexing**: Scores ordered by score and timestamp
- **Query optimization**: Efficient leaderboard queries
- **Static file serving**: Configured for production

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following the coding standards
4. **Add tests** if applicable
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Submit a pull request**

### Coding Standards
- **Frontend**: ESLint + Prettier configuration
- **Backend**: PEP 8 Python style guide
- **Commits**: Conventional commit messages
- **Documentation**: Update README for new features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

If you encounter any issues or have questions:

1. **Check the troubleshooting section** above
2. **Review existing GitHub issues**
3. **Create a new issue** with:
   - Detailed description of the problem
   - Steps to reproduce
   - System information (OS, browser, versions)
   - Console errors or logs

## 🎉 Acknowledgments

- **Galleria Farms** for 25 years of excellence
- **Vue.js team** for the amazing framework
- **Phaser.js community** for the powerful game engine
- **Django team** for the robust backend framework
- **All contributors** who helped make this project better

---

**Made with ❤️ using Vue 3, Phaser.js, Django, and lots of coffee!** ☕

*Celebrating 25 years of Galleria Farms with modern web technology* 🌸 