import { IsString } from 'class-validator';

export interface ISendGridConfig {
  apiKey: string;
  sender: string;
}

export class SendGridConfigValidator implements ISendGridConfig {
  @IsString()
  readonly apiKey!: string;

  @IsString()
  readonly sender!: string;
}

export const getSendGridConfig = (): ISendGridConfig => ({
  apiKey: process.env.SENDGRID_API_KEY,
  sender: process.env.SENDGRID_SENDER,
});
