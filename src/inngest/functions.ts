import { openai, createAgent, createTool, createNetwork } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";

import { inngest } from "./client";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { z } from "zod";
import { PROMPT } from "@/prompt";

//! Creates an Inngest function that runs code in a sandbox and returns output and sandbox URL.
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("vibe-nextjs-test-tushar");
      return sandbox.sandboxId;
    });

    //! Initializes a code agent with tools for terminal, file operations, and file reading in the sandbox.
    const codeAgent = createAgent({
      name: "code-agent",
      description: "An expert coding agent",
      system: PROMPT,
      model: openai({ model: "gpt-4o", defaultParameters: { temperature: 0.1 } }),
      tools: [
        //! Tool 1 : Terminal
        //! Tool: Runs terminal commands inside the sandbox and returns output or error.
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };
              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  }
                });
                return result.stdout;
              } catch (e) {
                console.error(
                  `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`,
                );
                return `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
              }
            });
          },
        }),
        //! Tool 2 : createOrUpdateFiles
        // ! Tool: Creates or updates files in the sandbox and updates network state
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or Update files in the Sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              }),
            ),
          }),
          handler: async ({ files }, { step, network }) => {

            const newFiles = step?.run("createOrUpdateFiles", async () => {
              try {
                const updatedFiles = await network.state.data.files || {};
                const sandbox = await getSandbox(sandboxId);
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content)
                  updatedFiles[file.path] = file.content;
                }
                return updatedFiles;
              } catch (error) {
                return "Error: " + error;
              }
            });
            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          }
        }),
        //! Tool 3 :  readFiles
        //! Tool: Reads files from the sandbox and returns their contents.
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (error) {
                return "Error: " + error;
              }
            })
          }
        })
      ],
      // ! Handles agent response, saving summary to network state if present.
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText = await lastAssistantTextMessageContent(result);
          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }
          return result;
        },
      },
    });

    // !Creates a network for the coding agent and routes tasks based on summary state.
    const network = createNetwork({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) {
          return;
        }
        return codeAgent;
      }
    })

    //! result
    const result = await network.run(event.data.value);

    //! Runs the code agent to generate code based on event data value.
    const { output } = await codeAgent.run(
      `Write the following snippet: ${event.data.value}`,
    );

    //! Retrieves the sandbox URL for accessing the running code.
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    })

    //! Returns the generated code output and sandbox URL and files and summary..
    return {
      url : sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary : result.state.data.summary,
    };
  },
);