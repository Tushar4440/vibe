import { Sandbox } from "@e2b/code-interpreter";
import { AgentResult, Message, TextMessage } from "@inngest/agent-kit";

//* Returns a connected Sandbox instance for the given sandboxId.
// Connects to an existing E2B Sandbox environment using its ID
export async function getSandbox(sandboxId: string) {
    const sandbox = await Sandbox.connect(sandboxId);
    return sandbox;
}

//* Extracts and returns the last assistant message content from the agent result.
// Finds the most recent assistant message in the agent's output messages
// and returns its text content (handles both string and array formats)
export async function lastAssistantTextMessageContent(result : AgentResult){
    // Find the index of the last message where role is "assistant"
    const lastAssistantTextMessageIndex = result.output.findLastIndex(
        (message) => message.role === "assistant",
    );
    // Get the message object at that index, cast as TextMessage or undefined
    const message = result.output[lastAssistantTextMessageIndex] as  | TextMessage | undefined;
    // Extract content: if it's a string, return it; if it's an array, join all text items
    return message?.content
        ? typeof message.content === "string"
            ? message.content 
            : message.content.map((c) => c.text).join("")
        : undefined;
}

//* Parses agent output and extracts text content, or returns "Fragment" if not text type
// Takes an array of messages and processes the first message
export const parseAgentOutput = (value: Message[]) => {
  const output = value[0]; // Get the first message
  // If the message type is not "text", return a default "Fragment" string
  if (output.type !== "text") {
    return "Fragment";
  }
  // If content is an array, map and join all text items into a single string
  if (Array.isArray(output.content)) {
    return output.content.map((txt) => txt).join("")
  } else {
    // If content is a string, return it as-is
    return output.content;
  }
  return "Fragment"; // Fallback (unreachable due to early returns)
}