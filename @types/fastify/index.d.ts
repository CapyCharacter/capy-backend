// https://github.com/fastify/fastify/issues/1417#issuecomment-458601746

import { Auth } from "@/types/Auth";
import { PrismaClient } from "@prisma/client";
import { IncomingMessage, Server, ServerResponse } from "http";
import { Server as SocketIOServer } from 'socket.io';

declare module 'fastify' {
    export interface FastifyInstance<
        HttpServer = Server,
        HttpRequest = IncomingMessage,
        HttpResponse = ServerResponse,
    > {
        prisma: PrismaClient;
        io: SocketIOServer;
    }

    export interface FastifyRequest {
    }
}
