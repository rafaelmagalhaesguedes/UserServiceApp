import { Request, Router, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { UserValidator } from '../middlewares/UserMiddleware';

class UserRoutes {
  public router: Router;
  
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.get(
      '/',
      (req: Request, res: Response) => this.userController.getAllUsers(req, res),
    );

    this.router.put(
      '/:id',
      (req: Request, res: Response) => this.userController.updateUser(req, res),
    )
    
    this.router.post(
      '/',
      UserValidator.validateBody,
      (req: Request, res: Response) => this.userController.registerUser(req, res),
    );
  }
}

export default new UserRoutes().router;