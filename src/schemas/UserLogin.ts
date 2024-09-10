import { Static, Type } from "@sinclair/typebox";

export const UserLoginSchema = Type.Object({
    email: Type.String({ description: "Email of the user for login" }),
    password: Type.String({ description: "Password for user authentication" }),
});

export type UserLogin = Static<typeof UserLoginSchema>;
