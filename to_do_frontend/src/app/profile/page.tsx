"use client";

import { useEffect, useState } from "react";
import PageShell from "@/components/PageShell";
import Protected from "@/components/Protected";
import { apiChangePassword, apiGetProfile, apiUpdateProfile, type UserProfile } from "@/lib/api";

export default function ProfilePage() {
  const [userId, setUserId] = useState<string>("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async (id: number) => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const data = await apiGetProfile(id);
      setProfile(data);
    } catch (err: unknown) {
      const { extractErrorMessage } = await import("@/lib/error");
      const msg = extractErrorMessage(err, "Failed to load profile");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If the app had a /me endpoint we'd use it; using manual entry for demonstration due to API spec
  }, []);

  const onSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile?.user?.id) return;
    setMessage(null);
    setError(null);
    try {
      const updated = await apiUpdateProfile(profile.user.id, {
        display_name: (profile.display_name || "").trim() || undefined,
        bio: (profile.bio || "").trim() || undefined,
      });
      setProfile(updated);
      setMessage("Profile updated.");
    } catch (err: unknown) {
      const { extractErrorMessage } = await import("@/lib/error");
      const msg = extractErrorMessage(err, "Update failed");
      setError(msg);
    }
  };

  const onChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const old_password = (form.elements.namedItem("old_password") as HTMLInputElement).value;
    const new_password = (form.elements.namedItem("new_password") as HTMLInputElement).value;
    setPwLoading(true);
    setMessage(null);
    setError(null);
    try {
      await apiChangePassword({ old_password, new_password });
      setMessage("Password changed.");
      form.reset();
    } catch (err: unknown) {
      const { extractErrorMessage } = await import("@/lib/error");
      const msg = extractErrorMessage(err, "Password change failed");
      setError(msg);
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <Protected>
      <PageShell>
        <div className="grid gap-6">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold mb-4">Profile</h1>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="number"
                placeholder="Enter your user ID"
                className="rounded border border-gray-300 px-3 py-2 w-44"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <button
                className="rounded bg-blue-600 text-white px-3 py-2"
                onClick={() => {
                  const idNum = Number(userId);
                  if (!Number.isFinite(idNum) || idNum <= 0) {
                    setError("Please enter a valid numeric user ID.");
                    return;
                  }
                  load(idNum);
                }}
              >
                Load Profile
              </button>
            </div>

            {loading ? (
              <div className="text-gray-600">Loading...</div>
            ) : profile ? (
              <div className="grid gap-4">
                <div className="rounded border border-gray-200 p-4">
                  <h2 className="font-medium mb-2">User</h2>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Username:</span> {profile.user.username}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Email:</span> {profile.user.email}
                  </p>
                </div>

                <form className="grid gap-3" onSubmit={onSaveProfile}>
                  <div>
                    <label className="block text-sm font-medium mb-1">Display name</label>
                    <input
                      className="w-full rounded border border-gray-300 px-3 py-2"
                      value={profile.display_name || ""}
                      onChange={(e) =>
                        setProfile((prev) => (prev ? { ...prev, display_name: e.target.value } : prev))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea
                      className="w-full rounded border border-gray-300 px-3 py-2"
                      rows={3}
                      value={profile.bio || ""}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    />
                  </div>
                  <button className="rounded bg-blue-600 text-white px-4 py-2 w-fit">
                    Save Profile
                  </button>
                </form>
              </div>
            ) : (
              <p className="text-gray-600">Enter your user ID to load profile.</p>
            )}
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold mb-3">Change Password</h2>
            <form className="grid gap-3 max-w-md" onSubmit={onChangePassword}>
              <div>
                <label className="block text-sm font-medium mb-1">Old password</label>
                <input
                  name="old_password"
                  type="password"
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New password</label>
                <input
                  name="new_password"
                  type="password"
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={pwLoading}
                className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-50 w-fit"
              >
                {pwLoading ? "Updating..." : "Change Password"}
              </button>
            </form>
          </section>

          {(message || error) && (
            <div
              className={`rounded border p-3 text-sm ${
                message
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message || error}
            </div>
          )}
        </div>
      </PageShell>
    </Protected>
  );
}
