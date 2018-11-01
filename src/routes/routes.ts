import { Request, Response, Router } from 'express';
import { TradfriHandler } from '../handlers/tradfri-handler';

export class Routes {
    private readonly router: Router;
    private tradfriHandler: TradfriHandler;

    constructor() {
        this.router = Router();
        this.setupRoutes();
        this.tradfriHandler = new TradfriHandler();
    }

    getRouter(): Router {
        return this.router;
    }

    private setupRoutes(): void {
        this.router.get('/status', (req: Request, res: Response) => {
            res.json({status: 'OK'});
        });
    }
}
