"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { getProject } from "@/lib/redux/slices/projectSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function EmployeeProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    currentProject: project,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.projects);

  useEffect(() => {
    if (id && typeof id === "string") {
      dispatch(getProject(id));
    }
  }, [dispatch, id]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-500" />
      </div>
    );

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!project) return <div className="p-6">Project not found</div>;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      {/* Project Details Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Members */}
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span>{project.members?.length || 0} members</span>
          </div>
          {project.members && project.members.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.members.map((member: any) => (
                <Badge key={member._id} variant="secondary">
                  {member.email}
                </Badge>
              ))}
            </div>
          )}

          {/* Deadline */}
          {project.deadline && (
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>
                Deadline:{" "}
                <Badge variant="outline">
                  {format(new Date(project.deadline), "MMM dd, yyyy")}
                </Badge>
              </span>
            </div>
          )}

          {/* Created By */}
          <div>
            <span className="text-muted-foreground">Created By: </span>
            <span className="font-medium">{project.createdBy.email}</span>
          </div>

          {/* Project File */}
          {project.file?.url && (
            <div className="mt-4">
              <span className="text-muted-foreground flex items-center gap-1">
                <FileText className="h-5 w-5" /> Project File:
              </span>

              {project.file.url.endsWith(".pdf") && (
                <iframe
                  src={project.file.url}
                  width="100%"
                  height="500px"
                  className="mt-2 border rounded"
                />
              )}

              {project.file.url.endsWith(".docx") && (
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(
                    project.file.url
                  )}&embedded=true`}
                  width="100%"
                  height="600"
                  className="mt-2 border rounded"
                />
              )}

              {!project.file.url.endsWith(".pdf") &&
                !project.file.url.endsWith(".docx") && (
                  <a
                    href={project.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-blue-600 underline"
                  >
                    View File
                  </a>
                )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Back Button Only */}
      <div className="flex justify-start">
        <Button variant="outline" onClick={() => router.back()}>
          Back to Projects
        </Button>
      </div>
    </div>
  );
}
