import { TaskContentEdit } from "@/features/tasks/task-content";
import { auth } from "@/lib/auth/helper";
import { redirect } from "next/navigation";
import { getTaskByIdentifier } from "./task.actions";

type TaskParamsProps = {
  params: { orgSlug: string; taskIdentifier: string; slug: string };
};

export default async function TaskPage({ params }: TaskParamsProps) {
  const user = await auth();

  if (!user) {
    redirect("/auth/signin");
  }

  const task = await getTaskByIdentifier(params.taskIdentifier);

  if (!task) {
    return <div>Task not found</div>;
  }

  return <TaskContentEdit task={task} params={params} />;
}
