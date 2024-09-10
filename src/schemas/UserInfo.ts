import { Static, Type } from "@sinclair/typebox";

export const UserInfoSchema = Type.Object({
    id: Type.Number({ description: "ID of the user in database" }),
    email: Type.String({ description: "Email of the user" }),
    username: Type.String({ description: "Username, not to be confused with display name" }),
    display_name: Type.String({ description: "Display name, ideally the user's full name" }),
    is_premium: Type.Boolean({ description: "Being premium means one having purchased to upgrade his/her account to Pro" }),
});

export type UserInfo = Static<typeof UserInfoSchema>;
