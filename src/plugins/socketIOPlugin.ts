import { FRONTEND_URLS, REDIS_URL } from '@/env';
import { createAdapter } from '@socket.io/redis-adapter';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import fastifySocketIO from 'fastify-socket.io';
import Redis from 'ioredis';

/**
 * This plugin can be registered at any time before the server is listening.
 */
export const socketIOPlugin: FastifyPluginAsync = fp(async (server: FastifyInstance) => {
    try {
        const pubClient = new Redis(REDIS_URL);
        const subClient = pubClient.duplicate();

        server.register(fastifySocketIO, {
            cors: {
                origin: FRONTEND_URLS,
                methods: ['GET', 'POST'],
                allowedHeaders: ['Content-Type', 'Authorization'],
                credentials: true,
            },
            adapter: createAdapter(pubClient, subClient),
        });

        server.addHook('onClose', async _server => {
            await Promise.all([
                pubClient.quit(),
                subClient.quit(),
            ]);
        });
    } catch (error) {
        server.log.error('Failed to initialize Socket.IO plugin:', error);
        if (error instanceof Error) {
            if (error.message.includes('ECONNREFUSED')) {
                server.log.error('Redis connection refused. Please check if Redis is running and the REDIS_URL is correct.');
            } else {
                server.log.error('Unexpected error:', error.message);
            }
        } else {
            server.log.error("" + error);
        }
        throw error;
    }
});
