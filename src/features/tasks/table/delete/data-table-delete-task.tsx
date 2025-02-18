"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, useZodForm } from "@/components/ui/form";
import { LoaderCircle } from "@/components/ui/loader-circle";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { CircleDot, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import { z } from "zod";
import { type Task } from "../../data/schema";
import { itemStyle, priorityWithIcon, statusWithIcon } from "../../utils";
import { deleteTaskAction } from "./task-delete.action";

export const DeleteTaskSchema = z.object({
  id: z.string().min(1, { message: "Task ID is required" }),
  title: z.string().optional(),
  userId: z.string(),
});

export type DeleteTaskType = z.infer<typeof DeleteTaskSchema>;

export type DataTableDeleteTaskProps = {
  task: Task;
  className?: string;
};

export function DataTableDeleteTask({
  task,
  className,
}: DataTableDeleteTaskProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>("");
  const [dot, setDot, removeDot] = useLocalStorage("dotColor", true);

  const dotColor = itemStyle(task.priority);

  const session = useSession();
  const router = useRouter();

  const form = useZodForm({
    schema: DeleteTaskSchema,
    defaultValues: {
      id: task.id,
      title: task.identifier,
      userId: session.data?.user?.id ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: DeleteTaskType) => {
      const result = await deleteTaskAction(values);

      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }
    },
    onSuccess: () => {
      toast.success("Task deleted successfully");
      form.reset();
      setOpen(false);
      router.refresh();
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast.error(error.message || "An error occurred while deleting the task");
    },
  });

  if (!session.data?.user) {
    toast.error("User not found");
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size={"sm"}
          className="flex w-full items-center justify-start text-sm"
        >
          <div className="flex w-full items-center justify-between">
            <span>Delete</span>
            <span className="text-xs">⌘⌫</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="size-5 text-zinc-300" />
            <span>Delete task</span>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={async (v) => {
            await mutation.mutateAsync(v);
          }}
        >
          <div className="flex w-full flex-col gap-4">
            <div className="font-semibold">
              Are you sure to delete this task ?
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-muted p-4">
              <div className="flex items-center space-x-2">
                <span>
                  {dot && <CircleDot className={cn(dotColor, "size-4")} />}
                </span>
                <span>{task.identifier}</span>
                <span className="text-zinc-500">{statusWithIcon([task])}</span>
                <span className="text-zinc-500">
                  {priorityWithIcon([task])}
                </span>
              </div>
              <div className="text-zinc-500">
                {task.content && task.content.length > 50
                  ? `${task.content.slice(0, 50)}...`
                  : task.content}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-10 sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant={"destructive"}
              disabled={mutation.isPending}
              className="w-24"
            >
              {mutation.isPending ? <LoaderCircle /> : "Delete"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
