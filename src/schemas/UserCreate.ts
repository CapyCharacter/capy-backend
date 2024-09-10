import { Static, Type } from "@sinclair/typebox";

export const UserCreateSchema = Type.Object({
    email: Type.String({ description: "Email of the new user" }),
    username: Type.String({ description: "Username for the new user, not to be confused with display name" }),
    display_name: Type.String({ description: "Display name for the new user, ideally the user's full name" }),
    password: Type.String({ description: "Password for the new user account" }),
});

export type UserCreate = Static<typeof UserCreateSchema>;
