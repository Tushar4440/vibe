import { projectsRouter } from '@/modules/projects/server/procedures';
import { createTRPCRouter } from '../init';
import { messagesRouter } from '@/modules/messages/server/procedures';
import { usageRouter } from '@/modules/usage/server/procedures';
//! Defines the main TRPC router with invoke and createAi endpoints.
export const appRouter = createTRPCRouter({
  usage : usageRouter,
  projects: projectsRouter,
  messages: messagesRouter,
});
//! export type definition of API
export type AppRouter = typeof appRouter;