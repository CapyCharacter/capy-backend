import { LLM_SOCKET_URL } from "@/env";
import { LLMServiceInput, LLMServiceInputSchema, LLMServiceOutput, LLMServiceOutputSchema } from "@/schemas/AIServiceInterface";
import { Auth } from "@/types/Auth";
import { Message } from "@prisma/client";
import { AISocketIOHelpers } from "@/utils/AISocketIOHelpers";
import { createRealSocketIOClientInterface, createFakeSocketIOClientInterface, SocketIOClientInterface } from "@/utils/SocketIOClient";
import { Value } from "@sinclair/typebox/value";

export type LLMServiceOnNewDataCallback = (new_data: LLMServiceOutput) => void;

export class LLMServices {
    static run = async ({ auth, previous_messages, latest_message_content, onNewData } : {
        auth: Auth,
        previous_messages: Message[],
        latest_message_content: string,
        onNewData: LLMServiceOnNewDataCallback,
    }): Promise<Error|true> => {
        const socketToLLM = (null !== LLM_SOCKET_URL)
            ? createRealSocketIOClientInterface({ url: LLM_SOCKET_URL })
            : createFakeSocketIOClientInterface({
                process: async (_unknown_input, _unknown_sendData) => {
                    const input = Value.Decode(LLMServiceInputSchema, _unknown_input);
                    const sendData = (data: LLMServiceOutput) => _unknown_sendData(Value.Encode(LLMServiceOutputSchema, data));

                    for (const data of [
                        "This ", "is ", "some ", "sample ", "output ", "from ", "the ", "LLM ", "service. ",
                        "Thank you ", "for using ", "our service ",
                        "(or actually, ", "testing it ", "out!). ",
                        "Your ", "input ", "was: ",
                    ]) {
                        await new Promise((resolve) => setTimeout(resolve, 100));
                        sendData({ is_finished: false, error: false, new_data: data });
                    }

                    sendData({ is_finished: true, error: false, new_data: input.latest_message_content });
                },
            });

        return LLMServices.runWithSocket({ auth, previous_messages, latest_message_content, socketToLLM, onNewData });
    };

    static runWithSocket = async ({ auth, previous_messages, latest_message_content, socketToLLM, onNewData } : {
        auth: Auth,
        previous_messages: Message[],
        latest_message_content: string,
        socketToLLM: SocketIOClientInterface,
        onNewData: LLMServiceOnNewDataCallback,
    }): Promise<Error|true> => {
        const { is_premium } = auth.user;
        try {
            AISocketIOHelpers.registerCommonStuff({
                socketToAI: socketToLLM,
                modelName: "LLM",
                onNewData,
            });

            socketToLLM.emit("message", Value.Encode(LLMServiceInputSchema, {
                conversation_history: previous_messages,
                latest_message_content,
                is_premium,
            } satisfies LLMServiceInput));

            return true;
        } catch (e) {
            return new Error("" + e);
        }
    };
}
