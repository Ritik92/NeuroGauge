import { auth } from "@/auth.config"; // Adjust path based on your setup
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await auth(); // Fetch session
console.log(session)
  // If no session, redirect to sign-in page
  if (!session) {
    redirect("/auth/signin");
  }

  // Check if the user has the SYSTEM_ADMIN role
  // if (session.user.role !== "SYSTEM_ADMIN") {
  //   redirect("/unauthorized");
  // }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {session.user.email}</p>
      <p>Your role: {session.user.role}</p>
    </div>
  );
}
