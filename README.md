# Node.js TypeScript Console App

A simple console application built with Node.js and TypeScript.

## Features

- Interactive command-line interface
- TypeScript for type safety
- Built-in commands: help, time, hello, version, status, echo
- Graceful error handling and process termination

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Build the application:
```bash
npm run build
```

3. Run the application:
```bash
npm start
```

### Development

For development with auto-recompilation:

```bash
npm run dev
```

For watching file changes and auto-building:

```bash
npm run watch
```

## Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled application
- `npm run dev` - Run directly with ts-node (development)
- `npm run watch` - Watch for changes and auto-compile
- `npm run clean` - Remove compiled files

## Commands

Once the application is running, you can use these commands:

- `help` - Show available commands
- `time` - Show current date and time
- `hello` - Say hello
- `version` - Show application version
- `status` - Show application status
- `echo <message>` - Echo a message
- `exit` or `quit` - Exit the application

## Project Structure

```
.
├── src/
│   └── index.ts          # Main application file
├── dist/                 # Compiled JavaScript files
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## License

MIT
