"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchProjects } from "@/lib/redux/slices/projectSlice";
import { fetchTasksByProject } from "@/lib/redux/slices/taskSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function EmployeeTasksPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((state: RootState) => state.projects);
  const { tasks, isLoading } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (projects.length > 0) {
      // fetch tasks for each project only once
      projects.forEach((project) => {
        if (project._id) {
          dispatch(fetchTasksByProject(project._id));
        }
      });
    }
  }, [projects.length, dispatch]);

  // Filter tasks to those assigned to this employee
  const myTasks = tasks.filter((task) => {
    if (!user) return false; // no user logged in
    if (!task.assignee) return false; // task has no assignee
    return (
      task.assignee === user._id ||
      (typeof task.assignee === "object" && task.assignee?._id === user._id)
    );
  });

  // Status badge styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "To-Do":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Tasks</h1>

      {!user ? (
        <div className="text-red-500">You must be logged in to view tasks.</div>
      ) : isLoading ? (
        <div>Loading tasks...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myTasks.length === 0 && (
            <div className="col-span-full text-muted-foreground text-center">
              No tasks assigned to you!
            </div>
          )}

          {myTasks.map((task) => (
            <Card key={task._id}>
              <CardHeader>
                <CardTitle className="text-base">{task.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {task.description && (
                  <p className="text-sm text-muted-foreground">
                    {task.description}
                  </p>
                )}

                <Badge className={getStatusColor(task.status)}>
                  {task.status}
                </Badge>

                {task.deadline && (
                  <div className="text-xs text-muted-foreground">
                    Due: {format(new Date(task.deadline), "MMM dd, yyyy")}
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Priority: {task.priority || "N/A"}
                </div>

                {task.projectId &&
                  typeof task.projectId === "object" &&
                  "name" in task.projectId && (
                    <div className="text-xs text-muted-foreground">
                      Project: {(task.projectId as { name: string }).name}
                    </div>
                  )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
