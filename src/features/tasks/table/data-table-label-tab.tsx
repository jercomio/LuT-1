import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import loa from "@/lib/loa";
import type { TasksDataFiltered } from "../data/filters";
import DataTableDialog__label from "./data-table-dialog__label";

type DataTableChartProps = {
  table: TasksDataFiltered;
};

export function DataTableLabelTab({ table }: DataTableChartProps) {
  const labelCounter = (label: string): number => {
    let count = 0;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    table.label.filter((task) => {
      if (task.label === label) {
        count += task.count;
      }
    });
    return count;
  };

  return (
    <div className="w-full">
      <Table>
        <TableCaption>Table of label's distribution</TableCaption>
        <TableHeader className="">
          <TableRow>
            <TableHead className="w-1/2 text-start">Label</TableHead>
            <TableHead className="text-center">Number</TableHead>
            <TableHead className="text-center">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.label.map((lbl, idx) => (
            <TableRow key={idx}>
              <TableCell className="py-2 font-medium">
                {loa.capitalize(lbl.label)}
              </TableCell>
              <TableCell className="py-2 text-center font-medium">
                {lbl.count}
              </TableCell>
              <TableCell className="flex items-center justify-center py-2">
                <DataTableDialog__label table={table} label={lbl.label} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
