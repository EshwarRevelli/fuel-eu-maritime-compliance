import { Router, Request, Response } from 'express';
import { BankingServicePort } from '../../../core/ports/inbound/BankingService';

export function createBankingRouter(bankingService: BankingServicePort): Router {
  const router = Router();

  router.get('/banking/records', async (req: Request, res: Response) => {
    try {
      const shipId = req.query.shipId as string;
      const year = parseInt(req.query.year as string);

      if (!shipId || !year) {
        return res.status(400).json({ error: 'shipId and year are required' });
      }

      const records = await bankingService.getBankRecords(shipId, year);
      res.json(records);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  router.post('/banking/bank', async (req: Request, res: Response) => {
    try {
      const { shipId, year, amount } = req.body;

      if (!shipId || !year || !amount) {
        return res.status(400).json({ error: 'shipId, year, and amount are required' });
      }

      const entry = await bankingService.bankSurplus({ shipId, year, amount });
      res.json(entry);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  router.post('/banking/apply', async (req: Request, res: Response) => {
    try {
      const { shipId, year, amount } = req.body;

      if (!shipId || !year || !amount) {
        return res.status(400).json({ error: 'shipId, year, and amount are required' });
      }

      const result = await bankingService.applyBanked({ shipId, year, amount });
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}



