import { requireAuth } from "@/middleware/requireAuth";
import { UserCreate, UserCreateSchema } from "@/schemas/UserCreate";
import { UserInfo, UserInfoSchema } from "@/schemas/UserInfo";
import { UserUpdate, UserUpdateSchema } from "@/schemas/UserUpdate";
import { UserServices } from "@/services/UserServices";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

export const userRoutes = async (server: FastifyInstance) => {
    server.get('/', {
        schema: {
            description: "Get the user information of the currently authenticated user.",
            tags: ['user'],
            response: {
                200: UserInfoSchema,
            },
            security: [{ cookieAuth: [] }],
        },
    }, async (req, res) => {
        const auth = await requireAuth(req, res);
        const { prisma } = req.server;
        const result = await UserServices.getUser({ prisma, auth });
        if (result instanceof Error) {
            throw result;
        }

        return result;
    });

    server.post<{
        Body: UserCreate,
        Reply: UserInfo,
    }>('/create', {
        schema: {
            description: "Sign up or register a new user account.",
            tags: ['user'],
            body: UserCreateSchema,
            response: {
                200: UserInfoSchema,
            },
        },
    }, async (req, res) => {
        const { prisma } = req.server;
        const userCreate = req.body;
        const result = await UserServices.createUser({ prisma, userCreate });
        if (result instanceof Error) {
            throw result;
        }

        return result;
    });

    server.patch<{
        Body: UserUpdate,
        Reply: UserInfo,
    }>('/update', {
        schema: {
            description: "Update some information of a user.",
            tags: ['user'],
            body: UserUpdateSchema,
            response: {
                200: UserInfoSchema,
            },
            security: [{ cookieAuth: [] }],
        },
    }, async (req, res) => {
        const auth = await requireAuth(req, res);

        const { prisma } = req.server;
        const userUpdate = req.body;
        const result = await UserServices.updateUser({ prisma, auth, userUpdate });

        if (result instanceof Error) {
            throw result;
        }

        return result;
    });

    server.delete<{
        Reply: null,
    }>('/delete', {
        schema: {
            description: "Delete a user account.",
            tags: ['user'],
            response: {
                200: Type.Null(),
            },
            security: [{ cookieAuth: [] }],
        },
    }, async (req, res) => {
        const auth = await requireAuth(req, res);
        const { prisma } = req.server;

        const result = await UserServices.deleteUser({ prisma, auth });
        if (result instanceof Error) {
            throw result;
        }
        
        return;
    });
};
