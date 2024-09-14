import { Type, Static } from "@sinclair/typebox";
import { VoiceInfoSchema } from "./VoiceInfo";

export const VoiceInfoListSchema = Type.Array(VoiceInfoSchema);

export type VoiceInfoList = Static<typeof VoiceInfoListSchema>;
