import { Type, Static } from "@sinclair/typebox";

export const CharacterUpdateSchema = Type.Object({
    avatar_url: Type.Optional(Type.String()),
    name: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
    tagline: Type.Optional(Type.String()),
    definition: Type.Optional(Type.String()),
    greeting: Type.Optional(Type.String()),
    num_chats: Type.Optional(Type.Integer()),
    num_likes: Type.Optional(Type.Integer()),
    is_public: Type.Optional(Type.Boolean()),
    voice_id: Type.Optional(Type.Integer()),
});

export type CharacterUpdate = Static<typeof CharacterUpdateSchema>;
