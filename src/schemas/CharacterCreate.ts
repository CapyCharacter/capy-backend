import { Type, Static } from "@sinclair/typebox";

export const CharacterCreateSchema = Type.Object({
    avatar_url: Type.String(),
    name: Type.String(),
    description: Type.String(),
    tagline: Type.String(),
    definition: Type.String(),
    greeting: Type.String(),
    is_public: Type.Boolean(),
    voice_id: Type.Union([Type.Integer(), Type.Null()]),
});

export type CharacterCreate = Static<typeof CharacterCreateSchema>;
