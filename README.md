# 🌸 Flower Farm Frenzy

A full-stack arcade-style web game where players click flowers to gain points while avoiding weeds! Built with Vue 3 + Phaser.js frontend and Django backend.

## 🎮 Game Features

- **Arcade-style grid game**: Flowers pop up randomly, click them to score points
- **60-second rounds**: Fast-paced gameplay with countdown timer
- **Weeds system**: Avoid clicking weeds that deduct points
- **Score submission**: Enter 3-letter initials to save high scores
- **Leaderboard**: View top 10 scores from all players
- **Responsive design**: Works on both desktop and mobile devices

## 🏗️ Tech Stack

### Frontend
- **Vue 3** with TypeScript
- **Vite** for build tooling
- **Phaser.js** for game engine
- **Tailwind CSS** for styling
- **Axios** for API communication

### Backend
- **Django** with Django REST Framework
- **PostgreSQL** database
- **CORS** enabled for frontend communication
- **Rate limiting** to prevent spam
- **Admin interface** for score management

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (for production)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your database settings
   ```

5. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser** (optional):
   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server**:
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your API URL if different from default
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## 🎯 How to Play

1. **Start Game**: Click "Play" to begin a 60-second round
2. **Click Flowers**: Pink flowers give you +10 points
3. **Avoid Weeds**: Dark green squares deduct -5 points
4. **Beat the Clock**: You have 60 seconds to score as many points as possible
5. **Submit Score**: Enter your 3-letter initials to save your score
6. **Check Leaderboard**: View the top 10 highest scores

## 📡 API Endpoints

### Scores
- `POST /api/scores/` - Submit a new score
- `GET /api/scores/top/` - Get top 10 scores

### Health Check
- `GET /api/health/` - API health check

## 🔧 Development

### Backend Commands
```bash
# Run tests
python manage.py test

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Access admin panel
# Go to http://localhost:8000/admin
```

### Frontend Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## 🚢 Deployment

### Railway Deployment

Both frontend and backend can be deployed to Railway:

#### Backend (Django)
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard:
   - `SECRET_KEY`
   - `DEBUG=False`
   - `ALLOWED_HOSTS=your-domain.railway.app`
   - Database variables (Railway provides PostgreSQL)
3. Railway will automatically deploy using the Dockerfile

#### Frontend (Vue)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to Railway or any static hosting service
3. Update `VITE_API_URL` to point to your deployed backend

### Environment Variables

#### Backend (.env)
```env
SECRET_KEY=your-super-secret-key
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.railway.app
DB_NAME=flower_farm_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
```

#### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.railway.app/api
```

## 🎨 Game Assets

The game creates simple geometric sprites programmatically:
- **Flowers**: Pink circles with gold centers
- **Weeds**: Dark green squares with lighter accents
- **Grid**: Semi-transparent brown cells with borders

## 🔒 Security Features

- **Rate limiting**: Score submissions limited to prevent spam
- **Input validation**: Initials must be exactly 3 letters
- **CSRF protection**: Disabled for API endpoints but enabled for admin
- **CORS configuration**: Only allows requests from frontend domain

## 🐛 Troubleshooting

### Common Issues

1. **CORS errors**: Make sure backend CORS settings include your frontend URL
2. **Database connection**: Ensure PostgreSQL is running and credentials are correct
3. **Port conflicts**: Backend runs on 8000, frontend on 5173 by default
4. **Module not found**: Run `pip install -r requirements.txt` or `npm install`

### Debug Mode

Enable debug mode by setting `DEBUG=True` in backend `.env` file for detailed error messages.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section
2. Look at existing GitHub issues
3. Create a new issue with detailed information

---

Made with ❤️ using Vue 3, Phaser.js, Django, and lots of coffee! ☕ 