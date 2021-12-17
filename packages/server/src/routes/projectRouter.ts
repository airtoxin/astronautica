import { z } from "zod";
import { prisma } from "../prisma";
import { addDays } from "date-fns";
import { createRouter } from "./helper";

export const projectRouter = createRouter().mutation("init", {
  input: z.object({
    projectName: z.string(),
  }),
  resolve: async (req) => {
    const projectName = req.input.projectName;
    const project = await prisma.project.create({
      data: {
        name: projectName,
        apiKeys: {
          create: [
            {
              status: "ENABLE",
              description: `API Key for ${projectName}`,
              expiresAt: addDays(new Date(), 30),
            },
          ],
        },
      },
      include: {
        apiKeys: true,
      },
    });
    const apiKey = project.apiKeys[0];
    if (apiKey == null) throw new Error(`API Key not created`);

    return apiKey;
  },
});
