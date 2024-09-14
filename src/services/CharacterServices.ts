import { CharacterNotFoundError } from "@/errors";
import { CharacterCreate } from "@/schemas/CharacterCreate";
import { CharacterInfo } from "@/schemas/CharacterInfo";
import { CharacterInfoList } from "@/schemas/CharacterInfoList";
import { CharacterUpdate } from "@/schemas/CharacterUpdate";
import { PrismaClient } from "@prisma/client";
import { VOICE_INCLUDE } from "./VoiceServices";

const CHARACTER_WHERE = ({ userId }: { userId: number|null }) => {
    if (null === userId) {
        return {
            is_public: true,
        };
    } else {
        return {
            OR: [
                {
                    is_public: true,
                },
                {
                    is_public: false,
                    creator_user_id: userId,
                },
            ],
        };
    }
};

export const CHARACTER_INCLUDE = {
    voice: {
        include: VOICE_INCLUDE,
    },
    conversations: {
        include: {
            user: true,
        },
    },
    creator_user: true,
} as const;

export class CharacterServices {
    static getFeaturedCharacters = async ({
        prisma,
    }: { prisma: PrismaClient }): Promise<Error | CharacterInfoList> => {
        const characters = await prisma.character.findMany({
            where: CHARACTER_WHERE({ userId: null }),
            include: CHARACTER_INCLUDE,
        });
        return characters;
    }

    static getRecommendedCharacters = async ({
        prisma,
    }: { prisma: PrismaClient }): Promise<Error | CharacterInfoList> => {
        const characters = await prisma.character.findMany({
            where: CHARACTER_WHERE({ userId: null }),
            include: CHARACTER_INCLUDE,
        });
        return characters;
    }

    static getRecentCharacters = async ({
        prisma,
        userId,
    }: { prisma: PrismaClient, userId: number }): Promise<Error | CharacterInfoList> => {
        const characters = await prisma.character.findMany({
            where: CHARACTER_WHERE({ userId }),
            include: CHARACTER_INCLUDE,
        });
        return characters;
    }

    static getThisWeekCharacters = async ({
        prisma,
        userId,
    }: { prisma: PrismaClient, userId: number }): Promise<Error | CharacterInfoList> => {
        const characters = await prisma.character.findMany({
            where: CHARACTER_WHERE({ userId }),
            include: CHARACTER_INCLUDE,
        });
        return characters;
    }

    static getCharacterById = async ({
        prisma,
        userId,
        characterId,
    }: { prisma: PrismaClient, userId: number, characterId: number }): Promise<Error | CharacterInfo> => {
        try {
            const character = await prisma.character.findUnique({
                where: Object.assign(
                    { id: characterId },
                    CHARACTER_WHERE({ userId }),
                ),
                include: {
                    ...CHARACTER_INCLUDE,
                    creator_user: true,
                },
            });
            if (null === character) {
                return new CharacterNotFoundError();
            }

            return character;
        } catch (error) {
            return new Error("failed to get character: " + error);
        }
    }

    static createCharacter = async ({
        prisma, userId, characterCreate,
    }: {
        prisma: PrismaClient,
        userId: number,
        characterCreate: CharacterCreate,
    }): Promise<Error | CharacterInfo> => {
        try {
            const newCharacter = await prisma.character.create({
                data: {
                    ...characterCreate,
                    creator_user_id: userId,
                    num_chats: 0,
                    num_likes: 0,
                },
                include: {
                    ...CHARACTER_INCLUDE,
                    creator_user: true,
                },
            });

            return newCharacter;
        } catch (error) {
            return new Error("failed to create character: " + error);
        }
    }

    static updateCharacter = async ({
        prisma, userId, characterId, characterUpdate,
    }: {
        prisma: PrismaClient,
        userId: number,
        characterId: number,
        characterUpdate: CharacterUpdate,
    }): Promise<Error | CharacterInfo> => {
        try {
            const updatedCharacter = await prisma.character.update({
                where: {
                    id: characterId,
                },
                data: characterUpdate,
                include: CHARACTER_INCLUDE,
            });
            return updatedCharacter;
        } catch (error) {
            return new Error("failed to update character: " + error);
        }
    }

    static deleteCharacter = async ({
        prisma, userId, characterId,
    }: {
        prisma: PrismaClient,
        userId: number,
        characterId: number,
    }): Promise<Error | true> => {
        try {
            await prisma.character.delete({
                where: { id: characterId },
            });
        } catch (error) {
            return new Error("failed to delete character: " + error);
        }
        return true;
    }
}
