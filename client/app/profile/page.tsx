"use client";

import { useUserProfile } from "@/hooks/useUserProfile";

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useUserProfile();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-red-500"
      >
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold">Profile</h1>
      {profile ? (
        <div className="mt-4 text-center">
          <p>
            <strong>Name:</strong> {profile.fullname}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Roles:</strong> {profile.roles.join(", ")}
          </p>
        </div>
      ) : (
        <p>No profile data found.</p>
      )}
    </div>
  );
}
