"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchProjects } from "@/lib/redux/slices/projectSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, FolderKanban, ListTodo } from "lucide-react";
import Link from "next/link";

export default function EmployeeDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((state: RootState) => state.projects);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Dummy stats; you can connect these to your backend task data
  const stats = [
    {
      title: "My Projects",
      value: projects.length,
      icon: FolderKanban,
      color: "text-blue-600",
    },
    {
      title: "Tasks To Do",
      value: 0, // Fetch from backend
      icon: ListTodo,
      color: "text-yellow-600",
    },
    {
      title: "In Progress",
      value: 0,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Completed",
      value: 0,
      icon: CheckCircle2,
      color: "text-green-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">Here's your project overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <Link
                key={project._id}
                href={`/employee/projects/${project._id}`}
                className="block p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
