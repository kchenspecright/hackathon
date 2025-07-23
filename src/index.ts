import Anthropic from "@anthropic-ai/sdk";
import { createInterface, Interface } from "readline";
import dotenv from "dotenv";
import { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { tools } from "./tools"; // Import your tools
import { getSetting, listSettings, setSetting } from "./db";

dotenv.config(); // load environment variables from .env

const LLM_MODEL = "claude-sonnet-4-20250514"; // Default model
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
      model: LLM_MODEL,
      max_tokens: 1000,
      messages,
      tools: tools, // Pass the tools array here
    });

    // Process response and handle tool calls
    const finalText = [];
    //const toolResults = [];

    for (const content of response.content) {
      if (content.type === "text") {
        finalText.push(content.text);
      } else if (content.type === "tool_use") {
        //Execute tool call
        const toolName = content.name;
        const toolArgs = content.input as { [x: string]: unknown } | undefined;
        let toolMessage: string = "";

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
              toolMessage = `${setting_type} setting for record type "${recordType}" created/updated successfully.`;
            }
            break;
          case "get_setting":
            if (
              toolArgs &&
              typeof toolArgs === "object" &&
              "setting_type" in toolArgs &&
              "recordType" in toolArgs
            ) {
              const { recordType, setting_type } = toolArgs as { recordType: string; setting_type: string };
              // Call the getSetting function to retrieve the setting
              finalText.push(
                `[Calling tool ${toolName} with args ${JSON.stringify(
                  toolArgs
                )}]`
              );
              const fields = getSetting(setting_type, recordType);
              if (fields) {
                toolMessage = `Fields for ${setting_type} setting and record type "${recordType}": ${JSON.stringify(
                  fields
                )}`;
              } else {
                toolMessage = `No settings found for ${setting_type} setting and record type "${recordType}".`;
              }
            }
            break;
          case "list_settings":
            // Call the listSettings function to retrieve all settings
            finalText.push(`[Calling tool ${toolName}]`);
            const allSettings = listSettings();
            if (allSettings) {
              toolMessage = `All settings: ${JSON.stringify(allSettings)}`;
            } else {
              toolMessage = "No settings found.";
            }
            break;
          default:
            finalText.push(`Unknown tool: ${toolName}`);
            break;
        }
        if (toolMessage) {
          // Continue conversation with tool results
          messages.push({
            role: "assistant",
            content: [content],
          });
          messages.push({
            role: "user",
            content: [{
              type: "tool_result",
              tool_use_id: content.id, // Use the same ID for tool use
              content: toolMessage
            }]
          });

          // Get next response from Claude
          const response = await this.anthropic.messages.create({
            model: LLM_MODEL,
            max_tokens: 1000,
            messages,
          });

          finalText.push(
            response.content[0].type === "text" ? response.content[0].text : ""
          );
        }
      }
    }

    return finalText.join("\n") + "\n\n";
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
        console.log('\x1b[32m%s\x1b[0m', "\n" + response);
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
