import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import IMailProvider from './models/IMailProvider';
import EtherealMailProvider from './implementations/EtherealMailProvider';
import GoogleSMTPMailProvider from './implementations/GoogleSMTPMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  googleSmtp: container.resolve(GoogleSMTPMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
