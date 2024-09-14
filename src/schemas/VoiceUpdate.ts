import { Type, Static } from "@sinclair/typebox";

export const VoiceUpdateSchema = Type.Object({
    name: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
    is_public: Type.Optional(Type.Boolean()),
    sample_audio_url: Type.Optional(Type.String()),
});

export type VoiceUpdate = Static<typeof VoiceUpdateSchema>;
