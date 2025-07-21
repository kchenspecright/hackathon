import { createInterface, Interface } from 'readline';

class ConsoleApp {
  private rl: Interface;

  constructor() {
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async start(): Promise<void> {
    console.log('🚀 Welcome to the Node.js TypeScript Console App!');
    console.log('Type "help" for available commands or "exit" to quit.\n');

    await this.mainLoop();
  }

  private async mainLoop(): Promise<void> {
    while (true) {
      try {
        const input = await this.prompt('> ');
        const command = input.trim().toLowerCase();

        if (command === 'exit' || command === 'quit') {
          console.log('👋 Goodbye!');
          break;
        }

        await this.handleCommand(command, input.trim());
      } catch (error) {
        console.error('❌ An error occurred:', error);
      }
    }

    this.rl.close();
  }

  private async handleCommand(command: string, fullInput: string): Promise<void> {
    switch (command) {
      case 'help':
        this.showHelp();
        break;
      
      case 'time':
        console.log(`⏰ Current time: ${new Date().toLocaleString()}`);
        break;
      
      case 'hello':
        console.log('👋 Hello there! How can I help you today?');
        break;
      
      case 'version':
        console.log('📦 App version: 1.0.0');
        break;
      
      case 'status':
        console.log('✅ Application is running smoothly!');
        break;
      
      default:
        if (command.startsWith('echo ')) {
          const message = fullInput.slice(5);
          console.log(`📢 ${message}`);
        } else if (command === '') {
          // Empty command, do nothing
        } else {
          console.log(`❓ Unknown command: "${command}". Type "help" for available commands.`);
        }
        break;
    }
  }

  private showHelp(): void {
    console.log(`
📖 Available Commands:
  help     - Show this help message
  time     - Show current date and time
  hello    - Say hello
  version  - Show application version
  status   - Show application status
  echo     - Echo a message (usage: echo <message>)
  exit     - Exit the application
  quit     - Exit the application
`);
  }

  private prompt(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }
}

// Main execution
async function main(): Promise<void> {
  const app = new ConsoleApp();
  await app.start();
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
