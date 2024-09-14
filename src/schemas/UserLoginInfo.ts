import { Static, Type } from "@sinclair/typebox";
import { UserInfoSchema } from "./UserInfo";

export const UserLoginInfoSchema = Type.Object({
    token: Type.String({ description: "Authentication token for the user. Not used for further HTTP communication, only for Socket.IO authentication." }),
    user: UserInfoSchema,
});

export type UserLoginInfo = Static<typeof UserLoginInfoSchema>;
