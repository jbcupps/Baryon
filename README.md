# SKB Baryon Visualization

This project presents an interactive 3D mathematical modeling tool for visualizing baryon formation under the Spacetime Klein Bottle (SKB) hypothesis. It provides a dynamic and educational platform to explore how fundamental particles, represented as topological defects, merge to form stable structures like protons and neutrons.

The visualization is built on a robust mathematical framework, incorporating concepts like quaternionic holonomy, Pin⁻ structures, and causal compensation to deliver a physically accurate and visually engaging experience.

## Core Concepts

The **Spacetime Klein Bottle (SKB) hypothesis** proposes that:
- Spacetime is the only fundamental entity.
- Fundamental particles are non-orientable topological defects in 4D spacetime, specifically with the topology similar to a Klein bottle.
- Forces and particle properties emerge from the topological and geometric properties of these defects.

This application visualizes the "merger" of three quark sub-SKBs into a single, stable baryon, demonstrating concepts like color confinement and mass generation through binding energy.

## Features

- **Interactive 3D Visualization**: Real-time rendering of the quark merger process using Three.js and React Three Fiber.
- **Baryon Presets**: Pre-configured visualizations for the formation of a **Proton (uud)** and a **Neutron (udd)**.
- **Dynamic Animations**: Smooth animations showing the transition from three separate quarks into a single baryon structure.
- **Mathematical Accuracy**: All visual parameters (scale, rotation, flux vectors) are derived from the physical properties defined in the SKB mathematical framework.
- **Real-time Data Display**: View key mathematical data, such as holonomy values and confinement strength, update in real time as the animation progresses.
- **Advanced Control Panel**: Fine-tune physics parameters like deformation intensity, fluid viscosity, and confinement strength to see their effect on the simulation.
- **Educational Overlays**: Toggle the display of mathematical formulas and analysis sections to better understand the underlying physics.

## Technology Stack

- **Application Framework**: [Next.js](https://nextjs.org/) (React)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **3D Rendering**: [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction), [@react-three/drei](https://github.com/pmndrs/drei)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Containerization**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- **CI/CD**: [GitHub Actions](https://github.com/features/actions)

## Project Structure

The project is organized as a monorepo with the following structure:

```
/
├── .github/workflows/        # CI/CD pipeline configuration
├── documents/                # Project documentation and update logs
├── skb-baryon-demo/
│   └── app/                  # The core Next.js application source code
├── .env.example              # Example environment variables
├── docker-compose.yml        # Docker service orchestration
└── README.md                 # This file
```

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/) (v20 or later)
- [Docker](https://www.docker.com/products/docker-desktop/)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Baryon
```

### 2. Configure Environment Variables

Create a `.env` file in the project root by copying the example file.

```bash
cp .env.example .env
```

Review the `.env` file and ensure the variables are set correctly. The default values are configured to work with the `docker-compose.yml` setup.

```env
# .env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=skb_secure_password_2025
POSTGRES_DB=skb_baryon_db
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgres://postgres:skb_secure_password_2025@db:5432/skb_baryon_db
```

### 3. Build and Run the Application

Use Docker Compose to build the images and start the services.

```bash
docker compose up --build -d
```

This command will:
- Build the Docker image for the Next.js application.
- Pull the official PostgreSQL image.
- Start both containers and connect them on a shared network.

### 4. Access the Application

Once the containers are running, you can access the SKB Baryon Visualization in your browser at:

**[http://localhost:3000](http://localhost:3000)**

The PostgreSQL database will be running and accessible on port `5432`.

## Available Scripts

The following scripts are available in the `skb-baryon-demo/app/package.json` file and can be run inside the `app` container:

- `npm run dev`: Starts the application in development mode.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase.

To run a command inside the container:
```bash
docker compose exec app <command>
# Example:
docker compose exec app npm run lint
```

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## License

This project is unlicensed. Please add a license file if you wish to distribute it. 
