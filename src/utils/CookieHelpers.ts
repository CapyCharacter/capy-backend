import { FastifyReply, FastifyRequest } from "fastify";

export class CookieHelpers {
    static setCookie = (res: FastifyReply, name: string, value: string): void => {
        if (!value) {
            res.clearCookie(name);
        } else {
            res.setCookie(name, value);
        }
    }

    static getCookie = (req: FastifyRequest, name: string): null | string => {
        return req.cookies[name] ?? null;
    }
}
