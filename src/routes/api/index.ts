import { usersRoutes } from "./users";
import { authRoutes } from "./auth";
import { FastifyInstance } from "fastify";
import { conversationsRoutes } from "./conversations";
import { messagesRoutes } from "./messages";
import { charactersRoutes } from "./characters";
import { voicesRoutes } from "./voices";

export const apiRoutes = async (server: FastifyInstance) => {
    server.register(authRoutes, { prefix: '/auth' });
    server.register(usersRoutes, { prefix: '/users' });
    server.register(conversationsRoutes, { prefix: '/conversations' });
    server.register(messagesRoutes, { prefix: '/messages' });
    server.register(charactersRoutes, { prefix: '/characters' });
    server.register(voicesRoutes, { prefix: '/voices' });
};
