import { getCurrentUser } from "@/lib/auth";
import NewEventForm from "./NewEventForm";
export default async function NewEventPage() {
  const user = await getCurrentUser();

  if (user.role !== "Admin") {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        このページは管理者のみがアクセスできます。
      </div>
    );
  }

  return <NewEventForm />;
}
