import { Sandbox } from "@e2b/code-interpreter";
import { AgentResult, TextMessage } from "@inngest/agent-kit";

//* Returns a connected Sandbox instance for the given sandboxId.
export async function getSandbox(sandboxId: string) {
    const sandbox = await Sandbox.connect(sandboxId);
    return sandbox;
}

//* Extracts and returns the last assistant message content from the agent result.
export async function lastAssistantTextMessageContent(result : AgentResult){
    const lastAssistantTextMessageIndex = result.output.findLastIndex(
        (message) => message.role === "assistant",
    );
    const message = result.output[lastAssistantTextMessageIndex] as  | TextMessage | undefined;
    return message?.content
        ? typeof message.content === "string"
            ? message.content 
            : message.content.map((c) => c.text).join("")
        : undefined;
}