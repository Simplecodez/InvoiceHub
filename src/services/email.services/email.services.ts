import path from 'path';
import { convert } from 'html-to-text';
import nodemailer from 'nodemailer';
import pug from 'pug';
import { IUser } from '../../interfaces/user.interface';
import { IEmail } from '../../interfaces/email-interface';
import { injectable } from 'tsyringe';

@injectable()
class Email implements IEmail {
  private from: string;

  constructor() {
    this.from = `InvoiceApp <${process.env.EMAIL_FROM}>`;
  }

  private newTransport() {
    return nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  private async initiateSend(userData: Partial<IUser>, subject: string, html: string) {
    const mailOptions = {
      from: this.from,
      to: userData.email,
      subject,
      html,
      text: convert(html, { wordwrap: 120 })
    };
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome(userData: IUser, url: string) {
    const html = pug.renderFile(path.join(__dirname, `../../views/email/welcome.pug`), {
      name: userData.first_name,
      url
    });
    await this.initiateSend(userData, 'Welcome', html);
  }

  async sendResetPassword(userData: IUser, otp: string) {
    const html = pug.renderFile(path.join(__dirname, `../../views/email/passwordReset.pug`), {
      name: userData.first_name,
      otp
    });
    await this.initiateSend(userData, 'Reset Password', html);
  }
}

export default Email;
