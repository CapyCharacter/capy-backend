import { FastifyInstance } from "fastify";
import fastifyCookie from '@fastify/cookie';
import { BACKEND_COOKIE_DOMAIN, BACKEND_COOKIE_SAMESITE, FRONTEND_URLS } from "@/env";
import { prismaPlugin } from "./prismaPlugin";

export async function registerAllPlugins(server: FastifyInstance) {
    await Promise.all([
        registerCookiePlugin(server),
        registerCorsPlugin(server),
        server.register(prismaPlugin),
    ]);
}

async function registerCookiePlugin(server: FastifyInstance) {
    await server.register(fastifyCookie, {
        parseOptions: {
            domain: BACKEND_COOKIE_DOMAIN,
            path: '/',
            sameSite: BACKEND_COOKIE_SAMESITE,
            httpOnly: true,
            secure: true,
        },
    });
}

async function registerCorsPlugin(server: FastifyInstance) {
    await server.register(import('@fastify/cors'), {
        origin: FRONTEND_URLS,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Cookie',
            'Content-Type',
            'Content-Encoding',
            'Content-Language',
            'Content-Length',
            'Cache-Control',
            'Accept',
            'Accept-Language',
            'X-CSRF-Token',
        ],
        credentials: true,
    });
}
