import { LOGGER } from 'logger';

export enum RoutePath {
    AUTH_INIT = '/auth/init',
    AUTH_CALLBACK = '/auth/callback',
    AUTH_PINGID_CALLBACK = '/auth/pingId/callback',
    AUTH_TOKEN = '/auth/token',
    AUTH_TOKEN_VALIDATE = '/auth/token/validate',

    RENDER_EDIT_PROFILE = '/profile',
    RENDER_EDIT_PROFILE_EMAIL_PERMISSIONS = '/profile/email/permissions',

    SAVE_PROFILE_CREDENTIALS = '/profile',
    SAVE_PROFILE_EMAIL = '/profile/email',
    SAVE_PROFILE_PASSWORD = '/profile/password',
    SAVE_PROFILE_EMAIL_PASSWORD = '/profile/email_password',
    SAVE_PROFILE_PERMISSIONS = '/profile/permissions',
    SAVE_PROFILE_EMAIL_PERMISSIONS = '/profile/email/permissions',
}

export interface UrlSearchParams {
    [query: string]: string;
}

export class UrlBuilder {
    private static baseUrl: string = process.env.API_BASE_URL;

    /**
     * Builds an absolute url that points to the API with urlencoded query params
     * @throws {Error} No callback path provided
     */
    public static build(path: RoutePath | string, searchParams: UrlSearchParams = {}): string {
        if (!path) { throw new Error('Must provide callback path'); }
        const url = new URL(this.baseUrl);
        url.pathname = (url.pathname + path).replace(/\/\//g, '/');
        Object.keys(searchParams).forEach((query: string) =>
            url.searchParams.append(query, searchParams[query]));
        LOGGER.debug(url.href, 'We built a url for you');
        return url.href;
    }

    /**
     * Builds an absolute url with query params
     * @throws {Error} No callback path provided
     */
    public static buildAbsolute(url: string, searchParams: UrlSearchParams = {}): string {
        const absoluteUrl = new URL(url);
        Object.keys(searchParams).forEach((query: string) =>
            absoluteUrl.searchParams.append(query, searchParams[query]));
        LOGGER.debug(absoluteUrl.href, 'We built a url for you');
        return absoluteUrl.href;
    }
}
