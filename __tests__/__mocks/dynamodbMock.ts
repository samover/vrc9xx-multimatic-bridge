import { Table } from 'dynamodb';
import { MockOf } from '../__helpers/mockOf.type';

export const putItemStub = jest.fn();
export const getItemStub = jest.fn();

jest.mock('dynamodb', () => ({
    __esModule: true,
    Table: jest.fn().mockImplementation((): MockOf<Table> => ({
        putItem(item): Promise<void> { return putItemStub(item) },
        getItem(key): Promise<JSON> { return getItemStub(key) },
    })),
}));

export const init = () => {
    putItemStub.mockResolvedValue(null);
};

