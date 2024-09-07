console.info(`====================================`);
console.info(`App started at ${new Date()}`);
process.on("exit", function () {
    console.info(`App stopped at ${new Date()}`);
});

import { createServer } from "./server";
import { SERVER_PORT } from "@/env";

async function serve() {
    const server =  await createServer();

    server.listen({ port: SERVER_PORT, host: '0.0.0.0' }, async (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        // app is ready, notify pm2
        if (process.send !== undefined) {
            process.send("ready");
        }
        console.info(`Server listening at ${address}`);
        console.info(`since ${new Date()}`);
    });

    const shutdown = async function () {
        // pm2 is trying to terminate this app
        try {
            await server.close();
            process.exit(0);
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    };

    process.on('message', function (msg) {
        if (msg === 'shutdown') shutdown();
    });
}

serve();
