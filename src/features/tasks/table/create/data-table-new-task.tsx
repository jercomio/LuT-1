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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "@/components/ui/loader-circle";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Table } from "@tanstack/react-table";
import { ListPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { type Task } from "../../data/schema";
import { tasksPropertiesComponents } from "../../tasks-toolbar/tasks-properties-components";
import { CreateTaskButtonStyle, type CreateTaskButton } from "../../types";
import { createTaskAction } from "./task-create.action";

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string(),
  status: z.string().optional(),
  priority: z.string().optional(),
  label: z.string().optional(),
  userId: z.string(),
});

export type CreateTaskType = z.infer<typeof CreateTaskSchema>;

export type DataTableTaskCreateProps<TData> = {
  table: Table<TData> | Task[];
  type?: CreateTaskButton;
  status?: string;
  className?: string;
};

export function DataTableCreateTask<TData>({
  table,
  type,
  status,
  className,
}: DataTableTaskCreateProps<TData>) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>("");
  const [content, setContent] = React.useState<string>("");

  const session = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useZodForm({
    schema: CreateTaskSchema,
    defaultValues: {
      title: "",
      content: "",
      status: status ?? "",
      userId: session.data?.user?.id ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: CreateTaskType) => {
      const result = await createTaskAction(values);

      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }
    },
    onSuccess: async () => {
      toast.success("Task created successfully");
      form.reset();
      setOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      router.refresh();
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast.error(error.message || "An error occurred while creating the task");
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
          variant={type === "icon" || type === "simple" ? "outline" : "ghost"}
          size={"sm"}
          className={cn(
            type === "icon"
              ? cn("flex justify-between bg-orange-500 mr-2", className)
              : cn("flex w-full items-center justify-start text-sm", className),
          )}
        >
          {type === "icon" ? (
            <CreateTaskButtonStyle.icon className={cn("size-auto")} />
          ) : type === "simple" ? (
            <CreateTaskButtonStyle.simple className={cn("size-auto")} />
          ) : (
            <div className="flex w-full items-center justify-between">
              <span>Create</span>
              <span className="text-xs">⌘e</span>
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ListPlus className="size-5" />
            Create a new task
          </DialogTitle>
          <DialogDescription>To create a new task</DialogDescription>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={async (v) => {
            await mutation.mutateAsync(v);
          }}
        >
          <div className="flex w-full flex-col gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter title..."
                      {...field}
                      value={field.value || ""}
                      // onChange={(e) => setTitle(e.target.value)}
                      onChange={(e) => {
                        field.onChange(e);
                        // form.setValue("title", e.target.value);
                        setTitle(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description..."
                      {...field}
                      value={field.value}
                      // onChange={(e) => setContent(e.target.value)}
                      onChange={(e) => {
                        field.onChange(e);
                        // form.setValue("content", e.target.value);
                        setContent(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* // Combobox */}
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Status</FormLabel> */}
                    <FormControl>
                      <tasksPropertiesComponents.status
                        value={field.value}
                        defaultValue={status}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Priority</FormLabel> */}
                    <FormControl>
                      <tasksPropertiesComponents.priority
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Label</FormLabel> */}
                    <FormControl>
                      <tasksPropertiesComponents.label
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
              disabled={mutation.isPending}
              className="w-24"
            >
              {mutation.isPending ? <LoaderCircle /> : "Create"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
