import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";

// Backend endpoints for managing projects.
// These procedures handle database operations for projects.

export const projectsRouter = createTRPCRouter({
    // Retrieves a single project by its ID.
    // Only returns the project if it belongs to the logged-in user.
    getOne: protectedProcedure
        .input(z.object({
            id: z.string().min(1, { message: "Id is required" })
        }))
        .query(async ({ input,ctx }) => {
            const existingProject = await prisma.project.findUnique({
                where: {
                    id: input.id,
                    userId: ctx.auth.userId,
                }
            });
            if (!existingProject) {
                throw new TRPCError({
                    code: "NOT_FOUND", message: "Project not found"
                });
            }
            return existingProject;
        }),
    // Fetches all projects for the logged-in user, sorted by most recently updated.
    getMany: protectedProcedure
        .query(async ({ctx}) => {
            const projects = await prisma.project.findMany({
                where:{
                    userId:ctx.auth.userId,
                },
                orderBy: {
                    updatedAt: "desc",
                },
            });
            return projects;
        }),
    // Creates a new project with the user's initial request/prompt.
    // Stores the request as the first message and triggers the AI to generate code.
    create: protectedProcedure
        .input(
            z.object({
                value: z.string()
                    .min(1, { message: "Value is required" })
                    .max(10000, { message: "Value is too long" }),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const createdProject = await prisma.project.create({
                data: {
                    userId: ctx.auth.userId,
                    name: generateSlug(2, {
                        format: "kebab",
                    }),
                    messages: {
                        create: {
                            content: input.value,
                            role: "USER", 
                            type: "RESULT",
                        }
                    }
                }
            })


            await inngest.send({
                name: "code-agent/run",
                data: {
                    value: input.value,
                    projectId: createdProject.id,
                }
            });

            return createdProject;
        })
});