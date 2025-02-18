import { type Table } from "@tanstack/react-table";
import { type Task } from "./schema";

export function dataSortedByIdentifier<TData>(table: Table<TData>) {
  
  const sortedRows = table.getRowModel().rows.sort((a, b) => {
    const aIdentifier = (a.original as Task).identifier;
    const bIdentifier = (b.original as Task).identifier;
    return aIdentifier.localeCompare(bIdentifier);
  });

  const sortedData = sortedRows.map(row => row.original);
  return sortedData;
}

export function sortDataByIdentifier(data: Task[]): Task[] {
  return data.sort((a, b) => {
    if (a.identifier < b.identifier) return 1; // a vient après b
    if (a.identifier > b.identifier) return -1; // a vient avant b
    return 0; // a et b sont égaux
  });
}