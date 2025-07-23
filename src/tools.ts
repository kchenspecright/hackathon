import { Tool } from "@anthropic-ai/sdk/resources/messages";

export const tools: Tool[] = [
    {
        name: "create_setting",
        description: "Creates a new custom supersede setting for specifications with a specific record type.",
        input_schema: {
            type: "object",
            properties: {
                recordType: {
                    type: "string",
                    description: "The type of the record to create a setting for. for example, 'bottle', 'can', or 'pallet'."
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
    },
    {
        name: "get_setting",
        description: "Retrieves the custom supersede setting for specifications with a specific record type. Returns an array of fields.",
        input_schema: {
            type: "object",
            properties: {
                recordType: {
                    type: "string",
                    description: "The type of the record to retrieve a setting for. for example, 'bottle', 'can', or 'pallet'."
                },
            },
            required: ["recordType"]
        }
    }
];