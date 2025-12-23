import { initTRPC } from '@trpc/server';
import { cache } from 'react';
import superjson from "superjson";
//* Creates TRPC context with a static userId (for demonstration).
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: 'user_123' };
});
//* Avoid exporting the entire t-object
//* since it's not very descriptive.
//* For instance, the use of a t variable
//* is common in i18n libraries.
//* Initializes TRPC with superjson transformer.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
//* Base router and procedure helpers
//* Exports TRPC router factory.
export const createTRPCRouter = t.router;
//* Exports TRPC caller factory.
export const createCallerFactory = t.createCallerFactory;
//* Exports base TRPC procedure helper.
export const baseProcedure = t.procedure;