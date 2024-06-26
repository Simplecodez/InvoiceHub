import express, { Router } from 'express';
import { container } from 'tsyringe';
import UserRegistrationController from '../controllers/auth/register.controller';
import UserActivationController from '../controllers/auth/activation.controller';
import UserSigninController from '../controllers/auth/signin.controller';
import ProtectUser from '../middlewares/auth/protect.middleware';
import ForgotPasswordController from '../controllers/auth/forgotpassword.controller';
import { PasswordResetController } from '../controllers/auth/reset-password.controller';

const userRegistrationController = container.resolve(UserRegistrationController);
const userActivationController = container.resolve(UserActivationController);
const userSigninController = container.resolve(UserSigninController);
const protectController = container.resolve(ProtectUser);
const forgotPasswordController = container.resolve(ForgotPasswordController);
const passwordResetController = container.resolve(PasswordResetController);
class AuthRouter {
  private router: Router;
  constructor() {
    this.router = express.Router();
    this.initialize();
  }

  private initialize() {
    this.router.post('/register', userRegistrationController.register());
    this.router.get('/activate/:activation_token', userActivationController.activate());
    this.router.post('/signin', userSigninController.signin());
    this.router.post('/forgot-password', forgotPasswordController.forgotPassword());
    this.router.get('/resent-activation-token', protectController.protect(), userRegistrationController.resendActivationToken());
    this.router.post('/verify-password-reset-token', passwordResetController.verifyResetToken());
  }
  getRouter(): Router {
    return this.router;
  }
}

const authRouter = new AuthRouter();

export default authRouter.getRouter();
