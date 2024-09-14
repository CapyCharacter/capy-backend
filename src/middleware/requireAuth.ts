import { AuthError } from "@/errors";
import { AuthServices } from "@/services/AuthServices";
import { Auth } from "@/types/Auth";
import { AccessTokenHelpers } from "@/utils/AccessTokenHelpers";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Socket } from "socket.io";

export const requireAuth = async (req: FastifyRequest, res: FastifyReply): Promise<Auth> => {
    const token = AccessTokenHelpers.getToken(req);
    if (null === token) {
        throw new AuthError();
    }

    const { prisma } = req.server;

    const auth = await AuthServices.verify({ prisma, token });
    if (auth instanceof Error) {
        throw auth;
    }

    return auth;
}

export const createFrontendSocketIOMiddleware_requireAuth = (server: FastifyInstance) => {
    const { prisma } = server;

    return async (socket: Socket, next: (err?: Error) => void) => {
        const token = socket.handshake.auth.token;
        if (null === token) {
            return next(new AuthError("no token provided"));
        }

        const auth = await AuthServices.verify({ prisma, token });
        if (auth instanceof Error) {
            return next(auth);
        }

        socket.data.auth = auth;
        socket.data.server = server;
        next();
    };
};
