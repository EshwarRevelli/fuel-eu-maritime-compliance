import { Router, Request, Response } from 'express';
import { RouteServicePort } from '../../../core/ports/inbound/RouteService';

export function createRoutesRouter(routeService: RouteServicePort): Router {
  const router = Router();

  router.get('/routes', async (req: Request, res: Response) => {
    try {
      const routes = await routeService.getAllRoutes();
      res.json(routes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/routes/:routeId/baseline', async (req: Request, res: Response) => {
    try {
      const { routeId } = req.params;
      const route = await routeService.setBaseline(routeId);
      res.json(route);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  router.get('/routes/comparison', async (req: Request, res: Response) => {
    try {
      const comparisons = await routeService.getComparison();
      res.json(comparisons);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}



