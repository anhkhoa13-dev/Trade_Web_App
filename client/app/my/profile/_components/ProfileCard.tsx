"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../ui/shadcn/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../ui/shadcn/card";
import { Input } from "../../../ui/shadcn/input";
import { Label } from "../../../ui/shadcn/label";
import { CheckCircle2, Loader2 } from "lucide-react";
import { UserProfile } from "@/backend/user/user.types";
import { updateProfile } from "@/actions/user.action";
import { useRouter } from "next/navigation";

type ProfileCardProps = {
  profile: UserProfile;
};

export default function ProfileCard({ profile }: ProfileCardProps) {
  const router = useRouter();
  const [form, setForm] = useState<UserProfile>(profile);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(profile);
    setIsDirty(false);
    setIsSaving(false);
    setIsSaved(false);
  }, [profile]);

  const handleChange = (field: keyof UserProfile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setIsSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        username: form.username,
        firstName: form.firstName || "",
        lastName: form.lastName || "",
        phoneNum: form.phoneNum || "",
        description: form.description || "",
      };

      const result = await updateProfile(payload);

      if (result.status === "error") {
        setError(result.message || "Failed to update profile");
        setIsSaving(false);
        return;
      }

      setIsSaving(false);
      setIsDirty(false);
      setIsSaved(true);

      // Refresh the page data
      router.refresh();

      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      console.error("Save failed:", err);
      setError("An unexpected error occurred");
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstname">First name</Label>
          <Input
            id="firstname"
            value={form.firstName ?? ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastname">Last name</Label>
          <Input
            id="lastname"
            value={form.lastName ?? ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="phoneNum">Phone number</Label>
          <Input
            id="phoneNum"
            value={form.phoneNum ?? ""}
            onChange={(e) => handleChange("phoneNum", e.target.value)}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={form.email} disabled />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" value={form.roles.join(", ")} disabled />
        </div>
      </CardContent>

      <CardFooter className="flex justify-end items-center space-x-3">
        {error && <span className="text-red-600 text-sm">{error}</span>}
        {isSaving && (
          <span className="text-muted-foreground text-sm flex items-center">
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            Saving...
          </span>
        )}
        {isSaved && (
          <span className="text-green-600 text-sm flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Saved successfully
          </span>
        )}
        {isDirty && !isSaving && (
          <Button onClick={handleSave} disabled={isSaving}>
            Save
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
