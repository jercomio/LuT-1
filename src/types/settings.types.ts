const Themes = {
  light: "light",
  dark: "dark",
  system: "system",
} as const;
export type Theme = (typeof Themes)[keyof typeof Themes];

const taskItemGapSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const taskItemGapSizeValues = ['py-1', 'py-2', 'py-3', 'py-4', 'py-5'] as const;

export const taskItemGap = taskItemGapSizes.reduce((acc, key, idx) => {
  acc[key] = taskItemGapSizeValues[idx];
  return acc;
}, {} as Record<typeof taskItemGapSizes[number], typeof taskItemGapSizeValues[number]>);

export type GlobalSettings = {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updateAt: Date;
  theme: Theme;
  app: {
    name: string;
  }
  tasks: {
    textSize: string;
    gap: string;
    color: string;
  }
};
