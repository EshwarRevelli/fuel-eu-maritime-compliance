import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getPrismaClient } from './infrastructure/db/client';
import { PrismaRouteRepository } from './adapters/outbound/postgres/RouteRepository';
import { PrismaBankingRepository } from './adapters/outbound/postgres/BankingRepository';
import { PrismaComplianceRepository } from './adapters/outbound/postgres/ComplianceRepository';
import { PrismaPoolingRepository } from './adapters/outbound/postgres/PoolingRepository';
import { RouteUseCase } from './core/application/RouteUseCase';
import { ComplianceUseCase } from './core/application/ComplianceUseCase';
import { BankingUseCase } from './core/application/BankingUseCase';
import { PoolingUseCase } from './core/application/PoolingUseCase';
import { createRoutesRouter } from './adapters/inbound/http/routes';
import { createComplianceRouter } from './adapters/inbound/http/compliance';
import { createBankingRouter } from './adapters/inbound/http/banking';
import { createPoolsRouter } from './adapters/inbound/http/pools';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Prisma
const prisma = getPrismaClient();

// Initialize repositories
const routeRepository = new PrismaRouteRepository(prisma);
const bankingRepository = new PrismaBankingRepository(prisma);
const complianceRepository = new PrismaComplianceRepository(prisma, bankingRepository);

// Initialize use cases
const routeService = new RouteUseCase(routeRepository);
const complianceService = new ComplianceUseCase(complianceRepository, routeRepository);
const bankingService = new BankingUseCase(bankingRepository, complianceService, complianceRepository);
const poolingService = new PoolingUseCase(new PrismaPoolingRepository(prisma));

// Register routes
app.use('/', createRoutesRouter(routeService));
app.use('/', createComplianceRouter(complianceService));
app.use('/', createBankingRouter(bankingService));
app.use('/', createPoolsRouter(poolingService));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

