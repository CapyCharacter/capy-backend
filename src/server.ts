import fastify from "fastify";

import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { TRUST_PROXY, ENABLE_LOGGING } from "@/env";

import { allRoutes } from "@/routes";
import { registerAllPlugins } from "@/plugins";

export async function createServer() {
    // https://fastify.dev/docs/latest/Reference/TypeScript/#typebox
    // We use Typebox for building types and schemas
    // for Fastify Request and Reply objects.
    const server = fastify({
        trustProxy: TRUST_PROXY,
        logger: ENABLE_LOGGING,
    }).withTypeProvider<TypeBoxTypeProvider>();

    await registerAllPlugins(server);

    await server.register(allRoutes, { prefix: '/' });

    return server;
}
