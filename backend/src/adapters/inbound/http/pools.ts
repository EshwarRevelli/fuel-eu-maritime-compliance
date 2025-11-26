import { Router, Request, Response } from 'express';
import { PoolingServicePort } from '../../../core/ports/inbound/PoolingService';

export function createPoolsRouter(poolingService: PoolingServicePort): Router {
  const router = Router();

  router.post('/pools', async (req: Request, res: Response) => {
    try {
      const { year, members } = req.body;

      if (!year || !members || !Array.isArray(members)) {
        return res.status(400).json({ error: 'year and members array are required' });
      }

      const result = await poolingService.createPool({ year, members });
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}



