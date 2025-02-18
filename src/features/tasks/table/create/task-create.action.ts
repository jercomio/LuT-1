"use server";
import { orgAction } from "@/lib/actions/safe-actions";
import { env } from "@/lib/env";
import { headers } from "next/headers";
import { z } from "zod";

const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string(),
  status: z.string().optional(),
  priority: z.string().optional(),
  label: z.string().optional(),
  userId: z.string(),
});

// type CreateTaskType = z.infer<typeof CreateTaskSchema>;

export const createTaskAction = orgAction
  .schema(CreateTaskSchema)
  .metadata({
    roles: ["OWNER", "ADMIN"]
  })
  .action(async ({ parsedInput }) => {
    try {
      const host = headers().get("host");
      const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

      const response = await fetch(`${protocol}://${host}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.JWT_SECRET}`,
        },
        body: JSON.stringify(parsedInput),
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { serverError: errorData.error || "Failed to create task" };
      }
      
      const data = await response.json();
      const parsedData = CreateTaskSchema.safeParse(data);
      return {
        success: true,
        parsedData
      };
    } catch (error) {
      console.error("Create task error:", error);
      throw error;
    }
  });