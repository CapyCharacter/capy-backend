import { Type, Static } from "@sinclair/typebox";

export const MessageInfoSchema = Type.Object({
    id: Type.Number(),
    conversation_id: Type.Number(),
    voice_call_id: Type.Union([Type.Number(), Type.Null()]),
    sent_by_user: Type.Boolean(),
    sent_at: Type.Number(),
    content: Type.String()
});

export type MessageInfo = Static<typeof MessageInfoSchema>;
