import * as path from 'path';
import hb from 'handlebars';
import * as mjml2html from 'mjml';
import * as fs from 'fs/promises';

import { IAppConfig } from '@config/index';
import { IMailing } from '../sendgrid';

export class MJMLProvider {
  private readonly engine = hb;

  constructor(private readonly appConfig: IAppConfig) {}

  async render(mailing: IMailing) {
    const { templateName, payload } = mailing;

    const templateBody = await fs.readFile(
      path.resolve(
        process.cwd(),
        this.appConfig.emailTemplatesPath,
        `${templateName}.hbs`,
      ),
      'utf8',
    );
    const template = this.engine.compile(templateBody);

    const res = template(payload);
    const mj = mjml2html(res);
    return { html: mj.html as string };
  }
}
