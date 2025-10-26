"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchProjects } from "@/lib/redux/slices/projectSlice";
import { fetchTasksByProject } from "@/lib/redux/slices/taskSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminAnalyticsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((state: RootState) => state.projects);
  const { tasks } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // For task breakdown (group by status)
  const taskStatusCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    { "To-Do": 0, "In Progress": 0, Done: 0 } as Record<string, number>
  );

  // For project-task count bar chart
  const barData = projects.map((project) => ({
    name: project.name,
    tasks: tasks.filter((task) => task.projectId === project._id).length,
  }));

  const pieData = [
    { name: "To-Do", value: taskStatusCounts["To-Do"] },
    { name: "In Progress", value: taskStatusCounts["In Progress"] },
    { name: "Done", value: taskStatusCounts["Done"] },
  ];

  const colors = ["#94a3b8", "#fbbf24", "#22c55e"];

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Project-wise Task Counts</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tasks" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Task Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                label
                outerRadius={90}
                dataKey="value"
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={colors[idx]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
