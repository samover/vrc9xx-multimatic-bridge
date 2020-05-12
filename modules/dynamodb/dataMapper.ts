/* eslint-disable prefer-destructuring */
import { AttributeMap, AttributeValue } from 'aws-sdk/clients/dynamodb';

export type DynamoDBDataType = 'N'|'S'|'BOOL';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Json { [key: string]: any }

// Only transforms data types actually used by the application.
// As a consequence null or Data are not mapped correctly).
export const transformJsonToAttributeMap = (json: Json): AttributeMap => {
    const data: Json = {};
    Object.keys(json).forEach((key: string) => {
        if (typeof json[key] === 'number') {
            data[key] = { N: `${json[key]}` };
        } else if (typeof json[key] === 'boolean') {
            data[key] = { BOOL: json[key] };
        } else if (`${json[key]}` === 'true' || `${json[key]}` === 'false') {
            data[key] = { BOOL: json[key] === 'true' };
        } else {
            data[key] = { S: json[key] };
        }
    });

    return data;
};

export const transformAttributeMapToJson = (map: AttributeMap): Json => {
    const data: Json = {};

    Object.keys(map).forEach((key: string) => {
        const attribute: AttributeValue = map[key];
        let value: boolean|number|string;
        if (Object.keys(attribute)[0] === 'S') { value = Object.values(attribute)[0]; }
        if (Object.keys(attribute)[0] === 'N') { value = parseFloat(Object.values(attribute)[0]); }
        if (Object.keys(attribute)[0] === 'BOOL') { value = Object.values(attribute)[0]; }
        data[key] = value;
    });

    return data;
};
