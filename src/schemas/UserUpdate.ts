import { Static, Type } from "@sinclair/typebox";

export const UserUpdateSchema = Type.Object({
    email: Type.Optional(Type.String({ description: "New email of the user" })),
    username: Type.Optional(Type.String({ description: "New username, not to be confused with display name" })),
    display_name: Type.Optional(Type.String({ description: "New display name, ideally the user's full name" })),
});

export type UserUpdate = Static<typeof UserUpdateSchema>;
