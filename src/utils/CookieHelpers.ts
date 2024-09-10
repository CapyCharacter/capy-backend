import { BACKEND_COOKIE_DOMAIN, BACKEND_COOKIE_SAMESITE } from "@/env";
import { FastifyReply, FastifyRequest } from "fastify";

const THREE_MONTHS_IN_SECONDS = 3 * 30 * 24 * 60 * 60;

export class CookieHelpers {
    static setCookie = (res: FastifyReply, name: string, value: string): void => {
        res.setCookie(name, value, {
            secure: true,
            httpOnly: true,
            domain: BACKEND_COOKIE_DOMAIN,
            path: '/',
            sameSite: BACKEND_COOKIE_SAMESITE,
            maxAge: THREE_MONTHS_IN_SECONDS,
        });
    }

    static getCookie = (req: FastifyRequest, name: string): null | string => {
        return req.cookies[name] ?? null;
    }
}
