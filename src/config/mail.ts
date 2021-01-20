interface IMailConfig {
  driver: 'ethereal' | 'googleSmtp';
  defaults: {
    from: {
      email: string;
      name: string;
      password: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: process.env.MAIL_USER,
      name: process.env.MAIL_NAME,
      password: process.env.MAIL_PASSWORD,
    },
  },
} as IMailConfig;
