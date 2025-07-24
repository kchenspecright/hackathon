import Anthropic from "@anthropic-ai/sdk";
import { createInterface, Interface } from "readline";
import dotenv from "dotenv";
import { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { tools } from "./tools"; // Import your tools
import { createSpecification, getSetting, getSpecification, listSettings, setSetting } from "./db";

dotenv.config(); // load environment variables from .env
// Todo:
// https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking#interleaved-thinking
// https://docs.anthropic.com/en/docs/build-with-claude/search-results

const LLM_MODEL = "claude-sonnet-4-20250514"; // Default model
const BETA = ["interleaved-thinking-2025-05-14"]; // Beta features to enable
class Agent {
  private rl: Interface;
  private anthropic: Anthropic;
  constructor() {
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async processQuery(query: string) {
    /**
     * Process a query using Claude and available tools
     *
     * @param query - The user's input query
     * @returns Processed response as a string
     */
    const messages: MessageParam[] = [
      {
        role: "user",
        content: query,
      },
    ];

    // Initial Claude API call
    const response = await this.anthropic.beta.messages.create({
      betas: BETA, // Enable beta features
      thinking: {
        type: "enabled",
        budget_tokens: 10000,
      },
      model: LLM_MODEL,
      max_tokens: 1000,
      messages,
      tools: tools, // Pass the tools array here
    });

    // Process response and handle tool calls
    const finalText: string[] = [];
    await this.processResponse(response, messages, finalText);
    return finalText.join("\n") + "\n\n";
  }
  async processResponse(response: Anthropic.Beta.BetaMessage, messages: MessageParam[], finalText: string[]){
    const toolResults = [];
    const thinkingBlocks = [];
    const toolUseBlocks = [];
    for (const content of response.content) {
      if (content.type === "text") {
        finalText.push(content.text);
      } else if (content.type === "thinking") {
        thinkingBlocks.push(content);
        finalText.push(`[Thinking: ${content.thinking}]\n`);
      } else if (content.type === "tool_use") {
        toolUseBlocks.push(content);
        const toolName = content.name;
        const toolArgs = content.input as { [x: string]: unknown } | undefined;

        switch (toolName) {
          case "create_setting":
            if (
              toolArgs &&
              typeof toolArgs === "object" &&
              "recordType" in toolArgs &&
              "setting_type" in toolArgs &&
              "fields" in toolArgs
            ) {
              const { recordType, setting_type, fields } = toolArgs as {
                recordType: string;
                setting_type: string;
                fields: { name: string; value: string }[];
              };
              // Call the setSetting function to create or update the setting
              finalText.push(
                `[Calling tool ${toolName} with args ${JSON.stringify(
                  toolArgs
                )}]`
              );
              setSetting(setting_type, recordType, fields);
              const toolResultContent = `${setting_type} setting for record type "${recordType}" created/updated successfully.`;
              toolResults.push({
                type: "tool_result",
                tool_use_id: content.id,
                content: toolResultContent,
              });
            }
            break;
          case "get_setting":
            if (
              toolArgs &&
              typeof toolArgs === "object" &&
              "setting_type" in toolArgs &&
              "recordType" in toolArgs
            ) {
              const { recordType, setting_type } = toolArgs as {
                recordType: string;
                setting_type: string;
              };
              // Call the getSetting function to retrieve the setting
              finalText.push(
                `[Calling tool ${toolName} with args ${JSON.stringify(
                  toolArgs
                )}]`
              );
              const fields = getSetting(setting_type, recordType);
              let toolResultContent: string;
              if (fields) {
                toolResultContent = `Fields for ${setting_type} setting and record type "${recordType}": ${JSON.stringify(
                  fields
                )}`;
              } else {
                toolResultContent = `No settings found for ${setting_type} setting and record type "${recordType}".`;
              }
              toolResults.push({
                type: "tool_result",
                tool_use_id: content.id,
                content: toolResultContent,
              });
            }
            break;
          case "list_settings":
            // Call the listSettings function to retrieve all settings
            finalText.push(`[Calling tool ${toolName}]`);
            const allSettings = listSettings();
            let toolResultContent: string;
            if (allSettings) {
              toolResultContent = `All settings: ${JSON.stringify(
                allSettings
              )}`;
            } else {
              toolResultContent = "No settings found.";
            }
            toolResults.push({
              type: "tool_result",
              tool_use_id: content.id,
              content: toolResultContent,
            });
            break;
            case "get_specification_by_id":
            if (toolArgs && typeof toolArgs === "object" && "specification_id" in toolArgs) {
              const { specification_id } = toolArgs as {
                specification_id: string;
              };
              // Call the getSpecification function to retrieve the specification
              finalText.push(
                `[Calling tool ${toolName} with args ${JSON.stringify(
                  toolArgs
                )}]`
              );
              const specification = getSpecification(specification_id);
              let toolResultContent: string;
              if (specification) {
                toolResultContent = `Specification details for ID "${specification_id}": ${JSON.stringify(
                  specification
                )}`;
              } else {
                toolResultContent = `No specification found for ID "${specification_id}".`;
              }
              toolResults.push({
                type: "tool_result",
                tool_use_id: content.id,
                content: toolResultContent,
              });
            }
            break;
          case "create_specification":
            if (toolArgs && typeof toolArgs === "object" && "data" in toolArgs) {
              const { data } = toolArgs as {
                data: { name: string; description: string; status: string };
              };
              // Call the createSpecification function to create a new specification
              finalText.push(
                `[Calling tool ${toolName} with args ${JSON.stringify(
                  toolArgs
                )}]`
              );
              const newSpecification = createSpecification(data);
              toolResults.push({
                type: "tool_result",
                tool_use_id: content.id,
                content: `Created new specification: ${JSON.stringify(
                  newSpecification
                )}`,
              });
            }
            break;
          default:
            finalText.push(`Unknown tool: ${toolName}`);
            break;
        }
      }
    }
    if (toolUseBlocks.length > 0) {
      // Continue conversation with tool results
      messages.push({
        role: "assistant",
        content: [...thinkingBlocks, ...toolUseBlocks],
      });
      messages.push({
        role: "user",
        content: toolResults.map((result) => ({
          type: "tool_result",
          tool_use_id: result.tool_use_id,
          content: result.content,
        })),
      });

      // Get next response from Claude
      const response = await this.anthropic.beta.messages.create({
        betas: BETA, // Enable beta features
        thinking: {
          type: "enabled",
          budget_tokens: 10000,
        },
        model: LLM_MODEL,
        max_tokens: 1000,
        messages,
      });

      this.processResponse(response, messages, finalText);
    }
  }
  async mainLoop(): Promise<void> {
    try {
      console.log("\nSpec Agent Started!");
      console.log("Type your queries or 'quit' to exit.");

      while (true) {
        const message = await this.prompt("Query: ");
        if (message.toLowerCase() === "quit") {
          break;
        }
        const response = await this.processQuery(message);
        console.log("\x1b[32m%s\x1b[0m", "\n" + response);
      }
    } finally {
      this.rl.close();
    }
  }

  private prompt(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }
}

// Main execution
async function main(): Promise<void> {
  const app = new Agent();
  await app.mainLoop();
}

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n👋 Received SIGINT. Exiting gracefully...");
  process.exit(0);
});

// Run the application
main().catch((error) => {
  console.error("💥 Fatal error:", error);
  process.exit(1);
});
