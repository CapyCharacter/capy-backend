import { PrismaClient } from '@prisma/client';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

// Credit:
// https://github.com/danielm/fastify-prisma-swagger-rest-boilerplate/blob/main/src/plugins/prisma.plugin.ts

/**
 * This plugin can be registered at any time before the server is listening.
 */
export const prismaPlugin: FastifyPluginAsync = fp(async (server: FastifyInstance) => {
    const prisma = new PrismaClient();

    server.decorate('prisma', prisma);

    server.addHook('onClose', async (server) => {
        await server.prisma.$disconnect();
    })
})
