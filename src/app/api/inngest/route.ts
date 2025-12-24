import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { codeAgentFunction } from "@/inngest/functions";

//* Create an API that serves zero functions
//* Sets up API routes for Inngest functions (GET, POST, PUT) using the helloWorld function.
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    //* your functions will be passed here later! */
    codeAgentFunction, 
  ],
});