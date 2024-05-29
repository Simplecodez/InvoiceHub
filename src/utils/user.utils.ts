import * as crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Response, Request } from 'express';
import { ObjectId } from 'mongoose';

class Utils {
  private static signToken(id: string, expiresin: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: expiresin
    });
  }

  static createSetJWTToken(userID: string, res: Response): string {
    const token = Utils.signToken(userID, process.env.JWT_EXPIRES_IN as string);
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none'
    });
    return token;
  }
  static createSetEmail(email: string, res: Response) {
    res.cookie('email', email, {
      expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none'
    });
  }

  static generateActivationTokenAndURL(req: Request): { activationURL: string; activationToken: string; activationTokenExpire: Date } {
    const urlActivationToken = crypto.randomBytes(32).toString('hex');
    const activationURL = `${req.protocol}://${req.get('host')}/api/v1/auth/activate/${urlActivationToken}`;
    const activationToken = crypto.createHash('sha256').update(urlActivationToken).digest('hex');
    const activationTokenExpire = new Date(Date.now() + 40 * 60 * 1000);
    return { activationURL, activationToken, activationTokenExpire };
  }

  static verifyOTP(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }

  static async verifyPassword(candidatePassword: string, userPassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, userPassword);
  }

  static verifyJWTToken(token: string, secret: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }

  static changedPasswordAfter(JWTTimestamp: number, passwordChangedAt: Date): boolean {
    if (passwordChangedAt) {
      const changedTimestamp = passwordChangedAt.getTime() / 1000;
      return JWTTimestamp < changedTimestamp;
    }
    // False means NOT changed
    return false;
  }
  static generateCSRFToken(userId: string): string {
    return crypto
      .createHmac('sha256', process.env.CSRF_SECRET as string)
      .update(userId + Date.now().toString())
      .digest('hex');
  }
}

export default Utils;