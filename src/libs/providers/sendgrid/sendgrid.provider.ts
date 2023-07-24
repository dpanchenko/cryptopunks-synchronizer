import { Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

import { ISendGridConfig } from '@config/index';

import { EmailTemplatesEnum, IMailing } from './types';
import { MJMLProvider } from '../mjml';

export class SendGridProvider {
  readonly logger: Logger = new Logger(SendGridProvider.name);

  constructor(
    private readonly sendGridConfig: ISendGridConfig,
    private readonly mjmlProvider: MJMLProvider,
  ) {
    sgMail.setApiKey(sendGridConfig.apiKey);
  }

  async send(mailing: IMailing) {
    this.logger.debug(`Mailing ${JSON.stringify(mailing)}`);
    const { html } = await this.mjmlProvider.render(mailing);
    await sgMail.send({
      to: mailing.to,
      from: {
        name: 'Vera Services',
        email: this.sendGridConfig.sender,
      },
      subject: this.getSubjectByTemplateName(mailing.templateName),
      html,
    });
  }

  private getSubjectByTemplateName(template: EmailTemplatesEnum): string {
    switch (template) {
      case EmailTemplatesEnum.OTPCode:
        return 'OTP Code';
    }
  }
}
