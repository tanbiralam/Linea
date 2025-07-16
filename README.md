# Linea AI 🚀

An intelligent code generation assistant powered by OpenAI's GPT-4, specifically designed for Windows environments. Linea AI helps developers automate code creation, file management, and command execution through natural language interactions.

> 🌱 **Project Status**: This is the foundational version of Linea AI, a basic yet powerful AI assistant for building applications. We're actively working on a modernized version inspired by advanced AI coding assistants like Lovable and Bolt AI, which will include enhanced features, better UI/UX, and more sophisticated code generation capabilities.

## 🌟 Features

- **Intelligent Code Generation**: Leverages GPT-4 to understand and generate code based on natural language descriptions
- **Windows-Optimized**: Built specifically for Windows environments with proper command translations
- **File Management**: Automated file creation and management capabilities
- **Interactive Reasoning**: Shows thought process and reasoning behind each action
- **JSON-Based Communication**: Structured communication format for reliable interactions

## 🎯 Upcoming Features

- Modern web-based UI for better interaction
- Real-time code suggestions and completions
- Multi-file project management
- Enhanced error handling and debugging assistance
- Integration with popular IDEs
- Support for multiple AI models
- Collaborative coding features

## 🛠️ Tech Stack

- Node.js
- OpenAI API (GPT-4)
- dotenv (Environment management)
- Native Windows command execution

## 📋 Prerequisites

- Node.js (v14 or higher)
- Windows OS
- OpenAI API key

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone <your-repo-url>
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_api_key_here
```

4. Run the application:

```bash
node index.js
```

## 💡 How It Works

Linea AI operates in a 5-step process:

1. **START**: Receives user query
2. **THINK**: Analyzes the request and plans actions
3. **ACTION**: Executes necessary commands or file operations
4. **OBSERVE**: Processes the results
5. **OUTPUT**: Provides final response or continues the loop

## 🔒 Security Notes

- Requires API key configuration through environment variables
- Executes system commands - use with appropriate permissions
- Implements basic input validation for file operations

## ⚠️ Disclaimer

This tool executes system commands and modifies files. Please review any generated code or commands before execution in a production environment.

## 🔄 Version History

- **v1.0.0** (Current): Basic AI assistant with command execution and file management using CLI

---

> 💡 **Note**: While the current version provides core functionality for AI-assisted development.
