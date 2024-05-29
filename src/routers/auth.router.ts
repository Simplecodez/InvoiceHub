import express, { Router } from 'express';
import { container } from 'tsyringe';
import UserRegistrationService from '../controllers/auth.controller';

const userRegistrationService = container.resolve(UserRegistrationService);

class AuthRouter {
  private router: Router;
  constructor() {
    this.router = express.Router();
    this.initialize();
  }

  private initialize() {
    this.router.post('/register', userRegistrationService.register());
  }
  getRouter(): Router {
    return this.router;
  }
}

const authRouter = new AuthRouter();

export default authRouter.getRouter();
