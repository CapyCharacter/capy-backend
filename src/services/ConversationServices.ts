import { ConversationNotFoundError } from "@/errors";
import { ConversationInfo } from "@/schemas/ConversationInfo";
import { ConversationInfoList } from "@/schemas/ConversationInfoList";
import { Message, PrismaClient } from "@prisma/client";
import { CHARACTER_INCLUDE } from "./CharacterServices";
import { VOICE_INCLUDE } from "./VoiceServices";

export const CONVERSATION_INCLUDE = {
    character: {
        include: CHARACTER_INCLUDE,
    },
    voice: {
        include: VOICE_INCLUDE,
    },
} as const;

export class ConversationServices {
    static async getConversations({ prisma, userId }: {
        prisma: PrismaClient,
        userId: number,
    }): Promise<Error|ConversationInfoList> {
        const conversations = await prisma.conversation.findMany({
            where: {
                user_id: userId,
            },
            include: CONVERSATION_INCLUDE,
        });

        return conversations;
    }

    static async getConversationByCharacterIdAndCreateIfNotExists({ prisma, characterId, userId }: {
        prisma: PrismaClient,
        characterId: number,
        userId: number,
    }): Promise<Error | ConversationInfo> {
        try {
            const conversation = await prisma.conversation.findFirst({
                where: {
                    character_id: characterId,
                    user_id: userId,
                },
                include: CONVERSATION_INCLUDE,
            });

            if (null === conversation) {
                const newConversation = await prisma.conversation.create({
                    data: {
                        character_id: characterId,
                        user_id: userId,
                        is_public: false,
                    },
                    include: CONVERSATION_INCLUDE,
                });

                return newConversation;
            }

            return conversation;
        } catch (error) {
            return new Error("Failed to fetch conversation: " + error);
        }
    }

    static async getMessages({ prisma, conversation_id }: {
        prisma: PrismaClient,
        conversation_id: number,
    }): Promise<Error|Message[]> {
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversation_id,
            },
            include: {
                messages: {
                    orderBy: {
                        sent_at: "asc",
                    },
                },
            },
        });

        if (null === conversation) {
            return new Error("Conversation not found");
        }

        return conversation.messages;
    }

    static async createMessage({ prisma, conversation_id, authenticated_user_id, sent_by_user, content }: {
        prisma: PrismaClient,
        conversation_id: number,
        authenticated_user_id: number,
        content: string,
        sent_by_user: boolean,
    }): Promise<Error|Message> {
        try {
            const conversation = await prisma.conversation.findUnique({
                where: {
                    id: conversation_id,
                    user_id: authenticated_user_id,
                },
            });

            if (!conversation) {
                return new ConversationNotFoundError();
            }

            const message = await prisma.message.create({
                data: {
                    conversation_id,
                    content,
                    sent_by_user,
                    sent_at: new Date(),
                },
            });

            return message;
        } catch (error) {
            return new Error("while creating message: " + error);
        }
    }

    static async updateMessage({ prisma, message_id, content }: {
        prisma: PrismaClient,
        message_id: number,
        content: string,
    }): Promise<Error|true> {
        try {
            await prisma.message.update({
                where: { id: message_id },
                data: {
                    content,
                },
            });
            return true;
        } catch (error) {
            return new Error("while updating message: " + error);
        }
    }

    static async deleteMessage({ prisma, message_id }: {
        prisma: PrismaClient,
        message_id: number,
    }): Promise<Error|true> {
        try {
            await prisma.message.delete({ where: { id: message_id } });
            return true;
        } catch (error) {
            return new Error("Error deleting message: " + error);
        }
    }
}
