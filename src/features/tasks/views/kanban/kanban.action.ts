"use server";

import { prisma } from "@/lib/prisma";
import type { Task } from "../../data/schema";

export const updateStatus = async (task: Task) => {
  console.log("updateStatus", `ok => ${task.identifier}`);
  await prisma.task.update({
    where: { id: task.id },
    data: { status: "canceled" },
  });
};
