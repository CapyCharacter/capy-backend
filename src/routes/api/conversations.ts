import { requireAuth } from "@/middleware/requireAuth";
import { ConversationInfoList, ConversationInfoListSchema } from "@/schemas/ConversationInfoList";
import { ConversationServices } from "@/services/ConversationServices";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

export const conversationsRoutes = async (server: FastifyInstance) => {
    server.get<{
        Reply: ConversationInfoList,
        Querystring: { character_id?: string },
    }>('/', {
        schema: {
            description: 'Get all conversations of the currently authenticated user. If characterId query param is provided, return the conversation by character ID (as a list with one element - the conversation object). In case the user has not chatted with the character before, create a new conversation with the character.',
            querystring: Type.Object({
                character_id: Type.Optional(Type.String({
                    description: 'The ID of the character to get the conversation for',
                })),
            }),
            response: {
                200: ConversationInfoListSchema
            },
            security: [{ cookieAuth: [] }],
        },
    }, async (req, res): Promise<ConversationInfoList> => {
        const auth = await requireAuth(req, res);

        const { prisma } = req.server;
        const characterId = req.query.character_id ? parseInt(req.query.character_id, 10) : null;

        if (characterId) {
            if (isNaN(characterId)) {
                throw new Error("Invalid character ID");
            }

            const conversation = await ConversationServices.getConversationByCharacterIdAndCreateIfNotExists({
                prisma,
                characterId,
                userId: auth.user.id
            });
    
            if (conversation instanceof Error) {
                throw conversation;
            }
    
            return [conversation];
        } else {
            const conversations = await ConversationServices.getConversations({ prisma, userId: auth.user.id });
            if (conversations instanceof Error) {
                throw conversations;
            }
            
            return conversations;
        }
    });
};
