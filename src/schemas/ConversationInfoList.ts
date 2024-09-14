import { Type, Static } from "@sinclair/typebox";
import { ConversationInfoSchema } from "./ConversationInfo";

export const ConversationInfoListSchema = Type.Array(ConversationInfoSchema);

export type ConversationInfoList = Static<typeof ConversationInfoListSchema>;
