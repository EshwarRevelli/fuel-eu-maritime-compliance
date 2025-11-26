import { Router, Request, Response } from 'express';
import { ComplianceServicePort } from '../../../core/ports/inbound/ComplianceService';

export function createComplianceRouter(complianceService: ComplianceServicePort): Router {
  const router = Router();

  router.get('/compliance/cb', async (req: Request, res: Response) => {
    try {
      const shipId = req.query.shipId as string;
      const year = parseInt(req.query.year as string);

      if (!shipId || !year) {
        return res.status(400).json({ error: 'shipId and year are required' });
      }

      const cb = await complianceService.getComplianceBalance(shipId, year);
      res.json(cb);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  router.get('/compliance/adjusted-cb', async (req: Request, res: Response) => {
    try {
      const shipId = req.query.shipId as string;
      const year = parseInt(req.query.year as string);

      if (!shipId || !year) {
        return res.status(400).json({ error: 'shipId and year are required' });
      }

      const adjustedCb = await complianceService.getAdjustedComplianceBalance(shipId, year);
      res.json(adjustedCb);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}



