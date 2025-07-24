import { Tool } from "@anthropic-ai/sdk/resources/messages";

export const tools: Tool[] = [
    {
        name: "create_setting",
        description: "Creates a new setting for specifications with a specific record type. Setting type can be 'custom supersede', 'dynamic clone', etc. The setting specifies the fields to be updated.",
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
        description: "Retrieves setting of a specific setting type and record type. Returns an array of fields to be updated for a specific setting type and record type.",
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
        description: "Lists settings for setting types and all record types. Returns an array of settings. Each setting contains the setting type, record type, and fields to be updated.",
        input_schema: {
            type: "object",
            properties: {},
            required: []
        }
    },
    {
        name: "get_specification_by_id",
        description: "Retrieves a specification by its ID. Returns the specification details including its ID, name, record type, description and status.",
        input_schema: {
            type: "object",
            properties: {
                specification_id: {
                    type: "string",
                    description: "The ID of the specification to retrieve."
                }
            },
            required: ["specification_id"]
        }
    },
    {
        name: "create_specification",
        description: "Creates a new specification with specification data. The specification data includes the name, record type, description, and status of the specification.  This tool could used to dynamic clone or custom supersede.",
        input_schema: {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "The name of the specification."
                        },
                        description: {
                            type: "string",
                            description: "The description of the specification."
                        },
                        status: {
                            type: "string",
                            description: "The status of the specification."
                        },
                        record_type: {
                            type: "string",
                            description: "The type of the record for the specification. For example, 'bottle', 'can', or 'pallet'."
                        }
                    },
                    required: ["name", "description", "status", "record_type"]
                }
            },
            required: ["data"]
        }
    }
];