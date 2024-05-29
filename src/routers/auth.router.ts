import express, { Router } from 'express';

// Register UserModel with the container using the token
class AuthRouter {
  private router: Router;
  constructor() {
    this.router = express.Router();
    this.initialize();
  }

  private initialize() {}
  getRouter(): Router {
    return this.router;
  }
}

const authRouter = new AuthRouter();

export default authRouter.getRouter();
