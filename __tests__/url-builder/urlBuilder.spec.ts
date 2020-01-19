import * as faker from 'faker';
import { UrlBuilder } from '../src';

describe('UrlBuilder', () => {
    describe('build', () => {
        it(`builds a url from a path and the baseUrl ${process.env.API_BASE_URL}`, () => {
            const url = UrlBuilder.build('/path/to/resource');
            expect(url).toEqual(`${process.env.API_BASE_URL}/path/to/resource`);
        });
        it('accepts queryParams', () => {
            const url = UrlBuilder.build('/path/to/resource', { sort: 'ASC', limit: '10' });
            expect(url).toEqual(`${process.env.API_BASE_URL}/path/to/resource?sort=ASC&limit=10`);
        });
        it('removes trailing / from baseURL', () => {
            // @ts-ignore
            UrlBuilder.baseUrl = 'https://www.api.com/trailing/'

            const url = UrlBuilder.build('/path/to/resource');
            expect(url).toEqual('https://www.api.com/trailing/path/to/resource');

            // @ts-ignore
            UrlBuilder.baseURL = process.env.API_BASE_URL
        });
        it('throws when no path is given', () => {
            // @ts-ignore
            expect(() => UrlBuilder.build()).toThrow();
        });
    });

    describe('buildAbsolute', () => {
        it('builds a url from scratch', () => {
            const baseUrl = faker.internet.url() + '/path';
            const url = UrlBuilder.buildAbsolute(baseUrl);
            expect(url).toEqual(baseUrl);
        });
        it('builds a url from scratch with query parameters', () => {
            const baseUrl = faker.internet.url() + '/path';
            const url = UrlBuilder.buildAbsolute(baseUrl, { sort: 'ASC' });
            expect(url).toEqual(`${baseUrl}?sort=ASC`);
        });
    });
});
