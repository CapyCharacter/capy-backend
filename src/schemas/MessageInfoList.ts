import { Type, Static } from "@sinclair/typebox";
import { MessageInfoSchema } from "./MessageInfo";

export const MessageInfoListSchema = Type.Array(MessageInfoSchema);

export type MessageInfoList = Static<typeof MessageInfoListSchema>;
