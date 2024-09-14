import { Type, Static } from "@sinclair/typebox";
import { CharacterInfoSchema } from "./CharacterInfo";

export const CharacterInfoListSchema = Type.Array(CharacterInfoSchema);

export type CharacterInfoList = Static<typeof CharacterInfoListSchema>;
