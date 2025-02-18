"use client";
import { type Table } from "@tanstack/react-table";
import React from "react";
import { labels, priorities, statuses } from "../data/data";
import { TasksToolbarPropsFilters } from "./tasks-toolbar-props-filters";

type DataTableFacetedFilterProps = {
  title?: string;
  defaultValue?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
};

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
};

export type ComboBoxProps = {
  value: string | undefined;
  onChange: (value: string) => void;
  defaultValue?: string;
};

type TasksPropertiesComponentsType = {
  status: (
    props: ComboBoxProps,
  ) => React.ReactElement<DataTableFacetedFilterProps & ComboBoxProps>;
  priority: (
    props: ComboBoxProps,
  ) => React.ReactElement<DataTableFacetedFilterProps & ComboBoxProps>;
  label: (
    props: ComboBoxProps,
  ) => React.ReactElement<DataTableFacetedFilterProps & ComboBoxProps>;
};

export const tasksPropertiesComponents: TasksPropertiesComponentsType = {
  status: (props: ComboBoxProps) => {
    const { value, onChange, defaultValue } = props;
    return (
      <TasksToolbarPropsFilters
        title="Status"
        options={statuses}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    );
  },
  priority: (props: ComboBoxProps) => {
    const { value, onChange, defaultValue } = props;
    return (
      <TasksToolbarPropsFilters
        title="Priority"
        options={priorities}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    );
  },
  label: (props: ComboBoxProps) => {
    const { value, onChange, defaultValue } = props;
    return (
      <TasksToolbarPropsFilters
        title="Label"
        options={labels}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    );
  },
};
