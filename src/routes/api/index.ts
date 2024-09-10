import { userRoutes } from "./user";
import { authRoutes } from "./auth";
import { FastifyInstance } from "fastify";

export const apiRoutes = async (server: FastifyInstance) => {
    server.register(authRoutes, { prefix: '/auth' });
    server.register(userRoutes, { prefix: '/user' });
};
