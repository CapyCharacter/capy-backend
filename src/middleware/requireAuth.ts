import { AuthError } from "@/errors";
import { AuthServices } from "@/services/AuthServices";
import { Auth } from "@/types/Auth";
import { AccessTokenHelpers } from "@/utils/AccessTokenHelpers";
import { FastifyReply, FastifyRequest } from "fastify";

export const requireAuth = async (req: FastifyRequest, res: FastifyReply): Promise<Auth> => {
    const { prisma } = req.server;
    const token = AccessTokenHelpers.getToken(req);
    if (null === token) {
        throw new AuthError();
    }

    const auth = await AuthServices.verify({ prisma, token });
    if (auth instanceof Error) {
        throw auth;
    }

    return auth;
};
