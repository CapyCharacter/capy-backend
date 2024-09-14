import { Type, Static } from "@sinclair/typebox";
import { VoiceInfoSchema } from "./VoiceInfo";
import { UserInfoSchema } from "./UserInfo";

export const CharacterInfoSchema = Type.Object({
    id: Type.Integer(),
    avatar_url: Type.String(),
    name: Type.String(),
    description: Type.String(),
    tagline: Type.String(),
    definition: Type.String(),
    greeting: Type.String(),
    num_chats: Type.Integer(),
    num_likes: Type.Integer(),
    is_public: Type.Boolean(),
    voice_id: Type.Union([Type.Integer(), Type.Null()]),
    voice: Type.Union([VoiceInfoSchema, Type.Null()]),
    creator_user_id: Type.Integer(),
    creator_user: UserInfoSchema,
});

export type CharacterInfo = Static<typeof CharacterInfoSchema>;
