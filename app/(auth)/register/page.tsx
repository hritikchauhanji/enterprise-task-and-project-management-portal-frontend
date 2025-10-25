"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { register } from "@/lib/redux/slices/authSlice";
import { AppDispatch } from "@/lib/redux/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, AlertCircle, Upload } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear specific field error when user types again
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    // Clear general error when user starts typing
    setGeneralError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setFieldErrors({});

    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      if (profileImage) data.append("profileImage", profileImage);

      const result = await dispatch(register(data)).unwrap();

      toast.success(result.message || "User registered successfully!");
      router.push("/login");
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
          errorData?.message || "Registration failed. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasFieldErrors = Object.keys(fieldErrors).some(
    (key) => fieldErrors[key]
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <div className="p-3 bg-primary rounded-full">
              <UserPlus className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Join our Task Management Portal
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {generalError && !hasFieldErrors && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}

            {/* Profile Image Upload */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-dashed border-gray-300">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <Label
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary/90"
                >
                  <Upload className="h-4 w-4 text-primary-foreground" />
                </Label>
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Upload profile picture (optional)
              </p>
            </div>

            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
                className={fieldErrors.name ? "border-red-500" : ""}
              />
              {fieldErrors.name && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-1">
              <Label htmlFor="username">
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleInputChange}
                disabled={isLoading}
                className={fieldErrors.username ? "border-red-500" : ""}
              />
              {fieldErrors.username && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                className={fieldErrors.email ? "border-red-500" : ""}
              />
              {fieldErrors.email && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                className={fieldErrors.password ? "border-red-500" : ""}
              />
              {fieldErrors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">
                Confirm Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                className={fieldErrors.confirmPassword ? "border-red-500" : ""}
              />
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2">Creating account...</span>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
