import { Type, Static } from "@sinclair/typebox";
import { CharacterInfoSchema } from "./CharacterInfo";
import { VoiceInfoSchema } from "./VoiceInfo";

export const ConversationInfoSchema = Type.Object({
    id: Type.Integer(),
    character_id: Type.Union([Type.Integer(), Type.Null()]),
    user_id: Type.Integer(),
    pinned_message_id: Type.Union([Type.Integer(), Type.Null()]),
    voice_id: Type.Union([Type.Integer(), Type.Null()]),
    is_public: Type.Boolean(),

    character: Type.Union([CharacterInfoSchema, Type.Null()]),
    voice: Type.Union([VoiceInfoSchema, Type.Null()]),
});

export type ConversationInfo = Static<typeof ConversationInfoSchema>;
