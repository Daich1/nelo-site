import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  type Role = "Admin" | "Nelo" | "Member" | "Guest";

  interface User {
    id: string;
    role: Role;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    role?: "Admin" | "Nelo" | "Member" | "Guest";
  }
}
