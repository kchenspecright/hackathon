import Anthropic from '@anthropic-ai/sdk';
import { createInterface, Interface } from 'readline';
import dotenv from "dotenv";
import { MessageParam } from '@anthropic-ai/sdk/resources/messages';
dotenv.config(); // load environment variables from .env

const LLM_MODEL = "claude-sonnet-4-20250514"; // Default model
class Agent {
  private rl: Interface;
  private anthropic: Anthropic;
  constructor() {
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
     this.anthropic = new Anthropic({
      apiKey:  process.env.ANTHROPIC_API_KEY,
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
    const response = await this.anthropic.messages.create({
      model: LLM_MODEL,
      max_tokens: 1000,
      messages,
    //   tools: this.tools,
    });

    // Process response and handle tool calls
    const finalText = [];
    const toolResults = [];

    for (const content of response.content) {
      if (content.type === "text") {
        finalText.push(content.text);
      } else if (content.type === "tool_use") {
        // Execute tool call
        // const toolName = content.name;
        // const toolArgs = content.input as { [x: string]: unknown } | undefined;

        // const result = await this.mcp.callTool({
        //   name: toolName,
        //   arguments: toolArgs,
        // });
        // toolResults.push(result);
        // finalText.push(
        //   `[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`,
        // );

        // // Continue conversation with tool results
        // messages.push({
        //   role: "user",
        //   content: result.content as string,
        // });

        // // Get next response from Claude
        // const response = await this.anthropic.messages.create({
        //   model: "claude-3-5-sonnet-20241022",
        //   max_tokens: 1000,
        //   messages,
        // });

        // finalText.push(
        //   response.content[0].type === "text" ? response.content[0].text : "",
        // );
      }
    }

    return finalText.join("\n");
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
        console.log("\n" + response);
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
process.on('SIGINT', () => {
  console.log('\n👋 Received SIGINT. Exiting gracefully...');
  process.exit(0);
});

// Run the application
main().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
