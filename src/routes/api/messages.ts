import { FastifyInstance } from "fastify";
import { MessageInfoList, MessageInfoListSchema } from "@/schemas/MessageInfoList";
import { Type, Static } from "@sinclair/typebox";
import { requireAuth } from "@/middleware/requireAuth";
import { Value } from "@sinclair/typebox/value";

const MessageInfoListGetSchema = Type.Object({
    conversation_id: Type.String({
        description: 'The ID of the conversation to get the messages for. Must be integer.',
    }),
});

type MessageInfoListGet = Static<typeof MessageInfoListGetSchema>;

export const messagesRoutes = async (server: FastifyInstance) => {
    server.get<{
        Querystring: MessageInfoListGet,
        Reply: MessageInfoList,
    }>('/', {
        schema: {
            description: 'Get all messages of the specified conversation of the currently authenticated user',
            querystring: MessageInfoListGetSchema,
            response: {
                200: MessageInfoListSchema,
            },
            security: [{ cookieAuth: [] }],
        },
    }, async (req, res) => {
        const auth = await requireAuth(req, res);
        const conversationId = parseInt(req.query.conversation_id, 10);
        if (isNaN(conversationId)) {
            throw new Error('Invalid conversation ID');
        }

        const { prisma } = req.server;

        const messages = await prisma.message.findMany({
            where: {
                conversation: {
                    id: conversationId,
                    user_id: auth.user.id,
                },
            },
            include: {
                conversation: true,
            },
        });

        return messages.map(x => ({
            id: x.id,
            conversation_id: x.conversation_id,
            voice_call_id: x.voice_call_id,
            sent_by_user: x.sent_by_user,
            sent_at: x.sent_at.getTime(),
            content: x.content,
        }));
    });
};
