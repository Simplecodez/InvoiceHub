import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catch.async.utils';
import { AppError } from '../../utils/app.error.utils';
import Utils from '../../utils/user.utils';
import { IUserRequest, IUserService } from '../../interfaces/user.interface';
import { inject, injectable } from 'tsyringe';

@injectable()
class ProtectUser {
  constructor(@inject('UserService') private readonly userService: IUserService) {}

  private extractJWTToken(req: Request) {
    let jwtToken: string | undefined = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      jwtToken = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      jwtToken = req.cookies.jwt;
    } else if (req.headers['access-token']) {
      jwtToken = req.headers['access-token'] as string;
    }
    return jwtToken;
  }

  private async getVerifiedUser(req: Request) {
    // 1) Getting token and check of it's there
    let jwtToken = this.extractJWTToken(req);
    if (!jwtToken) throw new AppError('You are not signed in! Please sign in.', 401);

    // 2) Verification jwtToken
    const decoded = await Utils.verifyJWTToken(jwtToken, process.env.JWT_SECRET as string);

    // 3) Check if user still exist
    const currentUser = await this.userService.findOne(decoded.id, false);
    if (!currentUser) throw new AppError('Sorry, your token is no longer valid, please sign in again.', 401);

    // 4) Check if user changed password after the token was issued
    if (Utils.changedPasswordAfter(decoded.iat, currentUser.password_changed_at as Date)) {
      throw new AppError('You recently changed password! Please log in again.', 401);
    }
    return currentUser;
  }

  protect() {
    return catchAsync(async (req: Request | IUserRequest, res: Response, next: NextFunction) => {
      const authorisedUser = await this.getVerifiedUser(req);
      (req as IUserRequest).user = authorisedUser;
      next();
    });
  }
}

export default ProtectUser;
