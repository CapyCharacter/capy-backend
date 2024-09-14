import { AIServiceOutput, AIServiceOutputSchema } from "@/schemas/AIServiceInterface";
import { SocketIOClientInterface as SocketIOInterface } from "./SocketIOClient";
import { Value } from "@sinclair/typebox/value";

export class AISocketIOHelpers {
    static registerCommonStuff = ({ socketToAI, modelName, onNewData }: {
        socketToAI: SocketIOInterface,
        modelName: string,
        onNewData: (data: AIServiceOutput) => void,
    }) => {
        socketToAI.on("message", _unknown_data => {
            let data: AIServiceOutput;
            try {
                data = Value.Decode(AIServiceOutputSchema, _unknown_data);
            } catch (e) {
                return AISocketIOHelpers.notifyErrorAndDisconnectSocket({
                    socketToAI,
                    modelName,
                    onNewData,
                    error: `Error: ${modelName}: ${e}`,
                });
            }

            try {
                onNewData(data);
            } catch (e) {
                console.error(`Fatal error while calling onNewData() for ${modelName} model: ${e}`);
            }

            if (data.is_finished) {
                return socketToAI.disconnect();
            }
        });

        socketToAI.on("connect_error", _unknown_error => {
            const error = "" + _unknown_error;
            console.error(`Error: Connection to ${modelName} service failed.`, error);
            AISocketIOHelpers.notifyErrorAndDisconnectSocket({
                socketToAI,
                modelName,
                onNewData,
                error: `Error: Connection to ${modelName} service failed: ${error}`,
            });
        });

        socketToAI.on("disconnect", _unknown_reason => {
            const reason = "" + _unknown_reason;
            console.log(`Socket to ${modelName} disconnected:`, reason);
        });
    };

    static notifyErrorAndDisconnectSocket = ({ socketToAI: _unused, modelName, onNewData, error }: {
        socketToAI: SocketIOInterface,
        modelName: string,
        onNewData: (data: AIServiceOutput) => void,
        error: string,
    }) => {
        onNewData({
            is_finished: true,
            error: `Error: ${modelName}: ${error}`,
        });
        // Because is_finished is true, the socket will be disconnected due to the first listener in registerCommonSocketIOEventListeners above.
    };
}
