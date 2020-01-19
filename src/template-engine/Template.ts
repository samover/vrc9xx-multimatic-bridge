import { LOGGER } from 'logger';
import { compile } from 'ejs';
import * as fs from "fs";

export class Template {
    private template: string;

    constructor(template: string) {
        this.template = template;
    }

    /**
     * Returns HTML from compiled ejs
     */
    public async render(data: any): Promise<string> {
        const template = await this.getTemplate();

        if (!template) throw new Error('Template not found');

        return compile(template, { client: true })(data);
    }

    private async getTemplate(): Promise<string> {
        return new Promise((resolve) => {
            fs.readFile(this.template, (err, data) => {
                if (err) {
                    LOGGER.error(err, `Failed fetching template ${this.template}`);
                    return resolve(null);
                }
                return resolve(data && data.toString('utf-8'));
            });
        });
    }
}
