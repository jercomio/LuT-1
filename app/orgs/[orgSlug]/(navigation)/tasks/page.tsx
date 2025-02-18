import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import type { Task } from "@/features/tasks/data/schema";
import { columns } from "@/features/tasks/table/columns";
import { TasksStorage } from "@/features/tasks/tasks-storage";
import { combineWithParentMetadata } from "@/lib/metadata";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { getOrgsMembers } from "@/query/org/get-orgs-members";
import type { PageParams } from "@/types/next";
import type { ColumnDef } from "@tanstack/react-table";
import { getTasks } from "./tasks.actions";

export const generateMetadata = combineWithParentMetadata({
  title: "Tasks",
  description: "Tasks manager",
});

export default async function RoutePage(props: PageParams) {
  // const tasks = await getDemoTasks();
  const { org } = await getRequiredCurrentOrgCache(["ADMIN"]);
  const members = await getOrgsMembers(org.id);

  const tasksResult = await getTasks();
  const tasks = Array.isArray(tasksResult) ? tasksResult : [];

  return (
    <Layout size="xl" className="mx-auto my-0">
      <LayoutHeader>
        <LayoutTitle className="font-sans">Lunar Tasks Manager</LayoutTitle>
      </LayoutHeader>
      {/* <LayoutActions className="flex gap-2">
        <Button variant="outline">Delete</Button>
        <Button variant="default">Create</Button>
      </LayoutActions> */}
      <LayoutContent className="flex flex-col gap-4 lg:gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          <TasksStorage
            tasks={tasks}
            columns={columns as ColumnDef<Task>[]}
            members={members.map((m) => ({
              role: m.roles,
              ...m.user,
              id: m.id,
            }))}
          />
          {/* <UsersChart />
          <ClientOrg /> */}
        </div>
        {/* <DonutChart /> */}
      </LayoutContent>
    </Layout>
  );
}
