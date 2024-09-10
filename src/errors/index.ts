import createError from "@fastify/error";

export const AuthError = createError('FST_ERR_AUTH', "User not authenticated", 401);
export const EmailNotFoundError = createError('FST_ERR_NOT_FOUND', "Email not found", 404);
export const WrongPasswordError = createError('FST_ERR_AUTH', "Wrong password", 401);
