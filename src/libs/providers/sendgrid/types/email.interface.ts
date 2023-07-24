import { EmailTemplatesEnum } from './email-templates.enum';

export interface IMailingPayload {
  [key: string]: any;
}

export interface IMailing {
  to: string;
  templateName: EmailTemplatesEnum;
  subject?: string;
  payload?: IMailingPayload;
}
