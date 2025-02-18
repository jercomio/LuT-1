"use server";

import { taskSchema } from "@/features/tasks/data/schema";
import { env } from "@/lib/env";
import { headers } from 'next/headers';


// Retrieve one task by identifier
export async function getTaskByIdentifier(identifier: string) {
  try {
    const host = headers().get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const response = await fetch(`${protocol}://${host}/api/tasks/${identifier}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.JWT_SECRET}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      // return { serverError: errorData.error || "Failed to get task" };
      return null;
    }
    
    const data = await response.json();
    const parsedData = taskSchema.safeParse(data);
    return parsedData.success ? parsedData.data : null;
  } catch (error) {
    console.error("Get task error:", error);
    throw error;
  }
}