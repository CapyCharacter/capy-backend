import { FastifyInstance } from "fastify";
import { apiRoutes } from "./api";

export const allRoutes = async (server: FastifyInstance) => {
    server.register(apiRoutes, { prefix: '/api' });
};
