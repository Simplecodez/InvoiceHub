import express, { Router } from 'express';
import { container } from 'tsyringe';
import UserRegistrationController from '../controllers/auth/register.controller';
import UserActivationController from '../controllers/auth/activation.controller';

const userRegistrationController = container.resolve(UserRegistrationController);
const userActivationController = container.resolve(UserActivationController);

class AuthRouter {
  private router: Router;
  constructor() {
    this.router = express.Router();
    this.initialize();
  }

  private initialize() {
    this.router.post('/register', userRegistrationController.register());
    this.router.post('/activate/:activation_token', userActivationController.activate());
  }
  getRouter(): Router {
    return this.router;
  }
}

const authRouter = new AuthRouter();

export default authRouter.getRouter();
