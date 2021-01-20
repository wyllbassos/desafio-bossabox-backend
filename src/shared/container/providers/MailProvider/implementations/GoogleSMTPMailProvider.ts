import { injectable, inject } from 'tsyringe';

import mailConfig from '@config/mail';
import nodemailer, { Transporter } from 'nodemailer';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvieder/models/IMailTemplateProvider';
import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

@injectable()
export default class GoogleSMTGMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    const { email, password } = mailConfig.defaults.from;
    this.client = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: email,
        pass: password,
      },
    });
    // verify connection configuration
    this.client.verify(error => {
      if (error) {
        console.log(error);
      } else {
        console.log('Server is ready to take our messages');
      }
    });
  }

  public async sendMail(data: ISendMailDTO): Promise<void> {
    const { to, from, subject, templateData } = data;
    const { email, name } = mailConfig.defaults.from;
    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      // text: 'teste',
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}
