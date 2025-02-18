"use server";
import { orgAction } from "@/lib/actions/safe-actions";
import { env } from "@/lib/env";
import { headers } from "next/headers";
import { z } from "zod";

const DeleteTaskSchema = z.object({
  id: z.string().min(1, { message: "Task ID is required" }),
  title: z.string().optional(),
  userId: z.string(),
});

export const deleteTaskAction = orgAction
  .schema(DeleteTaskSchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      const host = headers().get("host");
      const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
      
      const response = await fetch(`${protocol}://${host}/api/tasks`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.JWT_SECRET}`,
        },
        body: JSON.stringify(parsedInput),
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { serverError: errorData.error || "Failed to delete task" };
      }
      const data = await response.json();
      const parsedData = DeleteTaskSchema.safeParse(data);
      
      return { 
        success: true,
        parsedData 
      };
    } catch (error) {
      console.error("Delete task error:", error);
      throw error;
    }
  });

  // Detete many tasks
  const DeleteManyTasksSchema = z.array(z.object({
    id: z.string().min(1, { message: "Task ID is required" }),
    title: z.string().optional(),
    userId: z.string(),
  }));
  
  export const deleteManyTasksAction = orgAction
    .schema(DeleteManyTasksSchema)
    .metadata({
      roles: ["OWNER", "ADMIN"],
    })
    .action(async ({ parsedInput }) => {
      try {
        const host = headers().get("host");
        const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
        
        const response = await fetch(`${protocol}://${host}/api/tasks`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.JWT_SECRET}`,
          },
          body: JSON.stringify(parsedInput),
          cache: "no-store",
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          return { serverError: errorData.error || "Failed to delete tasks" };
        }
        // const data = await response.json();
        // const parsedData = DeleteManyTasksSchema.safeParse(data);
        
        // return { 
        //   success: true,
        //   parsedData 
        // };

        // Retourner un objet simple au lieu du résultat complet
        return { success: true };
      } catch (error) {
        console.error("Delete tasks error:", error);
        // throw error;
        return { serverError: "An error occurred while deleting tasks" };
      }
    });