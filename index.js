import { OpenAI } from "openai";
import { exec } from "node:child_process";

import dotenv from "dotenv";
import { SYSTEM_PROMPT } from "./prompt";
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

const client = new OpenAI({ apiKey });

function getWeatherInfo(cityname) {
  return `${cityname} has 43 Degree C`;
}

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, function (err, stdout, stderr) {
      if (err) return reject(err);
      resolve(`stdout: ${stdout}\nstderr:${stderr}`); // ✅ RESOLVE it here
    });
  });
}

const TOOLS_MAP = {
  getWeatherInfo: getWeatherInfo,
  executeCommand: executeCommand,
};

async function init() {
  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
  ];

  const userQuery = "What is in my package.json";
  messages.push({ role: "user", content: userQuery });

  while (true) {
    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      response_format: { type: "json_object" },
      messages: messages,
    });

    messages.push({
      role: "assistant",
      content: response.choices[0].message.content,
    });
    const parsed_reponse = JSON.parse(response.choices[0].message.content);

    if (parsed_reponse.step && parsed_reponse.step === "think") {
      console.log(`🧠: ${parsed_reponse.content}`);
      continue;
    }

    if (parsed_reponse.step && parsed_reponse.step === "output") {
      console.log(`🤖: ${parsed_reponse.content}`);
      break;
    }

    if (parsed_reponse.step && parsed_reponse.step === "action") {
      const tool = parsed_reponse.tool;
      const input = parsed_reponse.input;

      const value = await TOOLS_MAP[tool](input);
      console.log(`🔨: Tool Call ${tool}: (${input}): ${value}`);

      messages.push({
        role: "assistant",
        content: JSON.stringify({ step: "observe", content: value }),
      });
      continue;
    }
  }
}

init();
