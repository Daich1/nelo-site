import { getServerSession } from "next-auth";

export async function getCurrentUser() {
  const session = await getServerSession();
  return {
    name: session?.user?.name || "ゲスト",
    role: (session?.user as any)?.role || "Guest",
    email: session?.user?.email || null,
    id: (session?.user as any)?.id || null,
  };
}
