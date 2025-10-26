"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchProjects } from "@/lib/redux/slices/projectSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Edit } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function EmployeeProjectsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, isLoading } = useSelector(
    (state: RootState) => state.projects
  );

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-500" />
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-muted-foreground">View all organization projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {project.description}
              </p>
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

              <Link href={`/employee/projects/${project._id}`}>
                <button className="mt-2 w-full flex items-center justify-center gap-2 bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition">
                  <Edit className="h-4 w-4" /> View
                </button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
