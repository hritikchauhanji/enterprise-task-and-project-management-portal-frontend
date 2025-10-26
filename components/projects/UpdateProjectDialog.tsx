"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { updateProject } from "@/lib/redux/slices/projectSlice";
import { fetchUsers } from "@/lib/redux/slices/userSlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

import { MultiSelect } from "@/components/ui/multi-select";

interface UpdateProjectDialogProps {
  projectId: string;
  projectData: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateProjectDialog({
  projectId,
  projectData,
  open,
  onOpenChange,
}: UpdateProjectDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector((state: RootState) => state.users);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    deadline: "",
  });
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // fetch users
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // populate form
  useEffect(() => {
    if (projectData) {
      setFormData({
        name: projectData.name,
        description: projectData.description,
        deadline: projectData.deadline?.slice(0, 10) || "",
      });
      setSelectedMembers(projectData.members.map((m: any) => m._id));
    }
  }, [projectData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setFieldErrors({});
    setIsLoading(true);

    try {
      if (!formData.name.trim()) {
        setFieldErrors({ name: "Project name is required" });
        setIsLoading(false);
        return;
      }

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      if (formData.deadline) {
        const [year, month, day] = formData.deadline.split("-");
        data.append("deadline", `${day}-${month}-${year}`);
      }
      if (file) data.append("projectFile", file);
      if (selectedMembers.length > 0)
        data.append("members", JSON.stringify(selectedMembers));

      const result = await dispatch(
        updateProject({ id: projectId, projectData: data })
      ).unwrap();

      toast.success(result?.message || "Project updated successfully!");
      onOpenChange(false);
    } catch (err: any) {
      const errorData = err?.response?.data || err;
      const backendErrors = errorData?.errors || errorData?.data?.errors || [];

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        const fieldErrs: { [key: string]: string } = {};
        backendErrors.forEach((errorObj: any) => {
          if (errorObj.field && errorObj.message) {
            fieldErrs[errorObj.field] = errorObj.message;
          }
        });
        setFieldErrors(fieldErrs);
        return;
      }

      if (errorData?.statusCode === 500) {
        setGeneralError("Something went wrong. Please try again later.");
      } else {
        setGeneralError(
          errorData?.message || "Failed to update project. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="update-project-dialog-desc">
        <DialogHeader>
          <DialogTitle>Update Project</DialogTitle>
        </DialogHeader>

        <p id="update-project-dialog-desc" className="sr-only">
          Update project details and team members
        </p>

        {generalError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{generalError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div className="space-y-1">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setFieldErrors((prev) => ({ ...prev, name: "" }));
              }}
              disabled={isLoading}
              className={fieldErrors.name ? "border-red-500" : ""}
              placeholder="Project Name"
            />
            {fieldErrors.name && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                setFieldErrors((prev) => ({ ...prev, description: "" }));
              }}
              disabled={isLoading}
              rows={3}
              placeholder="Project Description"
            />
            {fieldErrors.description && (
              <p className="text-xs text-red-500 mt-1">
                {fieldErrors.description}
              </p>
            )}
          </div>

          {/* Deadline */}
          <div className="space-y-1">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => {
                setFormData({ ...formData, deadline: e.target.value });
                setFieldErrors((prev) => ({ ...prev, deadline: "" }));
              }}
              disabled={isLoading}
            />
            {fieldErrors.deadline && (
              <p className="text-xs text-red-500 mt-1">
                {fieldErrors.deadline}
              </p>
            )}
          </div>

          {/* Members */}
          <div className="space-y-1">
            <Label>Select Members</Label>
            <MultiSelect
              options={users.map((user) => ({
                label: user.email,
                value: user._id,
              }))}
              value={selectedMembers}
              onChange={(values) => {
                setSelectedMembers(values);
                setFieldErrors((prev) => ({ ...prev, members: "" }));
              }}
              disabled={isLoading}
            />
            {fieldErrors.members && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.members}</p>
            )}
          </div>

          {/* Project File */}
          <div className="space-y-1">
            <Label>Project File (optional)</Label>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={isLoading}
            />
            {projectData?.file?.url && !file && (
              <p className="text-sm text-muted-foreground">
                Current File:{" "}
                <a
                  href={projectData.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {projectData.file.url.split("/").pop()}
                </a>
              </p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Project"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
