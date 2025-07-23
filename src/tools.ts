import { Tool } from "@anthropic-ai/sdk/resources/messages";

export const tools: Tool[] = [
    {
        name: "create_setting",
        description: "Creates a new setting for specifications with a specific record type.",
        input_schema: {
            type: "object",
            properties: {
                setting_type: {
                    type: "string",
                    description: "The type of setting to create. for example, 'custom supersede', 'dynamic clone'."
                },
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
                                description: "The name of the field to update."
                            },
                            value: {
                                type: "string",
                                description: "The value of the field to update to."
                            }
                        },
                        required: ["name", "value"]
                    }
                }
            },
            required: ["setting_type", "recordType", "fields"]
        }
    },
    {
        name: "get_setting",
        description: "Retrieves setting of a specific setting type and record type. Returns an array of fields.",
        input_schema: {
            type: "object",
            properties: {
                setting_type: {
                    type: "string",
                    description: "The type of setting to retrieve. for example, 'custom supersede', 'dynamic clone'."
                },
                recordType: {   
                    type: "string",
                    description: "The type of the record to retrieve a setting for. for example, 'bottle', 'can', or 'pallet'."
                },
            },
            required: ["setting_type", "recordType"]
        }
    },
    {
        name: "list_settings",
        description: "Lists all settings for all record types.",
        input_schema: {
            type: "object",
            properties: {},
            required: []
        }
    }
];