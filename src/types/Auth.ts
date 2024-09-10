import { AuthToken, User } from "@prisma/client";

export type Auth = {
    user: User,
    token: string,
    tokenRecordId: number,
};
