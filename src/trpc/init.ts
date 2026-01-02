import { auth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import superjson from "superjson";

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

//* Creates TRPC context with a static userId (for demonstration).
// Creates context for TRPC procedures.
// Context is passed to every backend function and contains user authentication info.
export const createTRPCContext = cache(async () => {
  return { auth: await auth()};
});
//* Avoid exporting the entire t-object
//* since it's not very descriptive.
//* For instance, the use of a t variable
//* is common in i18n libraries.
//* Initializes TRPC with superjson transformer.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});

// Middleware that checks if a user is logged in before executing a protected procedure.
// If the user is not authenticated, it throws an error.
const isAuthed = t.middleware(({next,ctx})=>{
  if(!ctx.auth.userId){
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated"
    });
  }
  return next({
    ctx:{
      auth: ctx.auth,
    },
  })
})

//* Base router and procedure helpers
//* Exports TRPC router factory.
export const createTRPCRouter = t.router;
//* Exports TRPC caller factory.
export const createCallerFactory = t.createCallerFactory;
//* Exports base TRPC procedure helper.
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(isAuthed);