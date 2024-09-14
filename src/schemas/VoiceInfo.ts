import { Type, Static } from "@sinclair/typebox";
import { UserInfoSchema } from "./UserInfo";

export const VoiceInfoSchema = Type.Object({
    id: Type.Integer(),
    name: Type.String(),
    description: Type.String(),
    is_public: Type.Boolean(),
    creator_user_id: Type.Integer(),
    creator_user: UserInfoSchema,
});

export type VoiceInfo = Static<typeof VoiceInfoSchema>;
