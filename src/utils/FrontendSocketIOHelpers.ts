import { AIServiceInput, AIServiceInputFromFrontend, AIServiceInputFromFrontendSchema, AIServiceOutput } from "@/schemas/AIServiceInterface";
import { SocketIOClientInterface } from "./SocketIOClient";
import { Value } from "@sinclair/typebox/value";

export class FrontendSocketIOHelpers {
    static notifyErrorAndDisconnectSocket = ({ socketFromFrontend, error }: {
        socketFromFrontend: SocketIOClientInterface,
        error: string,
    }) => {
        socketFromFrontend.emit("message", {
            is_finished: true,
            error,
        } satisfies AIServiceOutput);

        socketFromFrontend.disconnect();
    };

    static addUserMessageEventListener = ({ socketFromFrontend, onUserMessage } : {
        socketFromFrontend: SocketIOClientInterface,
        onUserMessage: (data: AIServiceInputFromFrontend) => Promise<void>,
    }) => {
        socketFromFrontend.on("message", async (raw_data: any) => {
            try {
                const data = Value.Decode(AIServiceInputFromFrontendSchema, raw_data);
                await onUserMessage(data);
            } catch (error) {
                FrontendSocketIOHelpers.notifyErrorAndDisconnectSocket({
                    socketFromFrontend,
                    error: "" + error,
                });
            }
        });
    };
}
