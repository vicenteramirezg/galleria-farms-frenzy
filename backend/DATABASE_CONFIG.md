# Database Configuration

This Django application is configured to automatically use the appropriate database backend based on the deployment environment.

## Local Development (SQLite3)

- **Database**: SQLite3 (file-based database)
- **Location**: `backend/db.sqlite3`
- **Configuration**: Automatic - no environment variables needed
- **Advantages**: 
  - Zero configuration
  - Perfect for development and testing
  - No external dependencies

## Production Deployment (PostgreSQL on Railway)

- **Database**: PostgreSQL
- **Configuration**: Automatic via Railway environment variables
- **Detection**: Uses `RAILWAY_ENVIRONMENT` environment variable
- **Required Variables** (automatically set by Railway):
  - `RAILWAY_ENVIRONMENT=production`
  - `PGDATABASE` - Database name
  - `PGUSER` - Database user
  - `PGPASSWORD` - Database password
  - `PGHOST` - Database host
  - `PGPORT` - Database port

## How It Works

The application automatically detects the environment:

1. **Railway Detection**: Checks for `RAILWAY_ENVIRONMENT` environment variable
2. **Local Development**: If not found, uses SQLite3
3. **Production**: If found, uses PostgreSQL with Railway's provided credentials

## Testing Your Configuration

Run the database configuration test script:

```bash
cd backend
python test_db_config.py
```

This will show you:
- Which database backend is being used
- Current database settings
- Connection test results

## Environment Variables

### Local Development (.env file)
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Railway Production
Railway automatically sets the required PostgreSQL environment variables. You only need to set:
- `SECRET_KEY` (required)
- `RAILWAY_PUBLIC_DOMAIN` (optional, for CORS)
- `ALLOWED_HOSTS` (optional, additional hosts)

## Migration Commands

### Local Development
```bash
python manage.py makemigrations
python manage.py migrate
```

### Railway Production
Railway will automatically run migrations during deployment if you configure the build command properly.

## Security Features

When deployed to Railway, the application automatically enables:
- HTTPS enforcement
- Security headers
- Debug mode disabled
- HSTS (HTTP Strict Transport Security)
- Content type sniffing protection
- XSS protection 