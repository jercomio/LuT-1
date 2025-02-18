"use server";
import { taskSchema } from "@/features/tasks/data/schema";
import { env } from "@/lib/env";
import { promises as fs } from "fs";
import { headers } from "next/headers";
import path from "path";
import { z } from "zod";

// Simulate a database read for tasks.
export async function getDemoTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "/src/features/tasks/data/tasks.json")
  );

  const tasks = JSON.parse(data.toString());

  return z.array(taskSchema).parse(tasks);
}

export async function getTasks() {
  try {
    const host = headers().get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const response = await fetch(`${protocol}://${host}/api/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.JWT_SECRET}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      // return { serverError: errorData.error || "Failed to create task" };
      return null;
    }
    
    const data = await response.json();
    const parsedData = z.array(taskSchema).safeParse(data);
    return parsedData.success ? parsedData.data : null;
  } catch (error) {
    console.error("Create task error:", error);
    throw error;
  }
}