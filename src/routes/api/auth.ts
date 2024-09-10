import { requireAuth } from "@/middleware/requireAuth";
import { UserInfo, UserInfoSchema } from "@/schemas/UserInfo";
import { UserLogin, UserLoginSchema } from "@/schemas/UserLogin";
import { AuthServices } from "@/services/AuthServices";
import { AccessTokenHelpers } from "@/utils/AccessTokenHelpers";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

export const authRoutes = async (server: FastifyInstance) => {
    server.post<{
        Body: UserLogin,
        Reply: UserInfo,
    }>('/login', {
        schema: {
            description: "Logs a user in (authenticates that user).",
            tags: ['auth'],
            body: UserLoginSchema,
            response: {
                200: UserInfoSchema,
            },
        },
    }, async (req, res) => {
        const { prisma } = req.server;
        const userLogin = req.body;

        const auth = await AuthServices.logUserIn({ prisma, userLogin });
        if (auth instanceof Error) {
            throw auth;
        }

        AccessTokenHelpers.setToken(res, auth.token);
        return auth.user;
    });

    server.post('/logout', {
        schema: {
            description: "Logs a user out (invalidate his/her access token and clear out the access token cookie)",
            tags: ['auth'],
            response: {
                200: Type.Null(),
            },
            security: [{ cookieAuth: [] }],
        },
    }, async (req, res) => {
        const auth = await requireAuth(req, res);
        const { prisma } = req.server;

        const result = await AuthServices.logUserOut({ prisma, auth });
        if (result instanceof Error) {
            throw result;
        }

        AccessTokenHelpers.setToken(res, "");
        return;
    });
};
