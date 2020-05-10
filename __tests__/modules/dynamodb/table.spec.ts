import { InternalServerError } from 'aws-lambda-core/lib/errors';
import { Table } from 'dynamodb';
import * as faker from 'faker';

describe('Table', () => {
    beforeEach(() => {
        this.putItemStub = jest.fn().mockReturnValue({ promise: () => Promise.resolve() });
        this.getItemStub = jest.fn().mockReturnValue({ promise: () => Promise.resolve({
                Item: 'result',
            }) });

        this.client = {
            putItem: this.putItemStub,
            getItem: this.getItemStub,
        };
        this.transformAttributeMapToJsonStub = jest.fn().mockReturnValue('json');
        this.transformJsonToAttributeMapStub = jest.fn().mockReturnValue('attributeMap');
    });

    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    describe('#putItem', () => {
        const json = { [faker.lorem.word()]: faker.lorem.word() };

        beforeEach(() => {
            this.table = new Table(faker.lorem.word());
            this.table.client = this.client;
            this.table.transformJsonToAttributeMap = this.transformJsonToAttributeMapStub;
        });
        it('converts json to dynamoDb attribute map', async () => {
            await this.table.putItem(json);
            expect(this.transformJsonToAttributeMapStub).toHaveBeenCalledWith(json);
        });
        it('saves data to a dynamodb table', async () => {
            await this.table.putItem(json);
            expect(this.putItemStub).toHaveBeenCalledWith({ Item: 'attributeMap', TableName: this.table.tableName });
        });
        it('throws an internalServerError', async () => {
            this.putItemStub.mockRejectedValue(new Error());
            await expect(this.table.putItem(json)).rejects.toBeInstanceOf(InternalServerError);
        })
    });

    describe('#getItem', () => {
        const json = { [faker.lorem.word()]: faker.lorem.word() };

        beforeEach(() => {
            this.table = new Table(faker.lorem.word());
            this.table.client = this.client;
            this.table.transformAttributeMapToJson = this.transformAttributeMapToJsonStub;
            this.table.transformJsonToAttributeMap = this.transformJsonToAttributeMapStub;
        });
        it('transforms a request into a dynamodb attributeMap query', async () => {
            await this.table.getItem(json);
            expect(this.transformJsonToAttributeMapStub).toHaveBeenCalledWith(json);
        });
        it('queries the dynamodb table', async () => {
            await this.table.getItem(json);
            expect(this.getItemStub).toHaveBeenCalledWith({ Key: 'attributeMap', TableName: this.table.tableName });
        });
        it('transforms the result to json', async () => {
            await this.table.getItem(json);
            expect(this.transformAttributeMapToJsonStub).toHaveBeenCalledWith('result');
        });
        it('resolves a json result', async () => {
            await expect(this.table.getItem(json)).resolves.toEqual('json');
        });
        it('throws an internalServerError', async () => {
            this.getItemStub.mockRejectedValue(new Error());
            await expect(this.table.getItem(json)).rejects.toBeInstanceOf(InternalServerError);
        })
    });
});
