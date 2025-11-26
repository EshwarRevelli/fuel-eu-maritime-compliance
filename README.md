# Fuel EU Maritime Compliance Platform

A full-stack application for managing Fuel EU Maritime compliance, including route management, compliance balance calculations, banking, and pooling operations.

## Architecture

This project follows **Hexagonal Architecture (Ports & Adapters)** principles:

### Backend Structure
```
backend/src/
  core/
    domain/          # Domain entities and business logic
    application/     # Use cases (business logic orchestration)
    ports/
      inbound/       # Service interfaces (ports)
  adapters/
    inbound/http/    # HTTP controllers (Express routes)
    outbound/postgres/# Database repositories (Prisma)
  infrastructure/
    db/              # Database client and seeds
    server/          # Server setup
```

### Frontend Structure
```
frontend/src/
  core/
    domain/          # Domain models
    ports/           # Service interfaces
  adapters/
    ui/              # React components and hooks
    infrastructure/  # API client (Axios)
```

## Tech Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Jest

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd varun
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and set your DATABASE_URL

# Run database migrations
npx prisma migrate dev --name init

# Seed the database
npm run db:seed

# Start the development server
npm run dev
```

The backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## Running Tests

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

(Add frontend tests as needed)

## API Endpoints

### Routes
- `GET /routes` - Get all routes
- `POST /routes/:routeId/baseline` - Set a route as baseline
- `GET /routes/comparison` - Get comparison data (baseline vs others)

### Compliance
- `GET /compliance/cb?shipId=XXX&year=YYYY` - Get compliance balance
- `GET /compliance/adjusted-cb?shipId=XXX&year=YYYY` - Get adjusted compliance balance

### Banking
- `GET /banking/records?shipId=XXX&year=YYYY` - Get bank records
- `POST /banking/bank` - Bank surplus CB
- `POST /banking/apply` - Apply banked surplus

### Pooling
- `POST /pools` - Create a pool

## Features

### 1. Routes Tab
- View all routes in a table
- Filter by vessel type, fuel type, and year
- Set baseline route for comparison

### 2. Compare Tab
- Compare routes against baseline
- Visual chart showing GHG intensity comparison
- Compliance status (Compliant/non Compliant) based on target intensity (89.3368 gCO₂e/MJ)

### 3. Banking Tab
- View current compliance balance (CB)
- Bank positive CB surplus
- Apply banked surplus to deficits
- Real-time CB updates

### 4. Pooling Tab
- Create pools with multiple ships
- Automatic surplus-to-deficit allocation
- Validation: pool sum must be ≥ 0
- Exit condition checks

## Compliance Balance Formula

```
CB = (Target - Actual) × Energy in scope
Energy in scope ≈ fuelConsumption × 41,000 MJ/t
Target Intensity (2025) = 89.3368 gCO₂e/MJ
```

- **Positive CB** = Surplus (below target)
- **Negative CB** = Deficit (above target)

## Database Schema

- `routes` - Route data with GHG intensity and consumption
- `ship_compliance` - Calculated compliance balances
- `bank_entries` - Banked surplus records
- `pools` - Pool registry
- `pool_members` - Pool member allocations

## Sample Data

The seed script creates 5 sample routes:
- R001 (Container, HFO, 2024) - Set as baseline
- R002 (BulkCarrier, LNG, 2024)
- R003 (Tanker, MGO, 2024)
- R004 (RoRo, HFO, 2025)
- R005 (Container, LNG, 2025)

## Development

### Backend Development
```bash
cd backend
npm run dev        # Start with hot reload
npm run db:studio  # Open Prisma Studio
```

### Frontend Development
```bash
cd frontend
npm run dev        # Start Vite dev server
```

## Production Build

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve the dist/ folder with a static server
```

## License

ISC



