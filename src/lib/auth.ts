const KEY = "sedt-auth";

export const auth = {
  isAuthed(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(KEY) === "1";
  },
  login(email: string) {
    localStorage.setItem(KEY, "1");
    localStorage.setItem("sedt-user", email);
  },
  logout() {
    localStorage.removeItem(KEY);
    localStorage.removeItem("sedt-user");
  },
  user(): string {
    if (typeof window === "undefined") return "user@energy.io";
    return localStorage.getItem("sedt-user") || "user@energy.io";
  },
};
