import { OpenAI } from "openai";
import { exec } from "node:child_process";
import fs from "fs/promises";

import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

const client = new OpenAI({ apiKey });

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, function (err, stdout, stderr) {
      if (err) return reject(err);
      resolve(`stdout: ${stdout}\nstderr:${stderr}`);
    });
  });
}

async function writeFile(input) {
  if (!input || !input.filename || typeof input.content !== "string") {
    throw new Error(
      "Invalid input: must contain 'filename' and 'content' (as string)"
    );
  }

  await fs.writeFile(input.filename, input.content);
  return `✅ File ${input.filename} created successfully.`;
}

const TOOLS_MAP = {
  executeCommand: executeCommand,
  writeFile: writeFile,
};

const SYSTEM_PROMPT = `
    You are an helpful AI Assistant who is designed to resolve user query. 
    You work on START, THINK, ACTION, OBSERVE and OUTPUT Mode.

    In the START phase, user gives a query to you.
    Then, you THINK how to resolve that query atleast 3-4 times and make sure that all is clear.
    If there is a need to call a tool, you call an ACTION event with tool and input parameters.
    If there is an action call, wait for the OBSERVE that is out of the tool.
    Based on the OBSERVE from prev step, you either OUTPUT or repeat the loop. 

    Rules: 
    - Always wait for next step.
    - Always output a single step and wait for the next step.
    - Output must be strictly JSON.
    - Only call tool action from Available tools only.
    - Strictly follow the output format in JSON.
    - For writeFile tool, input must be a JSON object with filename and content properties.

    Available Tools:
    - executeCommand(command: string): string — Executes a given Windows shell command (CMD/PowerShell) on user's device and returns the STDOUT & STDERR
    - writeFile({ filename: string, content: string }): string — Writes given content to the specified filename
      * Input format: {"filename": "path/to/file.ext", "content": "file content here"}
      * Example: {"filename": "todo_app/index.html", "content": "<!DOCTYPE html>..."}

    NOTE:
    - You are running on a Windows system.
    - DO NOT use Linux commands like 'cat', 'ls', 'grep', etc.
    - Use Windows CMD equivalents like:
    - 'type package.json' instead of 'cat package.json'
    - 'dir' instead of 'ls'
    - 'findstr' instead of 'grep'

    Example:
    START: What is weather of Kolkata?
    THINK: The user is asking for the weather of Kolkata.
    THINK: From the available tools, I must call getWeatherInfo tool for Kolkata as input.
    ACTION: Call Tool getWeatherInfo(Kolkata)
    OBSERVE: 32 Degree C
    THINK: The Output of getWeatherInfo for Kolkata is 32 Degree C
    OUTPUT: Hey, the weather of Kolkata is 32 Degree C which is quiet hot

    Tool Call Examples:
    For executeCommand: {"step": "action", "tool": "executeCommand", "input": "mkdir new_folder"}
    For writeFile: {"step": "action", "tool": "writeFile", "input": {"filename": "app.js", "content": "console.log('Hello World');"}}

    Output Format: 
    {"step": "string", "tool": "string", "input": "string or object", "content": "string"}
`;

async function init() {
  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
  ];

  const userQuery =
    "Create a Simple TODO App using HTML, CSS and JS inside todo_app folder.";
  messages.push({ role: "user", content: userQuery });

  while (true) {
    const response = await client.chat.completions.create({
      model: "gpt-4o", // Note: Changed from "gpt-4.1" to "gpt-4o" (valid model)
      response_format: { type: "json_object" },
      messages: messages,
    });

    messages.push({
      role: "assistant",
      content: response.choices[0].message.content,
    });

    const parsed_response = JSON.parse(response.choices[0].message.content);

    if (parsed_response.step && parsed_response.step === "think") {
      console.log(`🧠: ${parsed_response.content}`);
      continue;
    }

    if (parsed_response.step && parsed_response.step === "output") {
      console.log(`🤖: ${parsed_response.content}`);
      break;
    }

    if (parsed_response.step && parsed_response.step === "action") {
      const tool = parsed_response.tool;
      const input = parsed_response.input;

      try {
        const value = await TOOLS_MAP[tool](input);
        console.log(
          `🔨: Tool Call ${tool}: ${JSON.stringify(input)}: ${value}`
        );

        messages.push({
          role: "assistant",
          content: JSON.stringify({ step: "observe", content: value }),
        });
      } catch (error) {
        console.error(`❌: Tool Call ${tool} failed: ${error.message}`);
        messages.push({
          role: "assistant",
          content: JSON.stringify({
            step: "observe",
            content: `Error: ${error.message}`,
          }),
        });
      }
      continue;
    }
  }
}

init();
