import socketIOClient from "socket.io-client";

export type SocketIOClientEventListener = (...args: unknown[]) => void;

export type SocketIOClientInterface = {
    on: (event: string, callback: SocketIOClientEventListener) => void,
    emit: (event: string, ...args: unknown[]) => void,
    disconnect: () => void,
};

export function createRealSocketIOClientInterface({ url } : {
    url: string,
}): SocketIOClientInterface {
    const socket = socketIOClient(url);

    return {
        on: (event, callback) => {
            socket.on(event, callback);
        },
        emit: (event, ...args) => {
            socket.emit(event, ...args);
        },
        disconnect: () => {
            socket.disconnect();
        },
    };
}

export function createFakeSocketIOClientInterface({ process } : {
    process: (input: unknown, sendData: (data: unknown) => void|Promise<void>) => void,
}): SocketIOClientInterface {
    const eventListeners: {
        [event: string]: SocketIOClientEventListener[],
    } = {};

    const emit: SocketIOClientInterface["emit"] = (event, ...args) => {
        setTimeout(() => {
            process(args[0], async (data: unknown) => {
                eventListeners[event].forEach(listener => listener(data));
            });
        }, 1000); // simulate network and (AI) processing delays
    };

    const on: SocketIOClientInterface["on"] = (event, callback) => {
        eventListeners[event] = eventListeners[event] || [];
        eventListeners[event].push(callback);
    };

    return {
        on,
        emit,
        disconnect: () => {},
    };
}
