import { BACKEND_SECRET } from '@/env';
import { AuthError, EmailNotFoundError, WrongPasswordError } from '@/errors';
import { UserLogin } from '@/schemas/UserLogin';
import { Auth } from '@/types/Auth';
import { PrismaClient } from '@prisma/client';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { createSigner, createVerifier } from 'fast-jwt';

const AUTH_TOKEN_JWT_ALGORITHM = 'HS256';

const sign = createSigner({
    key: BACKEND_SECRET,
    algorithm: AUTH_TOKEN_JWT_ALGORITHM,
});

const verify = createVerifier({
    key: BACKEND_SECRET,
    algorithms: [AUTH_TOKEN_JWT_ALGORITHM],
});

const issueAuthToken = async ({ prisma, user } : {
    prisma: PrismaClient,
    user: User,
}): Promise<Error | Auth> => {
    try {
        const tokenRecord = await prisma.authToken.create({
            data: {
                user_id: user.id,
            },
        });

        const token = sign({
            u: user.id,
            t: tokenRecord.id,
        });

        return { user, token, tokenRecordId: tokenRecord.id };
    } catch (e) {
        return new Error("" + e);
    }
};

const verifyAuthToken = async ({ prisma, token } : {
    prisma: PrismaClient,
    token: string
}): Promise<Error | Auth> => {
    try {
        const payload = verify(token);
        const userId = payload.u;
        const tokenId = payload.t;

        // Check types of userId and tokenId
        if (typeof userId !== 'number' || typeof tokenId !== 'number' || userId < 1 || tokenId < 1) {
            return new AuthError("invalid token structure");
        }

        const authToken = await prisma.authToken.findUnique({
            where: {
                id: tokenId,
                user_id: userId,
            },
            include: {
                user: true,
            },
        });

        if (!authToken) {
            return new AuthError("invalid token");
        }

        return {
            user: authToken.user,
            tokenRecordId: authToken.id,
            token,
        } satisfies Auth;
    } catch (error) {
        return new AuthError("while verifying auth token: " + error);
    }
};

export class AuthServices {
    static logUserIn = async ({ prisma, userLogin } : {
        prisma: PrismaClient,
        userLogin: UserLogin,
    }): Promise<Error|Auth> => {
        const user = await prisma.user.findUnique({
            where: {
                email: userLogin.email,
            },
        });

        if (null === user) {
            return new EmailNotFoundError();
        }

        const isPasswordValid: boolean = await bcrypt.compare(userLogin.password, user.password_hash);

        if (!isPasswordValid) {
            return new WrongPasswordError();
        }

        return await issueAuthToken({ prisma, user });
    }

    static verify = async ({ prisma, token }: {
        prisma: PrismaClient,
        token: string
    }): Promise<Error|Auth> => {
        try {
            if (!token) {
                return new AuthError("No token provided");
            }

            const auth = await verifyAuthToken({ prisma, token });
            if (auth instanceof Error) {
                return auth;
            }

            return auth;
        } catch (error) {
            return new AuthError("while verifying auth token: " + error);
        }
    }

    static logUserOut = async ({ prisma, auth }: {
        prisma: PrismaClient,
        auth: Auth,
    }): Promise<Error|true> => {
        try {
            await prisma.authToken.delete({
                where: {
                    id: auth.tokenRecordId,
                },
            });

            return true;
        } catch (e) {
            return new Error("while logging out user: " + e);
        }
    }
}
