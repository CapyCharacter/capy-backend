import { FastifyReply, FastifyRequest } from "fastify";
import { CookieHelpers } from "./CookieHelpers";

export const ACCESS_TOKEN_COOKIE_NAME = 'capy_auth';

export class AccessTokenHelpers {
    static setToken = (res: FastifyReply, token: string): void => {
        return CookieHelpers.setCookie(res, ACCESS_TOKEN_COOKIE_NAME, token);
    };

    static getToken = (req: FastifyRequest): null | string => {
        return CookieHelpers.getCookie(req, ACCESS_TOKEN_COOKIE_NAME) || null;
    };
};
