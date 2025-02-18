"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import loa from "@/lib/loa";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { type Column } from "@tanstack/react-table";
import { Check } from "lucide-react";
import React from "react";
import { type ComboBoxProps } from "./tasks-toolbar-props";

type DataTableFacetedFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
};

type TasksToolbarPropsFiltersProps = {
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  value?: string;
  defaultValue?: string;
  onChange: (value: string) => void;
};

export function TasksToolbarPropsFilters<TData, TValues>({
  column,
  title,
  options,
  value,
  defaultValue,
  onChange,
}: DataTableFacetedFilterProps<TData, TValues> & ComboBoxProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [valueSelected, setValueSelected] = React.useState<string>(
    defaultValue ?? "",
  );
  const [propertiesValues, setPropertiesValues] = React.useState<string[]>([]);

  const { data, isSuccess } = useQuery({
    queryKey: ["Property", title],
    queryFn: () => {
      const newTaskProperties: string[] = [];
      if (title === "Status") {
        newTaskProperties.push(valueSelected);
      } else if (title === "Priority") {
        newTaskProperties.push(valueSelected);
      } else if (title === "Label") {
        newTaskProperties.push(valueSelected);
      }
      return newTaskProperties;
    },
    enabled: title === "Status" || title === "Priority" || title === "Label",
  });

  if (isSuccess) {
    console.log(data);
  }

  const selectedOption = options.find(
    (option) => valueSelected === option.value,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          size="sm"
          className="h-8 justify-between border-dashed"
        >
          {valueSelected || defaultValue ? (
            selectedOption?.icon ? (
              <>
                <selectedOption.icon className="size-4" />
                {loa.capitalize(valueSelected || defaultValue)}
              </>
            ) : (
              selectedOption?.label
            )
          ) : (
            title
          )}
          {/* <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" /> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`${title}...`} />
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  defaultValue={option.value}
                  onSelect={(currentValue) => {
                    setValueSelected(
                      currentValue === valueSelected
                        ? option.label
                        : currentValue,
                    );
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  {option.icon && <option.icon className="mr-2 size-4" />}
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto size-4 shrink-0",
                      valueSelected === option.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
