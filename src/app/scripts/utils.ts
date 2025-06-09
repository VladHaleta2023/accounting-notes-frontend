export function getRoleFromSession(): string {
    if (typeof window !== "undefined") {
        const role = sessionStorage.getItem("adminStatus") || "false";
        return role;
    }
    
    return "false";
}

export function updateRole(): boolean {
  return getRoleFromSession() === "true";
}