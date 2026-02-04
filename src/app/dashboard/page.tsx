import { redirect } from "next/navigation";

export default function DashboardPage() {
  redirect("/dashboard/strategy");
  return null;
}

