import { Tool } from "@anthropic-ai/sdk/resources/messages";

export const tools: Tool[] = [
    {
        name: "create_setting",
        description: "Creates a new custom supersede setting for a specific record type.",
        input_schema: {
            type: "object",
            properties: {
                recordType: {
                    type: "string",
                    description: "The type of the record to create a setting for."
                },
                fields: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string",
                                description: "The name of the field."
                            },
                            value: {
                                type: "string",
                                description: "The value of the field."
                            }
                        },
                        required: ["name", "value"]
                    }
                }
            },
            required: ["recordType", "fields"]
        }
    }
];