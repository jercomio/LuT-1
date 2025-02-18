"use client";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChartPie, LayoutGrid, Table, Tags } from "lucide-react";
import React from "react";
import type { TasksDataFiltered } from "../data/filters";
import DataTableCardSmall from "./data-table-card-sm";
import { DataTableChartLabel } from "./data-table-chart-label";
import { DataTableLabelTab } from "./data-table-label-tab";

type DataTableChartProps = {
  table: TasksDataFiltered;
};

export function DataTableLabelCard({ table }: DataTableChartProps) {
  const [isChart, setIsChart] = React.useState<boolean>(false);
  const [isBoard, setIsBoard] = React.useState<boolean>(true);
  const [isTable, setIsTable] = React.useState<boolean>(false);

  return (
    <div className="rounded-lg border border-solid border-zinc-100/15 bg-zinc-950 p-2">
      <div className="mb-2 flex justify-between">
        <div className="flex items-center gap-2">
          <Tags className="ml-2 size-4" />
          <span className="text-xs">Label</span>
        </div>
        <div>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant={"outline"} size={"xs"}>
                view
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="flex size-fit flex-col gap-0">
              <div className="pb-4">
                <p className="text-sm">Layout</p>
              </div>
              <div className="flex size-fit items-center justify-center gap-2">
                <Button
                  variant={"outline"}
                  className={cn("w-fit h-fit", isChart ? "bg-accent" : "")}
                  onClick={() => {
                    setIsChart(!isChart);
                    setIsBoard(false);
                    setIsTable(false);
                  }}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ChartPie className="size-4" />
                    <span className="text-xs">Chart</span>
                  </div>
                </Button>
                <Button
                  variant={"outline"}
                  className={cn("w-fit h-fit", isBoard ? "bg-accent" : "")}
                  onClick={() => {
                    setIsBoard(!isBoard);
                    setIsChart(false);
                    setIsTable(false);
                  }}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <LayoutGrid className="size-4" />
                    <span className="text-xs">Board</span>
                  </div>
                </Button>
                <Button
                  variant={"outline"}
                  className={cn("w-fit h-fit", isTable ? "bg-accent" : "")}
                  onClick={() => {
                    setIsTable(!isTable);
                    setIsChart(false);
                    setIsBoard(false);
                  }}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Table className="size-4" />
                    <span className="text-xs">Table</span>
                  </div>
                </Button>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
      <Separator />
      <div
        className={cn(
          isChart
            ? "h-auto mt-2"
            : "my-6 flex h-[291px] flex-col items-center justify-center gap-4 overflow-y-auto",
        )}
      >
        {isChart ? <DataTableChartLabel table={table.label} /> : null}
        {isBoard ? (
          <div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-2">
            {/* <DataTableCardSmall table={table} label={"bug"} />
            <DataTableCardSmall table={table} label={"feature"} />
            <DataTableCardSmall table={table} label={"documentation"} />
            <DataTableCardSmall table={table} label={"update"} /> */}
            {table.label.map((label) => (
              <DataTableCardSmall
                key={label.label}
                table={table}
                label={label.label}
                className="w-full"
              />
            ))}
          </div>
        ) : null}
        {isTable ? <DataTableLabelTab table={table} /> : null}
      </div>
    </div>
  );
}
