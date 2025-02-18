"use client";
import { DotPending } from "@/components/svg/dot-pending";
import { Button } from "@/components/ui/button";
import { Form, useZodForm } from "@/components/ui/form";
import type { Task } from "@/features/tasks/data/schema";
import { useMutation } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { createTaskAction } from "../task-create.action";

export const DuplicateTaskSchema = z.object({
  id: z.string().min(1, "Title is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string(),
  status: z.string().optional(),
  priority: z.string().optional(),
  label: z.string().optional(),
  userId: z.string(),
});

export type DuplicateTaskType = z.infer<typeof DuplicateTaskSchema>;

export type DataTableDuplicateTaskProps<TData extends Task> = {
  row: Row<TData>;
  className?: string;
};

export function DataTableDuplicateTask<TData extends Task>({
  row,
  className,
}: DataTableDuplicateTaskProps<TData>) {
  const session = useSession();
  const router = useRouter();

  const form = useZodForm({
    schema: DuplicateTaskSchema,
    defaultValues: {
      id: row.original.id,
      title: row.original.title,
      content: row.original.content ?? "",
      status: row.original.status,
      priority: row.original.priority,
      label: row.original.label,
      userId: session.data?.user?.id ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: DuplicateTaskType) => {
      const result = await createTaskAction(values);

      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Task duplicated successfully");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "An error occurred while duplicating the task",
      );
    },
  });

  if (!session.data?.user) {
    toast.error("User not found");
    return null;
  }

  return (
    <Form
      form={form}
      onSubmit={async (v) => {
        await mutation.mutateAsync(v);
      }}
    >
      <Button
        type="submit"
        disabled={mutation.isPending}
        variant={"ghost"}
        size={"sm"}
        className="flex w-full items-center justify-start text-sm"
      >
        {mutation.isPending ? (
          <span className="inline-flex items-end gap-1">
            Duplicating
            <DotPending />
          </span>
        ) : (
          <div className="flex w-full items-center justify-between">
            <span>Duplicate</span>
            <span className="text-xs">⌘d</span>
          </div>
        )}
      </Button>
    </Form>
  );
}
