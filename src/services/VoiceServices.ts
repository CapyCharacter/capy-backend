import { PrismaClient } from "@prisma/client";
import { VoiceInfo } from "@/schemas/VoiceInfo";
import { VoiceNotFoundError } from "@/errors";
import { VoiceCreate } from "@/schemas/VoiceCreate";
import { VoiceUpdate } from "@/schemas/VoiceUpdate";

export const VOICE_INCLUDE = {
    creator_user: true,
} as const;

const VOICE_WHERE = ({ userId }: { userId: number|null }) => {
    if (null === userId) {
        return { is_public: true };
    }
    return {
        OR: [
            { is_public: true },
            { creator_user_id: userId },
        ],
    };
};

export class VoiceServices {
    static getVoices = async ({
        prisma, userId,
    }: {
        prisma: PrismaClient, userId: number,
    }): Promise<Error | VoiceInfo[]> => {
        try {
            const voices = await prisma.voice.findMany({
                where: VOICE_WHERE({ userId }),
                include: VOICE_INCLUDE,
            });
            return voices;
        } catch (error) {
            return new Error("failed to get voices: " + error);
        }
    }

    static getVoiceById = async ({
        prisma, userId, voiceId,
    }: {
        prisma: PrismaClient, userId: number, voiceId: number,
    }): Promise<Error | VoiceInfo> => {
        try {
            const voice = await prisma.voice.findUnique({
                where: Object.assign(
                    { id: voiceId },
                    VOICE_WHERE({ userId }),
                ),
                include: VOICE_INCLUDE,
            });
            if (!voice) {
                return new VoiceNotFoundError();
            }
            return voice;
        } catch (error) {
            return new Error("failed to get voice: " + error);
        }
    }

    static createVoice = async ({
        prisma, userId, voiceCreate,
    }: {
        prisma: PrismaClient, userId: number, voiceCreate: VoiceCreate,
    }): Promise<Error | VoiceInfo> => {
        try {
            const voice = await prisma.voice.create({
                data: {
                    ...voiceCreate,
                    creator_user_id: userId,
                },
                include: VOICE_INCLUDE,
            });
            return voice;
        } catch (error) {
            return new Error("failed to create voice: " + error);
        }
    }

    static updateVoice = async ({
        prisma, userId, voiceId, voiceUpdate,
    }: {
        prisma: PrismaClient, userId: number, voiceId: number, voiceUpdate: VoiceUpdate,
    }): Promise<Error | VoiceInfo> => {
        try {
            const voice = await prisma.voice.update({
                where: Object.assign(
                    { id: voiceId },
                    VOICE_WHERE({ userId }),
                ),
                data: {
                    ...voiceUpdate,
                },
                include: VOICE_INCLUDE,
            });
            return voice;
        } catch (error) {
            return new Error("failed to update voice: " + error);
        }
    }

    static deleteVoice = async ({
        prisma, userId, voiceId,
    }: {
        prisma: PrismaClient, userId: number, voiceId: number,
    }): Promise<Error | true> => {
        try {
            await prisma.voice.delete({
                where: {
                    id: voiceId,
                    ...VOICE_WHERE({ userId }),
                },
            });
            return true;
        } catch (error) {
            return new Error("failed to delete voice: " + error);
        }
    }
}
