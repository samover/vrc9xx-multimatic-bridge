import * as faker from 'faker';
import { transformAttributeMapToJson, transformJsonToAttributeMap } from 'dynamodb';

describe('Dynamodb.dataMapper', () => {
    describe('#transformJsonToAttributeMap', () => {
        it('transforms json with string attribute to dynamodb attributes', () => {
            const input = { value: 'stringKey' };
            expect(transformJsonToAttributeMap(input)).toEqual({
                value: {
                    S: 'stringKey',
                },
            });
        });
        it('transforms json with number attribute to dynamodb attributes', () => {
            const input = { value: 12.04 };
            expect(transformJsonToAttributeMap(input)).toEqual({
                value: {
                    N: '12.04',
                },
            });
        });
        it('transforms json with boolean attribute to dynamodb attributes', () => {
            const input = { value1: true, value2: false };
            expect(transformJsonToAttributeMap(input)).toEqual({
                value1: {
                    BOOL: true,
                },
                value2: {
                    BOOL: false,
                },
            });
        });
        it('transforms json with boolean string attribute to dynamodb attributes', () => {
            const input = { value1: 'true', value2: 'false' };
            expect(transformJsonToAttributeMap(input)).toEqual({
                value1: {
                    BOOL: true,
                },
                value2: {
                    BOOL: false,
                },
            });
        });
    });
    describe('#transformAttributeMapToJson', () => {
        it('transforms dynamodb attributes to a json object', () => {
            const input = {
                value1: {
                    BOOL: true,
                },
                value2: {
                    BOOL: false,
                },
                value3: {
                    S: 'stringKey',
                },
                value4: {
                    N: '12.04235',
                },
            };

            expect(transformAttributeMapToJson(input)).toEqual({
                value1: true,
                value2: false,
                value3: 'stringKey',
                value4: 12.04235,
            })
        });
    });
});
