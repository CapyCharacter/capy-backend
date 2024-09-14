import { FastifyInstance } from "fastify";
import { apiRoutes } from "./api";
import { frontendSocketIOEventListeners } from "./frontendSocketIO";

export const allRoutes = async (server: FastifyInstance) => {
    server.register(apiRoutes, { prefix: '/api' });

    server.register(frontendSocketIOEventListeners);
};
