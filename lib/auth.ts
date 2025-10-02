export type Role = "Admin"|"Nelo"|"Member"|"Guest";


export async function getCurrentUser(){
const role: Role = process.env.N_ROLE as Role || "Guest";
return { id: "u_demo", name: "Demo", role };
}