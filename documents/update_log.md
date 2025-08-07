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

## Docker and Prisma Stability Improvements
- Simplified `prisma/schema.prisma` to use default client output and platform-native engine for portability in Docker (Alpine).
- Updated `app/Dockerfile` to install `openssl` and `libstdc++`, run `prisma generate`, and copy Prisma engines for production runtime.
- Added explicit `env_file: .env` to `docker-compose.yml` for consistent variable loading.
- Created root `.env.example` with safe local defaults; do not commit a real `.env` to source control.

## Visualization Objective Alignment
- Removed non-manifold spheres from the 3D scene to focus strictly on manifold wireframes.
- Edited `components/fluid-enhanced-three-js-visualization.tsx` to eliminate `SphereGeometry` proximity zones; retained line-based interaction cues.
- Kept ring and bridge indicators minimal and wireframe-only to avoid spherical glyphs; manifolds remain colored wireframe Klein bottle meshes.

## UI Formatting Consistency (Control Panels)
- Standardized card spacing across panels by applying `pb-3` to headers and `pt-0` to contents.
- Unified panel styling by using the `scientific-panel` class for `EssentialControls`.
- Ensured consistent responsive spacing and section toggles in `advanced-controls-panel.tsx` and `control-panel.tsx`.

## Paper Integration (Mathematics & Topology)
- Added `components/bordism-eta-demo.tsx`: interactive η-invariant demo mapping to Ω₄^{Pin⁻} ≅ Z/16Z per Bordism paper.
- Linked demo inside `components/math-formulas.tsx` and corrected focus to 4D Pin⁻ bordism classes with η-based explanation.