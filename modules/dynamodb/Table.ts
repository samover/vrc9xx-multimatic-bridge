import { DynamoDB } from 'aws-sdk'
import { AttributeMap, AttributeValue } from 'aws-sdk/clients/dynamodb';
import { InternalServerError } from '../errors';
import { LOGGER } from '../logger';

type DynamoDBDataType = 'N'|'S'|'BOOL';
interface Json { [key: string]: any; }

export class Table {
    private tableName: string;
    private client: DynamoDB;

    constructor(tableName: string) {
        this.client = new DynamoDB({ apiVersion: '2012-08-10' });
        this.tableName = tableName;
    }

    public async putItem(item: Json) {
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

    public async getItem(key: object) {
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

    private transformJsonToAttributeMap(json: Json): AttributeMap {
        const data: Json = {};
        Object.keys(json).forEach((key: string) => {
            if (typeof json[key] === 'number') {
                data[key] = { N: json[key] };
            } else if (`${json[key]}` === 'true' || `${json[key]}` === 'false') {
                data[key] = { BOOL: json[key] === 'true' };
            } else {
                data[key] = { S: json[key] };
            }
        });

        return data;
    }

    private transformAttributeMapToJson(map: AttributeMap): Json {
        const data: Json = {};

        Object.keys(map).forEach((key: string) => {
            const attribute: AttributeValue = map[key];
            let value: boolean|number|string;
            if (Object.keys(attribute)[0] === 'S') { value = Object.values(attribute)[0]; }
            if (Object.keys(attribute)[0] === 'N') { value = parseFloat(Object.values(attribute)[0]); }
            if (Object.keys(attribute)[0] === 'BOOL') { value = Object.values(attribute)[0] === 'true'; }
            data[key] = value;
        });

        return data;
    }
}
