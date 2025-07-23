# Project Update Log

## Initial Refactor for CI/CD
- Added Docker and Docker Compose setup.
- Configured GitHub Actions for CI/CD.
- Created .env.example for secrets management.
- Ensured all packages are current as per package.json.

## Docker Build Fix
- Fixed Dockerfile to handle missing lock files gracefully.
- Updated GitHub Actions to use the same dependency installation logic.
- Project uses Yarn with .yarnrc.yml but no lock file.
- Created missing public directory for Next.js static assets.
- Added .gitkeep to ensure public directory is tracked.

## Runtime Environment Fix
- Created .env file with PostgreSQL credentials to fix database startup.
- Updated Dockerfile to use Next.js standalone output for better production deployment.
- Modified next.config.js to output standalone build.
- Removed development volume mount from docker-compose.yml.
- Added security improvements with non-root user in container.
- Corrected .env file encoding to remove Byte Order Mark (BOM) for Docker compatibility. 