"use client";

import { Badge } from "@/components/ui/badge";
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
import { slugify } from "@/lib/utils";
import type { Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, SquareCheckBig } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import type { Task } from "../../data/schema";
import { TaskContentEditor } from "../../task-content/task-content-editor";
import { labelWithIcon, priorityWithIcon, statusWithIcon } from "../../utils";

type TaskViewProps = {
  row: Row<Task>;
};

export function TaskView({ row }: TaskViewProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const session = useSession();
  const router = useRouter();
  const params = useParams<{ orgSlug: string }>();

  if (!session.data?.user) {
    toast.error("User not found");
    return null;
  }

  const handleClick = ({
    identifier,
    title,
  }: {
    identifier: string;
    title: string;
  }) => {
    const slugifiedTitle = slugify(title);
    return router.push(
      `/orgs/${params.orgSlug}/tasks/${identifier.toLowerCase()}/${slugifiedTitle}`,
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"sm"}>
          <Eye className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[96vw] max-w-fit rounded-lg lg:min-w-[680px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SquareCheckBig className="size-5" />
            {row.original.identifier}
          </DialogTitle>
          <DialogDescription>To update this task</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <h3>{row.original.title}</h3>
          <TaskContentEditor
            disabled={true}
            value={row.original.content ?? ""}
          />
          <div className="flex items-center gap-2">
            <Badge
              variant={"outline"}
              className="text-xs font-light text-zinc-400"
            >
              {statusWithIcon([row.original], "size-3")}
            </Badge>
            <Badge
              variant={"outline"}
              className="text-xs font-light text-zinc-400"
            >
              {priorityWithIcon([row.original], "size-3")}
            </Badge>
            <Badge
              variant={"outline"}
              className="text-xs font-light text-zinc-400"
            >
              {labelWithIcon([row.original], "size-3")}
            </Badge>
            <Badge
              variant={"outline"}
              className="text-xs font-light text-zinc-400"
            >
              {row.original.dueOfDate
                ? format(new Date(row.original.dueOfDate), "PPP")
                : undefined}
            </Badge>
          </div>
        </div>

        <DialogFooter className="mt-10 sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setOpen(false);
              }}
            >
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="w-24"
            onClick={() =>
              handleClick({
                identifier: row.original.identifier,
                title: row.original.title,
              })
            }
          >
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
