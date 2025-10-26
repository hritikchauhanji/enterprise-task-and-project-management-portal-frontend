"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  fetchProjects,
  setCurrentProject,
} from "@/lib/redux/slices/projectSlice";
import {
  fetchTasksByProject,
  createTask,
  updateTask,
  deleteTask,
} from "@/lib/redux/slices/taskSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function EmployeeProjectDetailPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { projects, currentProject } = useSelector(
    (state: RootState) => state.projects
  );
  const { tasks, isLoading } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "To-Do",
    deadline: "",
  });

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchTasksByProject(projectId));
      const foundProject = projects.find((p) => p._id === projectId);
      if (foundProject) {
        dispatch(setCurrentProject(foundProject));
      }
    }
  }, [projectId, projects, dispatch]);

  // Populate the form with task details for editing
  useEffect(() => {
    if (editTaskId) {
      const task = tasks.find((t) => t._id === editTaskId);
      if (task) {
        setTaskForm({
          title: task.title,
          description: task.description || "",
          priority: task.priority,
          status: task.status,
          deadline: task.deadline?.slice(0, 10) || "",
        });
        setShowTaskForm(true);
      }
    }
  }, [editTaskId, tasks]);

  // Handle adding/updating a task
  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      ...taskForm,
      assignee: user?._id,
      projectId,
    };
    if (editTaskId) {
      await dispatch(updateTask({ id: editTaskId, taskData: body }));
      setEditTaskId(null);
    } else {
      await dispatch(createTask(body));
    }
    setTaskForm({
      title: "",
      description: "",
      priority: "medium",
      status: "To-Do",
      deadline: "",
    });
    setShowTaskForm(false);
  };

  // Handle delete
  const handleDeleteTask = async (taskId: string) => {
    if (confirm("Delete this task?")) {
      await dispatch(deleteTask(taskId));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {currentProject && (
        <Card>
          <CardHeader>
            <CardTitle>{currentProject.name}</CardTitle>
            <div className="text-sm text-muted-foreground">
              {currentProject.description}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-xs">
              Deadline:{" "}
              {currentProject.deadline
                ? currentProject.deadline.slice(0, 10)
                : "None"}
            </div>
            <Button onClick={() => setShowTaskForm(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <Card className="max-w-xl mx-auto mt-6">
          <CardHeader>
            <CardTitle>{editTaskId ? "Edit Task" : "Create Task"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleTaskSubmit}>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm((f) => ({ ...f, title: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  className="w-full border rounded p-2"
                  value={taskForm.priority}
                  onChange={(e) =>
                    setTaskForm((f) => ({ ...f, priority: e.target.value }))
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="w-full border rounded p-2"
                  value={taskForm.status}
                  onChange={(e) =>
                    setTaskForm((f) => ({ ...f, status: e.target.value }))
                  }
                >
                  <option value="To-Do">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={taskForm.deadline}
                  onChange={(e) =>
                    setTaskForm((f) => ({ ...f, deadline: e.target.value }))
                  }
                />
              </div>
              <div className="flex gap-4">
                <Button type="submit" disabled={!taskForm.title}>
                  {editTaskId ? "Update Task" : "Create Task"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditTaskId(null);
                    setShowTaskForm(false);
                    setTaskForm({
                      title: "",
                      description: "",
                      priority: "medium",
                      status: "To-Do",
                      deadline: "",
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div>Loading tasks...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <Card key={task._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{task.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditTaskId(task._id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
                <Badge>{task.status}</Badge>
                <div className="text-xs text-muted-foreground">
                  Due: {task.deadline ? task.deadline.slice(0, 10) : "None"}
                </div>
                <div className="text-xs">
                  Priority:
                  <span className="ml-2 font-bold capitalize">
                    {task.priority}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
