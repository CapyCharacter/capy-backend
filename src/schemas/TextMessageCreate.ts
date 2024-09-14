import { Type, Static } from "@sinclair/typebox";

export const TextMessageCreateSchema = Type.Object({
    content: Type.String(),
    conversation_id: Type.Number(),
});

export type TextMessageCreate = Static<typeof TextMessageCreateSchema>;
