import { LLMServices } from "@/services/LLMServices";
import { FastifyInstance } from "fastify";
import { createFrontendSocketIOMiddleware_requireAuth } from "@/middleware/requireAuth";
import { ConversationServices } from "@/services/ConversationServices";
import { FrontendSocketIOHelpers } from "@/utils/FrontendSocketIOHelpers";

export async function frontendSocketIOEventListeners(server: FastifyInstance) {
    server.io.use( createFrontendSocketIOMiddleware_requireAuth(server) );

    server.io.on('connection', async socketFromFrontend => {
        FrontendSocketIOHelpers.addUserMessageEventListener({
            socketFromFrontend,
            onUserMessage: async data => {
                const { prisma } = server;
                const { conversation_id, latest_message_content } = data;
                const previous_messages = await ConversationServices.getMessages({ prisma, conversation_id });
                if (previous_messages instanceof Error) {
                    throw previous_messages;
                }

                const latestMessageFromUser = await ConversationServices.createMessage({
                    prisma,
                    authenticated_user_id: socketFromFrontend.data.auth.user_id,
                    conversation_id,
                    content: latest_message_content,
                    sent_by_user: true,
                });
                if (latestMessageFromUser instanceof Error) {
                    throw latestMessageFromUser;
                }

                if (data.type === "LLM") {
                    const latestMessageFromLLM = await ConversationServices.createMessage({
                        prisma,
                        authenticated_user_id: socketFromFrontend.data.auth.user_id,
                        conversation_id,
                        content: "[Generating...]",
                        sent_by_user: false,
                    });
                    if (latestMessageFromLLM instanceof Error) {
                        throw latestMessageFromLLM;
                    }

                    let accumulatedMessageFromLLM = "";

                    LLMServices.run({
                        auth: socketFromFrontend.data.auth,
                        previous_messages,
                        latest_message_content,
                        onNewData: async data => {
                            socketFromFrontend.emit("message", data);
                            if (data.error === false) {
                                accumulatedMessageFromLLM += data.new_data;
                            }
                            if (data.is_finished) {
                                const message = await ConversationServices.updateMessage({
                                    prisma,
                                    message_id: latestMessageFromLLM.id,
                                    content: accumulatedMessageFromLLM,
                                });

                                if (message instanceof Error) {
                                    throw message;
                                }
                            }
                        },
                    });
                }
            },
        });
    });
}
