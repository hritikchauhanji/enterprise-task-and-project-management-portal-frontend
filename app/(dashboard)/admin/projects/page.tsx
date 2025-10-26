"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchProjects, deleteProject } from "@/lib/redux/slices/projectSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import Link from "next/link";
import CreateProjectDialog from "@/components/projects/CreateProjectDialog";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

export default function AdminProjectsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, isLoading } = useSelector(
    (state: RootState) => state.projects
  );

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDelete = async () => {
    if (!selectedProjectId) return;

    try {
      setIsDeleting(true);
      await dispatch(deleteProject(selectedProjectId));
      toast.success("Project deleted successfully!");
      setDeleteDialogOpen(false);
      setSelectedProjectId(null);
    } catch (error) {
      toast.error("Failed to delete project.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading)
    return (
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
    );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage all organization projects
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.description}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>{project.members?.length || 0} members</span>
              </div>

              {project.deadline && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Deadline: </span>
                  <Badge variant="outline">
                    {format(new Date(project.deadline), "MMM dd, yyyy")}
                  </Badge>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Link
                  href={`/admin/projects/${project._id}`}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </Link>

                {/* Delete Button triggers dialog */}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setSelectedProjectId(project._id);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
