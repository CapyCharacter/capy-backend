import { UserCreate } from "@/schemas/UserCreate"
import { UserUpdate } from "@/schemas/UserUpdate";
import { Auth } from "@/types/Auth";
import { PrismaClient, User } from "@prisma/client"
import bcrypt from "bcrypt";

const NUM_PASSWORD_HASH_SALT_ROUNDS = 10;

export class UserServices {
    static getUser = async ({ prisma, auth } : {
        prisma: PrismaClient,
        auth: Auth,
    }): Promise<Error|User> => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: auth.user.id,
                },
            });

            if (null === user) {
                return new Error("User not found");
            }

            return user;
        } catch (e) {
            return new Error("" + e);
        }
    }

    static createUser = async ({ prisma, userCreate } : {
        prisma: PrismaClient,
        userCreate: UserCreate,
    }): Promise<Error|User> => {
        try {
            const user = await prisma.user.create({
                data: {
                    email: userCreate.email,
                    password_hash: await bcrypt.hash(userCreate.password, NUM_PASSWORD_HASH_SALT_ROUNDS),
                    username: userCreate.display_name,
                    display_name: userCreate.display_name,
                    avatar_url: userCreate.avatar_url,
                    is_premium: false,
                },
            });

            return user;
        } catch (e) {
            return new Error("" + e);
        }
    }

    static updateUser = async ({ prisma, auth, userUpdate } : {
        prisma: PrismaClient,
        auth: Auth,
        userUpdate: UserUpdate,
    }): Promise<Error|User> => {
        try {
            const user = await prisma.user.update({
                where: {
                    id: auth.user.id,
                },
                data: userUpdate,
            });

            return user;
        } catch (e) {
            return new Error("" + e);
        }
    }

    static deleteUser = async ({ prisma, auth } : {
        prisma: PrismaClient,
        auth: Auth,
    }): Promise<Error|true> => {
        try {
            await prisma.user.delete({
                where: {
                    id: auth.user.id,
                },
            });

            return true;
        } catch (e) {
            return new Error("" + e);
        }
    }
}
