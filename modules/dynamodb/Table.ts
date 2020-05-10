/* eslint-disable prefer-destructuring */
import { InternalServerError } from 'aws-lambda-core/lib/errors';
import { DynamoDB } from 'aws-sdk';
import { LOGGER } from 'logger';
import { Json, transformAttributeMapToJson, transformJsonToAttributeMap } from './dataMapper';

export class Table {
    private tableName: string;

    private client: DynamoDB;

    private transformAttributeMapToJson: (map: DynamoDB.AttributeMap) => Json;

    private transformJsonToAttributeMap: (json: Json) => DynamoDB.AttributeMap;

    constructor(tableName: string) {
        this.client = new DynamoDB({ apiVersion: '2012-08-10' });
        this.tableName = tableName;
        this.transformAttributeMapToJson = transformAttributeMapToJson;
        this.transformJsonToAttributeMap = transformJsonToAttributeMap;
    }

    public async putItem(item: Json): Promise<void> {
        try {
            LOGGER.debug(item, 'Saving item');
            const params = {
                TableName: this.tableName,
                Item: this.transformJsonToAttributeMap(item),
            };
            LOGGER.debug(params, 'Saving item as thus');
            await this.client.putItem(params).promise();
        } catch (e) {
            LOGGER.debug(e, `Failed updating item in ${this.tableName} table`);
            throw new InternalServerError(e.message);
        }
    }

    public async getItem(key: object): Promise<Json> {
        try {
            const params = {
                TableName: this.tableName,
                Key: this.transformJsonToAttributeMap(key),
            };

            const result = await this.client.getItem(params).promise();
            return this.transformAttributeMapToJson(result.Item);
        } catch (e) {
            LOGGER.debug(e, `Failed fetching item in ${this.tableName} table`);
            throw new InternalServerError(e.message);
        }
    }

}
