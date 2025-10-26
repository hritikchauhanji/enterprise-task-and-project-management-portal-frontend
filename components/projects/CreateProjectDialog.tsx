"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { createProject } from "@/lib/redux/slices/projectSlice";
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

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateProjectDialog({
  open,
  onOpenChange,
}: CreateProjectDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { users, isLoading: usersLoading } = useSelector(
    (state: RootState) => state.users
  );

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

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

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
      // data.append("deadline", formData.deadline);
      if (formData.deadline) {
        const [year, month, day] = formData.deadline.split("-");
        data.append("deadline", `${day}-${month}-${year}`);
      }
      if (file) data.append("projectFile", file);
      if (selectedMembers.length > 0)
        data.append("members", JSON.stringify(selectedMembers));

      const result = await dispatch(createProject(data)).unwrap();

      toast.success(result?.message || "Project created successfully!", {
        duration: 3000,
      });

      // Reset form
      setFormData({ name: "", description: "", deadline: "" });
      setFile(null);
      setSelectedMembers([]);
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
          errorData?.message || "Failed to create project. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="create-project-dialog-desc">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        {/* Hidden description for ARIA */}
        <p id="create-project-dialog-desc" className="sr-only">
          Fill in project details and select team members
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {generalError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}

          {/* Project Name */}
          <div className="space-y-1">
            <Label htmlFor="name">
              Project Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setFieldErrors((prev) => ({ ...prev, name: "" }));
              }}
              disabled={isLoading}
              className={fieldErrors.name ? "border-red-500" : ""}
              placeholder="e.g., Website Redesign"
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
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={isLoading}
              rows={3}
              placeholder="Briefly describe the project..."
            />
            {fieldErrors.description && (
              <p className="text-xs text-red-500 mt-1">
                {fieldErrors.description}
              </p>
            )}
          </div>

          {/* Deadline */}
          <div className="space-y-1">
            <Label htmlFor="deadline">Deadline (dd-mm-yyyy)</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              disabled={isLoading}
              placeholder="30-10-2025"
            />
            {fieldErrors.deadline && (
              <p className="text-xs text-red-500 mt-1">
                {fieldErrors.deadline}
              </p>
            )}
          </div>

          {/* Members */}
          <div className="space-y-1">
            <Label htmlFor="members">Select Members</Label>
            {usersLoading ? (
              <p className="text-sm text-muted-foreground">Loading users...</p>
            ) : (
              <MultiSelect
                options={users.map((user) => ({
                  label: user.email,
                  value: user._id,
                }))}
                value={selectedMembers}
                onChange={(values: string[]) => {
                  setSelectedMembers(values);
                  setFieldErrors((prev) => ({ ...prev, members: "" }));
                }}
                disabled={isLoading}
                placeholder="Choose team members..."
              />
            )}
            {fieldErrors.members && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.members}</p>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-1">
            <Label htmlFor="file">Project File (optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={isLoading}
              />
              {file && (
                <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                  {file.name}
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2">Creating Project...</span>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
