import { Type, Static } from "@sinclair/typebox";

export const VoiceCreateSchema = Type.Object({
    name: Type.String(),
    description: Type.String(),
    sample_audio_url: Type.String(),
    is_public: Type.Boolean(),
});

export type VoiceCreate = Static<typeof VoiceCreateSchema>;
