"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Redirect authenticated users to their dashboard
    if (token && user) {
      if (user.role === "admin") {
        router.push("/admin/projects");
      } else {
        router.push("/employee/dashboard");
      }
    }
  }, [token, user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          Task Management Portal
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Organize projects, manage tasks, and collaborate with your team
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link href="/login">
            <Button size="lg">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
