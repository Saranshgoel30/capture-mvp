
export type CurrentProject = {
  id: string;
  userId: string;
  title: string;
  role: string;
  timeline: string;
  status: "In Production" | "Pre-Production" | "Post-Production";
  description: string;
  createdAt: number;
};
