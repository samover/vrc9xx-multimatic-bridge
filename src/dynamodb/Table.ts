import { DynamoDB } from 'aws-sdk'
import {LOGGER} from "../logger";
import {InternalServerError} from "../errors";
import {AttributeMap, AttributeValue} from "aws-sdk/clients/dynamodb";

type DynamoDBDataType = 'N'|'S'|'BOOL';

export class Table {
    private tableName: string;
    private client: DynamoDB;

    constructor(tableName: string) {
        this.client = new DynamoDB({ apiVersion: '2012-08-10' });
        this.tableName = tableName;
    }

    public async putItem(item: object) {
        try {
            const params = {
                TableName: this.tableName,
                Item: this.transformJsonToAttributeMap(item),
            };
            await this.client.putItem(params).promise();
        } catch (e) {
            LOGGER.debug(e, `Failed updating item in ${this.tableName} table`);
            throw new InternalServerError(e.message);
        }
    }

    public async getItem(key: object) {
        try {
            var params = {
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

    private transformJsonToAttributeMap(json: object): AttributeMap {
        const data = {};
        Object.keys(json).forEach((key: string) => {
            let itemType: DynamoDBDataType;
            if (typeof json[key] === 'string') itemType = 'S';
            if (typeof json[key] === 'number') itemType = 'N';
            if (`${json[key]}` === 'true' || `${json[key]}` === 'false') itemType = 'N';
            data[key] = { [itemType]: json[key] };
        });

        return data;
    }

    private transformAttributeMapToJson(map: AttributeMap): object {
        const data = {};

        // { prop: { [type]: stringValue } }
        Object.keys(map).forEach((key: string) => {
            const attribute: AttributeValue = map[key];
            let value: boolean|number|string;
            if (Object.keys(attribute)[0] === 'S') value = Object.values(attribute)[0];
            if (Object.keys(attribute)[0] === 'N') value = parseFloat(Object.values(attribute)[0]);
            if (Object.keys(attribute)[0] === 'BOOL') value = Object.values(attribute)[0] === 'true';
            data[key] = value;
        });

        return data;
    }
}
