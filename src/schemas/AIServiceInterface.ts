import { Type, Static, TObject } from '@sinclair/typebox';

const AIServiceInputCommonFromFrontendSchema = Type.Object({
    conversation_id: Type.Number(),
});

const AIServiceInputCommonSchema = Type.Object({
    is_premium: Type.Boolean(),
});

const AIServiceOutputCommonSchema = Type.Object({
    is_finished: Type.Boolean(),
    error: Type.Literal(false),
});

const AIServiceOutputErrorSchema = Type.Object({
    is_finished: Type.Literal(true),
    error: Type.String(),
});

function createSchemasForNewAIModel<ModelType extends string, InputAdditionalFields extends TObject, FrontendInputAdditionalFields extends TObject, OutputAdditionalFields extends TObject>({
    modelType,
    inputAdditionalFields,
    frontendInputAdditionalFields,
    outputAdditionalFields,
}: {
    modelType: ModelType,
    inputAdditionalFields: InputAdditionalFields,
    frontendInputAdditionalFields: FrontendInputAdditionalFields,
    outputAdditionalFields: OutputAdditionalFields,
}) {
    const inputForAIService = Type.Intersect([
        AIServiceInputCommonSchema,
        inputAdditionalFields,
    ] as const);

    const inputFromFrontend = Type.Intersect([
        AIServiceInputCommonFromFrontendSchema,
        frontendInputAdditionalFields,
        Type.Object({
            type: Type.Literal(modelType),
        }),
    ] as const);

    const outputFromAIService = Type.Union([
        Type.Intersect([
            AIServiceOutputCommonSchema,
            outputAdditionalFields,
        ]),

        AIServiceOutputErrorSchema,
    ] as const);

    return [inputForAIService, inputFromFrontend, outputFromAIService] as const;
}

export const [LLMServiceInputSchema, LLMServiceInputFromFrontendSchema, LLMServiceOutputSchema] = createSchemasForNewAIModel({
    modelType: "LLM" as const,

    inputAdditionalFields: Type.Object({
        conversation_history: Type.Array(Type.Object({
            sent_by_user: Type.Boolean(),
            content: Type.String(),
        })),
        latest_message_content: Type.String(),
    } as const),

    frontendInputAdditionalFields: Type.Object({
        latest_message_content: Type.String(),
    } as const),

    outputAdditionalFields: Type.Object({
        new_data: Type.String(),
    } as const),
});

export const AIServiceInputSchema = LLMServiceInputSchema; // | AnotherServiceInputSchema
export const AIServiceInputFromFrontendSchema = LLMServiceInputFromFrontendSchema; // | AnotherServiceInputFromFrontendSchema
export const AIServiceOutputSchema = LLMServiceOutputSchema; // | AnotherServiceOutputSchema

export type AIServiceInputCommon = Static<typeof AIServiceInputCommonSchema>;
export type AIServiceOutputCommon = Static<typeof AIServiceOutputCommonSchema>;

export type LLMServiceInput = Static<typeof LLMServiceInputSchema>;
export type LLMServiceInputFromFrontend = Static<typeof LLMServiceInputFromFrontendSchema>;
export type LLMServiceOutput = Static<typeof LLMServiceOutputSchema>;

export type AIServiceInput = Static<typeof AIServiceInputSchema>;
export type AIServiceInputFromFrontend = Static<typeof AIServiceInputFromFrontendSchema>;
export type AIServiceOutput = Static<typeof AIServiceOutputSchema>;
