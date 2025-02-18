"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Calendar,
  ClockAlert,
  LayoutDashboard,
  Logs,
  SquareKanban,
} from "lucide-react";
import React from "react";
import type { Task } from "../data/schema";
import { DataTable } from "../table/data-table";
import { DashboardLayout } from "../table/data-table-dashboard";
import { DataViewKanban } from "../views/kanban/data-view-kanban";
import { DataViewToday } from "../views/today/data-view-today";

type Props = {
  data: Task[];
  columns: ColumnDef<Task>[];
  members: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  }[];
};

type Tabs = {
  id: string;
  label: string | React.ReactNode;
  content: string | React.ReactNode;
};

export const TasksNavigation = ({ data, columns, members }: Props) => {
  const tabs: Tabs[] = [
    {
      id: "dashboard",
      label: (
        <div className="flex items-center space-x-2">
          <LayoutDashboard className="size-4" />
          <span>Dashboard</span>
        </div>
      ),
      content: <DashboardLayout columns={columns} data={data} />,
    },
    {
      id: "today",
      label: (
        <div className="flex items-center space-x-2">
          <Calendar className="size-4" />
          <span>Today</span>
        </div>
      ),
      content: <DataViewToday data={data} members={members} />,
    },
    {
      id: "kanban",
      label: (
        <div className="flex items-center space-x-2">
          <SquareKanban className="size-4" />
          <span>Kanban</span>
        </div>
      ),
      content: <DataViewKanban data={data} members={members} />,
    },
    {
      id: "urgent",
      label: (
        <div className="flex items-center space-x-2">
          <ClockAlert className="size-4" />
          <span>Urgent</span>
        </div>
      ),
      content: (
        <DataTable
          columns={columns}
          data={data.filter((d) => d.priority === "urgent")}
          //   className={cn("text-red-500 stroke-red-500")}
        />
      ),
    },
    {
      id: "tasks",
      label: (
        <div className="flex items-center space-x-2">
          <Logs className="size-4" />
          <span>Table</span>
        </div>
      ),
      content: <DataTable columns={columns} data={data} />,
    },
  ];

  return (
    <div className="flex w-full flex-col bg-transparent">
      <Tabs
        aria-label="Dynamic tabs"
        items={tabs}
        variant="solid"
        radius="sm"
        size="sm"
        classNames={{
          tabList:
            "animate-gradient bg-gradient-to-r from-orange-700 via-orange-500 to-orange-700 bg-[length:var(--bg-size)_100%] rounded-lg",
          cursor: "group-data-[selected=true]:bg-zinc-900 rounded-lg",
          tab: "text-sm",
          tabContent: "group-data-[selected=true]:text-zinc-100 text-zinc-200",
        }}
      >
        {(item) => (
          <Tab key={item.id} title={item.label}>
            {/* @todo: transform h-[800px] by dynamic value */}
            <Card className="overflow-hidden bg-transparent">
              <CardBody className="rounded-lg border-none">
                <ScrollArea className="w-full whitespace-nowrap">
                  {item.content}
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardBody>
            </Card>
          </Tab>
        )}
      </Tabs>
    </div>
  );
};
