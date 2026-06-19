export function verifyIfRoleIsAdmin(role: string) {
  return role.toUpperCase().includes(process.env.NEXT_PUBLIC_ADMIN?.toUpperCase()!);
}
