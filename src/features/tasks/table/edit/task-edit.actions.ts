"use server";
import { orgAction } from "@/lib/actions/safe-actions";
import { env } from "@/lib/env";
import { headers } from "next/headers";
import { z } from "zod";

const UpdateTaskSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  label: z.string().optional(),
  dueOfDate: z.coerce.date().optional(),
  userId: z.string(),
});

// type CreateTaskType = z.infer<typeof CreateTaskSchema>;

export const editTaskAction = orgAction
  .schema(UpdateTaskSchema)
  .metadata({
    roles: ["OWNER", "ADMIN"]
  })
  .action(async ({ parsedInput }) => {
    try {
      const host = headers().get("host");
      const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

      const response = await fetch(`${protocol}://${host}/api/tasks`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.JWT_SECRET}`,
        },
        body: JSON.stringify(parsedInput),
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { serverError: errorData.error || "Failed to update task" };
      }
      
      const data = await response.json();
      const parsedData = UpdateTaskSchema.safeParse(data);
      
      return {
        success: true,
        parsedData
      };
    } catch (error) {
      console.error("Update task error:", error);
      throw error;
    }
  });