// https://github.com/fastify/fastify/issues/1417#issuecomment-458601746

import { PrismaClient } from "@prisma/client";
import { IncomingMessage, Server, ServerResponse } from "http";

declare module 'fastify' {
    export interface FastifyInstance<
        HttpServer = Server,
        HttpRequest = IncomingMessage,
        HttpResponse = ServerResponse,
    > {
        prisma: PrismaClient;
    }

    export interface FastifyRequest {
    }
}
