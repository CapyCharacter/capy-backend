import { requireAuth } from "@/middleware/requireAuth";
import { VoiceCreate, VoiceCreateSchema } from "@/schemas/VoiceCreate";
import { VoiceInfo, VoiceInfoSchema } from "@/schemas/VoiceInfo";
import { VoiceInfoList, VoiceInfoListSchema } from "@/schemas/VoiceInfoList";
import { VoiceUpdate, VoiceUpdateSchema } from "@/schemas/VoiceUpdate";
import { VoiceServices } from "@/services/VoiceServices";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

export const voicesRoutes = async (server: FastifyInstance) => {
    server.get("/", {
        schema: {
            description: "Get all voices.",
            tags: ["voices"],
            security: [{ cookieAuth: [] }],
            response: {
                200: VoiceInfoListSchema,
            },
        },
    }, async (req, res): Promise<VoiceInfoList> => {
        const auth = await requireAuth(req, res);

        const voices = await VoiceServices.getVoices({
            prisma: req.server.prisma,
            userId: auth.user.id,
        });

        if (voices instanceof Error) {
            throw voices;
        }

        return voices;
    });

    server.get<{
        Params: {
            id: string;
        };
        Reply: VoiceInfo;
    }>("/:id", {
        schema: {
            description: "Get a voice by ID.",
            tags: ["voices"],
            security: [{ cookieAuth: [] }],
            params: Type.Object({
                id: Type.String(),
            }),
            response: {
                200: VoiceInfoSchema,
            },
        },
    }, async (req, res): Promise<VoiceInfo> => {
        const auth = await requireAuth(req, res);

        const voice = await VoiceServices.getVoiceById({
            prisma: req.server.prisma,
            userId: auth.user.id,
            voiceId: Number(req.params.id),
        });

        if (voice instanceof Error) {
            throw voice;
        }

        return voice;
    });

    server.post<{
        Body: VoiceCreate;
        Reply: VoiceInfo;
    }>("/", {
        schema: {
            description: "Create a new voice.",
            tags: ["voices"],
            security: [{ cookieAuth: [] }],
            body: VoiceCreateSchema,
            response: {
                200: VoiceInfoSchema,
            },
        },
    }, async (req, res): Promise<VoiceInfo> => {
        const auth = await requireAuth(req, res);

        const voice = await VoiceServices.createVoice({
            prisma: req.server.prisma,
            userId: auth.user.id,
            voiceCreate: req.body,
        });

        if (voice instanceof Error) {
            throw voice;
        }

        return voice;
    });

    server.patch<{
        Params: {
            id: string;
        };
        Body: VoiceUpdate;
        Reply: VoiceInfo;
    }>("/:id", {
        schema: {
            description: "Update a voice by ID.",
            tags: ["voices"],
            security: [{ cookieAuth: [] }],
            params: Type.Object({
                id: Type.String(),
            }),
            body: VoiceUpdateSchema,
            response: {
                200: VoiceInfoSchema,
            },
        },
    }, async (req, res): Promise<VoiceInfo> => {
        const auth = await requireAuth(req, res);

        const voiceId = Number(req.params.id);
        if (isNaN(voiceId)) {
            throw new Error("Invalid voice ID");
        }

        const result = await VoiceServices.updateVoice({
            prisma: req.server.prisma,
            userId: auth.user.id,
            voiceId,
            voiceUpdate: req.body,
        });

        if (result instanceof Error) {
            throw result;
        }

        return result;
    });

    server.delete<{
        Params: {
            id: string;
        };
    }>("/:id", {
        schema: {
            description: "Delete a voice by ID.",
            tags: ["voices"],
            security: [{ cookieAuth: [] }],
            params: Type.Object({
                id: Type.String(),
            }),
            response: {
                200: Type.Boolean(),
            },
        },
    }, async (req, res): Promise<boolean> => {
        const auth = await requireAuth(req, res);

        const voiceId = Number(req.params.id);
        if (isNaN(voiceId)) {
            throw new Error("Invalid voice ID");
        }

        const result = await VoiceServices.deleteVoice({
            prisma: req.server.prisma,
            userId: auth.user.id,
            voiceId,
        });

        if (result instanceof Error) {
            throw result;
        }

        return true;
    });
};
