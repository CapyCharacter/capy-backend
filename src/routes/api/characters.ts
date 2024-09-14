import { requireAuth } from "@/middleware/requireAuth";
import { CharacterCreate, CharacterCreateSchema } from "@/schemas/CharacterCreate";
import { CharacterInfo, CharacterInfoSchema } from "@/schemas/CharacterInfo";
import { CharacterInfoList, CharacterInfoListSchema } from "@/schemas/CharacterInfoList";
import { CharacterUpdate, CharacterUpdateSchema } from "@/schemas/CharacterUpdate";
import { CharacterServices } from "@/services/CharacterServices";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

export const charactersRoutes = async (server: FastifyInstance) => {
    server.get("/featured", {
        schema: {
            description: "Get featured characters for the home page.",
            tags: ["characters"],
            response: {
                200: CharacterInfoListSchema,
            },
        },
    }, async (req, res): Promise<CharacterInfoList> => {
        const characters = await CharacterServices.getFeaturedCharacters({
            prisma: req.server.prisma,
        });

        if (characters instanceof Error) {
            throw characters;
        }

        return characters;
    });

    server.get("/recommended", {
        schema: {
            description: "Get recommended characters for the user.",
            tags: ["characters"],
            response: {
                200: CharacterInfoListSchema,
            },
        },
    }, async (req, res): Promise<CharacterInfoList> => {
        const characters = await CharacterServices.getRecommendedCharacters({
            prisma: req.server.prisma,
        });

        if (characters instanceof Error) {
            throw characters;
        }

        return characters;
    });

    server.get("/recent", {
        schema: {
            description: "Get recent characters.",
            tags: ["characters"],
            security: [{ cookieAuth: [] }],
            response: {
                200: CharacterInfoListSchema,
            },
        },
    }, async (req, res): Promise<CharacterInfoList> => {
        const auth = await requireAuth(req, res);

        const characters = await CharacterServices.getRecentCharacters({
            prisma: req.server.prisma,
            userId: auth.user.id,
        });

        if (characters instanceof Error) {
            throw characters;
        }

        return characters;
    });

    server.get("/this-week", {
        schema: {
            description: "Get characters for this week.",
            tags: ["characters"],
            security: [{ cookieAuth: [] }],
            response: {
                200: CharacterInfoListSchema,
            },
        },
    }, async (req, res): Promise<CharacterInfoList> => {
        const auth = await requireAuth(req, res);

        const characters = await CharacterServices.getThisWeekCharacters({
            prisma: req.server.prisma,
            userId: auth.user.id,
        });

        if (characters instanceof Error) {
            throw characters;
        }

        return characters;
    });

    server.post<{
        Body: CharacterCreate;
        Reply: CharacterInfo;
    }>("/", {
        schema: {
            description: "Create a new character.",
            tags: ["characters"],
            security: [{ cookieAuth: [] }],
            body: CharacterCreateSchema,
            response: {
                200: CharacterInfoSchema,
            },
        },
    }, async (req, res): Promise<CharacterInfo> => {
        const auth = await requireAuth(req, res);

        const character = await CharacterServices.createCharacter({
            prisma: req.server.prisma,
            userId: auth.user.id,
            characterCreate: req.body,
        });

        if (character instanceof Error) {
            throw character;
        }

        return character;
    });

    server.get<{
        Params: { characterId: number };
        Reply: CharacterInfo;
    }>("/:characterId", {
        schema: {
            description: "Get a character by ID.",
            tags: ["characters"],
            security: [{ cookieAuth: [] }],
            params: Type.Object({
                characterId: Type.Integer(),
            }),
            response: {
                200: CharacterInfoSchema,
            },
        },
    }, async (req, res): Promise<CharacterInfo> => {
        const auth = await requireAuth(req, res);

        const characterId = +req.params.characterId;
        if (isNaN(characterId)) {
            throw new Error("invalid character id");
        }

        const character = await CharacterServices.getCharacterById({
            prisma: req.server.prisma,
            userId: auth.user.id,
            characterId,
        });

        if (character instanceof Error) {
            throw character;
        }

        return character;
    });

    server.patch<{
        Params: { characterId: number };
        Body: CharacterUpdate;
        Reply: CharacterInfo;
    }>("/:characterId", {
        schema: {
            description: "Update a character.",
            tags: ["characters"],
            security: [{ cookieAuth: [] }],
            params: Type.Object({
                characterId: Type.Integer(),
            }),
            body: CharacterUpdateSchema,
            response: {
                200: CharacterInfoSchema,
            },
        },
    }, async (req, res): Promise<CharacterInfo> => {
        const auth = await requireAuth(req, res);

        const characterId = +req.params.characterId;
        if (isNaN(characterId)) {
            throw new Error("invalid character id");
        }

        const character = await CharacterServices.updateCharacter({
            prisma: req.server.prisma,
            userId: auth.user.id,
            characterId,
            characterUpdate: req.body,
        });

        if (character instanceof Error) {
            throw character;
        }

        return character;
    });

    server.delete<{
        Params: { characterId: number };
        Reply: true;
    }>("/:characterId", {
        schema: {
            description: "Delete a character.",
            tags: ["characters"],
            security: [{ cookieAuth: [] }],
            params: Type.Object({
                characterId: Type.Integer(),
            }),
            response: {
                200: Type.Boolean(),
            },
        },
    }, async (req, res): Promise<true> => {
        const auth = await requireAuth(req, res);

        const characterId = +req.params.characterId;
        if (isNaN(characterId)) {
            throw new Error("invalid character id");
        }

        const result = await CharacterServices.deleteCharacter({
            prisma: req.server.prisma,
            userId: auth.user.id,
            characterId,
        });

        if (result instanceof Error) {
            throw result;
        }

        return true;
    });
};
