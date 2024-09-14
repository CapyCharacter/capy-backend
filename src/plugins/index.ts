import { FastifyInstance } from "fastify";
import fastifyCookie from '@fastify/cookie';
import { BACKEND_COOKIE_DOMAIN, BACKEND_COOKIE_SAMESITE, FRONTEND_URLS } from "@/env";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/utils/AccessTokenHelpers";

import { prismaPlugin } from "./prismaPlugin";
import { socketIOPlugin } from "./socketIOPlugin";

export async function registerAllPlugins(server: FastifyInstance) {
    await Promise.all([
        registerCookiePlugin(server),
        registerCorsPlugin(server),
        registerSwaggerPlugins(server),

        server.register(prismaPlugin),
        server.register(socketIOPlugin),
    ]);
}

async function registerCookiePlugin(server: FastifyInstance) {
    const THREE_MONTHS_IN_SECONDS = 3 * 30 * 24 * 60 * 60;

    await server.register(fastifyCookie, {
        parseOptions: {
            secure: true,
            httpOnly: true,
            domain: BACKEND_COOKIE_DOMAIN,
            path: '/',
            sameSite: BACKEND_COOKIE_SAMESITE,
            maxAge: THREE_MONTHS_IN_SECONDS,
        },
    });
}

async function registerCorsPlugin(server: FastifyInstance) {
    await server.register(import('@fastify/cors'), {
        origin: FRONTEND_URLS,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
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

async function registerSwaggerPlugins(server: FastifyInstance) {
    await server.register(fastifySwagger, {
        openapi: {
            info: {
                title: "CapyCharacter Backend API",
                description: "API Documentation for CapyCharacter Backend",
                version: "1.0.0",
            },

            components: {
                securitySchemes: {
                    cookieAuth: {
                        type: 'apiKey',
                        in: 'cookie',
                        name: ACCESS_TOKEN_COOKIE_NAME,
                        description: 'HttpOnly cookie-based authentication',
                    },
                },
            },
        },
    });

    await server.register(fastifySwaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false,
        },
    });
}
